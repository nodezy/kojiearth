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

// variables used in the file, token name and symbol are just for convinience
var crowdsaleAddress = "0x0bDd49F42CcF03855a7D508cf936Ad8d806B439f";
var tokenName = "Koji";
var tokenSymbol = "KOJI";
var tokenAddress = "0x1c8266A4369aF6d80Df2659Ba47B3c98f35cB8bE";
var account = "0x0bDd49F42CcF03855a7D508cf936Ad8d806B439f";
var FlatRateCrowdsaleABI = JSON.stringify([{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"hasClosed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isCapper","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOpen","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"closingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"capReached","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceCapper","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addCapper","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"openingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"remainingTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_rate","type":"uint256"},{"name":"_wallet","type":"address"},{"name":"_token","type":"address"},{"name":"_tokenWallet","type":"address"},{"name":"_openingTime","type":"uint256"},{"name":"_closingTime","type":"uint256"},{"name":"individualCap","type":"uint256"},{"name":"_cap","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"CapperAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"CapperRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"prevClosingTime","type":"uint256"},{"indexed":false,"name":"newClosingTime","type":"uint256"}],"name":"TimedCrowdsaleExtended","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"}],"name":"withdrawUnsoldTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"cap","type":"uint256"}],"name":"setCap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"beneficiary","type":"address"}],"name":"getCap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"beneficiary","type":"address"}],"name":"getContribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]);



/**
 * Setup the orchestra
 */
