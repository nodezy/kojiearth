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
let kojitoken = "0x30256814b1380Ea3b49C5AEA5C7Fa46eCecb8Bc0"; //bsc test KOJI
let bscnftaddress = "0x062C9545e61A7eD56F3BE4256EAAC19c5580868A"; //bsctest nft contract
let bscnftproxy = "0xe97E4c086283d6e6c407ac131F7413Fea3B32a46"; //bsctest nft proxy contract
let liquidpair = "0x697666d38d339958ed416e0119bdc73abef58996";
let oracle = "0x66F2495e1f139c22Dd839250858bB8936a7845Bc";
let staking = "0x1315990256C41CCa118301b1e34993e2fd38B7ab";
let rewards = "0xDE554cA0E3B9861d120A7415C0dE6Ac32AFb4cE4";

var kojitokenABI = JSON.stringify([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"AddToDistributorBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"AddToDistributorDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"AddToDistributorNetDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_walletGas","type":"uint256"},{"internalType":"uint256","name":"_reinvestGas","type":"uint256"}],"name":"ChangeDistribGas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timelimit","type":"uint256"}],"name":"ChangeImpoundTimelimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"ChangeMinHold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percent","type":"uint256"}],"name":"Donate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"GetClaimed","outputs":[{"internalType":"uint256","name":"pending","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GetMinDistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"GetPending","outputs":[{"internalType":"uint256","name":"pending","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GetRewardsToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"GetShareholderExpired","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percent","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin","type":"uint256"}],"name":"Reinvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"RescueBNBfromDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"SetDistributionCriteria","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"SweepDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"TransferBEP20fromDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"ViewHolderInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"unpaid","type":"uint256"},{"internalType":"uint256","name":"realised","type":"uint256"},{"internalType":"uint256","name":"excluded","type":"uint256"},{"internalType":"bool","name":"rewardeligible","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ViewMathInfo","outputs":[{"internalType":"uint256","name":"totalshares","type":"uint256"},{"internalType":"uint256","name":"netdividends","type":"uint256"},{"internalType":"uint256","name":"totaldistributed","type":"uint256"},{"internalType":"uint256","name":"totalreinvested","type":"uint256"},{"internalType":"uint256","name":"totalwithdrawn","type":"uint256"},{"internalType":"uint256","name":"totalDonated","type":"uint256"},{"internalType":"uint256","name":"totaldividends","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ViewMinHold","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETHaddedToPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percent","type":"uint256"}],"name":"Withdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_maxTxAmountBuy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmountSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxWalletToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokencontract","type":"address"},{"internalType":"uint256","name":"_minHoldAmount","type":"uint256"},{"internalType":"uint256","name":"_percent","type":"uint256"}],"name":"addPartnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"addToLiquid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"adminWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"airdropEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"approveMax","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burnRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_distributorgas","type":"uint256"},{"internalType":"uint256","name":"_walletgas","type":"uint256"}],"name":"changeContractGas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_oracle","type":"address"}],"name":"changeOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"charityWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"convertBNBtoWBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"distributorDeposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enableOracle","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enablePartners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeDenominator","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDonationLeaders","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPartnershipIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"bot","type":"bool"}],"name":"getTotalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isInBot","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"manualBurn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"nftPoolActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftRewardWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"contract IOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"partnerFeeLimiter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerShares","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokencontract","type":"address"}],"name":"removePartnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IDEXRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setAddToLiquid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setAirdropDisabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"toggle","type":"bool"}],"name":"setBot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setBuyTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setDistributorDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setEnableOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setEnablePartners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_totalFee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_charityWallet","type":"address"},{"internalType":"address","name":"_adminWallet","type":"address"},{"internalType":"address","name":"_nftRewardWallet","type":"address"},{"internalType":"address","name":"_stakePoolWallet","type":"address"}],"name":"setFeeReceivers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"blocks","type":"uint256"}],"name":"setInitialBlockLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsDividendExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsFeeExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsTxLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setLaunchEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setMaxWalletToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setNFTPoolActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limiter","type":"uint256"}],"name":"setPartnerFeeLimiter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setSellTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setStakePoolActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setSwapBackSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setTeamWalletDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setburnRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setstakepoolRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"settaxRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakePoolActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakePoolWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakepoolRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"taxRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"teamWalletDeposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCharity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNFTrewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStakepool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferBEP20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"adr","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"viewPartnership","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"address","name":"tokencontract","type":"address"},{"internalType":"uint256","name":"minHoldAmount","type":"uint256"},{"internalType":"uint256","name":"discount","type":"uint256"},{"internalType":"bool","name":"enabled","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"viewTeamWalletInfo","outputs":[{"internalType":"uint256","name":"charityDivs","type":"uint256"},{"internalType":"uint256","name":"adminDivs","type":"uint256"},{"internalType":"uint256","name":"nftDivs","type":"uint256"},{"internalType":"uint256","name":"stakeDivs","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]);
var bscnftmintABI = JSON.stringify([{"inputs":[{"internalType":"uint256","name":"_timestart","type":"uint256"},{"internalType":"uint256","name":"_timeend","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_toAdd","type":"address"}],"name":"addWhitelisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mintedCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtier1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtier2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintlimitsenabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftproxy","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"receiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_toRemove","type":"address"}],"name":"removeWhitelisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tier1minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier1mintlimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tier2minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier2mintlimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeend","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timestart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"walletbalanceenabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"minttier1NFT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"minttier2NFT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tier1mintLimitReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier2mintLimitReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"holder","type":"address"}],"name":"checkBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"mintedCounttier1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"mintedCounttier2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"setToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_receiver","type":"address"}],"name":"changeReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier1URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier2URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"tier1limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"tier2limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enabletimelimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablewalletlimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablemintlimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablewalletbalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"setWindow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"setnftproxy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHFromContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferERC20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getRoyaltyNumerator","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_number","type":"uint256"}],"name":"setRoyaltyNumerator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"updateTier1balance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"updateTier2balance","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var bscnftproxyABI = JSON.stringify([{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"NFTAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_nftaddress","type":"address"}],"name":"setNFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sender","type":"address"},{"internalType":"bytes32","name":"_tier","type":"bytes32"},{"internalType":"bytes32","name":"_redherring","type":"bytes32"}],"name":"method_unknown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHFromContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferERC20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"returnstring1","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"returnstring2","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"changeTier1URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"changeTier2URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier1URIstring","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier2URIstring","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var liquidpairabi = JSON.stringify([{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
var oracleabi = JSON.stringify([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"LazloOnline","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"_pair","type":"address"}],"name":"changePair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tier1","type":"uint256"},{"internalType":"uint256","name":"tier2","type":"uint256"}],"name":"changeTierAmounts","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getKojiUSDPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMinKOJITier1Amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMinKOJITier2Amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint256","name":"reserve0","type":"uint256"},{"internalType":"uint256","name":"reserve1","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getbnbequivalent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getdiscount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minTier1Amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minTier2Amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var stakingabi = JSON.stringify([{"inputs":[{"internalType":"contract KojiFlux","name":"_kojiflux","type":"address"},{"internalType":"uint256","name":"_startBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"}],"name":"Unstake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WithdrawRewardsOnly","type":"event"},{"inputs":[],"name":"KojiFluxAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NFTAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IERC20","name":"_stakeToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_toAdd","type":"address"}],"name":"addAuthorized","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addedstakeTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authorized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blockRewardLastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blockRewardPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blockRewardUpdateCycle","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blocksPerDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bonusRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"boostersEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buySuperMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buySuperMintKoji","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_oracle","type":"address"}],"name":"changeOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_rewards","type":"address"}],"name":"changeRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_upperlimit","type":"uint256"}],"name":"changeUpperLimiter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"conversionRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"convertAndWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableFluxSuperMintBuying","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enableKojiSuperMintBuying","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enableRewardWithdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enableRewardWithdrawals","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableTaxlessWithdrawals","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getAccruedRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_address","type":"address"}],"name":"getConversionAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"getConversionPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getConversionRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"getHolderRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getKojiPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getKojiPerBlockUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOracleMinMax","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"getPendingUSDRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"getRunningDepositTotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSuperMintPrices","outputs":[{"internalType":"uint256","name":"fluxprice","type":"uint256"},{"internalType":"uint256","name":"kojiprice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"getTierequivalent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getTotalPendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getTotalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"getTotalStake","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"getUSDequivalent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_staketime","type":"uint256"}],"name":"getUnstakePenalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"getWithdrawResult","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"},{"internalType":"uint256","name":"_tempamount","type":"uint256"}],"name":"getWithdrawResultTest","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"giveAllsuperMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"increaseKojiFluxBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"kojiflux","outputs":[{"internalType":"contract KojiFlux","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"minKojiTier1Stake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minKojiTier2Stake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"moveRewardsToEscrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"contract IOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IERC20","name":"stakeToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accKojiPerShare","type":"uint256"},{"internalType":"uint256","name":"runningTotal","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"promoActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"promoAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftID","type":"uint256"}],"name":"redeemtier1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftID","type":"uint256"}],"name":"redeemtier2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"reduceKojiFluxBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_toRemove","type":"address"}],"name":"removeAuthorized","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHFromContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardWithdrawalStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewards","outputs":[{"internalType":"contract IKojiRewards","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blockRewardPercentage","type":"uint256"}],"name":"setBlockRewardPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blockRewardUpdateCycle","type":"uint256"}],"name":"setBlockRewardUpdateCycle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocksPerDay","type":"uint256"}],"name":"setBlocksPerDay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rate","type":"uint256"}],"name":"setConverstionRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"setKojiFluxAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setKojiFluxBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_min1","type":"uint256"},{"internalType":"uint256","name":"_min2","type":"uint256"}],"name":"setKojiStakingMinMax","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"setNFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setPromoStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_stakeBonusStart","type":"uint256"},{"internalType":"uint256","name":"_stakeBonusEnd","type":"uint256"},{"internalType":"uint256","name":"_bonusRate","type":"uint256"},{"internalType":"bool","name":"_stakeBonusEnabled","type":"bool"}],"name":"setStakeBonusParams","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_fluxbuying","type":"bool"},{"internalType":"bool","name":"_kojibuying","type":"bool"}],"name":"setSuperMintBuying","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setTaxlessWithdrawals","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakeBonusEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakeBonusEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakeBonusStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"superMint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"superMintFluxPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"superMintKojiPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftID","type":"uint256"}],"name":"superminttier1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftID","type":"uint256"}],"name":"superminttier2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferERC20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unstakePenaltyDefaultTax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unstakePenaltyDenominator","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unstakePenaltyStartingTax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"updatePoolReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upperLimiter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"},{"internalType":"uint256","name":"usdEquiv","type":"uint256"},{"internalType":"uint256","name":"stakeTime","type":"uint256"},{"internalType":"uint256","name":"unstakeTime","type":"uint256"},{"internalType":"uint256","name":"tierAtStakeTime","type":"uint256"},{"internalType":"bool","name":"blacklisted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userStaked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawRewardsOnly","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var rewardsabi = JSON.stringify([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"blacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"holderRealized","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"holderRewardLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kojiflux","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"payPendingRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueETHFromContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardsEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"setstakingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakingContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokencontractv2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferERC20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]);

let sessionwallet; 
let sessiontier; 
let mintdata;

let charityAddress;
let charityBalance;
let adminBalance;
let nftrewardBalance;
let stakepoolBalance;
let stakepoolAddress;

let timestamp;
let blocknumber;

let bscchain = false;

