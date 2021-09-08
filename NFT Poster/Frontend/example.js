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


// Address of the selected account
let selectedAccount;
let kojitoken = "0x08ea9d54921d591146246aa7533c931cf78893b8"; //ropsten version of KOJI for testing
let bscnftaddress = "0x9b77B1F3DA601609E51eDD534C33B90e45c6324D" //bsctest nft minting contract

var kojitokenABI = JSON.stringify([{"inputs":[{"internalType":"address","name":"_charityAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"adminAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"adminTaxAlloc","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burnAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burnTaxAlloc","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"charityAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"charityTaxAlloc","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_actualAmount","type":"uint256"}],"name":"distribute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"excludeFromFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"excludeFromRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"holderTaxAlloc","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"includeInFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"includeInRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"isExcludedFromFees","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"isExcludedFromRewards","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_actualAmount","type":"uint256"},{"internalType":"bool","name":"_deductTransferFee","type":"bool"}],"name":"rewardsFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_adminAddress","type":"address"}],"name":"setAdminAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_burnAddress","type":"address"}],"name":"setBurnAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_charityAddress","type":"address"}],"name":"setCharityAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_holderTaxAlloc","type":"uint256"},{"internalType":"uint256","name":"_charityTaxAlloc","type":"uint256"},{"internalType":"uint256","name":"_burnTaxAlloc","type":"uint256"},{"internalType":"uint256","name":"_adminTaxAlloc","type":"uint256"}],"name":"setTaxAllocations","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taxPercentage","type":"uint256"}],"name":"setTaxPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"taxPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rewardAmount","type":"uint256"}],"name":"tokenWithRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAdminFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBurnFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCharityFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalHolderFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"totalTaxAlloc","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sender","type":"address"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var bscnftmintABI = JSON.stringify([{"inputs":[{"internalType":"uint256","name":"_timestart","type":"uint256"},{"internalType":"uint256","name":"_timeend","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_receiver","type":"address"}],"name":"changeReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier1URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"changeTier2URI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"holder","type":"address"}],"name":"checkBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablemintlimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enabletimelimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablewalletbalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"enablewalletlimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mintedCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"mintedCounttier1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"mintedCounttier1URI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"mintedCounttier2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"mintedCounttier2URI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtier1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtier2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintedtotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintlimitsenabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"minttier1NFT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"minttier2NFT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"receiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"setToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"setWindow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"tier1limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tier1mintLimitReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tier1minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier1mintlimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"tier2limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tier2mintLimitReached","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tier2minted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tier2mintlimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeend","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timestart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"walletbalanceenabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]);

let sessionwallet; 
let sessiontier; 

let timestamp;
let blocknumber;

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
  window.web3 = new Web3(ethereum);
    ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BSC_TESTNET_PARAMS]
        })
        .catch((error) => {
          //console.log(error)
        });
    onConnect();
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
		          if (mydata[i].name == "Ethereum Testnet Ropsten") {
		            document.getElementById("correctnetwork").style.display = 'block';
		            document.getElementById("incorrectnetwork").style.display = 'none';
		            document.getElementById("disconnected").style.display = 'none';
		            document.querySelector("#currency").textContent = "My ETH balance";
		            document.getElementById("bscnetwork").style.display = 'none';
		            document.getElementById("ethwallet-validation").style.display = 'block';
		            document.getElementById("incorrectalert").style.display = 'none';

		          } else {
		            document.getElementById("correctnetwork").style.display = 'none';
		            document.getElementById("disconnected").style.display = 'none';
		            document.getElementById("incorrectalert").style.display = 'none';

		            sessionwallet = document.querySelector("#account-wallet").value;
		            sessiontier = document.querySelector("#account-tier").value;

		            //console.log(sessiontier);

			            if (mydata[i].name !== "Binance Smart Chain Testnet") {
			              document.getElementById("incorrectnetwork").style.display = 'block';
			              document.getElementById("incorrectalert").style.display = 'none';

			            } else {

		            		  document.getElementById("incorrectnetwork").style.display = 'none';
				              document.getElementById("ethwallet-validation").style.display = 'none';
				              document.getElementById("correctnetwork").style.display = 'block';
				              document.getElementById("bscnetwork").style.display = 'block';
				              document.querySelector("#currency").textContent = "My BNB balance";
				              document.querySelector("#my-token-balance").textContent = "Soon";
				              document.getElementById("ethwallet-validation").style.display = 'none';

				              	if (sessionwallet == "" && sessiontier == "") {
				              		document.getElementById("incorrectalert").style.display = 'block';
				                } else {
				                	document.getElementById("incorrectalert").style.display = 'none';

				                	  if (sessionwallet != "" && sessiontier == "1") {
						                document.getElementById("tier1mint").style.display = 'block';
						              }

						              if (sessionwallet != "" && sessiontier == "2") {
						                document.getElementById("tier2mint").style.display = 'block';
						              }
				                }
			              	
			              		  
					               
					              
					    }
		            }
		            
		              
		            
		            //addETHNetwork();
		            //function call to switch back to ETHEREUM here?
		          
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
  document.querySelector("#account-balance").textContent = humanFriendlyBalance;

  //if (sessionwallet == "" && sessiontier == "") {
  	try {

  		fetch('validated/'+selectedAccount+'.blob')
		  .then(response => {
		    if (response.ok) {
		      return response.text()
		    } else if(response.status === 404) {
		    	document.querySelector("#account-wallet").value = selectedAccount;
		    	document.querySelector("#account-tier").value = "0";
		      return Promise.reject('error 404')
		    } else {
		      return Promise.reject('some other error: ' + response.status)
		    }
		  })
		  .then(data => {
		  	document.querySelector("#account-wallet").value = selectedAccount;
		  	document.querySelector("#account-tier").value = data;
		  })
		  .catch(); //error => console.log('error is', error)
	}
	catch {

	}
  //}

  var tokencontract = new web3.eth.Contract(JSON.parse(kojitokenABI),kojitoken);
  var nftcontract = new web3.eth.Contract(JSON.parse(bscnftmintABI),bscnftaddress);

  tokencontract.methods.balanceOf(selectedAccount).call(function(err,res){
    if(!err){
       // console.log(web3.utils.fromWei(res));
       var balance = web3.utils.fromWei(res);
       balance = +balance;
       balance = parseFloat(balance).toFixed(2);
        
        document.getElementById("my-token-balance").innerText = balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KOJI";

        var accountdata; 

        if (+balance >= 1000000000) {
          accountdata = btoa("account="+selectedAccount+"&tier=1"); 
          fetch("session.php?"+accountdata+"");
          document.querySelector("#mint-tier").textContent = "Holdings Validated! You are eligible to mint the Koji Tier 1 Animated Poster";
          document.querySelector("#bsc-switch").style.display = "block";
          
        } 

        if (+balance >= 250000000 && +balance < 1000000000) {
          accountdata = btoa("account="+selectedAccount+"&tier=2");
          fetch("session.php?"+accountdata+"");
          document.querySelector("#mint-tier").innerHTML = "Holdings Validated! You are eligible to mint the Koji Tier 2 Static Poster (<a href='https://app.uniswap.org/#/swap?outputCurrency=0x1c8266a4369af6d80df2659ba47b3c98f35cb8be&use=V2'>Buy more $KOJI on Uniswap</a>)";
          document.querySelector("#bsc-switch").style.display = "block";
        } 

        if (+balance < 250000000) {
          accountdata = btoa("account="+selectedAccount+"&tier=0");
          fetch("session.php?"+accountdata+"");
          document.querySelector("#mint-tier").innerHTML = "Not Eligible (<a href='https://app.uniswap.org/#/swap?outputCurrency=0x1c8266a4369af6d80df2659ba47b3c98f35cb8be&use=V2'>Buy $KOJI on Uniswap</a>)";
        } 
    } else {
    	//accountdata = btoa("account="+selectedAccount+"&tier=0");
       // fetch("session.php?"+accountdata+"");
    }
  });