function init() {

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

// Get a Web3 instance for the wallet
		  const web3 = new Web3(provider);

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
          if (mydata[i].name == "Ethereum Mainnet") {
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
  web3.eth.getAccounts((err, ret) => {
          account = ret;
          getAccountInfo(account[0]);
          isWeb3Connected(account[0]);
          //console.log(account[0]);
        });

  // for Flat Rate Crowdsale use the following ABI
        
        var CrowdsaleInstance = new web3.eth.Contract(JSON.parse(FlatRateCrowdsaleABI), crowdsaleAddress);
         

        var minABI = [
            // balanceOf
            {
              "constant":true,
              "inputs":[{"name":"_owner","type":"address"}],
              "name":"balanceOf",
              "outputs":[{"name":"balance","type":"uint256"}],
              "type":"function"
            },
            // decimals
            {
              "constant":true,
              "inputs":[],
              "name":"decimals",
              "outputs":[{"name":"","type":"uint8"}],
              "type":"function"
            }
          ];

          var tokencontract = new web3.eth.Contract(minABI,tokenAddress);

          /*async function getBalance() {
            balance = await tokencontract.methods.balanceOf(account[0]);
            return balance;
          }*/

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

        

          //console.log(getBalance());

        web3.eth.defaultAccount = web3.eth.accounts[0];

        // The minimum ABI to get ERC20 Token balance
        //console.log(web3.eth.defaultAccount);

        // get my address, ETH and token balance, and current rate (price)
        function getAccountInfo(account) {
            tokencontract.methods.balanceOf(account).call(function(err,res){
                if(!err){
                   // console.log(web3.utils.fromWei(res));
                    
                    document.getElementById("my-token-balance").innerText = web3.utils.fromWei(res) + " " + tokenSymbol;
                    document.getElementById("token-name").innerText = tokenName + " (" + tokenSymbol + ")";
                    
                    getCurrentRate();
                    getWalletCap();
                    getSaleTotals();

                    // Added by Andreas ---- as per instrucitons
                    getOpeningTime();

                } else {
                    //console.log(err);
                }
              
            });
          
        }

        // Added by Andreas - countdown to Crowdsale contract 

        function getOpeningTime() {          

          CrowdsaleInstance.methods.openingTime().call(function(err,result){

            var openingTime = result;
            var currentTime = Date.now();
            currentTime = parseInt(currentTime / 1000).toFixed(0)

            //console.log(openingTime);
            //console.log(currentTime);
            
            // var preSaleTime = currentTime - openingTime ;
            var preSaleTime = (+openingTime) - (+currentTime);
            preSaleTime = preSaleTime
            //console.log(preSaleTime)

            //nodezy: this function date() doesn't accurately express the difference between now and startTime
            /*var date = new Date(preSaleTime);

            var hours = date.getHours();
            var minutes = date.getMinutes();*/

            preSaleTime = (preSaleTime / 60) /60 //hours with the decimal remainder as minutes
            //console.log(preSaleTime)

            var sale_hours = (preSaleTime).toFixed(2);
            var arr = sale_hours.split('.')
            var sale_minutes = Number(arr[1]/100).toFixed(2);
            sale_hours = arr[0]
            //console.log(sale_minutes);

            sale_minutes = sale_minutes * 60
            sale_minutes = (sale_minutes).toFixed(0);

              
            var formattedTime = '<strong>' + sale_hours + '</strong> hours & <strong>' + sale_minutes + '</strong> minutes until presale is live!'; 
            
            document.getElementById("opening-time").innerHTML = formattedTime;
            //console.log(formattedTime);

            if (+sale_hours == 0 && +sale_minutes == 0) {
              document.getElementById("opening-time").innerHTML = '<strong>Presale starting shortly...</strong>';
              document.getElementById("validateMessage").innerText =  ""
            }

            //since tracking seconds from unix time is difficult, the timer will read 0 h 0 m but there will still be 60 
            //seconds counting down unseen to the user. during this time we reset the validation box because the user
            //will undoubtedly keep pressing the buy button during this period but will get the message "crowdsale isn't live yet"
            //and we can reset this message every 5 seconds. eventually it will go live hence the code below

            if (+sale_hours == 0 && +sale_minutes == -1) {
              document.getElementById("opening-time").innerHTML = '<strong>Presale is live!</strong>';
            }
            
          });

        };

        // get token name from Crowdsale contract
        function getTokenName() {
          CrowdsaleInstance.methods.token().call(function(err,result){
            document.getElementById("token-name").innerText = result;
          });
        }

        // get current rate from Crowdsale contract. For Flat Rate Crowdsale use rate() instead of getCurrentRate() on Crowdsale instance
        function getCurrentRate() {
          CrowdsaleInstance.methods.rate().call(function(err,result){
            document.getElementById("rate").innerText = result + " " + tokenSymbol + " = 1 ETH" ;
            if (result !== 0) {
              document.getElementById("my-network").innerText = "Ethereum Mainnet"
            }
          });
        }

        function getWalletCap() {
          CrowdsaleInstance.methods.getContribution(account[0]).call(function(err, result) {
            if (err) {
              document.getElementById("walletCap").innerText =  "Status " + err["message"];
            } else {
              var walletcap = web3.utils.fromWei(result)
              document.getElementById("walletCap").innerText =  web3.utils.fromWei(result) +" / 0.5 ETH";
              document.getElementById("walletCap").value = web3.utils.fromWei(result) 
              //console.log(result);
              if (walletcap == .5) {
                document.getElementById("buyAmount").setAttribute("disabled","disabled");
                document.getElementById("buySubmit").setAttribute("disabled","disabled");

                //document.getElementById("validateMessage").style.color = "red"
                // Added ny Andreas for better styling of alerts
                document.getElementById("validateMessage").classList.add("no-go");
                document.getElementById("validateMessage").classList.remove("go");

                document.getElementById("validateMessage").innerText =  "Wallet cap has been met"
              } else {
              	document.getElementById("buyAmount").removeAttribute("disabled");
                document.getElementById("buySubmit").removeAttribute("disabled");
                //document.getElementById("validateMessage").style.color = ""
                //document.getElementById("validateMessage").innerText =  ""
              }
            }
        });
        }


        function getSaleTotals() {
          

            CrowdsaleInstance.methods.weiRaised().call(function(err, result) {
            if (!err) {
              document.getElementById("totalSale").innerText =  web3.utils.fromWei(result)+" / ";
              //console.log(result);
            }
            });

            CrowdsaleInstance.methods.cap().call(function(err, result) {
            if (!err) {
              document.getElementById("totalCap").innerText =  web3.utils.fromWei(result)+" ETH";
              //console.log(result);
            }
            });


            CrowdsaleInstance.methods.capReached().call(function(err, result) {
              //console.log(result);
            if (result == true) {
                document.getElementById("buyAmount").setAttribute("disabled","disabled");
                document.getElementById("buySubmit").setAttribute("disabled","disabled");
                //document.getElementById("validateMessage").style.color = "red"
                // Added ny Andreas for better styling of alerts
                document.getElementById("validateMessage").classList.add("no-go");
                document.getElementById("validateMessage").classList.remove("go");
                document.getElementById("validateMessage").innerText =  "Sale total cap has been meet"
              } else {
                //console.log("sale is still live")
              }
        });

        }

        

  
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
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
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
    fetchAccountData();
  });

  // Subscribe to chainId change
   provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  }); 

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();


