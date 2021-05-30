<?php
// Start the session
session_start();


$font_khand_300 = "https://fonts.gstatic.com/s/khand/v9/TwMN-IINQlQQ0bL5cGEwbQc.woff2"; 
$font_khand_500 = "https://fonts.gstatic.com/s/khand/v9/TwMN-IINQlQQ0bKhcWEwbQc.woff2"; 
$font_khand_700 = "https://fonts.gstatic.com/s/khand/v9/TwMN-IINQlQQ0bLpd2EwbQc.woff2"; 

$et_logo = '<svg class="es-logo" xmlns="http://www.w3.org/2000/svg" width="293.775" height="293.667" viewBox="0 0 293.775 293.667"> <g id="etherscan-logo-light-circle" transform="translate(-219.378 -213.333)"> <path id="Path_1" data-name="Path 1" d="M280.433,353.152A12.45,12.45,0,0,1,292.941,340.7l20.737.068a12.467,12.467,0,0,1,12.467,12.467v78.414c2.336-.692,5.332-1.43,8.614-2.2a10.389,10.389,0,0,0,8.009-10.11V322.073a12.469,12.469,0,0,1,12.467-12.47h20.779a12.47,12.47,0,0,1,12.467,12.47v90.276s5.2-2.106,10.269-4.245a10.408,10.408,0,0,0,6.353-9.577V290.9a12.466,12.466,0,0,1,12.465-12.467h20.779A12.468,12.468,0,0,1,450.815,290.9v88.625c18.014-13.055,36.271-28.758,50.759-47.639a20.926,20.926,0,0,0,3.185-19.537,146.6,146.6,0,0,0-136.644-99.006c-81.439-1.094-148.744,65.385-148.736,146.834a146.371,146.371,0,0,0,19.5,73.45,18.56,18.56,0,0,0,17.707,9.173c3.931-.346,8.825-.835,14.643-1.518a10.383,10.383,0,0,0,9.209-10.306V353.152" transform="translate(0 0)" fill="#999"/> <path id="Path_2" data-name="Path 2" d="M244.417,398.641A146.808,146.808,0,0,0,477.589,279.9c0-3.381-.157-6.724-.383-10.049-53.642,80-152.686,117.405-232.79,128.793" transform="translate(35.564 80.269)" fill="#999"/> </g> </svg>';