let txinprogress = false;

let mobile = false;

let switched = false;

let donotsend = true;

let functioncalled = false;

let showstakinginfo = false;

let hidestakinginfo = false;

let apipull = 1;

let starttime;
let endtime;

let fluxrewards;

let kojiusd;

let totalkojistaked;

let totalrewardsone;

let humanFriendlyBalance;

const tokenAddress = kojitoken;
const tokenSymbol = 'KOJI v2';
const tokenDecimals = 9;
const tokenImage = 'https://assets.coingecko.com/coins/images/16124/small/koji-token-200.png';

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

function addKOJItoken() {
	const web3 = new Web3(provider);
	try {
	  // wasAdded is a boolean. Like any RPC method, an error may be thrown.
	  const wasAdded = ethereum.request({
	    method: 'wallet_watchAsset',
	    params: {
	      type: 'ERC20', // Initially only supports ERC20, but eventually more!
	      options: {
	        address: tokenAddress, // The address that the token is at.
	        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
	        decimals: tokenDecimals, // The number of decimals in the token
	        image: tokenImage, // A string url of the token logo
	      },
	    },
	  });

	  if (wasAdded) {
	   // console.log('Thanks for your interest!');
	  } else {
	   // console.log('Your loss!');
	  }
	} catch (error) {
	  console.log(error);
	}
}

/**
 * Setup the orchestra
 */
function init() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		mobile = true;
	} else {
		document.querySelector("#buy-link").setAttribute("target", "_blank");
	}
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
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
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

