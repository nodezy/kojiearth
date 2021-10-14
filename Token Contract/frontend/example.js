"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

let refreshinterval;
let bnbusd;

// Address of the selected account
let selectedAccount;
let kojitoken = "0xE0c010C702939B1881728Ee258038d3F65840264"; //bsc test KOJI
let bscnftaddress = "0x062C9545e61A7eD56F3BE4256EAAC19c5580868A" //bsctest nft contract
let bscnftproxy = "0xe97E4c086283d6e6c407ac131F7413Fea3B32a46" //bsctest nft proxy contract
let liquidpair = "0x8B59b29Dc55adA4A07A93e9ad5356E1e533fB0c4"

var kojitokenABI = JSON.stringify([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"WETHaddedToPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmountBuy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmountSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxWalletToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"addToLiquid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"adminWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"approveMax","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"changeGas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timelimit","type":"uint256"}],"name":"changeImpoundTimelimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"changeMinHold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"charityWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"distributeAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributorDeposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeDenominator","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFees","outputs":[{"internalType":"uint256","name":"holders","type":"uint256"},{"internalType":"uint256","name":"admin","type":"uint256"},{"internalType":"uint256","name":"charity","type":"uint256"},{"internalType":"uint256","name":"buyback","type":"uint256"},{"internalType":"uint256","name":"nftrewards","type":"uint256"},{"internalType":"uint256","name":"burn","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMinDistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"getPending","outputs":[{"internalType":"uint256","name":"pending","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRewardsToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"getShareholderExpired","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"bot","type":"bool"}],"name":"getTotalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"shareholder","type":"address"}],"name":"impound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isInBot","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"manualBurn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"nftRewardWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percent","type":"uint256"},{"internalType":"uint256","name":"_amountOut","type":"uint256"}],"name":"reinvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHFromContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHfromDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"resetAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IDEXRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setAddToLiquid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"toggle","type":"bool"}],"name":"setBot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setBuyTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setDistributionCriteria","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setDistributorDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_charityWallet","type":"address"},{"internalType":"address","name":"_adminWallet","type":"address"},{"internalType":"address","name":"_nftRewardWallet","type":"address"},{"internalType":"address","name":"_stakePoolWallet","type":"address"}],"name":"setFeeReceivers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reflectionFee","type":"uint256"},{"internalType":"uint256","name":"_adminFee","type":"uint256"},{"internalType":"uint256","name":"_charityFee","type":"uint256"},{"internalType":"uint256","name":"_buybackFee","type":"uint256"},{"internalType":"uint256","name":"_cakeFee","type":"uint256"},{"internalType":"uint256","name":"_burnFee","type":"uint256"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"blocks","type":"uint256"}],"name":"setInitialBlockLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsDividendExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsFeeExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsTxLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setMaxWalletToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setSellTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setStakePoolActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setSwapBackSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setTeamWalletDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setburnRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"settaxRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakePoolActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakePoolWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sweepDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"teamWalletDeposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCharity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNFTrewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStakepool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferERC20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"adr","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"viewHolderInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"held","type":"uint256"},{"internalType":"uint256","name":"unpaid","type":"uint256"},{"internalType":"uint256","name":"excluded","type":"uint256"},{"internalType":"uint256","name":"realised","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"viewMathInfo","outputs":[{"internalType":"uint256","name":"totalshares","type":"uint256"},{"internalType":"uint256","name":"totaldividends","type":"uint256"},{"internalType":"uint256","name":"netdividends","type":"uint256"},{"internalType":"uint256","name":"totaldistributed","type":"uint256"},{"internalType":"uint256","name":"totalreinvested","type":"uint256"},{"internalType":"uint256","name":"totalwithdrawn","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"viewMinHold","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"viewTeamWalletInfo","outputs":[{"internalType":"uint256","name":"charityDivs","type":"uint256"},{"internalType":"uint256","name":"adminDivs","type":"uint256"},{"internalType":"uint256","name":"nftDivs","type":"uint256"},{"internalType":"uint256","name":"stakeDivs","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percent","type":"uint256"}],"name":"withdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]);
var bscnftmintABI = JSON.stringify([{"inputs":[{"internalType":"uint256","name":"_timestart","type":"uint256"},{"internalType":"uint256","name":"_timeend","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_toAdd","type":"address"}],"name":"addWhitelisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mintedCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtier1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtier2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintlimitsenabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftproxy","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"receiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_toRemove","type":"address"}],"name":"removeWhitelisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tier1minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier1mintlimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tier2minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier2mintlimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeend","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timestart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"walletbalanceenabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"minttier1NFT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"minttier2NFT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tier1mintLimitReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier2mintLimitReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"holder","type":"address"}],"name":"checkBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"mintedCounttier1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"mintedCounttier2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"setToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_receiver","type":"address"}],"name":"changeReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier1URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier2URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"tier1limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"tier2limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enabletimelimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablewalletlimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablemintlimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablewalletbalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"setWindow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"setnftproxy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHFromContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferERC20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getRoyaltyNumerator","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_number","type":"uint256"}],"name":"setRoyaltyNumerator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"updateTier1balance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"updateTier2balance","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var bscnftproxyABI = JSON.stringify([{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"NFTAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_nftaddress","type":"address"}],"name":"setNFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sender","type":"address"},{"internalType":"bytes32","name":"_tier","type":"bytes32"},{"internalType":"bytes32","name":"_redherring","type":"bytes32"}],"name":"method_unknown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHFromContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferERC20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"returnstring1","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"returnstring2","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"changeTier1URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"changeTier2URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier1URIstring","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier2URIstring","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var liquidpairabi = JSON.stringify([{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]);


let sessionwallet; 
let sessiontier; 
let mintdata;

let charityBalance;
let adminBalance;
let nftrewardBalance;
let stakepoolBalance;

let timestamp;
let blocknumber;

let bscchain = false;

let txinprogress = false;

const BSC_MAINNET_PARAMS = {
    chainId: '0x38', // A 0x-prefixed hexadecimal chainId
    chainName: 'BSC Mainnet',
    nativeCurrency: {
        name: 'SmartChain',
        symbol: 'BNB',
        decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/']
}

const BSC_TESTNET_PARAMS = {
    chainId: '0x61', // A 0x-prefixed hexadecimal chainId
    chainName: 'BSC Testnet',
    nativeCurrency: {
        name: 'SmartChain',
        symbol: 'BNB',
        decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/']
}

function addBSCNetwork() {
  const web3 = new Web3(provider);
    ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BSC_TESTNET_PARAMS]
        })
        .catch((error) => {
          //console.log(error)
        });
    //onConnect();
    document.querySelector("#currency").textContent = "My BNB balance";
    document.querySelector("#network-name").textContent = BSC_MAINNET_PARAMS['chainName'];
}

