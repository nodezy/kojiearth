<?php
// Start the session
// session_start();

include 'inc/header.php';


?>

<script>    

    function openAlert(type, title, message) {

        var random1 = btoa(Math.random()).slice(0, 6);
        var random2 = btoa(Math.random()).slice(0, 6);
        var ui_alerts = document.getElementById('ui-alert-floats');
        ui_alerts.insertAdjacentHTML('afterbegin', '<div id="'+random1+'" class="alert alert-'+type+' inner-wrapper"><a class="close-btn" href="#" onclick="closeAlert(this);return false;"><i class="far fa-times"></i></a><div class="spacer"><div id="'+random2+'" class="alert-container"><div class="alert-icon"><i class="icon-info-circle2"></i></div><span class="alert-msg"><span class="alert-title">'+title+':</span> <span id="info-msg" style="word-break:break-all">'+message+'</span></span></div></div></div>');
        var target1 = document.getElementById(random1);
        var target2 = document.getElementById(random2).style;
        target2.opacity = 1;
            function fade(){target2.opacity-=.005}
             var fade_elm = window.setInterval(function () {
                    //console.log('fade called');
                    fade();
                },100);
        var clear_elm = window.setTimeout(function () {
            clearInterval(fade_elm);
            target1.remove();
            clearTimeout(clear_elm);
        },15000);
    }

    /*
    function openSuccessAlert() {
        var ui_alerts = document.getElementById('ui-alert-floats');
        ui_alerts.insertAdjacentHTML('afterbegin', '<div class="alert alert-success inner-wrapper"><a class="close-btn" href="#" onclick="closeAlert(this);return false;"><i class="far fa-times"></i></a><div class="spacer"><div class="alert-container"><div class="alert-icon"><i class="icon-check"></i> </div> <span class="alert-msg"><span class="alert-title">Success alert:</span> Nice work! Didn\'t think it would work but it did, lucky bastard... </span></div></div></div>');
    }

    function openWarningAlert() {
        var ui_alerts = document.getElementById('ui-alert-floats');
        ui_alerts.insertAdjacentHTML('afterbegin', '<div class="alert alert-warning inner-wrapper"><a class="close-btn" href="#" onclick="closeAlert(this);return false;"><i class="far fa-times"></i></a><div class="spacer"><div class="alert-container"><div class="alert-icon"><i class="fas fa-exclamation-circle"></i></div><span class="alert-msg"><span class="alert-title">Important:</span> This is quite imtportent you should probably write it down...</span></div></div></div>');
    }
 
    function openErrorAlert() {    
        var ui_alerts = document.getElementById('ui-alert-floats');    
        ui_alerts.insertAdjacentHTML('afterbegin', '<div class="alert alert-danger inner-wrapper"><a class="close-btn" href="#" onclick="closeAlert(this);return false;"><i class="far fa-times"></i></a><div class="spacer"><div class="alert-container"><div class="alert-icon"> <i class="icon-exclamation-triangle"></i></div><span class="alert-msg"><span class="alert-title">Danger alert:</span> Damn man! You messed something up, better not try again...</span></span></div></div></div>');
    }   
    */

    function closeAlert(element) {
         //edited by Nodezy
        //element.parentElement.classList.add('close');
        setTimeout(function() {
            //edited by Nodezy
            element.parentElement.remove();
            //element.parentElement.classList.add('remove');
        }, 500)
    }

</script>