const myAsyncFunc5 = (result) => { 

   //var amount = ".003 BNB";

    web3.eth.sendSignedTransaction(result.rawTransaction)
            .on('transactionHash', function(hash){
                
                console.log(hash);
            });

            
        //console.log(result);  

};


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  //console.log("Web3 instance is", web3);

  document.getElementById("connected").style.display = 'block';
  //edit by andreas	
  document.getElementById("page").classList.add('connected');
  document.getElementById("page").classList.remove('disconnected');

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

			            if (!switched) {

			            	 addBSCNetwork();
			            	 switched = true;
			            }
		           

		            
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
  humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

  
  document.querySelector("#selected-account").textContent = selectedAccount;
  document.querySelector("#token-address").textContent = kojitoken;
  document.querySelector("#token-address-link").innerHTML = '<a href="https://bscscan.com/address/' + kojitoken + '" class="to-address"><i class="icon-external-link"></i></a>';
  //edit by andreas
  document.querySelector("#selected-account-link").innerHTML = '<a href="https://bscscan.com/address/' + selectedAccount + '" class="to-address"><i class="icon-external-link"></i></a>';
  document.querySelector("#account-balance").textContent = humanFriendlyBalance + " BNB";
  
  
  var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);
  var nftcontract = new web3.eth.Contract(JSON.parse(bscnftmintABI),bscnftaddress);
  var paircontract = new web3.eth.Contract(JSON.parse(liquidpairabi),liquidpair);
  var oraclecontract = new web3.eth.Contract(JSON.parse(oracleabi),oracle);

  
  //added by andreas, show first/last 4 character from wallet address in disconect btn + wallet info & disconnect modal
  var selectedAccountFirstChars = selectedAccount.substring(0, 4);
  var selectedAccountLastChars = selectedAccount.substr(-4);
  
  document.getElementById("btn-disconnect").innerHTML = '<div><i class="icon-wallet1"></i><i></i></div><span> ' + selectedAccountFirstChars + '...' + selectedAccountLastChars + ' </span>';
  document.getElementById("selected-account-modal").textContent = selectedAccount;
  document.getElementById("selected-account-modal-link").innerHTML = '<a href="https://bscscan.com/address/' + selectedAccount + '"><i class="icon-external-link"></i> View on BSCScan</a>';
	 
 //added by andreas / END

	 oraclecontract.methods.LazloOnline().call(function(err,res){
		if(!err){
			if(res) {
				document.querySelector('#oracle-connected').style.display = 'inline';
			} else {
				document.querySelector('#oracle-connected').style.display = 'none';
			}
		}
	 });

	 oraclecontract.methods.getKojiUSDPrice().call(function(err,res){

		if(!err){

			kojiusd = res[2];

		}
	});

	 tokencontract.methods.enablePartners().call(function(err,res){
		if(!err){
			if(res) {
				document.querySelector('#partner-tokens-on').style.display = 'block';
				document.querySelector('#partner-tokens-off').style.display = 'none';

				tokencontract.methods.getPartnershipIndex().call(function(err,res){
					if(!err){
						//console.log(res);
						var y=0;

						//document.getElementById("partner-output").innerHTML = '';
						for(var x=0; x<res; x++) {
							

							tokencontract.methods.viewPartnership(x).call(function(err,res){
								if(!err){
									//console.log(res);
									//console.log(x);
									if(y<1) {
										//console.log('true');
										document.getElementById("partner-output").innerHTML = '';
										document.getElementById("partner-output").innerHTML = '<div class="data-row clearfix">Discount Token '+(+y+1)+' ('+res[3]+')</div>';
									} else {
										document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix">Discount Token '+(+y+1)+' ('+res[3]+')</div>';
									}
									
									document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix"><div class="title">Name</div><div class="value">'+res[0]+'</div></div>';
									//document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix"><div class="title">Symbol</div><div class="value">'+res[1]+'</div></div>';
									//document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix"><div class="title">Decimals</div><div class="value">'+res[2]+'</div></div>';
									//document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix"><div class="title">Contract</div><div class="value">'+res[3]+'</div></div>';
									document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix"><div class="title">Hold Requirement</div><div class="value">'+web3.utils.fromWei(res[4],"Gwei").replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' '+res[1]+'</div></div>';
									document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix"><div class="title">Discount %</div><div class="value">'+(+res[5]/10)+'%</div></div>';
									document.getElementById("partner-output").innerHTML += '<div class="data-row clearfix"><div class="title">Enabled</div><div class="value">'+res[6]+'</div></div>';
									y++;	
								}
							});

						}
					}
				});



			} else {
				document.getElementById("partner-output").innerHTML = '<div class="data-row clearfix">There are no Partner Token discounts at this time.</div>';
				document.querySelector('#partner-tokens-off').style.display = 'block';
				document.querySelector('#partner-tokens-on').style.display = 'none';
			}
		}
	 });

	 tokencontract.methods.enableOracle().call(function(err,res){
		if(!err){
			if(res) {
				document.querySelector('#dynamic-discount-on').style.display = 'block';
				document.querySelector('#dynamic-discount-off').style.display = 'none';
			} else {
				document.querySelector('#dynamic-discount-off').style.display = 'block';
				document.querySelector('#dynamic-discount-on').style.display = 'none';
			}
		}
	 });

 				
		//console.log(apipull);
		//console.log("pulling price from CoinGecko API");
	var bnbpricedata = fetch("https://api.coingecko.com/api/v3/simple/price/?ids=binancecoin&vs_currencies=usd", {mode: 'cors'}).then(function(response) {
        if (response.status !== 200) {
          console.log("Can Not get CoinGecko List Api! Status: " + response.status);
          //return;
        }  
      	  response.json().then(function(data) {
      		bnbusd = data.binancecoin.usd;
	        

	        document.getElementById("bnb-usd").innerHTML = '$' + bnbusd;

	         document.getElementById("bnb-balance-usd").innerHTML = "<span>($" +parseFloat(humanFriendlyBalance * bnbusd).toFixed(2)+")</span>";

	        paircontract.methods.getReserves().call(function(err,res){
			    if(!err){

			    	//console.log(res);

			    	var pooledbnb = parseFloat(web3.utils.fromWei(res._reserve0)).toFixed(2);

			    	document.getElementById("pool-bnb").innerHTML = ""+pooledbnb.replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" <span>BNB<span>";

			    	var pooledkoji = parseFloat(+res._reserve1/1e9).toFixed(2);

			    	document.getElementById("pool-koji").innerHTML = "<strong>"+pooledkoji.replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"<span> KOJI</span>";
			        
			       var poolbnbusdvalue = parseFloat(web3.utils.fromWei(res[0])*bnbusd).toFixed(2);

			       var kojiusdvalue = parseFloat(poolbnbusdvalue / web3.utils.fromWei(res[1],"gwei")).toFixed(9);
			       //console.log(web3.utils.fromWei(res[1],"gwei"));

			       document.getElementById("koji-usd").innerHTML = '$'+kojiusdvalue;

			       var kojibnbunrounded = parseFloat(kojiusdvalue / bnbusd);

			       document.getElementById("koji-bnb-unrounded").value = kojibnbunrounded;

			       var kojibnb = parseFloat(kojiusdvalue / bnbusd).toFixed(10);

             	   // edit by andreas 
			       // document.getElementById("koji-bnb").innerHTML = "<em>" +kojibnb+ "BNB</em>";
             	   document.getElementById("koji-bnb").innerText = kojibnb;

             		
	 				tokencontract.methods.balanceOf(selectedAccount).call(function(err,res){
					    if(!err){
					       // console.log(web3.utils.fromWei(res));
					       var balance = web3.utils.fromWei(res, "gwei");
					       balance = +balance;
					       balance = parseFloat(balance).toFixed(2);

					       tokencontract.methods.ViewMinHold().call(function(err,res){
							    if(!err){

							    	var minhold = parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(0);

							    	document.getElementById("minhold").innerText = minhold.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

							    	//console.log(+balance);
							    	//console.log(+minhold);

							    	if (+balance >= +minhold) {
							    		
										//edit by andreas
							    		//document.querySelector('#eligible-info').style.display = 'block';
							    		tokencontract.methods.ViewHolderInfo(selectedAccount).call(function(err,res){
							    			//console.log(res);
			    						if(!err){
			    							var user_rewards_bool = res.rewardeligible;
			    								if (!user_rewards_bool) { //user needs to register
			    									//document.querySelector('#registration').style.display = 'none';
			    									document.querySelector('#ineligible').style.display = 'block';
							    					document.querySelector('#eligible').style.display = 'none';
			    									
			    									/*if (ethBalance >= .003) { //user has enough gas to register
			    										document.querySelector('#req-gas-btn').setAttribute("disabled", "disabled");
			    										document.querySelector('#req-gas-btn').setAttribute("onclick", "");
			    										document.querySelector('#reg-holdings-btn').removeAttribute("disabled");
			    										document.querySelector('#reg-holdings-btn').setAttribute("onclick", "registerHoldings()");
														// edit by andreas
			    										// document.getElementById("req-gas-btn").innerText = "BNB Amount Sufficient";
														document.getElementById("req-gas-btn").innerHTML = "<div><i class='fas fa-gas-pump'></i></div><span><strong>BNB Amount Sufficient</strong></span>";
														// added by andreas
														document.querySelector('#no-gas-text').style.display = 'none';
														document.getElementById("req-gas-col").classList.add('hide');
														document.getElementById("reg-holdings-col").classList.add('single');
			    									} else { //user needs airdrop
			    										document.querySelector('#req-gas-btn').removeAttribute("disabled");
			    										document.querySelector('#req-gas-btn').setAttribute("onclick", "getBNB()");
			    										document.querySelector('#reg-holdings-btn').setAttribute("onclick", "");
			    										document.querySelector('#reg-holdings-btn').setAttribute("disabled", "disabled");
			    										document.getElementById("req-gas-btn").innerHTML = "<div><i class='fas fa-gas-pump'></i></div><span><strong>Request BNB for gas</strong></span>";
			    									}	*/
			    									
			    								} else { //user has already registered
			    									//document.querySelector('#reg-holdings-btn').setAttribute("onclick", "");
			    									//document.querySelector('#registration').style.display = 'none';
			    									document.querySelector('#ineligible').style.display = 'none';
							    					document.querySelector('#eligible').style.display = 'block';
			    								}

			    							}

			    						});
							    	} else {
							    		document.querySelector('#ineligible').style.display = 'block';
							    		document.querySelector('#eligible').style.display = 'none';
										//edit by andreas
							    		//document.querySelector('#eligible-info').style.display = 'none';
							    	}

							    	
							    }
							});


					       var kojiusdholdings = parseFloat(kojiusdvalue * balance).toFixed(2);
					        
					        document.getElementById("koji-balance").innerHTML = balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI <span class='usd-amount'>($" +kojiusdholdings+")</span>" ;
					        document.getElementById("koji-balance-1").innerHTML = "Balance: "+balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
					        document.getElementById("koji-balance-2").innerHTML = balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

					        tokencontract.methods.GetPending(selectedAccount).call(function(err,res){
					    		if(!err){

					    			//console.log(res);

					    			var dividends = web3.utils.fromWei(res);

					    			//console.log(dividends);


					    			tokencontract.methods.GetClaimed(selectedAccount).call(function(err,res){
					    				if(!err){

					    					//console.log(web3.utils.fromWei(res));

							    			dividends = +dividends + +web3.utils.fromWei(res);

							    			//console.log(dividends);

							    			document.getElementById("koji-divs-unrounded").value = dividends;

							    			var divsusdholdings = parseFloat(bnbusd * dividends).toFixed(2);

							    			document.getElementById("koji-divs").innerHTML = parseFloat(dividends).toFixed(9);

							    			document.getElementById("koji-divs-usd").innerHTML = "($" +divsusdholdings+")";

							    			var percent = document.querySelector('#amount').value;

							    			var percent2 = document.querySelector('#amount2').value;

							    			var adjdivs = parseFloat((dividends * percent) / 100).toFixed(9);

							    			var ridivs = parseFloat((dividends * percent2) / 100).toFixed(4);


							    			document.querySelector('#ri-equivalent').innerHTML = ridivs;

							    			document.getElementById("withdraw-divs").innerHTML = adjdivs;

							    			document.getElementById("donate-divs").innerHTML = adjdivs;

							    			var percent2 = document.querySelector('#amount2').value;

							    			//console.log(percent2);

							    			var kojireinvested = parseFloat((((dividends / kojibnbunrounded)*.936)) * percent2 / 100).toFixed(2);

							    			var kojiAmountOut = (kojireinvested * 90 /100).toFixed(0);


								    			if (dividends > 0.000000001) {

								    				document.getElementById("withdraw-btn").removeAttribute("disabled");

								    				document.getElementById("withdraw-btn").setAttribute('onclick', 'withdraw('+percent+')');

								    				document.querySelector('#withdraw-alert').style.display = 'none';

								    				document.getElementById("donate-btn").removeAttribute("disabled");

								    				document.getElementById("donate-btn").setAttribute('onclick', 'donate('+percent+')');

								    				document.querySelector('#donate-alert').style.display = 'none';

								    			} else { // added by andreas

							    					document.getElementById("withdraw-btn").setAttribute("disabled", "disabled");

								    				document.querySelector('#withdraw-alert').style.display = 'block';

								    				document.getElementById("withdraw-btn").removeAttribute('onclick');

								    				document.getElementById("donate-btn").setAttribute("disabled", "disabled");

								    				document.querySelector('#donate-alert').style.display = 'block';

								    				document.getElementById("donate-btn").removeAttribute('onclick');
												}

							    				//console.log(ridivs);

								    			if (+ridivs >= 0.001) {

								    				document.getElementById("reinvest-btn").removeAttribute("disabled");

								    				document.getElementById("reinvest-btn").setAttribute('onclick', 'reinvest('+percent2+','+kojiAmountOut+')');

								    				document.querySelector('#reinvest-alert').style.display = 'none';

								    				document.getElementById("koji-reinvested").innerHTML = kojireinvested.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

								    			} else {

							    					document.getElementById("reinvest-btn").setAttribute("disabled", "disabled");

								    				document.querySelector('#reinvest-alert').style.display = 'block';

								    				document.getElementById("reinvest-btn").removeAttribute('onclick');
													// edit by andreas
								    				document.getElementById("koji-reinvested").innerText = "0.00";

								    			}

							    			

											

							    				tokencontract.methods.getCirculatingSupply().call(function(err,res){
							    					if(!err){

														// edits by andreas, removed spaces, inline css and some decimals

							    						var totalCirc = parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(0);

							    						document.getElementById("total-circ").innerHTML = totalCirc.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

							    						document.getElementById("market-cap").innerHTML = "$" + parseFloat(totalCirc * kojiusdvalue).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
							    					}

							    					tokencontract.methods.balanceOf("0x000000000000000000000000000000000000dEaD").call(function(err,res){
							    						if(!err){

															// edits by andreas, added icon, removed spaces, inline css and some decimals

							    							var totalBurned =  parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(0); 

							    							var totalBurnedUSD = parseFloat(totalBurned * kojiusdvalue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

							    							document.getElementById("total-burn").innerHTML = '<i class="icon-fire"><i class="path1"></i><i class="path2"></i></i>' + totalBurned.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " <span>($" +totalBurnedUSD+")</span>";
							    						}

							    					});

							    					tokencontract.methods.WETHaddedToPool().call(function(err,res){
							    						if(!err){

							    							var wethadded = parseFloat(web3.utils.fromWei(res)).toFixed(9);

							    							document.getElementById("total-wbnb-added").innerHTML = wethadded + "<span>($" +parseFloat(wethadded * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    						
							    						}
							    					});

							    					tokencontract.methods.ViewHolderInfo(selectedAccount).call(function(err,res){
							    						if(!err){
							    							var user_realised = parseFloat(web3.utils.fromWei(res.realised)).toFixed(9);
							    							var user_rewards_bool = res.rewardEligible;
							    							document.getElementById("koji-divs-realized").innerHTML = user_realised + "<span class='usd-amount'>($" +parseFloat(user_realised * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    						}

							    					});

							    					tokencontract.methods.ViewMathInfo().call(function(err,res){
							    						if(!err){

							    							//console.log(res);

							    							var distributed = parseFloat(web3.utils.fromWei(res.totaldistributed)).toFixed(9);

							    							var reinvested = parseFloat(web3.utils.fromWei(res.totalreinvested)).toFixed(9);

							    							var withdrawn = parseFloat(web3.utils.fromWei(res.totalwithdrawn)).toFixed(9);

							    							var netdividends = parseFloat(web3.utils.fromWei(res.netdividends)).toFixed(9);

							    							var netdistributed = parseFloat(+netdividends + +withdrawn + +reinvested).toFixed(9);

							    							var totaldonated = parseFloat(web3.utils.fromWei(res.totalDonated)).toFixed(9);



							    							document.getElementById("total-divs").innerHTML = netdistributed + "<span>($" +parseFloat(netdividends * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    							document.getElementById("total-reinvest").innerHTML = reinvested + "<span>($" +parseFloat(reinvested * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    							document.getElementById("total-withdraw").innerHTML = withdrawn + "<span>($" +parseFloat(withdrawn * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    							document.getElementById("total-donated").innerHTML = totaldonated + " <span class='usd-amount'>($" +parseFloat(totaldonated * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    						}
							    					});

							    				});

							    				tokencontract.methods.getDonationLeaders().call(function(err,res) {

											    	if (!err) { 
											    		//console.log(res);
											    		var i;
											    		var j=1;
											    		var amtarr = [];
											    		var donor_result = "";
											    		var tempindex;
											    		var userwallet = "";

											    		amtarr = res[1];
											    		
											    		amtarr = amtarr.slice().sort(function(a, b){return b - a});
											    		

											    

											    		for (i=0; i < res[0].length; i++) {

											    			//console.log(res[1].indexOf(amtarr[i]));

											    			tempindex = res[1].indexOf(amtarr[i]);

											    			//console.log(amtarr[i]);


											    			var tempvalue = parseFloat(web3.utils.fromWei(amtarr[i])).toFixed(9);

											    			//console.log(tempvalue);

											    			tempvalue = parseFloat(tempvalue * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

											    			//console.log(res[0][tempindex]);
											    			//console.log(selectedAccount);
											    			

											    			if (res[0][tempindex] === selectedAccount) {
																// edit by andreas
											    				// userwallet = 'style="background-color:#8b235c6b !important"';
																userwallet = ' my-donation';
											    			} else {
											    				userwallet = '';
											    			}

															// added by andreas
															var donationWalletFirstChars = res[0][tempindex].substring(0, 4);
															var donationWalletLastChars = res[0][tempindex].substr(-4);

															// edit by andreas
											    			// donor_result += '<div class="data-row main clearfix" '+userwallet+'><div class="title">'+j+')<strong>'+res[0][tempindex]+'</strong></div><div class="value"><span>'+parseFloat(web3.utils.fromWei(amtarr[i])).toFixed(6)+' BNB</span> <span class="usd-amount">($ '+tempvalue+')</span></div></div>';
															donor_result += '<div class="data-row clearfix'+userwallet+'"><div class="title">'+j+')<strong> '+donationWalletFirstChars+'...'+donationWalletLastChars+'</strong></div><div class="value"><span>'+parseFloat(web3.utils.fromWei(amtarr[i])).toFixed(6)+' BNB</span> <span class="usd-amount">($'+tempvalue+')</span></div></div>';

											    			j++;
											    		}

											    		//console.log(donor_result);
											    		document.getElementById("leaderboard").innerHTML = donor_result;
											    			
											       	}

											    }); //getdonationleaders
												
											
					    				}
					    			}); // getClaimed
					    		}
					    	}); // getPending

					    }
					  }); //selectedAccount

			    }
			}); //getreserves

        }) //if (response.status !== 200) {
		.catch(function(err) {
	  		console.log("Can Not get CoinGecko Price Api! Status: " + err);
			});
	}); //fetch

	 if (!functioncalled) {
   	getwalletnft();
  }

	getStakingData();
	getTeamWallets();
}
       
//Team wallets section //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getTeamWallets() {

	const web3 = new Web3(provider);

	var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);

    tokencontract.methods.charityWallet().call(function(err,res) {

    	if (!err) { 
    		document.getElementById("charity-address").innerHTML = res;
			document.querySelector("#charity-address-link").innerHTML = '<a href="https://bscscan.com/address/' + res + '" class="to-address"><i class="icon-external-link"></i></a>';
  

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
			document.querySelector("#admin-address-link").innerHTML = '<a href="https://bscscan.com/address/' + res + '" class="to-address"><i class="icon-external-link"></i></a>';
  

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


    tokencontract.methods.nftPoolActive().call(function(err,res) {

    	if (!err) { 

    		if (res) {

    			document.querySelector("#nftActive").style.display = "block";
    			document.querySelector("#nftInactive").style.display = "none";

    			tokencontract.methods.nftRewardWallet().call(function(err,res) {

			    	if (!err) { 
			    		document.getElementById("nft-address").innerHTML = res;
						document.querySelector("#nft-address-link").innerHTML = '<a href="https://bscscan.com/address/' + res + '" class="to-address"><i class="icon-external-link"></i></a>';
			  

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

    		} else {

    			document.querySelector("#nftInactive").style.display = "block";
    			document.querySelector("#nftActive").style.display = "none";

    			tokencontract.methods.nftRewardWallet().call(function(err,res) {

			    	if (!err) { 
			    		document.getElementById("nft-address2").innerHTML = res;
						document.querySelector("#nft-address2-link").innerHTML = '<a href="https://bscscan.com/address/' + res + '" class="to-address"><i class="icon-external-link"></i></a>';
  
			    	}

			    });

    			

    		}

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
						document.querySelector("#stake-address1-link").innerHTML = '<a href="https://bscscan.com/address/' + res + '" class="to-address"><i class="icon-external-link"></i></a>';
  

			    		try {
			    			var balance = web3.eth.getBalance(res).then(stakebalance);

			    			//console.log(charityBalance);
			    			
			    			
			    		} 

			    		catch {

			    		}    		
			    		tokencontract.methods.stakePoolWallet().call(function(err,res) {
			    			if (!err) {
					    		tokencontract.methods.balanceOf(res).call(function(err,res) {
					    			//console.log(res);

					    			if (!err) { 

					    				document.getElementById("stake-divs").innerHTML = parseFloat(+res/10e8).toFixed(2) + " KOJI";

					    			}
					    		});
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
						document.querySelector("#stake-address2-link").innerHTML = '<a href="https://bscscan.com/address/' + res + '" class="to-address"><i class="icon-external-link"></i></a>';
  
			    	}

			    });

    			

    		}

		}

	});

}

//* Staking */////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function getStakingData() {

	const web3 = new Web3(provider);

	var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);
	var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);
	var oraclecontract = new web3.eth.Contract(JSON.parse(oracleabi),oracle);

	stakingcontract.methods.getOracleMinMax().call(function(err,res) {
		if (!err) { 
			//console.log(res);

			var tier1 = parseFloat(+res[0]/10e8).toFixed(0);
			var tier2 = parseFloat(+res[1]/10e8).toFixed(0);

			document.getElementById("tier1amount").innerHTML = tier1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
			document.getElementById("tier2amount").innerHTML = tier2.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

			stakingcontract.methods.userStaked(selectedAccount).call(function(err,res) {
				if (!err) { 

					//console.log(res);

					if(res) {//user is staked, calculate deposit/wd amounts

						//console.log(showstakinginfo);

						if (!showstakinginfo) {
						// edit by andreas, using the already made ui-toggle function instead
						// document.getElementById("show-staking-info").style.display = "none";
						// document.getElementById("staking-info-wrapper").style.marginBottom = "0px";
						// document.getElementById("hide-toggle").style.display = "none";
						// document.getElementById("show-toggle").style.display = "block";

						document.getElementById("staking-info-wrapper").classList.remove("toggle-active");

						}

						document.getElementById("manage-rewards").style.display = "block";
						document.getElementById("manage-supermints").style.display = "block";

						stakingcontract.methods.userInfo(0,selectedAccount).call(function(err,res) {
							if (!err) { 

								var mystake = parseFloat(+res[0]/10e8).toFixed(0);
								var mystakedusd = parseFloat((+kojiusd * res[0]) / 10e17).toFixed(2);

								//console.log(res); 
								//0 amount
								//1 rewardDebt
								//2 USDvalue
								//3 stakeTime
								//4 unstakeTime
								//5 tier #

								starttime = res[3];
								endtime = res[4];

								document.getElementById("my-total-stake").innerHTML = mystake.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
								document.getElementById("my-stake-value").innerHTML = "$"+ mystakedusd.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " USD";
								

								if (res[5] === 0) {
									document.getElementById("my-stake-tier").innerHTML = "ineligible";
								} else {
									document.getElementById("my-stake-tier").innerHTML = "Tier " + res[5];
								}

								var mytier = res[5];


								var unstaketime = res[4];
								

								stakingcontract.methods.getUnstakePenalty(unstaketime).call(function(err,res) {
									if (!err) { 

										//console.log(res);

										var penalty = res; 

										var days = penalty - 10;

										penalty = (penalty/10).toFixed(1);

										var pseudopenalty = penalty - 1;


										//1.5% (15 days until 0%)

										document.getElementById("unstake-penalty").innerHTML = "1% + " + pseudopenalty+"% early unstake" + " ("+ days + " days until 0%)";

										stakingcontract.methods.getHolderRewards(selectedAccount,0).call(function(err,res) {
											if (!err) { 
												var totalrewards = parseFloat(+res/10e8).toFixed(2);
												totalrewards = Number(totalrewards);
												var mypoolrewards = 0;

												//console.log("total rewards is " +totalrewards);

												if(totalrewards === 0) {
													
													mypoolrewards = (+mystake*((penalty/100)))*-1;
													//console.log(mypoolrewards);
													mypoolrewards = Number(totalrewards) + Number(mypoolrewards);
												} else {
													//totalrewards = totalrewards - mystake;
													mypoolrewards = (+mystake*((penalty/100)))*-1;
													//console.log(mypoolrewards);
													mypoolrewards = Number(totalrewards) + Number(mypoolrewards);
												}
												
												//console.log(mypoolrewards);
												//console.log(mystake);

												document.getElementById("my-pool-rewards").innerHTML = mypoolrewards.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
											}
										});


										//calculate amounts for further deposits

										var tier1stakedelta = (tier1 - mystake).toFixed(0);
										var tier2stakedelta = (tier2 - mystake).toFixed(0); 

										

										var tier1stakedeltakoji; 
										var tier2stakedeltakoji; 

										if (tier1stakedelta > 0) { //user stake amount is less than tier1 max

											tier1stakedeltakoji = parseFloat(tier1stakedelta*1.001).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
											document.getElementById("max1span").style.display = "inline";

											/*console.log(tier1stakedelta);
											console.log(kojiusd);

											console.log(tier1stakedelta/kojiusd);*/

										} else { //user stake amount is greater than tier1 max

											tier1stakedeltakoji = "N/A";
											document.getElementById("max1span").style.display = "none";
					
										}

										if (tier2stakedelta > 0) { //user stake amount is less than tier1 max

											tier2stakedeltakoji = parseFloat(tier2stakedelta*1.001).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
											document.getElementById("max1span").style.display = "inline";

										} else { //user stake amount is greater than tier1 max

											tier2stakedeltakoji = "N/A";
											document.getElementById("max2span").style.display = "none";
										}

										//console.log(tier1stakedeltakoji);
										//console.log(tier2stakedeltakoji);
										
										//console.log(+mytier);

										if (+mytier === 0) {

											//console.log("tier 0");

											document.getElementById("mintier1amount").innerHTML = parseFloat(Number(tier1)*1.001).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
											document.getElementById("mintier2amount").innerHTML = parseFloat(Number(tier2)*1.001).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

											//calculate amounts for further withdrawals

											document.getElementById("unstake-amount-1").innerHTML = " N/A";
											document.getElementById("unstake-amount-2").innerHTML = " N/A";


											document.getElementById("is-overage").style.display = "none";

										} else {

											document.getElementById("is-overage").style.display = "block";

											if (+mytier === 1 && tier1stakedeltakoji != "N/A") {

												document.getElementById("mintier1amount").innerHTML = tier1stakedeltakoji + ' (optional) <span class="tooltip conversion" data-tooltip="You already qualifty for tier 1, but you may optionally deposit more KOJI up to the max if desired."><i class="icon-question-circle"></i></span>';

											} else {

												document.getElementById("mintier1amount").innerHTML = tier1stakedeltakoji;

											}

											document.getElementById("mintier2amount").innerHTML = tier2stakedeltakoji;

											//calculate amounts for further withdrawals

											var tier1withdrawdelta = (mystake - tier1).toFixed(0);
											var tier2withdrawdelta = (mystake - tier2).toFixed(0);

											//console.log(tier2withdrawdelta);

											var tier1withdrawdeltakoji;
											var tier2withdrawdeltakoji;

											if (tier1withdrawdelta > 0) { //user stake amount is greater than tier1 max

												var tier1withdrawdeltakojiraw = parseFloat(tier1withdrawdelta).toFixed(0);

												tier1withdrawdeltakoji = " " + tier1withdrawdeltakojiraw.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";


											} else { //user stake amount is less than tier1 max

												tier1withdrawdeltakoji = " N/A";
											}

											if (tier2withdrawdelta > 0) { //user stake amount is greater than tier2 max


												var tier2withdrawdeltakojiraw = parseFloat(tier2withdrawdelta).toFixed(0);

												tier2withdrawdeltakoji = " " + tier2withdrawdeltakojiraw.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";


											} else { //user stake amount is less than tier2 max

												tier2withdrawdeltakoji = " N/A";
											}

											//console.log(tier2withdrawdelta);
											//console.log(tier2withdrawdeltakojiraw);
											//console.log(tier2withdrawdeltakoji);
											document.getElementById("unstake-amount-1").innerHTML = tier1withdrawdeltakoji;
											document.getElementById("unstake-amount-2").innerHTML = tier2withdrawdeltakoji;

											var poolreward;
											var reflect1Amount;
											var reflect2Amount;

											if (+mytier === 1) {					                

												if (tier1withdrawdeltakoji != " N/A") {

													//console.log("raw withdraw is " + tier1withdrawdeltakojiraw);

													stakingcontract.methods.getWithdrawResult(selectedAccount,web3.utils.toWei(tier1withdrawdeltakojiraw, "Gwei")).call(function(err,res) {
														if (!err) { 
															//console.log("net wd result is " +res);

															var net1outfixed = parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(0);

															//console.log("raw withdraw is " + tier1withdrawdeltakojiraw);
															//console.log("net out is " +net1outfixed);

															if (tier1withdrawdeltakojiraw >= net1outfixed) { //poow reward + unstake penalties make total reward negative

																reflect1Amount = (Number(tier1withdrawdeltakojiraw) - Number(net1outfixed))*-1;

															} else {
																reflect1Amount = Number(net1outfixed) - Number(tier1withdrawdeltakojiraw);
															}

															document.getElementById("overage-amt").innerHTML = tier1withdrawdeltakoji;

															reflect1Amount = parseFloat(reflect1Amount).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
															document.getElementById("pool-reward").innerHTML = reflect1Amount;

															 net1outfixed = parseFloat(net1outfixed).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

															 document.getElementById("netout").innerHTML = net1outfixed;
														}
													});

												} else {

													//console.log("raw withdraw is " + web3.utils.toWei(tier2withdrawdeltakojiraw, "Gwei"));

													stakingcontract.methods.getWithdrawResult(selectedAccount,web3.utils.toWei(tier2withdrawdeltakojiraw, "Gwei")).call(function(err,res) {
														if (!err) { 
															//console.log("net wd result is " +res);

															var net2outfixed = parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(0);

															//console.log("raw withdraw is " + tier2withdrawdeltakojiraw);
															//console.log("net out is " +net2outfixed);

															if (tier2withdrawdeltakojiraw >= net2outfixed) { //poow reward + unstake penalties make total reward negative

																reflect2Amount = (Number(tier2withdrawdeltakojiraw) - Number(net2outfixed))*-1;

															} else {
																reflect2Amount = Number(net2outfixed) - Number(tier2withdrawdeltakojiraw);
															}

															document.getElementById("overage-amt").innerHTML = tier2withdrawdeltakoji;

															reflect2Amount = parseFloat(reflect2Amount).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
															document.getElementById("pool-reward").innerHTML = reflect2Amount;

															 net2outfixed = parseFloat(net2outfixed).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

															 document.getElementById("netout").innerHTML = net2outfixed;
														}
													});

												}
												
											}

											if (+mytier === 2) {

												if (tier2withdrawdeltakoji != " N/A") {

													stakingcontract.methods.getWithdrawResult(selectedAccount,web3.utils.toWei(tier2withdrawdeltakojiraw, "Gwei")).call(function(err,res) {
														if (!err) { 
															//console.log("net wd result is " +res);

															var net2outfixed = parseFloat(web3.utils.fromWei(res, "Gwei")).toFixed(0);

															//console.log("raw withdraw is " + tier2withdrawdeltakojiraw);
															//console.log("net out is " +net2outfixed);

															if (tier2withdrawdeltakojiraw >= net2outfixed) { //poow reward + unstake penalties make total reward negative

																reflect2Amount = (Number(tier2withdrawdeltakojiraw) - Number(net2outfixed))*-1;

															} else {
																reflect2Amount = Number(net2outfixed) - Number(tier2withdrawdeltakojiraw);
															}

															document.getElementById("overage-amt").innerHTML = tier2withdrawdeltakoji;

															reflect2Amount = parseFloat(reflect2Amount).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
															document.getElementById("pool-reward").innerHTML = reflect2Amount;

															 net2outfixed = parseFloat(net2outfixed).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

															 document.getElementById("netout").innerHTML = net2outfixed;
														}
													});

												} else {
													//console.log(tier1withdrawdeltakoji);
													document.getElementById("is-overage").style.display = "none";

												}
											}

										}

									}
								});


							} 

						});

					} else { //user is not staked, reset deposit/staking amounts

					//console.log(hidestakinginfo);

						if(!hidestakinginfo) {
						// edit by andreas, using the already made ui-toggle function instead
						// document.getElementById("show-staking-info").style.display = "flex";
						// document.getElementById("staking-info-wrapper").style.marginBottom = "40px";
						// document.getElementById("hide-toggle").style.display = "block";
						// document.getElementById("show-toggle").style.display = "none";

						document.getElementById("staking-info-wrapper").classList.add("toggle-active");

						}

					document.getElementById("my-total-stake").innerHTML = "0 KOJI";
					document.getElementById("my-stake-value").innerHTML = "$0.00 USD";
					document.getElementById("my-stake-tier").innerHTML = "N/A"
					document.getElementById("my-pool-rewards").innerHTML = "0 KOJI";

					document.getElementById("unstake-amount-1").innerHTML = " N/A";
					document.getElementById("unstake-amount-2").innerHTML = " N/A";

					document.getElementById("is-overage").style.display = "none";

					document.getElementById("manage-supermints").style.display = "none";

					document.getElementById("max1span").style.display = "inline";
					document.getElementById("max2span").style.display = "inline";


					document.getElementById("mintier1amount").innerHTML = parseFloat(Number(tier1)*1.001).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
					document.getElementById("mintier2amount").innerHTML = parseFloat(Number(tier2)*1.001).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

					stakingcontract.methods.getAccruedRewards(selectedAccount).call(function(err,res) {
						if (!err) { 
							var totalaccrued = parseFloat(+res/10e8).toFixed(2);

							if (Number(totalaccrued) > 0) {
								document.getElementById("manage-rewards").style.display = "block";
							} else {
								document.getElementById("manage-rewards").style.display = "none";
							}
						}
					});

					}
				}

			});
		}

	});

	tokencontract.methods.allowance(selectedAccount,staking).call(function(err,res) {
		if (!err) { 

			if (+res ==0) {

				document.getElementById("approve-staking").style.display = "block";
				document.getElementById("deposit-staking").style.display = "none";

				document.getElementById("stakeDeposit").setAttribute("disabled",true);
				document.getElementById("stakeDeposit").setAttribute("placeholder","Please approve your KOJI for staking");


			} else {


				document.getElementById("approve-staking").style.display = "none";
				document.getElementById("deposit-staking").style.display = "block";

				document.getElementById("stakeDeposit").removeAttribute("disabled");
				document.getElementById("stakeDeposit").setAttribute("placeholder","Enter amount you want to stake");
			}

		}

	});


	stakingcontract.methods.poolInfo(0).call(function(err,res) {
		if (!err) { 

			totalkojistaked = parseFloat(+res[4]/10e8).toFixed(0);

			//console.log(totalrewardsone);
			//console.log(res);

			document.getElementById("total-koji-staked").innerHTML = totalkojistaked.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

			tokencontract.methods.balanceOf(staking).call(function(err,res) {
				if (!err) { 
					//console.log(res);

					totalrewardsone = parseFloat((+res/10e8) - totalkojistaked).toFixed(2); //this is a hack for now, must use difference between total staked in pool and actual contract balance

					//console.log(kojiusd);

					var totalrewardsoneusd = parseFloat(totalrewardsone * (kojiusd/10e8)).toFixed(2);

					document.getElementById("rewards-pool-one").innerHTML = totalrewardsone.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
					document.getElementById("rewards-pool-one-usd").innerHTML = "$"+ totalrewardsoneusd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " USD";


				}

			});


			oraclecontract.methods.getKojiUSDPrice().call(function(err,res){

				if(!err){

					//kojiusd = res[2];

					var totalkojistakedusd = parseFloat((+totalkojistaked * kojiusd) / 10e8).toFixed(2);

					document.getElementById("total-staked-usd").innerHTML = "$"+ totalkojistakedusd.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " USD";

				}

		 	});
		} else {
			document.getElementById("total-koji-staked").innerHTML = "0 KOJI";
			document.getElementById("rewards-pool-one").innerHTML = "0 KOJI";
			document.getElementById("rewards-pool-one-usd").innerHTML = "$0.00"
			document.getElementById("total-staked-usd").innerHTML = "$0.00 USD";

		}

	});

	/*supermint-flux-enabled
	supermint-flux-disabled
	supermint-koji-enabled
	supermint-koji-disabled
	supermint-balance
	//flux-supermint-price
	btn-supermint-flux
	//koji-supermint-price
	btn-supermint-koji*/

	// SUPERMINTS //////////////////////////////////////////////////////////////////////////////////////////////////

	stakingcontract.methods.getSuperMintPrices().call(function(err,res) {
		if (!err) { 
			document.getElementById("flux-supermint-price").innerHTML = parseFloat(+res[0]/10e8).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " FLUX";
			document.getElementById("koji-supermint-price").innerHTML = parseFloat(+res[1]/10e8).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
		}

	});

	stakingcontract.methods.enableFluxSuperMintBuying().call(function(err,res) {
		if (!err) { 
				//console.log(res);
			if (res) { //enabled
				//console.log(res);
				document.getElementById("supermint-flux-enabled").style.display = "inline-block";
				document.getElementById("supermint-flux-disabled").style.display = "none";
				document.getElementById("btn-supermint-flux").style.display = "block";
				document.getElementById("btn-supermint-flux-disabled").style.display = "none";

			} else { //disabled
				document.getElementById("supermint-flux-enabled").style.display = "none";
				document.getElementById("supermint-flux-disabled").style.display = "inline-block";
				document.getElementById("btn-supermint-flux").style.display = "none";
				document.getElementById("btn-supermint-flux-disabled").style.display = "block";
			}
		}
	});

	stakingcontract.methods.enableKojiSuperMintBuying().call(function(err,res) {
		if (!err) { 
				//console.log(res);
			if (res) { //enabled
				//console.log(res);
				document.getElementById("supermint-koji-enabled").style.display = "inline-block";
				document.getElementById("supermint-koji-disabled").style.display = "none";
				document.getElementById("btn-supermint-koji").style.display = "block";
				document.getElementById("btn-supermint-koji-disabled").style.display = "none";

			} else { //disabled
				document.getElementById("supermint-koji-enabled").style.display = "none";
				document.getElementById("supermint-koji-disabled").style.display = "inline-block";
				document.getElementById("btn-supermint-koji").style.display = "none";
				document.getElementById("btn-supermint-koji-disabled").style.display = "block";
			}
		}
	});

	stakingcontract.methods.superMint(selectedAccount).call(function(err,res) {
		if (!err) { 
			//console.log(res);

			if(res) {
				document.getElementById("supermint-balance").innerHTML = "1";
				//document.getElementById("btn-supermint-flux").setAttribute("disabled",true);
			} else {
				document.getElementById("supermint-balance").innerHTML = "0";
				//document.getElementById("btn-supermint-flux").removeAttribute("disabled");
			}
		}
	});


	// FLUX INFOS ////////////////////////////////////////////////////////////////////////////////////////////////////////

  	tokencontract.methods.balanceOf(rewards).call(function(err,res) {
		if (!err) { 
			//console.log(res);

			var rewardspooltwo = +res;

			document.getElementById("rewards-pool-two").innerHTML = parseFloat(+rewardspooltwo/10e8).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " FLUX";

			stakingcontract.methods.conversionRate().call(function(err,res) {
				if (!err) { 
					//console.log(res);

					var conversionrate = +res/100;

					//console.log(conversionrate);

					document.getElementById("flux-koji").innerHTML = conversionrate;

					var rewardspooltwousd = parseFloat((rewardspooltwo/10e8) * (kojiusd/10e8)).toFixed(2); 

					document.getElementById("rewards-pool-two-usd").innerHTML = "$"+ rewardspooltwousd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " USD";

					stakingcontract.methods.getTotalPendingRewards(selectedAccount).call(function(err,res) {
						if (!err) { 

							var totalpending = parseFloat(+res/10e8).toFixed(2);

							fluxrewards = Number(totalpending);

							//console.log(fluxrewards);

							//getAccruedRewards
							stakingcontract.methods.getAccruedRewards(selectedAccount).call(function(err,res) {
								if (!err) { 
									var totalaccrued = parseFloat(+res/10e8).toFixed(2);

									//console.log(totalaccrued);

									fluxrewards = Number(fluxrewards) + Number(totalaccrued);

									//console.log(fluxrewards);

									document.getElementById("my-flux-rewards").innerHTML = parseFloat(fluxrewards).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " FLUX";
									document.getElementById("my-flux-rewards-1").innerHTML = parseFloat(fluxrewards).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " FLUX";
									document.getElementById("my-flux-rewards-2").innerHTML = parseFloat(fluxrewards).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " FLUX";
							

									stakingcontract.methods.stakeBonusEnabled().call(function(err,res) {
										if (!err) { 
											if (res) { //bonus enabled
												document.getElementById("bonus-section").style.display = "block";
												document.getElementById("bonusrate-enabled").style.display = "block";
												document.getElementById("bonusrate-disabled").style.display = "none";

												stakingcontract.methods.stakeBonusStart().call(function(err,res) {
													if (!err) { 
														var bonusstart = res;
														

														stakingcontract.methods.stakeBonusStart().call(function(err,res) {
															if (!err) { 
																var bonusend = res;


																stakingcontract.methods.bonusRate().call(function(err,res) {
																	if (!err) { 
																		var bonusrate = res/100;
																		//console.log(bonusrate);

																		if (starttime >= bonusstart ) { //&& starttime <= bonusend) {  //need to fix
																			fluxrewards = (Number(fluxrewards) * Number(conversionrate)) * Number(bonusrate);
																		} else {
																			fluxrewards = Number(fluxrewards) * Number(conversionrate);
																		}
																

																		document.getElementById("netrate").innerHTML = parseFloat(fluxrewards).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

																	}
																});

															}	
														});
													}
												});	

											} else { //bonus not enabled

												//console.log(totalpending);

												fluxrewards = fluxrewards * conversionrate;

												//console.log(totalpending);

												document.getElementById("netrate").innerHTML = parseFloat(fluxrewards).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

												document.getElementById("bonus-section").style.display = "none";
												document.getElementById("bonusrate-enabled").style.display = "none";
												document.getElementById("bonusrate-disabled").style.display = "block";
											}

										}
									});
								}
							});

						}
					});

				}
			});


		}

	});

	

}

	
// getAccountInfo//////////////////////////////////////////////////////////////////////

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

// APPROVE STAKING /////////////////////////////////////////////////////////////////////////////////

async function approvestaking() {

	//console.log(mintdata);
	  document.getElementById("dep-holdings-loader").classList.add('ui-loading');
	  document.querySelector('#approve-staking').setAttribute("disabled", "disabled");

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
          data: tokencontract.methods.approveMax(staking).encodeABI()
              }, function(err, transactionHash) {
            //console.log('in progress');
            if (!err) {
            	 txinprogress = true;
	             //document.getElementById("req-gas-btn").setAttribute("disabled","disabled");
	             //document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");
	            
	             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

	             if (!mobile) {
	             	openAlert("info", "Transaction Submitted", message);
	             }
	             
            }
             
      })
      .on('receipt', function(receipt){

        //console.log(receipt);

        	if (!mobile) {
       		 	openAlert("success", "Transaction Completed", "Success!");
       		 }

        	document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
        	document.getElementById("approve-staking").setAttribute("disabled","disabled");

            fetchAccountData();

            txinprogress = false;


      })

      .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
      		 
             document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
        	document.getElementById("approve-staking").removeAttribute("disabled");
             openAlert("danger", "Transaction Failed", error.message);

             txinprogress = false;
      });
}

document.getElementById("stakeDeposit").addEventListener("keyup", function(e) {

	var amount = document.getElementById("stakeDeposit").value;

	//console.log(amount);

	amount = amount.toString().replace(/[, ]+/g, "").replace(/[^0-9]*$/, "");

	//console.log(amount);

	document.getElementById("stakeDeposit").value = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

});

//KOJI FLUX VALIDATION //////////////////////////////////////////////////////////////////////////////

async function validaterewards() {

	if (fluxrewards != 0) {
		document.getElementById("wd-rewards-loader").classList.add('ui-loading');
	  	document.querySelector('#redeem-flux').setAttribute("disabled", "disabled");
		redeemrewards();
	} else {
		document.getElementById("redeem-flux").removeAttribute("disabled");
		document.getElementById("redeemfluxalert").style.display = "block";
		document.getElementById("redeemfluxalert").innerHTML = "You have no pending FLUX rewards to convert";
		document.getElementById("wd-rewards-loader").classList.remove('ui-loading');
		document.getElementById("redeem-flux").removeAttribute("disabled");

	}

}

// KOJI FLUX WITHDRAW //////////////////////////////////////////////////////////////////////////////

async function redeemrewards() {


	// console.log(amount);
	  document.getElementById("wd-rewards-loader").classList.add('ui-loading');
	  document.querySelector('#redeem-flux').setAttribute("disabled", "disabled");

     const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

    var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);
          
  	web3.eth.sendTransaction(
      {from: account[0],
      to: staking,
      value: 0, 
      gasprice: 100000, // 100000 = 10 gwei
       //gas: 350000,   // gas limit
      data: stakingcontract.methods.convertAndWithdraw().encodeABI()
          }, function(err, transactionHash) {
        //console.log('in progress');
        if (!err) {
        	 txinprogress = true;
             //document.getElementById("req-gas-btn").setAttribute("disabled","disabled");
             //document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");
            
             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

             if (!mobile) {
             	openAlert("info", "Transaction Submitted", message);
             }
             
        }
         
  })
  .on('receipt', function(receipt){

    //console.log(receipt);

    	if (!mobile) {
   		 	openAlert("success", "Transaction Completed", "Success!");
   		 }

    	document.getElementById("wd-rewards-loader").classList.remove('ui-loading');
    	document.getElementById("redeem-flux").removeAttribute("disabled");
    	//document.getElementById("stakeDeposit").value = "";

        fetchAccountData();

        txinprogress = false;


  })

  .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
  		 
         document.getElementById("wd-rewards-loader").classList.remove('ui-loading');
    	document.getElementById("redeem-flux").removeAttribute("disabled");
         openAlert("danger", "Transaction Failed", error.message);

         txinprogress = false;
  });


}