/**
 * Setup the orchestra
 */
function init() {

  /*console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);*/

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if(location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    return;
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Nodezy's test key - don't copy as your mileage may vary
        infuraId: "21d7ff87ab3941cf8cfa4c0cb379a384",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  //console.log("Web3Modal instance is", web3Modal);
}

const getblocknumber = (result) => { 

  blocknumber = result;

}

const getblockstamp = (result) => { 

  timestamp = result.timestamp;
 // console.log(timestamp);
  
}

const charitybalance = (result) => { 

	charityBalance = result;

	document.getElementById("charity-balance").innerHTML = parseFloat(charityBalance/1e18).toFixed(9) + " BNB";
  
}

const adminbalance = (result) => { 

	adminBalance = result;

	document.getElementById("admin-balance").innerHTML = parseFloat(adminBalance/1e18).toFixed(9) + " BNB";
  
}

const nftbalance = (result) => { 

	nftrewardBalance = result;

	document.getElementById("nft-balance").innerHTML = parseFloat(nftrewardBalance/1e18).toFixed(9) + " BNB";
  
}

const stakebalance = (result) => { 

	stakepoolBalance = result;

	document.getElementById("stake-balance").innerHTML = parseFloat(stakepoolBalance/1e18).toFixed(9) + " BNB";
  
}

const getJSON = async url => {
	const response = await fetch(url); 

	return response.json(); // get JSON from the response 
}

async function getBNB() {

		   document.getElementById("get-bnb").innerText = "Please wait...";
           document.getElementById("get-bnb").setAttribute("disabled", "disabled");
          // document.getElementById("showLoading").style.display = 'block';  
           var userdata = btoa("address="+selectedAccount+"");

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 		// some code..
 		window.open("getgas.php?"+userdata+"");
 		document.getElementById("gas-dust").style.display = "block";
         document.getElementById("gas-dust").innerHTML =  "Opening new browser window...";//airdrops .004 BNB to cover mint, 1 per authorized wallet
	} else {
		try {
            
           
          var response = fetch("getgas.php?"+userdata+"", {mode: 'cors'}).then(function(response) {
            return response.text().then(function(text) {
          document.getElementById("gas-dust").style.display = "block";
          document.getElementById("gas-dust").innerHTML = text;//airdrops .004 BNB to cover mint, 1 per authorized wallet
          });
        });


	    }catch{
	      //console.log(err);
	    }
    }

  
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  //console.log("Web3 instance is", web3);

  document.getElementById("connected").style.display = 'block';

  try {

	web3.eth.getBlockNumber().then(getblocknumber);

	 } catch {

	 }


  // Load chain information over an HTTP API
  const chainId = await web3.eth.getChainId(function(err, result) {
    if (!err) {
     var mydata = JSON.parse(chainData);
    // console.log(mydata[0].name)
     // the code you're looking for
      var lookup = result;

      // iterate over each element in the array
		      for (var i = 0; i < mydata.length; i++){
		        // look for the entry with a matching `code` value
		        if (mydata[i].chainId == lookup){
		           // we found it
		          // obj[i].name is the matched result
		          document.querySelector("#network-name").textContent = mydata[i].name;
		          if (mydata[i].name == "Binance Smart Chain Testnet") {
		            document.getElementById("web3-wallet-connected").style.display = 'block';
		            document.getElementById("web3-wallet-disconnected").style.display = 'none';
		            document.getElementById("prepare").style.display = 'none';
		            document.getElementById("disconnected").style.display = 'none';
		            document.getElementById("btn-connect").style.display = 'none';
		            document.getElementById("btn-disconnect").style.display = 'block';
		            document.getElementById("incorrectalert").style.display = 'none';
		            
		          } else {
		          	document.getElementById("prepare").style.display = 'none';
		          	document.getElementById("incorrectalert").style.display = 'block';
		            //document.getElementById("correctnetwork").style.display = 'none';
		            //document.getElementById("disconnected").style.display = 'none';
		            addBSCNetwork();

		            
		            }
		            
		        }
		     }
  
    	}
  	});

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  //console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  const balance = await web3.eth.getBalance(selectedAccount);
  const ethBalance = web3.utils.fromWei(balance, "ether");
  const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);


  document.querySelector("#selected-account").textContent = selectedAccount;
  document.querySelector("#account-balance").textContent = humanFriendlyBalance + " BNB";


  var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);
  var nftcontract = new web3.eth.Contract(JSON.parse(bscnftmintABI),bscnftaddress);
  var paircontract = new web3.eth.Contract(JSON.parse(liquidpairabi),liquidpair);

  


	var bnbpricedata = fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd").then(function(response) {
      if (response.status !== 200) {
        console.log("Can Not get List Api! Status: " + response.status);
        return;
      }

      	response.json().then(function(data) {

	        //console.log(data.binancecoin.usd);
	        bnbusd = data.binancecoin.usd;

	        document.getElementById("bnb-usd").innerText = bnbusd;

	        paircontract.methods.getReserves().call(function(err,res){
			    if(!err){
			        
			       var poolbnbusdvalue = parseFloat(web3.utils.fromWei(res[0])*bnbusd).toFixed(2);

			       var kojiusdvalue = parseFloat(poolbnbusdvalue / web3.utils.fromWei(res[1],"gwei")).toFixed(9);
			       //console.log(web3.utils.fromWei(res[1],"gwei"));

			       document.getElementById("koji-usd").innerText = kojiusdvalue;

			       var kojibnbunrounded = parseFloat(kojiusdvalue / bnbusd);

			       document.getElementById("koji-bnb-unrounded").value = kojibnbunrounded;

			       var kojibnb = parseFloat(kojiusdvalue / bnbusd).toFixed(10);

             		// edit by andreas 
			       // document.getElementById("koji-bnb").innerHTML = "<em>" +kojibnb+ "BNB</em>";
             		document.getElementById("koji-bnb").innerText = kojibnb;

             		tokencontract.methods.viewMinHold().call(function(err,res){
					    if(!err){

					    	document.getElementById("minhold").innerText = parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					    }
					});

	 				tokencontract.methods.balanceOf(selectedAccount).call(function(err,res){
					    if(!err){
					       // console.log(web3.utils.fromWei(res));
					       var balance = web3.utils.fromWei(res, "gwei");
					       balance = +balance;
					       balance = parseFloat(balance).toFixed(2);

					       var kojiusdholdings = parseFloat(kojiusdvalue * balance).toFixed(2);
					        
					        document.getElementById("koji-balance").innerHTML = balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI &nbsp;&nbsp;<span style='color:#20b23f6e'>($" +kojiusdholdings+")</span>" ;

					        tokencontract.methods.getPending(selectedAccount).call(function(err,res){
					    		if(!err){
					    			var dividends = web3.utils.fromWei(res);

					    			document.getElementById("koji-divs-unrounded").value = dividends;

					    			var divsusdholdings = parseFloat(bnbusd * dividends).toFixed(2);

					    			document.getElementById("koji-divs").innerHTML = parseFloat(dividends).toFixed(9);

					    			document.getElementById("koji-divs-usd").innerHTML = "($" +divsusdholdings+")";

					    			var percent = document.querySelector('#amount').value;

					    			var percent2 = document.querySelector('#amount2').value;

					    			var adjdivs = parseFloat((dividends * percent) / 100).toFixed(9);

					    			var ridivs = parseFloat((dividends * percent2) / 100).toFixed(6);


					    			document.querySelector('#ri-equivalent').innerHTML = ridivs;

					    			document.getElementById("withdraw-divs").innerHTML = adjdivs;

					    			var percent2 = document.querySelector('#amount2').value;

					    			console.log(percent2);

					    			var kojireinvested = parseFloat((((dividends / kojibnbunrounded)*.936)) * percent2 / 100).toFixed(2);

					    			var kojiAmountOut = (kojireinvested * 90 /100).toFixed(0);


					    			if (dividends > 0) {

					    				document.getElementById("withdraw-btn").removeAttribute("disabled");

					    				document.getElementById("withdraw-btn").setAttribute('onclick', 'withdraw('+percent+')');

					    			}

					    			console.log(ridivs);

					    			if (+ridivs >= 0.001) {

					    				document.getElementById("reinvest-btn").removeAttribute("disabled");

					    				document.getElementById("reinvest-btn").setAttribute('onclick', 'reinvest('+percent2+','+kojiAmountOut+')');

					    				document.querySelector('#reinvest-alert').style.display = 'none';

					    			} else {

				    					document.getElementById("reinvest-btn").setAttribute("disabled", "disabled");

					    				document.querySelector('#reinvest-alert').style.display = 'block';

					    				document.querySelector('#reinvest-alert').innerHTML = "You need at least 0.001 BNB dividends equivalent to reinvest";

					    			}

					    			document.getElementById("koji-reinvested").innerHTML = kojireinvested.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					    				tokencontract.methods.getCirculatingSupply().call(function(err,res){
					    					if(!err){
					    						var totalCirc = parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(2);

					    						document.getElementById("total-circ").innerHTML = totalCirc.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

					    						document.getElementById("market-cap").innerHTML = "$ " + parseFloat(totalCirc * kojiusdvalue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					    					}

					    					tokencontract.methods.balanceOf("0x000000000000000000000000000000000000dEaD").call(function(err,res){
					    						if(!err){

					    							var totalBurned =  parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(2); 

					    							var totalBurnedUSD = parseFloat(totalBurned * kojiusdvalue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					    							document.getElementById("total-burn").innerHTML = totalBurned.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI &nbsp;&nbsp;<span style='color:#20b23f6e'>($" +totalBurnedUSD+")</span>";
					    						}

					    					});

					    					tokencontract.methods.WETHaddedToPool().call(function(err,res){
					    						if(!err){

					    							var wethadded = parseFloat(web3.utils.fromWei(res)).toFixed(9);

					    							document.getElementById("total-wbnb-added").innerHTML = wethadded + "&nbsp;&nbsp;<span style='color:#20b23f6e'>($" +parseFloat(wethadded * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
					    						
					    						}
					    					});

					    					tokencontract.methods.viewMathInfo().call(function(err,res){
					    						if(!err){

					    							//console.log(res);

					    							var distributed = parseFloat(web3.utils.fromWei(res.totaldistributed)).toFixed(9);

					    							var reinvested = parseFloat(web3.utils.fromWei(res.totalreinvested)).toFixed(9);

					    							var withdrawn = parseFloat(web3.utils.fromWei(res.totalwithdrawn)).toFixed(9);

					    							document.getElementById("total-divs").innerHTML = distributed + "&nbsp;&nbsp;<span style='color:#20b23f6e'>($" +parseFloat(distributed * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
					    							document.getElementById("total-reinvest").innerHTML = reinvested + "&nbsp;&nbsp;<span style='color:#20b23f6e'>($" +parseFloat(reinvested * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
					    							document.getElementById("total-withdraw").innerHTML = withdrawn + "&nbsp;&nbsp;<span style='color:#20b23f6e'>($" +parseFloat(withdrawn * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
					    						}
					    					});

					    				});
					    		}
					    	}); // getPending

					    }
					  }); //selectedAccount

			    }
			});

        });
       
   
    })
    .catch(function(err) {
      console.log("Can Not get Price Api! Status: " + err);
    });

    tokencontract.methods.charityWallet().call(function(err,res) {

    	if (!err) { 
    		document.getElementById("charity-address").innerHTML = res;

    		try {
    			var balance = web3.eth.getBalance(res).then(charitybalance);

    			//console.log(charityBalance);
    			
    			
    		} 

    		catch {

    		}    		

    		tokencontract.methods.viewTeamWalletInfo().call(function(err,res) {

    			if (!err) { 

    				document.getElementById("charity-divs").innerHTML = parseFloat(web3.utils.fromWei(res.charityDivs)).toFixed(9) + " BNB";

    			}
    		});

    	}

    });

    tokencontract.methods.adminWallet().call(function(err,res) {

    	if (!err) { 
    		document.getElementById("admin-address").innerHTML = res;

    		try {
    			var balance = web3.eth.getBalance(res).then(adminbalance);

    			//console.log(charityBalance);
    			
    			
    		} 

    		catch {

    		}    		

    		tokencontract.methods.viewTeamWalletInfo().call(function(err,res) {

    			if (!err) { 

    				document.getElementById("admin-divs").innerHTML = parseFloat(web3.utils.fromWei(res.adminDivs)).toFixed(9) + " BNB";

    			}
    		});

    	}

    });

    tokencontract.methods.nftRewardWallet().call(function(err,res) {

    	if (!err) { 
    		document.getElementById("nft-address").innerHTML = res;

    		try {
    			var balance = web3.eth.getBalance(res).then(nftbalance);

    			//console.log(charityBalance);
    			
    			
    		} 

    		catch {

    		}    		

    		tokencontract.methods.viewTeamWalletInfo().call(function(err,res) {

    			if (!err) { 

    				document.getElementById("nft-divs").innerHTML = parseFloat(web3.utils.fromWei(res.nftDivs)).toFixed(9) + " BNB";

    			}
    		});

    	}

    });

    tokencontract.methods.stakePoolActive().call(function(err,res) {

    	if (!err) { 

    		if (res) {

    			document.querySelector("#poolActive").style.display = "block";
    			document.querySelector("#poolInactive").style.display = "none";

    			tokencontract.methods.stakePoolWallet().call(function(err,res) {

			    	if (!err) { 
			    		document.getElementById("stake-address1").innerHTML = res;

			    		try {
			    			var balance = web3.eth.getBalance(res).then(stakebalance);

			    			//console.log(charityBalance);
			    			
			    			
			    		} 

			    		catch {

			    		}    		

			    		tokencontract.methods.viewTeamWalletInfo().call(function(err,res) {

			    			if (!err) { 

			    				document.getElementById("stake-divs").innerHTML = parseFloat(web3.utils.fromWei(res.stakeDivs)).toFixed(9) + " BNB";

			    			}
			    		});

			    	}

			    });

    		} else {

    			document.querySelector("#poolInactive").style.display = "block";
    			document.querySelector("#poolActive").style.display = "none";

    			tokencontract.methods.stakePoolWallet().call(function(err,res) {

			    	if (!err) { 
			    		document.getElementById("stake-address2").innerHTML = res;
			    	}

			    });

    			

    		}

		}

	});

  	 
}



async function getAccountInfo(account) {
//console.log('refreshing account info');
	try {

	web3.eth.getBlock(blocknumber).then(getblockstamp);

	 } catch {

	 }
     

  getAccountInfo(selectedAccount);

  document.querySelector("#btn-connect").style.display = "none";
  document.querySelector("#btn-disconnect").style.display = "block";

  document.querySelector("#web3-wallet-disconnected").style.display = "none";
  document.querySelector("#web3-wallet-connected").style.display = "block";

  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}



async function withdraw(percent) {

	 //console.log(mintdata);

	 if (percent == 0) {
	 	percent = 100;
	 }

     const web3 = new Web3(provider);

     // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

      var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);

       web3.eth.sendTransaction(
          {from: account[0],
          to: kojitoken,
          value: 0, 
          gasprice: 100000, // 100000 = 10 gwei
           //gas: 350000,   // gas limit
          data: tokencontract.methods.withdrawal(percent).encodeABI()
              }, function(err, transactionHash) {
            //console.log('in progress');
            if (!err) {
            	 txinprogress = true;
	             document.getElementById("withdraw-btn").setAttribute("disabled","disabled");
	             document.getElementById("withdraw-loader").classList.add('ui-loading');
	             var message = "<a href='https://testnet.bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"
	             openAlert("info", "Transaction Submitted", message);
             
            }
             
      })
      .on('receipt', function(receipt){

        //console.log(receipt);

       		 openAlert("success", "Transaction Completed", "Success!");

        	document.getElementById("withdraw-loader").classList.remove('ui-loading');
        	       

            fetchAccountData();

            txinprogress = false;


      })

      .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
      		 
             document.getElementById("withdraw-loader").classList.remove('ui-loading');
             document.getElementById("withdraw-btn").removeAttribute("disabled");
             openAlert("danger", "Transaction Failed", error.message);

             txinprogress = false;
      });
}


