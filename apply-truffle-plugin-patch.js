const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, '..', 'node_modules', 'truffle-plugin-verify', 'dist', 'constants.js');
const verifierPath = path.join(__dirname, '..', 'node_modules', 'truffle-plugin-verify', 'dist', 'verifier', 'EtherscanVerifier.js');

// Check if files exist
if (!fs.existsSync(constantsPath) || !fs.existsSync(verifierPath)) {
    console.log('truffle-plugin-verify not found, skipping patch application');
    process.exit(0);
}

// Read current files
let constantsContent = fs.readFileSync(constantsPath, 'utf8');
let verifierContent = fs.readFileSync(verifierPath, 'utf8');

let constantsChanged = false;
let verifierChanged = false;

// Apply patches to constants.js
if (!constantsContent.includes('ETHERSCAN_CHAINID_MAP')) {
    // Add ETHERSCAN_CHAINID_MAP after SOURCIFY_API_URL
    const insertPoint = constantsContent.indexOf('exports.SOURCIFY_API_URL');
    const nextLine = constantsContent.indexOf('\n', insertPoint) + 1;
    const chainIdMap = `// Chain ID mapping for Etherscan API v2 - maps network chain IDs to Etherscan's supported chain IDs
// Check https://api.etherscan.io/v2/chainlist for supported chain IDs
// Chain ID mapping for Etherscan API v2 - ensure all values are strings
exports.ETHERSCAN_CHAINID_MAP = {
    1: '1',      // Ethereum Mainnet
    5: '5',      // Goerli Testnet
    56: '56',    // BSC Mainnet
    97: '97',    // BSC Testnet (Chapel)
    11155111: '11155111', // Sepolia
    // Add more mappings as needed based on https://api.etherscan.io/v2/chainlist
};
// All networks now use unified Etherscan API v2
`;
    constantsContent = constantsContent.slice(0, nextLine) + chainIdMap + constantsContent.slice(nextLine);
    constantsChanged = true;
}

// Update API_URLS to use v2 API for main networks
const apiUrlReplacements = [
    [/1: 'https:\/\/api\.etherscan\.io\/api'/g, "1: 'https://api.etherscan.io/v2/api'"],
    [/5: 'https:\/\/api-goerli\.etherscan\.io\/api'/g, "5: 'https://api.etherscan.io/v2/api'"],
    [/10: 'https:\/\/api-optimistic\.etherscan\.io\/api'/g, "10: 'https://api.etherscan.io/v2/api'"],
    [/25: 'https:\/\/api\.cronoscan\.com\/api'/g, "25: 'https://api.etherscan.io/v2/api'"],
    [/56: 'https:\/\/api\.bscscan\.com\/api'/g, "56: 'https://api.etherscan.io/v2/api'"],
    [/97: 'https:\/\/api-testnet\.bscscan\.com\/api'/g, "97: 'https://api.etherscan.io/v2/api'"],
];

for (const [pattern, replacement] of apiUrlReplacements) {
    if (pattern.test(constantsContent)) {
        constantsContent = constantsContent.replace(pattern, replacement);
        constantsChanged = true;
    }
}

if (constantsChanged) {
    fs.writeFileSync(constantsPath, constantsContent, 'utf8');
    console.log('✓ Patched constants.js');
}

// Apply patches to EtherscanVerifier.js
// 1. Add chainId validation and URL building in sendVerifyRequest
if (!verifierContent.includes('ETHERSCAN_CHAINID_MAP')) {
    const sendVerifyRequestMatch = verifierContent.match(/(const relativeFilePath = artifact\.ast\.absolutePath\.replace\('project:', ''\);)/);
    if (sendVerifyRequestMatch) {
        const insertPoint = sendVerifyRequestMatch.index + sendVerifyRequestMatch[0].length;
        const chainIdCode = `
            // API v2 compatible - use apiKey and chainid parameters (chainid must be string)
            // Ensure chainId is available and convert to string
            (0, util_1.enforceOrThrow)(this.options.chainId !== undefined && this.options.chainId !== null, 'chainId is required for Etherscan API v2');
            const etherscanChainId = constants_1.ETHERSCAN_CHAINID_MAP[this.options.chainId] || String(this.options.chainId);
            this.logger.debug(\`Using chainId: \${this.options.chainId} -> \${etherscanChainId}\`);
            
            // Build URL with chainid in query string
            const urlParams = querystring_1.default.stringify({
                chainid: etherscanChainId
            });
            const requestUrl = \`\${this.options.apiUrl}?\${urlParams}\`;
            `;
        verifierContent = verifierContent.slice(0, insertPoint) + chainIdCode + verifierContent.slice(insertPoint);
        verifierChanged = true;
    }
}

// 2. Change apikey to apiKey in postQueries
if (verifierContent.includes("apikey: this.options.apiKey")) {
    verifierContent = verifierContent.replace(/apikey: this\.options\.apiKey/g, 'apiKey: this.options.apiKey');
    verifierChanged = true;
}