// STAKING VALIDATION //////////////////////////////////////////////////////////////////////////////

async function validatedeposit() {

	 document.getElementById("dep-holdings-loader").classList.add('ui-loading');
	 document.querySelector('#deposit-staking').setAttribute("disabled", "disabled");

     const web3 = new Web3(provider);

      var amount = document.getElementById("stakeDeposit").value;

       amount = amount.toString().replace(/[, ]+/g, "").replace(/[^0-9]*$/, "");

	  //amount = Number(amount);

	 // console.log(amount);

	  if (amount === 0) {

	  	document.getElementById("depositalert").style.display = "block";
		document.getElementById("depositalert").innerHTML = "Please enter an amount greater than zero";
		document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
		document.getElementById("deposit-staking").removeAttribute("disabled");

	  } else {
	  	document.getElementById("depositalert").style.display = "none";

	  	
	  //console.log(amount);

	  amount = web3.utils.toWei(amount, "Gwei");

	  	var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);

	  tokencontract.methods.balanceOf(selectedAccount).call(function(err,res){
		    if(!err){
		    	var balance = res;

		    	//console.log(balance);
		    	//console.log(amount);

		    	if (Number(balance) < Number(amount)) {

		    		document.getElementById("depositalert").style.display = "block";
					document.getElementById("depositalert").innerHTML = "Insufficient balance";
					document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
					document.getElementById("deposit-staking").removeAttribute("disabled");

		    	} else {

		    		var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);

					  stakingcontract.methods.getOracleMinMax().call(function(err,res) {
						if (!err) { 
							//console.log(res);

							var tier1 = parseFloat(+res[0]/10e8).toFixed(0);
							var tier2 = parseFloat(+res[1]/10e8).toFixed(0);

						  stakingcontract.methods.upperLimiter().call(function(err,res) {  //get uppperlimiter
								if (!err) { 

									var upperlimiter = Number(res);

									var max = ((Number(tier1) * Number(upperlimiter))/100)*10e8;
									var min = tier2*10e8;

								    stakingcontract.methods.userStaked(selectedAccount).call(function(err,res) {  //is user staked already?
										if (!err) { 

											//console.log(res);

											if(res) {//user is staked, calculate deposit/wd amounts

												stakingcontract.methods.userInfo(0,selectedAccount).call(function(err,res) { //get current stake
													if (!err) { 

														var mystake = res[0];
														var mystakedusd = parseFloat((+kojiusd * res[0]) / 10e17).toFixed(2);

														//console.log("mystake is " + mystake);
														//console.log(tier1);
														//console.log("new amount is " + amount);

														var mynewstake = Number(mystake) + Number(amount);

														//console.log("upperlimiter is " + upperlimiter);
														//console.log("newstake is " + mynewstake);
														//console.log("max stake is " + max)



														if (Number(mystake/10e8) > Number(tier1)) {

															document.getElementById("depositalert").style.display = "block";
															document.getElementById("depositalert").innerHTML = "You are already staking the maximum amount";
															document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
															document.getElementById("deposit-staking").removeAttribute("disabled");

														} else {

															if (Number(mynewstake)  > Number(max)) {

																var netamount = (Number(tier1*1.01)-Number(mystake/10e8)).toFixed(0);

																document.getElementById("depositalert").style.display = "block";
																document.getElementById("depositalert").innerHTML = "Your new deposit amount combined with your current stake is too high, please deposit less than "+netamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
																document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
																document.getElementById("deposit-staking").removeAttribute("disabled");
																

															} else {

																document.getElementById("depositalert").style.display = "none";
																document.getElementById("depositalert").innerHTML = "";

																depositstaking(amount);

															}
														}

													}

												});

											} else { //user isn't staked

												//console.log(max);
												//console.log(upperlimiter);
												//console.log(Number(amount) *(Number(upperlimiter)/100));

												if (Number(amount)  > Number(max)) {

													document.getElementById("depositalert").style.display = "block";
													document.getElementById("depositalert").innerHTML = "Your deposit amount is too high, please deposit less than "+ parseFloat(+max/10e8).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
													document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
													document.getElementById("deposit-staking").removeAttribute("disabled");
													

												} else {

													if (Number(amount) < Number(min)) {

														document.getElementById("depositalert").style.display = "block";
														document.getElementById("depositalert").innerHTML = "Your deposit amount is too low, please deposit more than "+ parseFloat(+min/10e8).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";
														document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
														document.getElementById("deposit-staking").removeAttribute("disabled");

													} else {

														document.getElementById("depositalert").style.display = "none";
														document.getElementById("depositalert").innerHTML = "";

													
														depositstaking(amount);
													}

													
												}


											}
										}
									});
								}
							});
						}
					});

		    	}
		    }
		});

	  }

}