Refresh(5000);
//window.scrollTo(0,document.body.scrollHeight);
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {
for (var i = 1; i < 99999; i++)
        window.clearInterval(i);
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

  account = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
  
  // Added by Andreas ---- required as btn's been moved out of their original #prepar/#connected containers
  document.querySelector("#btn-connect").style.display = "block";
  document.querySelector("#btn-disconnect").style.display = "none";

  // Added by Andreas ---- for additional styling of elements base on wallet connection status
  document.querySelector("#page").classList.remove("connected");
  document.querySelector("#page").classList.add("disconnected");


  
}

// buys tokens for specified amount of ETH (specified in input field with id: buyAmount)
  function buyTokens() {

    document.getElementById("approved").style.display = 'none';
    document.getElementById("buySubmit").setAttribute("disabled","disabled");
    document.getElementById("submitted").style.display = 'none';
    document.getElementById("buyTokens").style.display = 'none';
    document.getElementById("disclaimer").style.display = 'none';

    const web3 = new Web3(provider);

  // Get list of accounts of the connected wallet
  web3.eth.getAccounts((err, ret) => {
          account = ret;
          //console.log(account[0]);
        });

    var amount = document.getElementById("buyAmount").value;
    /*CrowdsaleInstance.methods.buyTokens(account[0], web3.utils.toWei(amount)).call(function(err, result) {
      if (err) {
        document.getElementById("buyTokens").innerText =  "Status" + err;
      } else {
        document.getElementById("buyTokens").innerText = "TX ID: " + result;
        console.log(result);
      }
    });*/
    web3.eth.sendTransaction(
          {from: account[0],
          to: crowdsaleAddress,
          value:  web3.utils.toWei(amount), 
          gasprice: 100000, // 100000 = 10 gwei
          gas: 250000,   // gas limit
          data: "0x"
              }, function(err, transactionHash) {
        if (err) {
        	document.getElementById("troubleshooting").style.display = 'none';
          document.getElementById("buyTokens").style.display = 'block';
        document.getElementById("buyTokens").innerHTML =  "Status: " + err["message"];
      } else {
      	/*var clearbuy = window.setTimeout(function () {
          ClearBuyOrder();
        },30000);*/
        document.getElementById("validateMessage").innerText =  ""
        document.getElementById("buyAmount").value = "";
        document.getElementById("buySubmit").setAttribute("disabled","disabled");
        document.getElementById("submitted").style.display = 'block';
        document.getElementById("troubleshooting").style.display = 'none';
        document.getElementById("buyTokens").style.display = 'block';
        document.getElementById("buyTokens").innerHTML = "TX: <a href='https://etherscan.io/tx/"+ transactionHash+"' target='_blank'>"+transactionHash+"</a>";
        document.getElementById("showLoading").style.display = 'block'; 
        //window.scrollTo(0,document.body.scrollHeight);
        //console.log(transactionHash);
      }
      })
    .on('receipt', function(receipt){
    /*window.clearTimeout(clearbuy);*/
    document.getElementById("approved").style.display = 'block';
    document.getElementById("showLoading").style.display = 'none';
    document.getElementById("disclaimer").style.display = 'block';
    document.getElementById("buyTokens").style.display = 'none';
    document.getElementById("submitted").style.display = 'none';
    document.getElementById("buySubmit").removeAttribute("disabled");
    document.getElementById("troubleshooting").style.display = 'none';
    
    fetchAccountData();
});
  }