// 3. Update axios.post to use postQueries directly instead of requestBody
// Find the pattern: axios.post(requestUrl, requestBody, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
const axiosPostPattern = /return yield axios_1\.default\.post\(requestUrl, requestBody, \{[\s\S]*?'Content-Type': 'application\/x-www-form-urlencoded'[\s\S]*?\}\);/;
if (axiosPostPattern.test(verifierContent) && verifierContent.includes('const requestBody = querystring_1.default.stringify(postQueries);')) {
    // Replace with postQueries directly
    verifierContent = verifierContent.replace(
        /const requestBody = querystring_1\.default\.stringify\(postQueries\);\s+this\.logger\.debug\(`POST URL: \$\{requestUrl\}`\);\s+this\.logger\.debug\(`POST Body: \$\{requestBody\}`\);\s+return yield axios_1\.default\.post\(requestUrl, requestBody, \{[\s\S]*?'Content-Type': 'application\/x-www-form-urlencoded'[\s\S]*?\}\);/,
        `const requestBody = querystring_1.default.stringify(postQueries);
                this.logger.debug(\`POST URL: \${requestUrl}\`);
                this.logger.debug(\`POST Body: \${requestBody}\`);
                // Set proper Content-Type header for form-encoded data
                return yield axios_1.default.post(requestUrl, postQueries, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });`
    );
    verifierChanged = true;
}

// 4. Add debug logging if missing
if (!verifierContent.includes('Sending verify request with POST arguments:')) {
    const postQueriesMatch = verifierContent.match(/(const postQueries = \{[\s\S]*?\};)/);
    if (postQueriesMatch) {
        const insertPoint = postQueriesMatch.index + postQueriesMatch[0].length;
        const debugCode = `
            try {
                this.logger.debug('Sending verify request with POST arguments:');
                (0, util_1.logObject)(this.logger, 'debug', postQueries, 2);`;
        verifierContent = verifierContent.slice(0, insertPoint) + debugCode + verifierContent.slice(insertPoint);
        verifierChanged = true;
    }
}

// 5. Update fetchConstructorValues to use chainid
if (!verifierContent.includes('etherscanChainId') || verifierContent.includes("apikey: this.options.apiKey")) {
    const fetchConstructorMatch = verifierContent.match(/res = yield axios_1\.default\.get\(`\$\{this\.options\.apiUrl\}\?\$\{querystring_1\.default\.stringify\(\{[\s\S]*?apikey: this\.options\.apiKey,[\s\S]*?\}\)\}`\);/);
    if (fetchConstructorMatch) {
        verifierContent = verifierContent.replace(
            /res = yield axios_1\.default\.get\(`\$\{this\.options\.apiUrl\}\?\$\{querystring_1\.default\.stringify\(\{[\s\S]*?apikey: this\.options\.apiKey,[\s\S]*?\}\)\}`\);/,
            `// API v2 compatible - include apiKey and chainid (chainid in URL query string)
                const etherscanChainId = constants_1.ETHERSCAN_CHAINID_MAP[this.options.chainId] || String(this.options.chainId);
                const urlParams = querystring_1.default.stringify({
                    chainid: etherscanChainId,
                    apiKey: this.options.apiKey,
                    module: 'account',
                    action: 'txlist',
                    address: contractAddress,
                    page: 1,
                    sort: 'asc',
                    offset: 1,
                });
                const url = \`\${this.options.apiUrl}?\${urlParams}\`;
                this.logger.debug(\`Retrieving constructor parameters from \${url}\`);
                res = yield axios_1.default.get(url);`
        );
        verifierChanged = true;
    }
}

// 6. Update verificationStatus to use chainid
if (verifierContent.includes("apikey: this.options.apiKey") && verifierContent.includes('verificationStatus')) {
    verifierContent = verifierContent.replace(
        /const qs = querystring_1\.default\.stringify\(\{[\s\S]*?apikey: this\.options\.apiKey,[\s\S]*?\}\);/,
        `const etherscanChainId = constants_1.ETHERSCAN_CHAINID_MAP[this.options.chainId] || String(this.options.chainId);
                    const qs = querystring_1.default.stringify({
                        chainid: etherscanChainId,
                        apiKey: this.options.apiKey,`
    );
    verifierChanged = true;
}

// 7. Update sendProxyVerifyRequest
if (verifierContent.includes('sendProxyVerifyRequest')) {
    // Add chainId handling at the start of the function
    if (!verifierContent.includes('sendProxyVerifyRequest') || !verifierContent.match(/sendProxyVerifyRequest\(address\) \{[\s\S]*?etherscanChainId/)) {
        verifierContent = verifierContent.replace(
            /(sendProxyVerifyRequest\(address\) \{[\s\S]*?return __awaiter\(this, void 0, void 0, function\* \(\) \{)/,
            `$1
            const etherscanChainId = constants_1.ETHERSCAN_CHAINID_MAP[this.options.chainId] || String(this.options.chainId);
            // Build URL with chainid in query string
            const urlParams = querystring_1.default.stringify({
                chainid: etherscanChainId
            });
            const requestUrl = \`\${this.options.apiUrl}?\${urlParams}\`;`
        );
        verifierChanged = true;
    }
    
    // Update the axios.post call in sendProxyVerifyRequest
    verifierContent = verifierContent.replace(
        /return yield axios_1\.default\.post\(this\.options\.apiUrl, requestBody, \{[\s\S]*?'Content-Type': 'application\/x-www-form-urlencoded'[\s\S]*?\}\);/,
        `this.logger.debug(\`Sending verify proxy request to \${requestUrl} with POST arguments:\`);
                (0, util_1.logObject)(this.logger, 'debug', postQueries, 2);
                const requestBody = querystring_1.default.stringify(postQueries);
                return yield axios_1.default.post(requestUrl, requestBody, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });`
    );
    verifierChanged = true;
}

if (verifierChanged) {
    fs.writeFileSync(verifierPath, verifierContent, 'utf8');
    console.log('✓ Patched EtherscanVerifier.js');
}

if (constantsChanged || verifierChanged) {
    console.log('truffle-plugin-verify patch applied successfully!');
} else {
    console.log('truffle-plugin-verify is already patched.');
}