// STAKING DEPOSIT /////////////////////////////////////////////////////////////////////////////////

async function depositstaking(amount) {


	// console.log(amount);
	  document.getElementById("dep-holdings-loader").classList.add('ui-loading');
	  document.querySelector('#deposit-staking').setAttribute("disabled", "disabled");

     const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

    var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);
          
  	web3.eth.sendTransaction(
      {from: account[0],
      to: staking,
      value: 0, 
      gasprice: 100000, // 100000 = 10 gwei
       //gas: 350000,   // gas limit
      data: stakingcontract.methods.deposit(0,amount).encodeABI()
          }, function(err, transactionHash) {
        //console.log('in progress');
        if (!err) {
        	 txinprogress = true;
             //document.getElementById("req-gas-btn").setAttribute("disabled","disabled");
             //document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");
            
             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

             if (!mobile) {
             	openAlert("info", "Transaction Submitted", message);
             }
             
        }
         
  })
  .on('receipt', function(receipt){

    //console.log(receipt);

    	if (!mobile) {
   		 	openAlert("success", "Transaction Completed", "Success!");
   		 }

    	document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
    	document.getElementById("deposit-staking").removeAttribute("disabled");
    	document.getElementById("stakeDeposit").value = "";

        fetchAccountData();

        txinprogress = false;


  })

  .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
  		 
         document.getElementById("dep-holdings-loader").classList.remove('ui-loading');
    	document.getElementById("deposit-staking").removeAttribute("disabled");
         openAlert("danger", "Transaction Failed", error.message);

         txinprogress = false;
  });
      
}