//added the isOpen.call() to the contract to the validation function, this way until the presale opens
//the user will not be able to even try to send ETH to the contract and waste their gas. Once the presale 
//is open, the validation then goes on to check if all requirements are met and calls the buyTokens() function if so

function validate () {
   const web3 = new Web3(provider);
  var CrowdsaleInstance = new web3.eth.Contract(JSON.parse(FlatRateCrowdsaleABI), crowdsaleAddress);
  CrowdsaleInstance.methods.isOpen().call(function(err, result) {
            if (!err) {
              //console.log(result);
              if (result == true) {
              var ethAmt = document.getElementById("buyAmount").value;
  var walletAmt = document.getElementById("walletCap").value;
  //console.log('wallet amount = '+walletAmt);
  var totalAmt = +ethAmt + +walletAmt;
  //console.log('total amount = '+totalAmt);
  if (ethAmt > 0 && ethAmt <= .5) {
    document.getElementById("buySubmit").removeAttribute("disabled");
    //document.getElementById("validateMessage").style.color = "green"
    // Added ny Andreas for better styling of alerts
    document.getElementById("validateMessage").classList.add("go");
    document.getElementById("validateMessage").classList.remove("no-go");
    document.getElementById("validateMessage").innerText =  "Eth amount is within range"
    if (totalAmt > .5) {  
    //document.getElementById("buySubmit").setAttribute("disabled","disabled");
    //document.getElementById("validateMessage").style.color = "red"
    // Added ny Andreas for better styling of alerts
    document.getElementById("validateMessage").classList.add("no-go");
    document.getElementById("validateMessage").classList.remove("go");
    document.getElementById("validateMessage").innerText =  "This amount puts the wallet over .5 Eth cap"
    } else {
    document.getElementById("buySubmit").removeAttribute("disabled");
    //document.getElementById("validateMessage").style.color = "green"
    // Added ny Andreas for better styling of alerts
    document.getElementById("validateMessage").classList.add("go");
    document.getElementById("validateMessage").classList.remove("no-go");
    document.getElementById("validateMessage").innerText =  "Wallet is at or below cap"
    buyTokens();
    }
  } else {
    //document.getElementById("buySubmit").setAttribute("disabled","disabled");
    //document.getElementById("validateMessage").style.color = "red"
    // Added ny Andreas for better styling of alerts
    document.getElementById("validateMessage").classList.add("no-go");
    document.getElementById("validateMessage").classList.remove("go");
    document.getElementById("validateMessage").innerText =  "Eth amount cannot be 0 or greater than .5 per wallet"
  }
  } else { //crowdsale is not open yet
    document.getElementById("validateMessage").classList.add("no-go");
    document.getElementById("validateMessage").classList.remove("go");
    document.getElementById("validateMessage").innerText =  "Crowdsale isn't live yet!"
  }
  }
  });

  

  


};

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

function ClearBuyOrder() {
  document.getElementById("showLoading").style.display = 'none';
  document.getElementById("buySubmit").removeAttribute("disabled");
  /*document.getElementById("troubleshooting").style.display = 'block';*/
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", getDisconnect);


});