<div class="inner-wrapper" style="display:none"><small>Open floating alerts: <a href="#" onclick="openAlert('success', 'Transaction Completed', 'Success!')">success</a> | <a href="#" onclick="openAlert('info', 'Transaction Submitted', 'Info!')">info</a> | <a href="#" onclick="openAlert('warning', 'Transaction Reverted', 'Warning!')">warning</a> | <a href="#" onclick="openAlert('danger', 'Transaction Failed!', 'Reverted!')">error</a></small></div>

   
      <div id="prepare">    


        <div class="inner-wrapper">


        <?php include 'inc/wallet-not-con.php'; ?>

        </div><!-- .inner-wrapper -->

      </div><!-- #prepare -->



      <div id="disconnected">

        <div class="inner-wrapper">           
        </div>

      </div><!-- #disconnected -->       



      <div id="connected" style="display: none">
        <div class="inner-wrapper">

          <div id="incorrectalert" class="alert alert-warning mb0">
            <div class="alert-container">
                <div class="alert-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <span class="alert-msg">
                    <span class="alert-title">Alert:</span>
                    You are connected to the wrong network. Please connect to the Binance Smart Chain network.
                </span>
            </div>
          </div>

           <!-- UI row with 2 column ------------------------------------------------------------>

    <div class="ui-wrapper">

        <span class="ui-title"><i class="far fa-chart-area"></i><strong>KOJI</strong> Price & Chart</span>

        
        
        <div class="ui-row price-chart col-2">
        
        <div class="ui-col price">
        <span id="update-price" class="ui-loader"></span>
        
         
                <div class="ui-box bottom-btn">
                    

                    <div class="data-row main clearfix">
                                <div class="title">KOJI/USD:</div>
                                <div class="value">$<span class="" id="koji-usd"></span></div>
                    </div>

                    <div class="data-row main clearfix">
                                <div class="title">KOJI/BNB</div>
                                <div class="value"><span class="" id="koji-bnb"></span> BNB</div>
                                <input type="hidden" id="koji-bnb-unrounded" value="" />
                    </div>

                    <div class="data-row bnb clearfix">
                                <div class="title">BNB/USD:</div>
                                <div class="value">$<span class=""  id="bnb-usd"></span></div>
                    </div>

                    <span class="ui-note">* Price data is updated every 15 seconds, please note there may be a slight delay/difference between price data and chart</span>
                    <a href="https://pcs.nhancv.com/#/swap?outputCurrency=0xE0c010C702939B1881728Ee258038d3F65840264">
                    <button type="button" class="btn btn-sep green">
                        <div><i class="far fa-coin"></i></div>
                        <span>Buy <strong>Koji</strong></span>
                    </button>
                    </a>

                </div>

            </div>

            <div class="ui-col chart">
                <div class="ui-box">


                        
                        <!-- TradingView Widget BEGIN -->
                          <div class="tradingview-widget-container">
                            <div id="tradingview_192fb"></div>
                            <div class="tradingview-widget"></div>
                            <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
                            <script type="text/javascript">
                            new TradingView.widget(
                            {
                            "autosize": true,
                            "symbol": "BINANCE:BNBUSD",
                            "interval": "5",
                            "timezone": "Etc/UTC",
                            "theme": "dark",
                            "style": "3",
                            "locale": "en",
                            "toolbar_bg": "#f1f3f6",
                            "enable_publishing": false,
                            "hide_top_toolbar": true,
                            "container_id": "tradingview_484b0"
                          }
                            );
                            </script>
                          </div>
                          <!-- TradingView Widget END -->
             


                </div>
            </div>

        </div><!-- .ui-row -->

        

    </div><!-- .ui-wrapper -->


          <!-- UI row with 1 column ------------------------------------------------------------>

            <div class="ui-wrapper">

                <span class="ui-title"><i class="far fa-wallet"></i>Tokenomics & Wallet Info</span>

                <div class="ui-row col-3">

                	<div class="ui-col">
                        <div class="ui-box">
                            <div class="data-row" style="flex:100%">
                                <div class="title">Tax per Buy/Sell:</div>
                                <div class="value"><center><span id="tax">6% KOJI <i class="far fa-arrow-right"></i> 84% BNB / 16% KOJI Burn <i class="far fa-fire" style="color:orange"></i></span></center></div>
                            </div>

                            <div class="data-row" style="width:44%;float:left">
                                <div class="title">Dividends:</div>
                                <div class="value"><span id="burn">84% BNB = 100% Divs</span></div>
                            </div>

                           <div class="data-row" style="width:44%; float:right; display:inline-block;">
                                <div class="title">Divs To Holders:</div>
                                <div class="value"><center><span id="holders">40% <i class="far fa-user" style="color:blue"></i></span></center></div>
                            </div>

                            <div class="data-row" style="width:44%;float:left">
                                <div class="title">Divs To Pool:</div>
                                <div class="value"><center><span id="pool">15% <i class="far fa-tint" style="color:yellow"></i></span></center></div>
                            </div>

                             <div class="data-row" style="width:44%; float:right; display:inline-block;">
                                <div class="title">Divs To Charity:</div>
                                <div class="value"><center><span id="charity">15% <i class="far fa-gift" style="color:green"></i></span></center></div>
                            </div>

                            <div class="data-row" style="width:44%;float:left">
                                <div class="title">Divs To Admin/Staking: </div>
                                <div class="value"><center><span id="admin">15% <i class="far fa-tree" style="color:grey"></i></span></center></div>
                            </div>

                             <div class="data-row" style="width:44%; float:right; display:inline-block;margin-bottom: 10px">
                                <div class="title">Divs To NFT Rewards: </div>
                                <div class="value"><center><span id="nft">15% <i class="far fa-image" style="color:red"></i></span></center></div>
                            </div>

                            
                        </div>
                    </div>

                    <div class="ui-col">
                        <div class="ui-box">
                            <div class="data-row clearfix">
                                <div class="title">My Network: </div>
                                <div class="value"><span id="network-name" style="float:right"></span></div>
                            </div>

                            <div class="data-row clearfix" style="line-height: 26px">
                                <div class="title">My Address:</div>
                                <div class="value"><span class="my-address">
                                	<span id="selected-account"></span><i class="fas fa-copy to-clipboard" data-clipboard-target="#selected-account"></i></span></div>
                            </div>

                            <div class="data-row clearfix" style="line-height: 26px">
                                <div class="title">My BNB balance:</div>
                                <div class="value"><span id="account-balance" style="float:right"></span></div>
                            </div>

                            
                        </div>
                    </div>

                    <div class="ui-col">
                        <div class="ui-box">
                          
                          <div id="ineligible" class="alert alert-warning mb0" style="margin-bottom:5px !Important; display:none;">
				            <div class="alert-container">
				                <div class="alert-icon">
				                    <i class="fas fa-exclamation-circle"></i>
				                </div>
				                <span class="alert-msg">
				                    <span class="alert-title">Important:</span>
				                    <span class="iu-note">You must hold minimum <span id="minhold"></span> KOJI to receive dividends!</span>
				                </span>
				            </div>
				          </div>
                          
                          <div class="data-row main clearfix" style="line-height: 26px">
                                <div class="title">My KOJI balance:</div>
                                <div class="value"><span id="koji-balance" style="float:right"></span></div>
                          </div>

				          <div id="eligible" class="alert alert-success mb0" style="margin-bottom:5px !Important; margin-top:5px !Important;padding:10px">
				            <div class="alert-container">
				                <div class="alert-icon">
				                    <i class="icon-check"></i>
				                </div>
				                <span class="alert-msg">
				                    <span class="iu-note">You are receiving dividends.</span>
				                </span>
				            </div>
				          </div>

                            <div class="data-row main clearfix" style="line-height: 26px">
                                <div class="title">My BNB Dividends:</div>
                                <div class="value"><span style="float:right"><span id="koji-divs"></span>&nbsp;&nbsp;<span id="koji-divs-usd" style='color:#20b23f6e;'></span></span>
                                    <input type="hidden" id="koji-divs-unrounded" value=""/></div>
                            </div>

                            <div id="eligible-info" class="alert alert-info mb0" style="margin-bottom:5px !Important; margin-top:5px !Important;padding:10px">
				            <div class="alert-container">
				                <div class="alert-icon">
				                    <i class="fas fa-exclamation-circle"></i>
				                </div>
				                <span class="alert-msg">
				                    <span class="iu-note">Dividends are distributed on sells only.</span>
				                </span>
				            </div>
				        </div>


                        </div>
                    </div>

                    </div><!-- .ui-row -->


                