// STAKING WITHDRAW VALIDATION /////////////////////////////////////////////////////////////////////////////////

async function validatewithdrawal() {

	 document.getElementById("wd-holdings-loader").classList.add('ui-loading');
	 document.querySelector('#withdraw-staking').setAttribute("disabled", "disabled");

     const web3 = new Web3(provider);

      var amount = document.getElementById("stakeWithdraw").value;

      amount = amount.toString().replace(/[, ]+/g, "").replace(/[^0-9]*$/, "");

	  //console.log(amount);

	  if (amount === 0) {

	  	document.getElementById("withdrawalert").style.display = "block";
		document.getElementById("withdrawalert").innerHTML = "Please enter an amount greater than zero";
		document.getElementById("wd-holdings-loader").classList.remove('ui-loading');
		document.getElementById("withdraw-staking").removeAttribute("disabled");

	  } else {

	  	document.getElementById("withdrawalert").style.display = "none";
     
	  //console.log(amount);
	  //amount = Number(amount);

	  amount = web3.utils.toWei(amount, "Gwei");

	  var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);

	   stakingcontract.methods.userStaked(selectedAccount).call(function(err,res) {  //is user staked already?
			if (!err) { 

				//console.log(res);

				if(res) {//user is staked, calculate deposit/wd amounts

					document.getElementById("withdrawalert").style.display = "none";
					document.getElementById("withdrawalert").innerHTML = "";

					stakingcontract.methods.userInfo(0,selectedAccount).call(function(err,res) { //get current stake
						if (!err) { 

							var mystakeraw = Number(res[0]);
							var mystake = parseFloat(+res[0]/10e8).toFixed(2);
							var mystakedusd = parseFloat((+kojiusd * res[0]) / 10e17).toFixed(2);

							//console.log(mystakeraw);
							//console.log(amount);

							if (amount > mystakeraw) {

								document.getElementById("withdrawalert").style.display = "block";
								document.getElementById("withdrawalert").innerHTML = "Desired withdrawal amount is higher than user staked amount";
								document.getElementById("wd-holdings-loader").classList.remove('ui-loading');
								document.getElementById("withdraw-staking").removeAttribute("disabled");

							} else {

								document.getElementById("withdrawalert").style.display = "none";
								document.getElementById("withdrawalert").innerHTML = "";

								withdrawstaking(amount);

							}

						}
					});

				} else {

					document.getElementById("withdrawalert").style.display = "block";
					document.getElementById("withdrawalert").innerHTML = "You don't have any stake to withdraw!";
					document.getElementById("wd-holdings-loader").classList.remove('ui-loading');
					document.getElementById("withdraw-staking").removeAttribute("disabled");

				}

			}
		});
	}
}

