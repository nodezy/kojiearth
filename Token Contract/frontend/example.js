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
let kojitoken = "0xe1528C08A7ddBBFa06e4876ff04Da967b3a43A6A"; //bsc test KOJI
let bscnftaddress = "0x062C9545e61A7eD56F3BE4256EAAC19c5580868A"; //bsctest nft contract
let bscnftproxy = "0xe97E4c086283d6e6c407ac131F7413Fea3B32a46"; //bsctest nft proxy contract
let liquidpair = "0x4e1052ab157d3cc240ad178fbde82c222a322a21";

var kojitokenABI = JSON.stringify([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"AddToDistributorBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"AddToDistributorDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_walletGas","type":"uint256"},{"internalType":"uint256","name":"_reinvestGas","type":"uint256"}],"name":"ChangeDistribGas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timelimit","type":"uint256"}],"name":"ChangeImpoundTimelimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"ChangeMinHold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"GetClaimed","outputs":[{"internalType":"uint256","name":"pending","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GetMinDistribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"GetPending","outputs":[{"internalType":"uint256","name":"pending","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GetRewardsToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_holder","type":"address"}],"name":"GetShareholderExpired","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percent","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin","type":"uint256"}],"name":"Reinvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"RescueBNBfromDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"SetDistributionCriteria","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"SweepDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"TransferBEP20fromDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"ViewHolderInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"unpaid","type":"uint256"},{"internalType":"uint256","name":"realised","type":"uint256"},{"internalType":"uint256","name":"excluded","type":"uint256"},{"internalType":"bool","name":"rewardeligible","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ViewMathInfo","outputs":[{"internalType":"uint256","name":"totalshares","type":"uint256"},{"internalType":"uint256","name":"netdividends","type":"uint256"},{"internalType":"uint256","name":"totaldistributed","type":"uint256"},{"internalType":"uint256","name":"totalreinvested","type":"uint256"},{"internalType":"uint256","name":"totalwithdrawn","type":"uint256"},{"internalType":"uint256","name":"totaldividends","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ViewMinHold","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETHaddedToPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percent","type":"uint256"}],"name":"Withdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_maxTxAmountBuy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmountSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxWalletToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokencontract","type":"address"},{"internalType":"uint256","name":"_minHoldAmount","type":"uint256"},{"internalType":"uint256","name":"_percent","type":"uint256"}],"name":"addPartnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"addToLiquid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"adminWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"airdropEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"approveMax","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burnRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_distributorgas","type":"uint256"},{"internalType":"uint256","name":"_walletgas","type":"uint256"}],"name":"changeContractGas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"charityWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"convertBNBtoWBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"distributorDeposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enablePartners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeDenominator","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPartnershipIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"bot","type":"bool"}],"name":"getTotalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isInBot","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"manualBurn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"nftPoolActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftRewardWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"partnerFeeLimiter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerShares","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokencontract","type":"address"}],"name":"removePartnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rescueBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IDEXRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setAddToLiquid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setAirdropDisabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"toggle","type":"bool"}],"name":"setBot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setBuyTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setDistributorDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setEnablePartners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_totalFee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_charityWallet","type":"address"},{"internalType":"address","name":"_adminWallet","type":"address"},{"internalType":"address","name":"_nftRewardWallet","type":"address"},{"internalType":"address","name":"_stakePoolWallet","type":"address"}],"name":"setFeeReceivers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"blocks","type":"uint256"}],"name":"setInitialBlockLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsDividendExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsFeeExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsTxLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setLaunchEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setMaxWalletToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setNFTPoolActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limiter","type":"uint256"}],"name":"setPartnerFeeLimiter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setSellTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setStakePoolActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setSwapBackSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setTeamWalletDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setburnRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setstakepoolRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"settaxRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakePoolActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakePoolWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakepoolRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"taxRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"teamWalletDeposit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCharity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNFTrewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStakepool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferBEP20Tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"adr","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"viewPartnership","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"address","name":"tokencontract","type":"address"},{"internalType":"uint256","name":"minHoldAmount","type":"uint256"},{"internalType":"uint256","name":"discount","type":"uint256"},{"internalType":"bool","name":"enabled","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"viewTeamWalletInfo","outputs":[{"internalType":"uint256","name":"charityDivs","type":"uint256"},{"internalType":"uint256","name":"adminDivs","type":"uint256"},{"internalType":"uint256","name":"nftDivs","type":"uint256"},{"internalType":"uint256","name":"stakeDivs","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]);
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
let stakepoolAddress;

let timestamp;
let blocknumber;

let bscchain = false;

let txinprogress = false;

let mobile = false;

let switched = false;

let apipull = 1;

let humanFriendlyBalance;

const tokenAddress = kojitoken;
const tokenSymbol = 'KOJI v0.08';
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

async function getBNB() {

		   document.getElementById("request-gas-btn").innerText = "Please wait...";
           document.getElementById("request-gas-btn").setAttribute("disabled", "disabled");
           document.getElementById("req-gas-loader").classList.add('ui-loading');
          // document.getElementById("showLoading").style.display = 'block';  
           var userdata = btoa("address="+selectedAccount+"");

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 		// some code..
 		window.open("getgas.php?"+userdata+"");
 		window.setTimeout(function(){
 			document.getElementById("req-gas-loader").classList.remove('ui-loading');
 			},4000);
 		document.getElementById("request-gas-btn").innerText = "Completed";
 		//document.getElementById("gas-dust").style.display = "block";
        // document.getElementById("gas-dust").innerHTML =  "Opening new browser window...";//airdrops .004 BNB to cover mint, 1 per authorized wallet
	} else {
		try {
            var response = fetch("getgas.php?"+userdata+"", {mode: 'cors'}).then(function(response) {
            return response.text().then(function(text) {
            	if (!mobile) {
       		 	openAlert("success", text, "");
       		 	}
       		 	document.getElementById("request-gas-btn").innerText = "Completed";
       		 	document.getElementById("req-gas-loader").classList.remove('ui-loading');
          //document.getElementById("gas-dust").style.display = "block";
          //document.getElementById("gas-dust").innerHTML = text;//airdrops .004 BNB to cover mint, 1 per authorized wallet
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

  
  //added by andreas, show first/last 4 character from wallet address in disconect btn + wallet info & disconnect modal
  var selectedAccountFirstChars = selectedAccount.substring(0, 4);
  var selectedAccountLastChars = selectedAccount.substr(-4);
  
  document.getElementById("btn-disconnect").innerHTML = '<div><i class="icon-wallet1"></i><i></i></div><span> ' + selectedAccountFirstChars + '...' + selectedAccountLastChars + ' </span>';
  document.getElementById("selected-account-modal").textContent = selectedAccount;
  document.getElementById("selected-account-modal-link").innerHTML = '<a href="https://bscscan.com/address/' + selectedAccount + '"><i class="icon-external-link"></i> View on BSCScan</a>';
	 
 //added by andreas / END

 			
 				
 				//console.log(apipull);
 				//console.log("pulling price from CoinGecko API");
 				var bnbpricedata = fetch("https://api.coingecko.com/api/v3/simple/price/?ids=binancecoin&vs_currencies=usd", {mode: 'cors'}).then(function(response) {
			      if (response.status !== 200) {
			        console.log("Can Not get CoinGecko List Api! Status: " + response.status);
			        //return;
			      }  
			      	response.json().then(function(data) {
			      		bnbusd = data.binancecoin.usd;

		    	
		    /*	console.log(apipull);
		    	console.log("pulling price from CoinGraph API");
			  	var bnbpricedata = fetch("https://coinograph.io/ticker/?symbol=binance:bnbusdt", {mode: 'cors'}).then(function(response) {
			  	 	if (response.status !== 200) {
				        console.log("Can Not get CoinGraph List Api! Status: " + response.status);
				        //return;
			        } 
			        response.json().then(function(data) {
			      		bnbusd = data.price;
			      	})
				    .catch(function(err) {
				      	console.log("Can Not get CoinGraph Price Api! Status: " + err);
				    });
			   	});
			   	
		  		  	 	
		   if (apipull == 1) {
		   	   apipull = 2;
		   } else {
		   		apipull = 1;
		   }*/

		  
	        //console.log(data.binancecoin.usd);
	        

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
			    									document.querySelector('#registration').style.display = 'block';
			    									document.querySelector('#ineligible').style.display = 'block';
							    					document.querySelector('#eligible').style.display = 'none';
			    									
			    									if (ethBalance >= .003) { //user has enough gas to register
			    										document.querySelector('#request-gas-btn').setAttribute("disabled", "disabled");
			    										document.querySelector('#request-gas-btn').setAttribute("onclick", "");
			    										document.querySelector('#reg-holdings-btn').removeAttribute("disabled");
			    										 document.querySelector('#reg-holdings-btn').setAttribute("onclick", "registerHoldings()");
			    										  document.getElementById("request-gas-btn").innerText = "BNB Amount Sufficient";
			    									} else { //user needs airdrop
			    										document.querySelector('#request-gas-btn').removeAttribute("disabled");
			    										document.querySelector('#request-gas-btn').setAttribute("onclick", "getBNB()");
			    										document.querySelector('#reg-holdings-btn').setAttribute("onclick", "");
			    										document.querySelector('#reg-holdings-btn').setAttribute("disabled", "disabled");
			    										document.getElementById("request-gas-btn").innerHTML = "<div><i class='fas fa-gas-pump'></i></div><span><strong>Request BNB for gas</strong></span>";
			    									}	
			    									
			    								} else { //user has already registered
			    									document.querySelector('#reg-holdings-btn').setAttribute("onclick", "");
			    									document.querySelector('#registration').style.display = 'none';
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

					        tokencontract.methods.GetPending(selectedAccount).call(function(err,res){
					    		if(!err){

					    			//console.log(res);

					    			var dividends = web3.utils.fromWei(res);

					    			console.log(dividends);


					    			tokencontract.methods.GetClaimed(selectedAccount).call(function(err,res){
					    				if(!err){

					    					console.log(web3.utils.fromWei(res));

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

							    			var percent2 = document.querySelector('#amount2').value;

							    			//console.log(percent2);

							    			var kojireinvested = parseFloat((((dividends / kojibnbunrounded)*.936)) * percent2 / 100).toFixed(2);

							    			var kojiAmountOut = (kojireinvested * 90 /100).toFixed(0);


								    			if (dividends > 0.000000001) {

								    				document.getElementById("withdraw-btn").removeAttribute("disabled");

								    				document.getElementById("withdraw-btn").setAttribute('onclick', 'withdraw('+percent+')');

								    				document.querySelector('#withdraw-alert').style.display = 'none';

								    			} else { // added by andreas

							    					document.getElementById("withdraw-btn").setAttribute("disabled", "disabled");

								    				document.querySelector('#withdraw-alert').style.display = 'block';

								    				document.getElementById("withdraw-btn").removeAttribute('onclick');
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

							    							document.getElementById("total-divs").innerHTML = netdistributed + "<span>($" +parseFloat(netdividends * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    							document.getElementById("total-reinvest").innerHTML = reinvested + "<span>($" +parseFloat(reinvested * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    							document.getElementById("total-withdraw").innerHTML = withdrawn + "<span>($" +parseFloat(withdrawn * bnbusd).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")</span>";
							    						}
							    					});

							    				});

					    				}
					    			}); // getClaimed
					    		}
					    	}); // getPending

					    }
					  }); //selectedAccount

			    }
			});

        })
		.catch(function(err) {
	  		console.log("Can Not get CoinGecko Price Api! Status: " + err);
			});
	});
       
    

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

