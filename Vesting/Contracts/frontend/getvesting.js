"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;


// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
//let selectedAccount;


var TeamVestingAddress = "0x0bF4728dB874b750da572C105c443118a8bCF913";
var tokenName = "Koji";
var tokenSymbol = "KOJI";
var tokenAddress = "0x1c8266a4369af6d80df2659ba47b3c98f35cb8be";
var account = "0x0bF4728dB874b750da572C105c443118a8bCF913";

var TeamVestingABI = JSON.stringify([{"inputs":[{"internalType":"address","name":"_koji","type":"address"},{"internalType":"address","name":"_vestingLogic","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"KOJI","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VESTING_LOGIC","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"getAllVestings","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_length","type":"uint256"}],"name":"getVestings","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"getVestingsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vestingCliffDuration","type":"uint256"}],"name":"setVestingCliffDuration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vestingDuration","type":"uint256"}],"name":"setVestingDuration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"vest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingCliffDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"vestings","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
var ProxyVestingABI = JSON.stringify([{"inputs":[],"name":"amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cliff","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"duration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_koji","type":"address"},{"internalType":"address","name":"_beneficiary","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_cliffDuration","type":"uint256"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"koji","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasableAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"start","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]);

var MainVestingInstance = new web3.eth.Contract(JSON.parse(TeamVestingABI), TeamVestingAddress);


/**
 * Setup the orchestra
 */
function init() {                                                   //this function is no longer used but left in as a fallback

  //console.log("Initializing example");
 // console.log("WalletConnectProvider is", WalletConnectProvider);
    

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
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
  });

document.getElementById("btn-connect").removeAttribute("disabled");
}



/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  
  window.web3 = new Web3(ethereum);
	 //console.log("Web3 instance is", web3);
  
  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId(function(err, result) {
    if (!err) {
     var mydata = JSON.parse(chainData);
     //console.log(mydata[0].name)
     // the code you're looking for
      var lookup = result;

      // iterate over each element in the array
      for (var i = 0; i < mydata.length; i++){
        // look for the entry with a matching `code` value
        if (mydata[i].chainId == lookup){
           // we found it
          // obj[i].name is the matched result
          document.querySelector("#network-name").textContent = mydata[i].name;

         // if (mydata[i].name == "Ethereum Mainnet") { // MAINNET
         if (mydata[i].name == "Ethereum Testnet Ropsten") { // ROPSTEN

          	var networkname = mydata[i].name
            document.getElementById("my-network").innerText = networkname; 

            document.getElementById("correctnetwork").style.display = 'block';
            document.getElementById("incorrectnetwork").style.display = 'none';

          } else {
            document.getElementById("correctnetwork").style.display = 'none';
            document.getElementById("incorrectnetwork").style.display = 'block';
          }
        }
      }
  
    }
  });
  
  

  // Get list of accounts of the connected wallet
  try {
            await ethereum.enable();
            var account = await web3.eth.getAccounts();
            //console.log(account[0]);
           
          fetch("session.php?account="+account[0]+"") //Nodezy: saving wallet address as a session variable


    }catch{
      //console.log(err);
    } finally {
            getAccountInfo(account[0]);
            isWeb3Connected(account[0]);
    }
   

          

          
          function isWeb3Connected(account) {
          if(window.ethereum) {
            web3.eth.getBalance(account, function(err, ethBalance) {
              if(!err){

            // document.getElementById("web3-wallet").innerHTML = "<p style='color:green;display:inline-block'><b>Yes</b></p>";

            // Added by Andreas - moving connection status to #header
            document.getElementById("web3-wallet").innerHTML = "<div class='dot-container'><div class='dot green'></div></div>Web3 wallet: <strong>connected</strong>";

            document.getElementById("my-address").innerText = account;
            document.getElementById("my-eth-balance").innerText = web3.utils.fromWei(ethBalance) + " ETH";
          }
          });
          } else {
          	web3.eth.getBalance(account, function(err, ethBalance) {
              if(!err){

            //document.getElementById("web3-wallet").innerHTML = "<p style='color:green;display:inline-block'><b>Yes</b></p>";

            // Added by Andreas - moving connection status to #header
            document.getElementById("web3-wallet").innerHTML = "<div class='dot-container'><div class='dot green'></div></div>Web3 wallet: <strong>connected</strong>";

            document.getElementById("my-address").innerText = account;
            document.getElementById("my-eth-balance").innerText = web3.utils.fromWei(ethBalance) + " ETH";
          }
          });
          }
        }

       

        // get my address, ETH and token balance, and current rate (price)
        function getAccountInfo(account) {
          
            MainVestingInstance.methods.vestings(account, 0).call(function(err,res){
                if(!err){
                  //user has vested tokens in the array
                    
                    document.getElementById("proxyaddress").innerText = res;
                    
                    //document.getElementById("my-token-balance").innerText = web3.utils.fromWei(res) + " " + tokenSymbol;
                    //document.getElementById("token-name").innerText = tokenName + " (" + tokenSymbol + ")";
                    
                    

                } else {
                    //console.log(err);
                }
              
            });
          
        }

       
       //new functions for vesting display and withdraw here

        

  
  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  //await Promise.all(rowResolvers);


  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";

  // Added by Andreas ---- required as btn's been moved out of their original #prepar/#connected containers
  document.querySelector("#btn-connect").style.display = "none";
  document.querySelector("#btn-disconnect").style.display = "block";

  // Added by Andreas ---- for additional styling of elements base on wallet connection status
  document.querySelector("#page").classList.add("connected");
  document.querySelector("#page").classList.remove("disconnected");
  
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

  // Added by Andreas ---- required as btn's been moved out of their original #prepar/#connected containers
  document.querySelector("#btn-disconnect").style.display = "none";
  document.querySelector("#btn-connect").style.display = "block";

  // Added by Andreas ---- for additional styling of elements base on wallet connection status
  document.querySelector("#page").classList.remove("connected");
  document.querySelector("#page").classList.add("disconnected");

  // Added by Andreas ---- to get the not connected status back after moved to #header
  document.getElementById("web3-wallet").innerHTML = "<div class='dot-container'><div class='dot red'></div></div>Web3 wallet: <strong>not connected</strong>";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData();
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  for (var i = 1; i < 99999; i++)
        window.clearInterval(i);

  //console.log(account)

  /*//console.log("Opening a dialog", web3Modal);
  try {                                                         //old modal connection method, left in as a fallback
    provider = await web3Modal.connect();           
  } catch(e) {
    //console.log("Could not get a wallet connection", e);
    return;
  }

   */
    // Subscribe to accounts change
  ethereum.on("accountsChanged", (accounts) => {
    if (account != null) {                 //this is so even after wallet is disconnected, metamask can still reload the site because
    fetchAccountData();                    //the ethereum.on event listener is still active and cannot be deactivated...so we just check
    } else {                              //and if the account is null we reload the page instead of letting metamask call the accountData function
      window.location.reload();
    }
  });

  // Subscribe to chainId change
  ethereum.on("chainChanged", (chainId) => {
    if (account != null) {
    fetchAccountData();
    } else {
      window.location.reload();
    }
  }); 

  // Subscribe to networkId change
  ethereum.on("networkChanged", (networkId) => {
    if (account != null) {
    fetchAccountData();
    } else {
      window.location.reload();
    }
  });



  await fetchAccountData();


Refresh(5000);
//window.scrollTo(0,document.body.scrollHeight);
}


/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {
  fetch("killsession.php"); //Nodezy: kill session so it won't autopopulate on refresh after disconnect
for (var i = 1; i < 99999; i++)
        window.clearInterval(i);
  //console.log("Killing the wallet connection", provider);

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
  
  // Added by Andreas ---- required as btn's been moved out of their original #prepar/#connected containers
  document.querySelector("#btn-connect").style.display = "block";
  document.querySelector("#btn-disconnect").style.display = "none";

  // Added by Andreas ---- for additional styling of elements base on wallet connection status
  document.querySelector("#page").classList.remove("connected");
  document.querySelector("#page").classList.add("disconnected");

  // TODO: Which providers have close method?                   //old disconnect method, leaving in as a fallback
  /*if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }*/
  
  web3.eth.accounts.wallet.clear();
  web3 = null;

  account = null;
  //console.log(account);
  window.setTimeout(function() {
  	window.location.reload();
  },1000);
  
    
}



  // allows user to withdraw tokens from escrow
	async function release() {

	   // const web3 = new Web3(provider);
	   window.web3 = new Web3(ethereum);

	    var ProxyVestingInstance = new web3.eth.Contract(JSON.parse(ProxyVestingABI), 'pull address from Main based on wallet');
	    

	  // Get list of accounts of the connected wallet
	   try {
	            await ethereum.enable();
	            var account = await web3.eth.getAccounts();
	    } catch {
	      //console.log(err);
	    }


	    web3.eth.sendTransaction(
	          {from: account[0],
	          to: crowdsaleAddress,
	          //value: web3.utils.toWei(amount),
	          gasprice: 100000, // 100000 = 10 gwei
	          //gas: 300000,   // gas limit
	          data: CrowdsaleInstance.methods.withdrawTokens(account[0]).encodeABI()   //New method calculates gas properly!!!
	              }, function(err, transactionHash) {
	        if (err) {
	          //document.getElementById("").style.display = 'block';
	          //document.getElementById("").innerHTML =  "Status: " + err["message"];
	      } else {
	        /*var clearbuy = window.setTimeout(function () {
	          ClearBuyOrder();
	        },30000);*/
	        /*document.getElementById("validateMessage").style.display = 'none';
	        document.getElementById("validateMessage").innerText =  ""
	        document.getElementById("buyAmount").value = "";
	        document.getElementById("buySubmit").setAttribute("disabled","disabled");
	        document.getElementById("submitted").style.display = 'block';
	        document.getElementById("troubleshooting").style.display = 'none';
	        document.getElementById("buyTokens").style.display = 'block';
	        document.getElementById("buyTokens").innerHTML = "TX: <a href='https://ropsten.etherscan.io/tx/"+ transactionHash+"' target='_blank'>"+transactionHash+"</a>";
	        document.getElementById("showLoading").style.display = 'block'; 
	        //window.scrollTo(0,document.body.scrollHeight);
	        //console.log(transactionHash);*/
	      }
	      })
	    .on('receipt', function(receipt){
	    /*window.clearTimeout(clearbuy);*/
	    /*document.getElementById("approved").style.display = 'block';
	    document.getElementById("showLoading").style.display = 'none';
	    document.getElementById("disclaimer").style.display = 'block';
	    document.getElementById("buyTokens").style.display = 'none';
	    document.getElementById("submitted").style.display = 'none';
	    document.getElementById("buySubmit").removeAttribute("disabled");
	    document.getElementById("troubleshooting").style.display = 'none';*/
	    
	    fetchAccountData();
		});
	 }


  

function getDisconnect() {

  
if (confirm("Are you sure you want to disconnect?") == true) {
  //console.log('Disconnect called');
    onDisconnect();
    //return true;
  } else {
    return false;
  }

  // Added by Andreas ---- to get the not connected status back after moved to #header
  document.getElementById("web3-wallet").innerHTML = "<div class='dot-container'><div class='dot red'></div></div>Web3 wallet: <strong>not connected</strong>";  

}

function Refresh(interval) {
  var interval = window.setInterval(function() {
fetchAccountData();
console.log('refresh')
},interval);
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  //init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", getDisconnect);
  document.getElementById("btn-connect").removeAttribute("disabled");  //event listener loaded, user can connect now

});