document.getElementById("stakeWithdraw").addEventListener("keyup", function(e) {

	var amount = document.getElementById("stakeWithdraw").value;

	//console.log(amount);

	amount = amount.toString().replace(/[, ]+/g, "").replace(/[^0-9]*$/, "");

	//console.log(amount);

	document.getElementById("stakeWithdraw").value = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

});

// WITHDRAW STAKING /////////////////////////////////////////////////////////////////////////////////

async function withdrawstaking(amount) {


	// console.log(amount);
	  document.getElementById("wd-holdings-loader").classList.add('ui-loading');
	  document.querySelector('#withdraw-staking').setAttribute("disabled", "disabled");

     const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

    var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);

          
  	web3.eth.sendTransaction(
      {from: account[0],
      to: staking,
      value: 0, 
      gasprice: 100000, // 100000 = 10 gwei
       //gas: 350000,   // gas limit
      data: stakingcontract.methods.withdraw(0,amount).encodeABI()
          }, function(err, transactionHash) {
        //console.log('in progress');
        if (!err) {
        	 txinprogress = true;
             //document.getElementById("req-gas-btn").setAttribute("disabled","disabled");
             //document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");
            
             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

             if (!mobile) {
             	openAlert("info", "Transaction Submitted", message);
             }
             
        }
         
  })
  .on('receipt', function(receipt){

    //console.log(receipt);

    	if (!mobile) {
   		 	openAlert("success", "Transaction Completed", "Success!");
   		 }

    	document.getElementById("wd-holdings-loader").classList.remove('ui-loading');
    	document.getElementById("withdraw-staking").removeAttribute("disabled");
    	document.getElementById("stakeWithdraw").value = "";

        fetchAccountData();

        txinprogress = false;


  })

  .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
  		 
         document.getElementById("wd-holdings-loader").classList.remove('ui-loading');
    	document.getElementById("withdraw-staking").removeAttribute("disabled");
         openAlert("danger", "Transaction Failed", error.message);

         txinprogress = false;
  });
     
       
}

// FLUX SUPERMINT BUYING ///////////////////////////////////////////////////////////////////////////////
async function buysupermintflux() {

		// console.log(amount);
	  document.getElementById("buy-supermints-loader").classList.add('ui-loading');
	  document.querySelector('#btn-supermint-flux').setAttribute("disabled", "disabled");

     const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

    var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);

    stakingcontract.methods.superMint(selectedAccount).call(function(err,res) {
		if (!err) { 
			//console.log(res);

			if(res) { //user already has a supermint
				document.getElementById("redeemsmfluxalert").innerHTML = "You can only have 1 superMint at a time.";
				document.getElementById("redeemsmfluxalert").style.display = "block";
				document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
				document.getElementById("btn-supermint-flux").removeAttribute("disabled");
			} else { //get flux purchase price
				document.getElementById("redeemsmfluxalert").style.display = "none";
				stakingcontract.methods.getTotalRewards(selectedAccount).call(function(err,res) { 
					if (!err) { 

						var userbalance = res;

						stakingcontract.methods.getSuperMintPrices().call(function(err,res) { 
							if (!err) { 
								var price = res[0];
								if(Number(userbalance) >= Number(price)) { //proceed with transaction

									console.log(userbalance);
									console.log(price);

									web3.eth.sendTransaction(
								      {from: account[0],
								      to: staking,
								      value: 0, 
								      gasprice: 100000, // 100000 = 10 gwei
								       //gas: 350000,   // gas limit
								      data: stakingcontract.methods.buySuperMint().encodeABI()
								          }, function(err, transactionHash) {
								        //console.log('in progress');
								        if (!err) {
								        	 txinprogress = true;
								             //document.getElementById("req-gas-btn").setAttribute("disabled","disabled");
								             //document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");
								            
								             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

								             if (!mobile) {
								             	openAlert("info", "Transaction Submitted", message);
								             }
								             
								        }
								         
								  })
								  .on('receipt', function(receipt){

								    //console.log(receipt);

								    	if (!mobile) {
								   		 	openAlert("success", "Transaction Completed", "Success!");
								   		 }

								    	document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
								    	document.getElementById("btn-supermint-flux").removeAttribute("disabled");

								        fetchAccountData();

								        txinprogress = false;


								  })

								  .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
								  		 
								         document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
								    	document.getElementById("btn-supermint-flux").removeAttribute("disabled");
								         openAlert("danger", "Transaction Failed", error.message);

								         txinprogress = false;
								  });

								} else { //show user alert insufficient balance
									document.getElementById("redeemsmfluxalert").innerHTML = "You do not have enough FLUX to buy a superMint.";
									document.getElementById("redeemsmfluxalert").style.display = "block";
									document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
								   	document.getElementById("btn-supermint-flux").removeAttribute("disabled");
								}
							}
						});

					}
				});
			}
		}
	});

}

async function buysupermintkoji() {


		// console.log(amount);
	  document.getElementById("buy-supermints-loader").classList.add('ui-loading');
	  document.querySelector('#btn-supermint-koji').setAttribute("disabled", "disabled");

     const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

    var stakingcontract = new web3.eth.Contract(JSON.parse(stakingabi),staking);
    var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);


    stakingcontract.methods.superMint(selectedAccount).call(function(err,res) {
		if (!err) { 
			//console.log(res);

			if(res) { //user already has a supermint
				document.getElementById("redeemsmkojialert").innerHTML = "You can only have 1 superMint at a time.";
				document.getElementById("redeemsmkojialert").style.display = "block";
				document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
		    	document.getElementById("btn-supermint-koji").removeAttribute("disabled");
			} else { //get flux purchase price
				document.getElementById("redeemsmkojialert").style.display = "none";
				tokencontract.methods.balanceOf(selectedAccount).call(function(err,res){
					if (!err) { 

						var userbalance = res;

						stakingcontract.methods.getSuperMintPrices().call(function(err,res) { 
							if (!err) { 
								var price = res[1];
								if(Number(userbalance) >= Number(price)) { //proceed with transaction

									web3.eth.sendTransaction(
								      {from: account[0],
								      to: staking,
								      value: 0, 
								      gasprice: 100000, // 100000 = 10 gwei
								       //gas: 350000,   // gas limit
								      data: stakingcontract.methods.buySuperMintKoji().encodeABI()
								          }, function(err, transactionHash) {
								        //console.log('in progress');
								        if (!err) {
								        	 txinprogress = true;
								             //document.getElementById("req-gas-btn").setAttribute("disabled","disabled");
								             //document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");
								            
								             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

								             if (!mobile) {
								             	openAlert("info", "Transaction Submitted", message);
								             }
								             
								        }
								         
								  })
								  .on('receipt', function(receipt){

								    //console.log(receipt);

								    	if (!mobile) {
								   		 	openAlert("success", "Transaction Completed", "Success!");
								   		 }

								    	document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
								    	document.getElementById("btn-supermint-koji").removeAttribute("disabled");

								        fetchAccountData();

								        txinprogress = false;


								  })

								  .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
								  		 
								         document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
								    	document.getElementById("btn-supermint-koji").removeAttribute("disabled");
								         openAlert("danger", "Transaction Failed", error.message);

								         txinprogress = false;
								  });

								} else { //show user alert insufficient balance
									document.getElementById("redeemsmkojialert").innerHTML = "You do not have enough KOJI to buy a superMint.";
									document.getElementById("redeemsmkojialert").style.display = "block";
									document.getElementById("buy-supermints-loader").classList.remove('ui-loading');
								    document.getElementById("btn-supermint-koji").removeAttribute("disabled");
								}
							}
						});

					}
				});
			}
		}
	});

}

//NFT Functions//////////////////////////////////////////////////////////////////////////

async function getwalletnft() {
	//console.log("function called");
	functioncalled = true;
	const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }
	var nftcontract = new web3.eth.Contract(JSON.parse(bscnftmintABI),bscnftaddress);
	nftcontract.methods.tokenOfOwnerByIndex(account[0], 0).call(function(err,res){
	        if(!err){

	        	document.getElementById("no-nft").style.display = "none";
	        	document.getElementById("nftdisplay").style.display = "block";
	        	document.getElementById("nft-holdings-loader").classList.add('ui-loading');

	        	var id = res;
	        	//console.log("result is " +res);
	        	nftcontract.methods.tokenURI(id).call(function(err,res){
			        if(!err){
			        	//get all JSON data
			        	var mintedURI = res;        		

		                var data = getJSON(mintedURI, {mode: 'cors'} ).then(data => populatenft(data, id));

			        }
		    	});
	        } else {

	        	//console.log("returned error");
	        	document.getElementById("no-nft").style.display = "block";
	        	document.getElementById("nftdisplay").style.display = "none";


	        }
	});

	
}

async function populatenft(data, id) {
	if (data !== null) {
		//console.log(data);
		//console.log(data.attributes[5].value);

		const web3 = new Web3(provider);
		var nftcontract = new web3.eth.Contract(JSON.parse(bscnftmintABI),bscnftaddress);
		nftcontract.methods.mintedtier1().call(function(err,res){
		        if(!err){
		        	var tier1total = res;
		        	nftcontract.methods.mintedtier2().call(function(err,res){
				        if(!err){
				        	//get all JSON data
				        	var tier2total = res;        		

			                var tempdata = "<div class='row'><span class='type'>" + data.attributes[0].trait_type + ": </span><span class='data'>" + data.attributes[0].value + "</span></div>"; //project
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[1].trait_type + ": </span><span class='data'>" + data.attributes[1].value + "</span></div>"; //type
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[2].trait_type + ": </span><span class='data'>" + data.attributes[2].value + "</span></div>"; //id
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[3].trait_type + ": </span><span class='data'>" + data.attributes[3].value + "</span></div>"; //titel
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[4].trait_type + ": </span><span class='data'>" + data.attributes[4].value + "</span></div>"; //rarity
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[5].trait_type + ": </span><span class='data'>" + data.attributes[5].value + "</span></div>"; //tier
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[6].trait_type + ": </span><span class='data'>" + data.attributes[6].value + "</span></div>"; //requirements
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[7].trait_type + ": </span><span class='data'>" + data.attributes[7].value + "</span></div>"; //royalties
					    	tempdata += "<span class='description'>" +data.description + "</span>";
							tempdata += "<span class='total'>Tier 1 Total: <strong>" + tier1total + " mints</strong></span>";
							tempdata += "<span class='total'>Tier 2 Total: <strong>" + tier2total + " mints</strong></span>";
					    	

						document.getElementById("nftdisplay").style.display = "block";
						if (data.attributes[5].value == "Tier 1") {
							document.getElementById("image").innerHTML = '<video width="100%" controls autoplay loop muted="muted"><source src="'+data.mp4+'" type="video/mp4">Your browser does not support the video tag.</video><br><div class="row"><span class="type" style="font-size:x-small">Contract: '+bscnftaddress+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="data" style="font-size:x-small">TokenID: '+id+'</span></div>';
						} else {
							document.getElementById("image").innerHTML = '<img src="'+data.image+'"><br><div class="row"><span class="type" style="font-size:x-small">Contract: '+bscnftaddress+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="data" style="font-size:x-small">TokenID: '+id+'</span></div>';
						}
						
						document.getElementById("metadata").innerHTML = tempdata;
						document.getElementById("nft-holdings-loader").classList.remove('ui-loading');

				        }
			    	});
		        }
		});
	}
}