document.getElementById("slider").addEventListener("input", function(e){

	//console.log('slider1');

	var divs = document.getElementById("koji-divs-unrounded").value; 

	//console.log(+divs);

	if (+divs == 0) {
		document.getElementById("withdraw-btn").removeAttribute('onclick');
		return;
	}

	var percent = document.querySelector('#amount').value;

	//console.log(percent);

	var netwithdrawal = ((divs * percent) / 100).toFixed(9);

	//console.log(netwithdrawal);

	document.getElementById("withdraw-divs").innerText = netwithdrawal;

	document.getElementById("withdraw-btn").setAttribute('onclick', 'withdraw('+percent+')');


});

async function reinvest(percent, minout) {

	 //console.log(mintdata);

	 if (percent == 0) {
	 	percent = 100;
	 }

     const web3 = new Web3(provider);

     // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

      var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);

      minout = web3.utils.toWei(""+minout+"", "Gwei");

      console.log(percent);
      console.log(minout);

       web3.eth.sendTransaction(
          {from: account[0],
          to: kojitoken,
          value: 0, 
          gasprice: 100000, // 100000 = 10 gwei
           //gas: 350000,   // gas limit
          data: tokencontract.methods.reinvest(percent, minout).encodeABI()
              }, function(err, transactionHash) {
            //console.log('in progress');
             if (!err) {
            	 txinprogress = true;
	             document.getElementById("reinvest-btn").setAttribute("disabled","disabled");
	             document.getElementById("reinvest-loader").classList.add('ui-loading');
	             var message = "<a href='https://testnet.bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"
	             openAlert("info", "Transaction Submitted", message);
             
            }
             
      })
      .on('receipt', function(receipt){

        //console.log(receipt);

	        openAlert("success", "Transaction Completed", "Success!");

        	document.getElementById("reinvest-loader").classList.remove('ui-loading');

	      	txinprogress = false;

            fetchAccountData();
      })

      .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
      		 

      		 document.getElementById("reinvest-loader").classList.remove('ui-loading');
             document.getElementById("reinvest-btn").removeAttribute("disabled");
             openAlert("danger", "Transaction Failed", error.message);

             txinprogress = false;
      });
}