</div><!-- .ui-wrapper -->

<div class="ui-wrapper">

<span class="ui-title"><i class="far fa-sack-dollar"></i>Reinvest or withdraw your dividends</span>
                    



                    <div class="ui-row col-2" style="min-height:270px;">

                    <div class="ui-col">
                    <span id="withdraw-loader" class="ui-loader"></span>
                        <div class="ui-box bottom-btn">
                            <div class="ui-slider withdraw" style="margin:10px 0;">

                                <script>
                                    function outputUpdate(amount) {
                                        document.querySelector('#amount').value = amount;
                                    }
                                </script>

                                <label for="slider" style="display: block;margin:0px"><i class="far fa-sliders-h"></i>
                                    Withdraw <strong><output for="slider" id="amount">100</output>%</strong> of your pending dividends.</label>
                                <input type="range" id="slider" min="25" max="100" value="100" step="25"
                                    aria-valuemin="25" aria-valuemax="100" aria-valuenow="100"
                                    oninput="outputUpdate(value)">

                            </div>
            


                            <div class="clearfix"><br></div>
                            <div class="data-row"><center><span id="withdraw-divs" style="font-size:xx-large; color:orange"></span> <span style="font-size:xx-large;">BNB</span></center></div>
                            <div class="clearfix"><br></div>
                            <button id="withdraw-btn" type="button" class="btn btn-sep bottom disabled" style="background-color: orange">
                                <div><i class="icon-external-link"></i></div>
                                <span><strong>Withdraw</strong></span>
                            </button>
                        </div>
                    </div>

            <div class="ui-col reinvest">
                <span id="reinvest-loader" class="ui-loader"></span>
                <div class="ui-box bottom-btn">

                    <div class="ui-slider" style="margin:10px 0;">

                        <script>
                            function outputUpdate2(amount) {
                                document.querySelector('#amount2').value = amount;
                            }
                        </script>

                        <label for="slider2" style="display: block;float:left; margin:0px"><i class="far fa-sliders-h"></i>
                            Reinvest <strong><output for="slider2" id="amount2">100</output>%</strong> of your pending dividends.</label>
                        <label style="display:inline;float:right;"><span id="ri-equivalent" style="font-size:x-small"></span> <span style="font-size:x-small">BNB</span></label>
                        <input type="range" id="slider2" min="25" max="100" value="100" step="25"
                            aria-valuemin="25" aria-valuemax="100" aria-valuenow="100"
                            oninput="outputUpdate2(value)">

                    </div>
                    

                    

                    <div class="clearfix"><center><span class="ui-note" style="margin-bottom:10px; margin-top:-5px">*Reinvesting places a market order at the current price; the KOJI amount is estimated.</span></center></div>
                    <div class="data-row"><center><span id="koji-reinvested" style="font-size:xx-large; color:#20b23f6e"></span> <span style="font-size:xx-large;">KOJI</span></center></div>
                    <div class="clearfix"><center><span id="reinvest-alert" style="color:red"></span></center></div>
                    <p style="display: none"><font style="font-size:x-small;"><em>*Reinvest uses high slippage to make sure the order goes through, however there is no guarantee of the resulting amount. If you are concerned with slippage please withdraw your dividends first and use the "BUY KOJI" button above to place your order.</em></font></p>
                    <button id="reinvest-btn" type="button" class="btn btn-sep bottom disabled" style="background-color: #20b23f6e">
                        <div><i class="icon-external-link"></i></div>
                        <span><strong>Reinvest</strong></span>
                    </button>
                </div>
                

            </div>

                </div><!-- .ui-row -->


                
            </div><!-- .ui-wrapper -->

            <!-- UI row with 2 column ------------------------------------------------------------>

            <div class="ui-wrapper">

                <span class="ui-title"><i class="far fa-list"></i>Stats & Team Wallet Info</span>

                <div class="ui-row col-2">

                    <div class="ui-col">
                        <div class="ui-box">  
                          <p>Stats & Info:</p>

                          <div class="data-row clearfix">
                                <div class="title">Market Capitalization: </div>
                                <div class="value"><span id="market-cap" style="float:right"></span></div>
                            </div>

                            <div class="data-row clearfix">
                                <div class="title">Total KOJI in Circulation: </div>
                                <div class="value"><span id="total-circ" style="float:right"></span></div>
                            </div>

                            <div class="data-row clearfix">
                                <div class="title">Total KOJI burned:</div>
                                <div class="value"><span id="total-burn" style="float:right"></span></div>
                            </div>

                            <div class="data-row clearfix">
                                <div class="title">Total WBNB added to pool:</div>
                                <div class="value"><span id="total-wbnb-added" style="float:right"></span></div>
                            </div>

                            <div class="data-row clearfix">
                                <div class="title">Total dividends distributed:</div>
                                <div class="value"><span id="total-divs" style="float:right"></span></div>
                            </div>

                            <div class="data-row clearfix">
                                <div class="title">Total divs reinvested:</div>
                                <div class="value"><span id="total-reinvest" style="float:right"></span></div>
                            </div>

                            <div class="data-row clearfix">
                                <div class="title">Total divs withdrawn:</div>
                                <div class="value"><span id="total-withdraw" style="float:right"></span></div>
                            </div>

                            
                        </div>
                    </div>

                    <div class="ui-col">
                        <div class="ui-box">
                            <p>Team wallets:</p>
                            
                            <div class="data-row clearfix">
                                <div class="title">Charity Wallet: <span class="contract-address" style="float:right; color:white"><span
                                    id="charity-address" ></span><i
                                    class="fas fa-copy to-clipboard" data-clipboard-target="#charity-address"></i></span></div><br>
                                
                                <div class="title">Total BNB dividends: <span id="charity-divs" style="float:right; color:white"></span></div>
                                <div class="title">Current Balance: <span id="charity-balance" style="float:right; color:white"></span></div>
                                <div class="title">Total Donated: <span id="donated" style="float:right"><a href="https://koji.earth/charity" target="_blank">$36,679</a></span></div>
                            </div>
                            <div class="data-row clearfix">
                                <div class="title">Admin Wallet: <span class="contract-address" style="float:right; color:white"><span
                                    id="admin-address" ></span><i
                                    class="fas fa-copy to-clipboard" data-clipboard-target="#admin-address"></i></span></div><br>
                                
                                <div class="title">Total BNB dividends: <span id="admin-divs" style="float:right; color:white"></span></div>
                                <div class="title">Current Balance: <span id="admin-balance" style="float:right; color:white"></span></div>
                            </div>
                            <div class="data-row clearfix">
                                <div class="title">NFT Rewards Wallet: <span class="contract-address" style="float:right; color:white"><span
                                    id="nft-address" ></span><i
                                    class="fas fa-copy to-clipboard" data-clipboard-target="#nft-address"></i></span></div><br>
                                
                                <div class="title">Total BNB dividends: <span id="nft-divs" style="float:right; color:white"></span></div>
                                <div class="title">Current Balance: <span id="nft-balance" style="float:right; color:white"></span></div>
                            </div>
                            <div class="data-row clearfix">
                                <div id="poolActive" style="display:none">
                                    <div class="title">Stake Pool Wallet: <span class="contract-address" style="float:right; color:white"><span
                                        id="stake-address1" ></span><i
                                        class="fas fa-copy to-clipboard" data-clipboard-target="#stake-address1"></i></span></div><br>
                                    
                                    <div class="title">Total BNB dividends: <span id="stake-divs" style="float:right; color:white"></span></div>
                                    <div class="title">Current Balance: <span id="stake-balance" style="float:right; color:white"></span></div>
                                </div>
                                <div id="poolInactive" style="display:none">
                                    <div class="title">Stake Pool Wallet: <span class="contract-address" style="float:right; color:white"><span
                                        id="stake-address2" ></span><i
                                        class="fas fa-copy to-clipboard" data-clipboard-target="#stake-address2"></i></span></div>
                                    <div class="alert alert-info">
                                        <div class="alert-container">
                                        <div class="alert-icon">
                                        <i class="icon-info-circle2"></i>
                                        </div>
                                            <span class="alert-msg">
                                            <span class="alert-title">Staking Pool is currently inactive</span>
                                            
                                            </span>
                                        </div>
                                    </div>
                                </div> <!--poolInactive-->
                            </div>
                        </div>
                    </div>

                    </div><!-- .ui-row -->
                </div><!-- .ui-wrapper -->

        </div><!-- .inner-wrapper -->
      </div><!-- #connected -->


<?php

include 'inc/footer.php';

?>




    