// TOKEN FUNCTIONS /////////////////////////////////////////////////////////////////////////////////

async function withdraw(percent) {

	 //console.log(mintdata);
	  document.getElementById("withdraw-loader").classList.add('ui-loading');

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
          data: tokencontract.methods.Withdrawal(percent).encodeABI()
              }, function(err, transactionHash) {
            //console.log('in progress');
            if (!err) {
            	 txinprogress = true;
	             document.getElementById("withdraw-btn").setAttribute("disabled","disabled");
	             document.getElementById("reinvest-btn").setAttribute("disabled","disabled");
	             document.getElementById("donate-btn").setAttribute("disabled","disabled");
	            
	             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

	             if (!mobile) {
	             	openAlert("info", "Transaction Submitted", message);
	             }
	             
             
            }
             
      })
      .on('receipt', function(receipt){

        //console.log(receipt);

        	if (!mobile) {
       		 	openAlert("success", "Transaction Completed", "Success!");
       		 }

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
	 document.getElementById("reinvest-loader").classList.add('ui-loading');

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

      //console.log(percent);
      //console.log(minout);

       web3.eth.sendTransaction(
          {from: account[0],
          to: kojitoken,
          value: 0, 
          gasprice: 100000, // 100000 = 10 gwei
           //gas: 350000,   // gas limit
          data: tokencontract.methods.Reinvest(percent, minout).encodeABI()
              }, function(err, transactionHash) {
            //console.log('in progress');
             if (!err) {
            	 txinprogress = true;
	             document.getElementById("withdraw-btn").setAttribute("disabled","disabled");
	             document.getElementById("reinvest-btn").setAttribute("disabled","disabled");
	             document.getElementById("donate-btn").setAttribute("disabled","disabled");
	             
	             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"
	             if (!mobile) {
	             	openAlert("info", "Transaction Submitted", message);
	             }
             
            }
             
      })
      .on('receipt', function(receipt){

        //console.log(receipt);

        	if (!mobile) {
	        	openAlert("success", "Transaction Completed", "Success!");
	        }

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

	var netdivs = ((divs * percent2) / 100).toFixed(4);

	document.querySelector('#ri-equivalent').innerHTML = netdivs;

	var netreinvest = parseFloat((((divs / kojibnb)*.936)) * percent2 / 100).toFixed(2);

	var minout = ((netreinvest * 90) / 100).toFixed(0);

	//console.log(netreinvest);

	console.log(minout);

	document.getElementById("koji-reinvested").innerText = netreinvest.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	if (netdivs >= 0.001) {

		document.getElementById("reinvest-btn").removeAttribute("disabled");

		document.querySelector('#reinvest-alert').style.display = 'none';
		// edit by andreas
		

		document.getElementById("reinvest-btn").setAttribute('onclick', 'reinvest('+percent2+','+minout+')');

	} else {

		//document.getElementById("koji-reinvested").innerText = "0.00";

		document.getElementById("reinvest-btn").setAttribute("disabled", "disabled");

		document.querySelector('#reinvest-alert').style.display = 'block';
		// edit by andreas
		//document.querySelector('#reinvest-alert').innerHTML = "You need at least 0.001 BNB dividends equivalent to reinvest";

		document.getElementById("reinvest-btn").removeAttribute('onclick');

	}

	
});

async function donate(percent) {

	 //console.log(mintdata);
	  document.getElementById("donate-loader").classList.add('ui-loading');

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
          data: tokencontract.methods.Donate(percent).encodeABI()
              }, function(err, transactionHash) {
            //console.log('in progress');
            if (!err) {
            	 txinprogress = true;
	             document.getElementById("withdraw-btn").setAttribute("disabled","disabled");
	             document.getElementById("reinvest-btn").setAttribute("disabled","disabled");
	             document.getElementById("donate-btn").setAttribute("disabled","disabled");
	            
	             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

	             if (!mobile) {
	             	openAlert("info", "Transaction Submitted", message);
	             }
	             
             
            }
             
      })
      .on('receipt', function(receipt){

        //console.log(receipt);

        	if (!mobile) {
       		 	openAlert("success", "Transaction Completed", "Success!");
       		 }

        	document.getElementById("donate-loader").classList.remove('ui-loading');
        	       

            fetchAccountData();

            txinprogress = false;


      })

      .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
      		 
             document.getElementById("donate-loader").classList.remove('ui-loading');
             document.getElementById("donate-btn").removeAttribute("disabled");
             openAlert("danger", "Transaction Failed", error.message);

             txinprogress = false;
      });
}

async function donatewithoutdivs(amount) {

	 //console.log(mintdata);
	  document.getElementById("donate-loader").classList.add('ui-loading');

     const web3 = new Web3(provider);

     // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }

      var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);

      tokencontract.methods.charityWallet().call(function(err,res) {

    	if (!err) { 
    	    charityAddress = res;
    		console.log(charityAddress);
    	}
      });

       web3.eth.getTransactionCount(account[0]).then(function(v){
            console.log("Count: "+v);
            var count = v;
           // var amount = web3.utils.toHex(3e15); //.003
            //creating raw tranaction
            var tx = {
                "from":account[0], 
                "gasPrice":web3.utils.toHex(10* 1e9), //10gwei for bsc
                "gasLimit":web3.utils.toHex(30000),   //22000 for bsc
                "to":charityAddress,
                "value":amount, //.1
                "data": "0x0",                                                  //contract.methods.transfer(toAddress, amount).encodeABI(),
                "nonce":web3.utils.toHex(count)}
            console.log(tx);
            try {
                var signedTx = web3.eth.sendTransaction(tx, function(err, transactionHash) {
            //console.log('in progress');
		            if (!err) {
		            	 txinprogress = true;
			             document.getElementById("withdraw-btn").setAttribute("disabled","disabled");
			             document.getElementById("reinvest-btn").setAttribute("disabled","disabled");
			             document.getElementById("donate-btn").setAttribute("disabled","disabled");
			            
			             var message = "<a href='https://bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

			             if (!mobile) {
			             	openAlert("info", "Transaction Submitted", message);
			             }
			             
		             
		            }
		             
		      })
		      .on('receipt', function(receipt){

		        //console.log(receipt);

		        	if (!mobile) {
		       		 	openAlert("success", "Transaction Completed", "Success!");
		       		 }

		        	document.getElementById("donate-loader").classList.remove('ui-loading');
		        	       

		            fetchAccountData();

		            txinprogress = false;


		      })

		      .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
		      		 
		             document.getElementById("donate-loader").classList.remove('ui-loading');
		             document.getElementById("donate-btn").removeAttribute("disabled");
		             openAlert("danger", "Transaction Failed", error.message);

		             txinprogress = false;
		      });
                
            }catch {

            }

        });
       
}



document.getElementById("slider3").addEventListener("input", function(e){

	//console.log('slider1');

	var divs = document.getElementById("koji-divs-unrounded").value; 

	//console.log(+divs);

	if (+divs == 0) {
		document.getElementById("donate-btn").removeAttribute('onclick');
		return;
	}

	var percent = document.querySelector('#amount3').value;

	//console.log(percent);

	var netwithdrawal = ((divs * percent) / 100).toFixed(9);

	//console.log(netwithdrawal);

	document.getElementById("donate-divs").innerText = netwithdrawal;

	document.getElementById("donate-btn").setAttribute('onclick', 'donate('+percent+')');


});

// For max staking onclick /////////////////////////////////////////////////////////////////////////

document.querySelector("#max1").addEventListener("click", function() {
	var mt1 = document.getElementById("mintier1amount").innerText;
	//console.log(mt1);
	document.getElementById("stakeDeposit").value = "";
	document.getElementById("stakeDeposit").value = mt1.replace(/[^0-9]*$/, "");
});

document.querySelector("#max2").addEventListener("click", function() {
	var mt2 = document.getElementById("mintier2amount").innerText;
	//console.log(mt2);
	document.getElementById("stakeDeposit").value ="";
	document.getElementById("stakeDeposit").value = mt2.replace(/[^0-9]*$/, "");
});



function openAlert(type, title, message) {

    var random1 = btoa(Math.random()).slice(0, 6);
    var random2 = btoa(Math.random()).slice(0, 6);
    var ui_alerts = document.getElementById('ui-alert-floats');
    ui_alerts.insertAdjacentHTML('afterbegin', '<div id="'+random1+'" class="alert alert-'+type+' inner-wrapper"><a class="close-btn" href="#" onclick="closeAlert(this);return false;"><i class="far fa-times"></i></a><div class="spacer"><div id="'+random2+'" class="alert-container"><div class="alert-icon"><i class="icon-info-circle2"></i></div><span class="alert-msg"><span class="alert-title">'+title+':</span> <span id="info-msg" style="word-break:break-all">'+message+'</span></span></div></div></div>');
    var target1 = document.getElementById(random1);
    var target2 = document.getElementById(random2).style;
	// edited by andreas - sorry nodezy, want my original slide-&-fade-out-left animation, and keeping them visible for so long that the tx hash and sucess are visible at the same time and stacked
    // target2.opacity = 1;
    //     function fade(){target2.opacity-=.005}
    //      var fade_elm = window.setInterval(function () {
    //             //console.log('fade called');
    //             fade();
    //         },100);
    // var clear_elm = window.setTimeout(function () {
    //     clearInterval(fade_elm);
    //     target1.remove();
    //     clearTimeout(clear_elm);
    // },15000);

	var clear_elm = window.setTimeout(function () {

		target1.classList.add('close'); // readdding the slide-&-fade-out-left animation
		
		setTimeout(function() { // removing element first after animation 
			target1.remove(); 
		}, 600)

	},15000);
}

function closeAlert(element) {
     //edited by Nodezy // un-edit by andreas
	 element.parentElement.classList.add('close');
    setTimeout(function() {
        //edited by Nodezy
        element.parentElement.remove();
        //element.parentElement.classList.add('remove');
    }, 500)
}

function outputUpdate(amount) {
    document.querySelector('#amount').value = amount;
}

 function outputUpdate2(amount) {
    document.querySelector('#amount2').value = amount;
}

function outputUpdate3(amount) {
    document.querySelector('#amount3').value = amount;
}

function toggleinfo() {

	if (!showstakinginfo) {
		showstakinginfo = true;
	} else {
		showstakinginfo = false;
	}

	if (!hidestakinginfo) {
		hidestakinginfo = true;
	} else {
		hidestakinginfo = false;
	}
}


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
			console.log('updating account data')

			//edit by andreas
			//document.getElementById("update-price").innerHTML = "<img src='https://app.koji.earth/assets/imgs/loading-buffering.gif' width='16px' height='16px'>";
			document.getElementById("update-price").classList.add("ui-loading");

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
  // edit by andreas, move the disconnect to the wallet modal
  //document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#wallet-disconnect").addEventListener("click", onDisconnect);

});