async function registerHoldings() {

	 //console.log(mintdata);
	  document.getElementById("reg-holdings-loader").classList.add('ui-loading');
	  document.querySelector('#reg-holdings-btn').setAttribute("disabled", "disabled");

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
          data: tokencontract.methods.registerShares().encodeABI()
              }, function(err, transactionHash) {
            //console.log('in progress');
            if (!err) {
            	 txinprogress = true;
	             document.getElementById("request-gas-btn").setAttribute("disabled","disabled");
	             document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");
	            
	             var message = "<a href='https://testnet.bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

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

        	document.getElementById("reg-holdings-loader").classList.remove('ui-loading');
        	document.getElementById("reg-holdings-btn").setAttribute("disabled","disabled");

            fetchAccountData();

            txinprogress = false;


      })

      .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
      		 
             document.getElementById("reg-holdings-loader").classList.remove('ui-loading');
        	document.getElementById("reg-holdings-btn").removeAttribute("disabled");
             openAlert("danger", "Transaction Failed", error.message);

             txinprogress = false;
      });
}

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
	            
	             var message = "<a href='https://testnet.bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"

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
	             
	             var message = "<a href='https://testnet.bscscan.com/tx/"+transactionHash+"' target='_blank'>Tx Hash "+transactionHash+"</a>"
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
  // edit by andreas, move the disconnect to the wallet modal
  //document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#wallet-disconnect").addEventListener("click", onDisconnect);

});