document.getElementById("slider2").addEventListener("input", function(e){

	//console.log('slider1');

	var divs = document.getElementById("koji-divs-unrounded").value; 

	var kojibnb = document.getElementById("koji-bnb-unrounded").value; 

	//console.log(+divs);

	//console.log(+kojibnb);

	var percent2 = document.querySelector('#amount2').value;

	//console.log(percent2);

	var netdivs = ((divs * percent2) / 100).toFixed(6);

	document.querySelector('#ri-equivalent').innerHTML = netdivs;

	var netreinvest = parseFloat((((divs / kojibnb)*.936)) * percent2 / 100).toFixed(2);

	var minout = ((netreinvest * 90) / 100).toFixed(0);

	//console.log(netreinvest);

	//console.log(minout);

	document.getElementById("koji-reinvested").innerText = netreinvest.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	if (netdivs >= 0.001) {

		document.getElementById("reinvest-btn").removeAttribute("disabled");

		document.querySelector('#reinvest-alert').style.display = 'none';

		document.getElementById("reinvest-btn").setAttribute('onclick', 'reinvest('+percent2+','+minout+')');

	} else {

		document.getElementById("reinvest-btn").setAttribute("disabled", "disabled");

		document.querySelector('#reinvest-alert').style.display = 'block';

		document.querySelector('#reinvest-alert').innerHTML = "You need at least 0.001 BNB dividends equivalent to reinvest";

		document.getElementById("reinvest-btn").removeAttribute('onclick');

	}

	


});

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled");
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  //console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    //console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    window.location.reload(false); 
  });

   
  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    //window.location.reload(false); 
    fetchAccountData()
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    //window.location.reload(false); 
    fetchAccountData()
  });
   

  await refreshAccountData();
  Refresh(15000);
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  window.clearInterval(refreshinterval);

  //console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  var accountdata = btoa("account="+selectedAccount+"")

  fetch("killsession.php?"+accountdata+"");

  selectedAccount = null;

  document.querySelector("#btn-connect").style.display = "block";
  document.querySelector("#btn-disconnect").style.display = "none";

  document.getElementById("disconnected").style.display = 'block';

  document.querySelector("#web3-wallet-disconnected").style.display = "block";
  document.querySelector("#web3-wallet-connected").style.display = "none";

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
  window.location.reload(false); 
}

function Refresh(interval) {
refreshinterval = window.setInterval(function() {
	if (!txinprogress) {
		fetchAccountData();
		//console.log('updating account data')

		//edit by andreas
		//document.getElementById("update-price").innerHTML = "<img src='https://app.koji.earth/assets/imgs/loading-buffering.gif' width='16px' height='16px'>";
		document.getElementById("update-price").classList.add("ui-loading")

		window.clearTimeout(updating);
		var updating = window.setTimeout(function () {
		  //edit by andreas
			//document.getElementById("update-price").innerHTML = "";
		  document.getElementById("update-price").classList.remove("ui-loading")
		},2000);
		}

},interval);
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});
