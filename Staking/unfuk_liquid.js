const { ethers } = require("ethers");
const ethSigUtil = require("@metamask/eth-sig-util");
const { SignTypedDataVersion } = require("@metamask/eth-sig-util");
const Web3 = require('web3');
//const crypto = require('crypto');

const RPC_ENDPOINT = 'wss://bsc-testnet-rpc.publicnode.com'
const PRIVATE_KEY = ''
const TOKEN_ADDRESS = '0x30256814b1380Ea3b49C5AEA5C7Fa46eCecb8Bc0'
const LP_TOKEN_ADDRESS = '0x697666d38d339958eD416E0119bDc73ABef58996'
const ROUTER_ADDRESS = '0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0'
const LIQUIDITY_AMOUNT = '14259' // 1 LP token
const AMOUNT_TOKEN_MIN = '1610000000000000000' // Minimum token amount
const AMOUNT_ETH_MIN = '47000000000000000000' // Minimum ETH amount
const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from now
const EXISTING_PERMIT_TYPEHASH = '0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9';
const EIP712_DOMAIN_TYPEHASH = 'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)';
const privateKeyBuffer = ethers.utils.arrayify(PRIVATE_KEY);

// Your wallet instance
const wallet = new ethers.Wallet(PRIVATE_KEY);

// Setup web3
const web3 = new Web3(RPC_ENDPOINT)

// Derive account from private key
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address;
web3.eth.accounts.wallet.add(PRIVATE_KEY);

// ABI Definitions (minimal required)
const ERC20_ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{"name": "", "type": "string"}],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{"name": "owner", "type": "address"}],
      "name": "nonces",
      "outputs": [{"name": "", "type": "uint256"}],
      "type": "function"
    }
  ]
  
  const ROUTER_ABI = [
    {
      "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
      "type": "function",
      "inputs": [
        {"name": "token", "type": "address"},
        {"name": "liquidity", "type": "uint256"},
        {"name": "amountTokenMin", "type": "uint256"},
        {"name": "amountETHMin", "type": "uint256"},
        {"name": "to", "type": "address"},
        {"name": "deadline", "type": "uint256"},
        {"name": "approveMax", "type": "bool"},
        {"name": "v", "type": "uint8"},
        {"name": "r", "type": "bytes32"},
        {"name": "s", "type": "bytes32"}
      ]
    }
  ]

    
    // Create contract instances
    const lpToken = new web3.eth.Contract(ERC20_ABI, LP_TOKEN_ADDRESS);
    const router = new web3.eth.Contract(ROUTER_ABI, ROUTER_ADDRESS);


    async function testHashing() {

        try {
            // Fetch all necessary contract details
            const [
                chainId,
                lpname,
                nonce
            ] = await Promise.all([
                web3.eth.getChainId(),
                lpToken.methods.name().call(),
                lpToken.methods.nonces(account).call()
            ])

            console.log(chainId);
            console.log(lpname);
            console.log(nonce);

            // Hash the components
            const typeHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(EIP712_DOMAIN_TYPEHASH));
            const nameHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(lpname));
            const versionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("1")); // if "1" is meant to be a string, 

            // Encode and hash the final data
            const domainSeparator = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                [typeHash, nameHash, versionHash, chainId, LP_TOKEN_ADDRESS]
            ));

            console.log('Constructed Domain Separator:', domainSeparator);
            console.log('Expected Domain Separator:', '0x3ae98d44f73508f60c43e71b63f7c40eab25cdf52f27ea25c1119aef2be893cd');
    
    
            // Construct permit data
            // Define the PERMIT_TYPEHASH
            const PERMIT_TYPEHASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"));

            // Function to encode and hash the permit data
            const permitHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                    ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
                    [PERMIT_TYPEHASH, account, ROUTER_ADDRESS, LIQUIDITY_AMOUNT, nonce, DEADLINE]
                ));


            console.log("Permit Type Hash:", PERMIT_TYPEHASH);
            console.log('Constructed Permit Hash:', permitHash);


            const msgParams = {
              domain: {
                name: lpname,
                version: '1',
                chainId: chainId, // Mainnet or replace with the actual chain ID you're using
                verifyingContract: LP_TOKEN_ADDRESS // Replace with your contract address
              },
              message: {
                owner: account, // Replace with the owner address
                spender: ROUTER_ADDRESS, // Replace with the spender address
                value: LIQUIDITY_AMOUNT,
                nonce: nonce,
                deadline: DEADLINE
                },
              primaryType: 'Permit',
              types: {
                EIP712Domain: [
                  { name: 'name', type: 'string' },
                  { name: 'version', type: 'string' },
                  { name: 'chainId', type: 'uint256' },
                  { name: 'verifyingContract', type: 'address' },
                ],
                Permit: [
                    { name: 'owner', type: 'address' },
                    { name: 'spender', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' }
                ]
              },
            };



            // Sign the typed data
            try {
                
                const signature = ethSigUtil.signTypedData({
                  privateKey: privateKeyBuffer, 
                  data: msgParams, 
                  version: SignTypedDataVersion.V4});
                  //console.log("Metamask sig utils generated signature", signature); 
                  //const signature = await wallet._signTypedData(domain, types, value);
                  console.log('Signature:', signature);

                // Optionally, you can split the signature into r, s, and v
                const { r, s, v } = ethers.utils.splitSignature(signature);
                console.log('v:', v);
                console.log('r:', r);
                console.log('s:', s);
                console.log(DEADLINE);

                // Optionally, recover the address to verify
                //const digest = ethers.utils._TypedDataEncoder.hash(domain, types, value);
                const digest = ethers.utils.keccak256(ethers.utils.concat([ 
                  ethers.utils.toUtf8Bytes('\x19\x01'), 
                  domainSeparator, 
                  permitHash
                ]));
                const recoveredAddress = ethers.utils.recoverAddress(digest, { r, s, v });
                console.log('Expected Addres: ', account);
                console.log('Recovered Address: ', recoveredAddress);

                try {
                  const tx = router.methods.removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
                      TOKEN_ADDRESS,
                      LIQUIDITY_AMOUNT,
                      AMOUNT_TOKEN_MIN,
                      AMOUNT_ETH_MIN,
                      account,
                      DEADLINE,
                      false,
                      v,
                      r,
                      s
                  );
      
                      // Estimate gas
                      var gas = await tx.estimateGas({ from: account });
                      gas = gas + 100000;
                      console.log('Estimated gas:', gas);
                      // Send the transaction
                        const receipt = await tx.send({ from: account, gas });
                        console.log('Transaction receipt:', receipt);
                } catch (error) {
                      console.error('Error sending transaction:', error);
                  }

                
            } catch (error) {
                console.error('Error signing typed data:', error);
            }

        } catch (error) {
        
            console.log("Something went wrong", error);
            
        } finally {
        // Always close the provider
        web3.currentProvider.disconnect();
        }
    }

testHashing();