?>
<html>
  <head>

    <title>$KOJI Team Vesting</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="apple-touch-icon" sizes="180x180" href="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/favicon-16x16.png">

    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="anonymous">  
    <link rel="preload" as="font" href="<?php echo $font_khand_300; ?>" as="font/woff2" crossorigin="anonymous"><link rel="preload" as="font" href="<?php echo $font_khand_500; ?>" as="font/woff2" crossorigin="anonymous"><link rel="preload" as="font" href="<?php echo $font_khand_700; ?>" as="font/woff2" crossorigin="anonymous">
    <style>@font-face {font-family: 'Khand';font-style: normal;font-weight: 300;src: local(''),url('<?php echo $font_khand_300; ?>') format('woff2');}@font-face {font-family: 'Khand';font-style: normal;font-weight: 500;src: local(''),url('<?php echo $font_khand_500; ?>') format('woff2');}@font-face {font-family: 'Khand';font-style: normal;font-weight: 700;src: local(''),url('<?php echo $font_khand_700; ?>') format('woff2');}</style>

 
    <link rel='stylesheet' id='styles-vendors-css' href='assets/css/style.min.css' type='text/css' media='all' />

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QDGJHBT4V9"></script>
    <!-- <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-QDGJHBT4V9');
    </script> -->

  </head>

  <body>

    <div id="page" class="disconnected">


    <div class="row red face small">

      <div class="inner-wrapper">
          <div class="koji-face-bg"><img src="assets/imgs/koji-face.svg" width="800" height="1094" /></div>
      </div>

    </div>
      

      <div id="header">

        <div id="header-top">

          <div class="inner-wrapper">

            <h1><strong>KOJI</strong><small>public sale</small>
              <!-- <img class="koji-face" src="assets/imgs/koji-face.svg" width="51" height="70" /> -->
            </h1>

            <div class="buttons">

              <button class="btn btn-sep connect" id="btn-connect">              
                <div><i class="icon-wallet1"></i><i class="icon-plus"></i></div>
                <span>connect</span> <span>wallet</span>              
              </button>
        
              <button class="btn btn-sep disconnect" id="btn-disconnect" style="display: none">
                <div><i class="icon-wallet1"></i><i class="icon-minus"></i></div>
                <span>disconnect</span> <span>wallet</span>   
              </button>

            </div><!-- .buttons -->

          </div><!-- .inner-wrapper -->

        </div><!-- #header-top -->


        <div id="connection-status" class="connection-status clearfix">

          <div class="inner-wrapper">
            <span class="status-text">
              <span id="web3-wallet">
                <div class="dot-container">
                  <div class="dot red"></div>
                </div>
                Web3 wallet: <strong>not connected</strong>
              </span>
            </span> 

          </div>

        </div><!-- #connection-status-->

      </div><!-- #header -->



      <div id="content">
        
    
      <div id="prepare">    


        <div class="inner-wrapper">

        
          <div class="ui-wrapper my-wallet ">

            <span class="ui-title"><i class="icon-wallet1"></i>My wallet</span>

            <div class="ui-box wallet-info">

            <p>No wallet is connected, please connect your wallet to see your vested tokens.</p>
            
            <p>Supported wallets for PC/MAC is <strong>Browser + Metamask Extension</strong> and on mobile <strong>MetaMask</strong> and <strong>TrustWallet</strong></p>

              <div class="alert alert-warning mb0">
                <div class="alert-container">
                  <div class="alert-icon">
                    <i class="icon-exclamation-triangle"></i>
                  </div>
                  <span class="alert-msg">
                  <span class="alert-title">Important:</span> 
                    If you're on mobile please only use the DApp Browser <em>(the built-in browser in MetaMask & TrustWallet)</em> as other methods are not fully supported.
                  </span>
                </div>
              </div>

            </div>

          </div><!-- .ui-wrapper.my-wallet -->





        </div><!-- .inner-wrapper -->

      </div><!-- #prepare -->



      <div id="connected" style="display: none">




        <div class="inner-wrapper">
          


          <div class="ui-wrapper my-wallet details">
            <span class="ui-title"><i class="icon-wallet1"></i>My wallet</span>
            <div class="ui-box wallet-info">

              <div class="wallet-row clearfix">
                <div class="title">My Network: </div>
                <div class="value"><span id="network-name">Web3 not connected.</span></div>
              </div>

              <div class="wallet-row clearfix">
                <div class="title">My Address:</div>
                <div class="value"><span id="my-address" class="contract-address">Web3 not connected.</span></div>
              </div>

              <div class="wallet-row clearfix">
                <div class="title">My ETH balance:</div>
                <div class="value"><span id="my-eth-balance">Web3 not connected.</span></div>
              </div>

              <div class="wallet-row clearfix">
                <div class="title">Proxy Vesting Contract:</div>
                <div class="value"><span id="proxyaddress">Web3 not connected.</span></div>
              </div>


            </div>
          </div><!-- .ui-wrapper.my-wallet -->

          <div class="stat-bars" style="display:none">

          <span class="title">KOJIs stil available:</span>
          <div class="koji bar">
            <div id="remainingPercent" class="bar-bg" style="width:50%;"></div>
            <div id="remaining" class="amount">200,000,000,000</div>
          </div>

          <span class="title">ETH raised (of ~133 CAP):</span>
          <div class="eth bar">
            <div id="raisedPercent" class="bar-bg" style="width:50%;"></div>
            <div id="totalRaised" class="amount">60</div>
          </div>

          </div>

          

          <div id="correctnetwork" style="display:none">

            <div class="ui-wrapper my-wallet">
              <span class="ui-title"><i class="icon-network-wired2"></i>Interacting with <span id="token-name"></span>
                Vesting Contract</span>
              <div class="ui-box wallet-info clearfix">

                <div class="wallet-row clearfix">
                  <div class="title">Network: </div>
                  <div class="value"><span id="my-network">Please switch to Ethereum Mainnet!</span></div>
                </div>

                <div class="wallet-row clearfix pre-sale-address">
                  <div class="title">Contract Address:</div>
                  <div class="value">
                    <a class="contract-address"
                      href="https://etherscan.io/address/0x23DAB939B141E0480dd61dFDcFB3e06D79682476"
                      target="_blank">0x23DAB939B141E0480dd61dFDcFB3e06D79682476 <i
                        class="icon-external-link"></i></a>
                    <a class="contract-code "
                      href="https://etherscan.io/address/0x23DAB939B141E0480dd61dFDcFB3e06D79682476#contracts"
                      target="_blank">Contract Source Code <i class="icon-external-link"></i></a>
                  </div>
                </div>

                <div class="wallet-row clearfix">
                  <div class="title">Locked Duration:</div>
                  <div class="value"><span id="duration"></span></div>
                </div>

                <div class="wallet-row clearfix">
                  <div class="title">Exchange Rate:</div>
                  <div class="value"><span id="rate">Please switch to Ethereum Mainnet!</span></div>
                </div>

                <div class="wallet-row clearfix">
                  <div class="title">My wallet cap:</div>
                  <div class="value"><button id="refund" type="button" class="btn refund" style="display:none;" onclick="finalrefund()">Refund ETH</button><span id="walletCap"></span><span id="unfinalizedrf" class="" style="display:none; color:red;float:right;width:100%">Please wait until dev finalizes the sale!</span><span id="finalizedrf" class="clearfix go" style="display:none;color:green;float:right;width:100%">You may now claim your refund!</span></div>
                </div>

                <div class="wallet-row clearfix withdraw">
                  <div class="title">My KOJI purchased:</div>
                  <div class="value"><span id="my-token-balance">Please switch to Ethereum Mainnet!</span></div>
                </div>

                <button id="withdraw" type="button" class="btn btn-sep buy" style="display:none;" onclick="finalwithdraw()">                        
                    <div><i class="icon-coins"></i></div>
                    <span>Withdraw your Koji</span>
                </button>


                <div id="unfinalizedwd" class="tx-alert-box wd" style="display:none;">

                <div class="alert alert-warning">
                  <div class="alert-container">
                    <div class="alert-icon">
                      <i class="icon-exclamation-triangle"></i>
                    </div>
                    <span class="alert-msg">
                    <span class="alert-title">Not yet!</span> 
                        Please wait until sale is over and liquidity is added to Uniswap!
                    </span>
                  </div>
                </div>  
                             
              
              
              </div>
                <div id="finalizedwd" class="tx-alert-box wd" style="display:none;">
                
            
              
              <div class="alert alert-info">
                <div class="alert-container">
                  <div class="alert-icon">
                    <i class="icon-check"></i>
                  </div>
                  <span class="alert-msg">
                  <span class="alert-title">Please go ahead!</span> 
                    You may now withdraw your tokens!
                  </span>
                </div>
              </div>  
              
              
            
      
                
                
                
              
              
              
              
              </div>

                <!-- <button id="withdraw-static" type="button" class="btn btn-sep buy"  style="display:block;" onclick="finalwithdraw()">
                        <div><i class="icon-external-link"></i></div>
                        <span>Withdraw your Koji</span>
                </button> -->

              </div><!-- .ui-wrapper.my-wallet -->
            </div><!-- #buy-koji -->



          </div><!-- #correctnetwork -->


        </div><!-- .inner-wrapper -->
      </div><!-- #connected -->


    </div><!-- #content -->



    <!-- <div class="row white">

      <div class="inner-wrapper">


      <blockquote class="clearfix" ><i class="icon-quote-left1"></i> Just an Alien helping Earth!</blockquote> 

      </div>
    </div> -->



    <div id="footer" class="clearfix">



      <div class="inner-wrapper">

        <div class="ul-wrapper">



          <ul class="contact contact-large">

            <li class="title">Need Help?</li>


            <li>
              <a class="no-loader" href="https://t.me/kojiearth" target="_blank">
                <i class="icon-telegram-plane"></i> <span>Community Support</span>
              </a>
            </li>
            <li>
              <a class="no-loader" href="mailto:contact@koji.earth">
                <i class="icon-envelope"></i> <span>Contact</span>
              </a>
            </li>

          </ul>



          <ul class="docs">
            <li class="title">Resources</li>
            <li>
              <a class="no-loader" href="https://koji.earth/download/KOJI-whitepaper-2021-may.pdf" target="_blank">
              <i class="icon-file-download"></i> <span>Whitepaper</span>
              </a>
            </li>
            <li>
              <a class="no-loader" href="https://koji.earth/download/KOJI-token-audit-by-techrate-org.pdf"
                target="_blank">
                <i class="icon-file-download"></i> <span>Audit by Techrate</span>
              </a>
            </li>
            <li>
              <a class="no-loader" href="https://etherscan.io/address/0x1c8266a4369af6d80df2659ba47b3c98f35cb8be#code"
                target="_blank">
                <i><?php echo $et_logo; ?></i> <span>Contract on Etherscan</span>
              </a>
            </li>
            <li>
              <a class="no-loader"
                href="https://etherscan.io/token/0x1c8266a4369af6d80df2659ba47b3c98f35cb8be?a=0x1930f96d7aff9321836e3fbcce96b0f48dad890e"
                target="_blank">
                <i><?php echo $et_logo; ?></i> <span>Token on Etherscan</span>
              </a>
            </li>
            <li>
              <a class="no-loader" href="https://github.com/nodezy/kojiearth" target="_blank">
                <i class="icon-github"></i> <span>Code on GitHub</span>
              </a>
            </li>



          </ul>

        </div><!-- .ul-wrapper -->


      </div><!-- .inner-wrapper -->


    </div><!-- #footer -->
      

    </div><!-- #page -->


    <script src="https://unpkg.com/web3@latest/dist/web3.min.js"></script>
    <script type="text/javascript" src="https://unpkg.com/web3modal"></script>
    <script type="text/javascript" src="https://unpkg.com/@walletconnect/web3-provider"></script>
    <script type="text/javascript" src="chaindata.js"></script>
    <!-- This is our crowsdale code -->
    <script type="text/javascript" src="./getvesting.js"></script>


  </body>
</html>
<?php
if( isset($_SESSION["account"])) {
  ?>
 <script>
  onConnect();
  //call onConnect(), user has already connected wallet
 </script>
  <?php
}
?>

<script> //for disconnected countdown timer




</script>