async function getAccountInfo(account) {

	try {

	web3.eth.getBlock(blocknumber).then(getblockstamp);

	 } catch {

	 }

	 sessionwallet = document.querySelector("#account-wallet").value;
     sessiontier = document.querySelector("#account-tier").value;

     //console.log(sessionwallet);
     //console.log(sessiontier);

     
     nftcontract.methods.minted(account).call(function(err,res){
        if(!err){
          if (res && !res) {
             //total # of NFT mints has been met
               document.getElementById("mint1").setAttribute("disabled","disabled");
                       document.getElementById("mint1").setAttribute("disabled","disabled");
	                   document.getElementById("mint1").style.display = "none";
	                   document.getElementById("mint2").setAttribute("disabled","disabled");
	                   document.getElementById("mint2").style.display = "none";
	                   document.getElementById("gas-airdrop").style.display = 'none';
                       document.getElementById("validation1").style.display = "block";
                       document.getElementById("validation1").innerHTML = "<span style='color:red'><br>This wallet has already minted 1 poster NFT</span>"
                       document.getElementById("validation2").style.display = "block";
                       document.getElementById("validation2").innerHTML = "<span style='color:red'><br>This wallet has already minted 1 poster NFT</span>"
           } else {
               nftcontract.methods.timestart().call(function(err,res){
                  if(!err){
                  		//console.log(+res);
	                    if (+res > +timestamp) {
	                        //wallet has already minted 1 NFT
	                       document.getElementById("mint1").setAttribute("disabled","disabled");
	                       document.getElementById("mint1").style.display = "none";
	                       document.getElementById("mint2").setAttribute("disabled","disabled");
	                       document.getElementById("mint2").style.display = "none";
	                       document.getElementById("gas-airdrop").style.display = 'none';
	                       document.getElementById("validation1").style.display = "block";
	                       document.getElementById("validation1").innerHTML = "<span style='color:red'><br>The minting window has not opened yet!</span>"
	                       document.getElementById("validation2").style.display = "block";
	                       document.getElementById("validation2").innerHTML = "<span style='color:red'><br>The minting window has not opened yet!</span>"
	                    } else {
	                       nftcontract.methods.timeend().call(function(err,res){
		                       	if(!err){
		                    		if (+res < +timestamp) {
		                    			//console.log(+res);
		                	    	   document.getElementById("mint1").setAttribute("disabled","disabled");
				                       document.getElementById("mint1").style.display = "none";
				                       document.getElementById("mint2").setAttribute("disabled","disabled");
				                       document.getElementById("mint2").style.display = "none";
				                       document.getElementById("gas-airdrop").style.display = 'none';
				                       document.getElementById("validation1").style.display = "block";
				                       document.getElementById("validation1").innerHTML = "<span style='color:red'><br>The minting window has closed!</span>"
				                       document.getElementById("validation2").style.display = "block";
				                       document.getElementById("validation2").innerHTML = "<span style='color:red'><br>The minting window has closed!</span>"
		                    		} else {
		                    				
				                       		if ((sessionwallet !== "" && sessiontier !== "") || sessionwallet !== "0") {

					                       		if (sessiontier == "1") {
									                document.getElementById("mint1").style.display = "block";
									                document.getElementById("validation1").style.display = "none";
						                        	document.getElementById("validation1").innerHTML = ""
						                        	document.getElementById("tier2mint").style.display = 'none';
						                        	document.getElementById("mint2").style.display = "none";
									                document.getElementById("validation2").style.display = "none";
						                        	document.getElementById("validation2").innerHTML = ""
									                
									              }

									              if (sessiontier == "2") {
									              	document.getElementById("tier1mint").style.display = 'none';
									              	document.getElementById("mint1").style.display = "none";
									                document.getElementById("validation1").style.display = "none";
						                        	document.getElementById("validation1").innerHTML = ""
									                document.getElementById("mint2").style.display = "block";
									                document.getElementById("validation2").style.display = "none";
						                        	document.getElementById("validation2").innerHTML = ""

									              }

									              //console.log(sessiontier);

			                    			  if (humanFriendlyBalance < .004) {
											    document.getElementById("gas-airdrop").style.display = 'block';
											    document.getElementById("mint1").setAttribute("disabled","disabled");
											    document.getElementById("mint2").setAttribute("disabled","disabled");
											  }  

											  if (humanFriendlyBalance >= .004) {

											    document.getElementById("gas-airdrop").style.display = 'none';
											    document.getElementById("gas-dust").style.display = 'none';
											    document.getElementById("mint1").removeAttribute("disabled");
											    document.getElementById("mint2").removeAttribute("disabled");

											   }

											}

										    if ((sessionwallet == "" && sessiontier == "") || sessiontier == "0") {
										    	document.getElementById("gas-airdrop").style.display = 'none';
										    	document.getElementById("tier1mint").style.display = 'block';
										    	document.getElementById("mint1").style.display = "none";
										    	document.getElementById("validation1").style.display = "block";
				                       			document.getElementById("validation1").innerHTML = "<span style='color:red'><br>Your wallet has not passed validation. Please switch to Ethereum mainnet to validate your $KOJI holdings.</span>"
										    	//document.getElementById("validation1").innerHTML = "wallet is "+sessionwallet+" tier is " + sessiontier;
										    }

										    if (!txinprogress) {
										      document.getElementById("mint1").removeAttribute("disabled");
										      document.getElementById("mint2").removeAttribute("disabled");
										    }
										    
										  
		                    		}
		                    	}
	                       });//minted();
	                    } //res = true
                   }  //err 
                });//timestart();
             } //err
        } //res = true
    });//timeend();
        
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

async function mintNFT(tier) {


     const web3 = new Web3(provider);

     // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        //console.log(err);
      }
  
  var nftcontract = new web3.eth.Contract(JSON.parse(bscnftmintABI),bscnftaddress);

  var txdata;

  if (tier == 1) {
    txdata = nftcontract.methods.minttier1NFT(account[0]).encodeABI()
  }

  if (tier == 2) {
    txdata = nftcontract.methods.minttier2NFT(account[0]).encodeABI()
  }
  
    web3.eth.sendTransaction(
          {from: account[0],
          to: bscnftaddress,
          value: 0, 
          gasprice: 100000, // 100000 = 10 gwei
           //gas: 350000,   // gas limit
          data: txdata
              }, function(err, transactionHash) {
            //console.log('in progress');
            txinprogress = true;
            document.getElementById("mint1").setAttribute("disabled","disabled");
             document.getElementById("mint2").setAttribute("disabled","disabled");
             document.getElementById("inprogress").style.display = 'block';
             document.getElementById("nft-tx").innerHTML = "TX: <a href='https://testnet.bscscan.com/tx/"+ transactionHash+"' target='_blank'>"+transactionHash+"</a>";
             
      })
      .on('receipt', function(receipt){

        //console.log(receipt);

       document.getElementById("inprogress").style.display = 'none';
       document.getElementById("txcomplete").style.display = 'block';
       document.getElementById("nftresult").innerHTML = '<div style="word-break:break-word">Your NFT has been minted at transaction hash <a href="https://testnet.bscscan.com/tx/'+receipt.transactionHash+'" target="_blank">'+receipt.transactionHash+'</a>.<br><br>You can add this NFT to your mobile wallet (Metamask, Trustwallet) by clicking on "Collectibles" and pasting in the following information:<br><br>Contract: '+bscnftaddress+'<br><br>TokenID: '+parseInt(receipt.logs[0].topics[3])+'<br><br><span style="color:red">Please note it may take several moments for your NFT image to display in your wallet</span><br><br>Thank you for supporting the koji.earth project!</div>';
      

      //fetchAccountData();
      })

      .on('error', function(error){ // If a out of gas error, the second parameter is the receipt.
      		 document.getElementById("inprogress").style.display = 'none';
             document.getElementById("nft-tx").innerHTML = "";
             document.getElementById("mint1").removeAttribute("disabled");
             document.getElementById("mint2").removeAttribute("disabled");
      });
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
    refreshAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    refreshAccountData();
  });
   

  await refreshAccountData();
  Refresh(5000);
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
}

function Refresh(interval) {
refreshinterval = window.setInterval(function() {
fetchAccountData();
//console.log('updating account data');
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
