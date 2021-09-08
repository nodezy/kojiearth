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

    <title>$KOJI Airdrop - koji.earth</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="apple-touch-icon" sizes="180x180" href="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/favicon-16x16.png">

    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="anonymous">  
    <link rel="preload" as="font" href="<?php echo $font_khand_300; ?>" as="font/woff2" crossorigin="anonymous"><link rel="preload" as="font" href="<?php echo $font_khand_500; ?>" as="font/woff2" crossorigin="anonymous"><link rel="preload" as="font" href="<?php echo $font_khand_700; ?>" as="font/woff2" crossorigin="anonymous">
    <style>@font-face {font-family: 'Khand';font-style: normal;font-weight: 300;src: local(''),url('<?php echo $font_khand_300; ?>') format('woff2');}@font-face {font-family: 'Khand';font-style: normal;font-weight: 500;src: local(''),url('<?php echo $font_khand_500; ?>') format('woff2');}@font-face {font-family: 'Khand';font-style: normal;font-weight: 700;src: local(''),url('<?php echo $font_khand_700; ?>') format('woff2');}</style>

 
    <link rel='stylesheet' id='styles-vendors-css' href='assets/css/style.min.css?ver=765tr' type='text/css' media='all' />

    <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-QDGJHBT4V9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-QDGJHBT4V9');
    </script> -->

  </head>

  <body>

    <div id="page" class="disconnected">
    <div id="header-dots" class="particles layer"></div>

    <div class="row red face small">

      <div class="inner-wrapper">
          <div class="koji-face-bg"><img src="assets/imgs/koji-face-new-2.svg" width="800" height="1094" /></div>
      </div>

    </div>
      

      <div id="header">
      
      
        <div id="header-top">

        

          <div class="inner-wrapper">

            <h1>
              <img class="koji-nft" src="assets/imgs/koji-nft-type.svg" /> 
            </h1>


          </div><!-- .inner-wrapper -->

        </div><!-- #header-top -->



      </div><!-- #header -->


      <div id="content">
       
    
      <div id="prepare">    


        <div class="inner-wrapper">


          <div class="ui-wrapper my-wallet ">

            <span class="ui-title"><i class="icon-wallet1"></i>Gas Airdrop</span>

            <div class="ui-box wallet-info">

            <p>Your gas airdrop has been sent to the network at tx hash <span style="word-break:break-word"><a href="https://testnet.bscscan.com/tx/<?php echo $_REQUEST['tx']; ?>" target="_blank"><?php echo $_REQUEST['tx'];?></a></span>. Please be patient while the network confirms the transaction.</p>
            
            <p>You may now go back to your wallet to continue minting your NFT. </p>

              <div class="alert alert-warning mb0">
                <div class="alert-container">
                  <div class="alert-icon">
                    <i class="icon-exclamation-triangle"></i>
                  </div>
                  <span class="alert-msg">
                  <span class="alert-title">Important:</span> 
                    If for some reason you did not recieve the .004 BNB to mint your NFT, please reach out to an admin in our <a href="https://t.me/kojiearth" target="_blank">telegram channel</a> and reference the above tx hash.
                  </span>
                </div>
              </div>

            </div>

          </div><!-- .ui-wrapper.my-wallet -->


        </div><!-- .inner-wrapper -->

      </div><!-- #prepare -->

      
    </div><!-- #content -->



    <!-- <div class="row white">

      <div class="inner-wrapper">


      <blockquote class="clearfix" ><i class="icon-quote-left1"></i> Just an Alien helping Earth!</blockquote> 

      </div>
    </div> -->



    <div id="footer" class="clearfix" style="padding-top:50px">



      <div class="inner-wrapper">

        <div class="info-ul ul-wrapper">



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


            <li class="title small">Downloads</li>

            <li class="small">
                <a class="no-loader" href="https://koji.earth/download/KOJI-whitepaper-2021.pdf" target="_blank">
                    <i class="icon-file-download"></i> <span>Whitepaper</span>
                </a>
            </li>
            <li class="small">
                <a class="no-loader" href="https://koji.earth/download/KOJI-fairpaper.pdf" target="_blank">
                    <i class="icon-file-download"></i> <span>Fairpaper</span>
                </a>
            </li>
            <li class="small">
                <a class="no-loader" href="https://koji.earth/download/KOJI-whitepaper-chinese.pdf" target="_blank">
                    <i class="icon-file-download"></i> <span>白皮书</span>
                </a>
            </li>
            <li class="small">
                <a class="no-loader" href="https://koji.earth/download/KOJI-token-audit-by-solidproof.pdf" target="_blank">
                    <i class="icon-file-download"></i> <span>Audit by Solidproof</span>
                </a>
            </li>  
            <li class="small">
                <a class="no-loader" href="https://koji.earth/download/KOJI-token-audit-by-soken.pdf" target="_blank">
                    <i class="icon-file-download"></i> <span>Audit by Soken</span>
                </a>
            </li>  
            <li class="small">
                <a class="no-loader" href="https://koji.earth/download/KOJI-token-audit-by-techrate-org.pdf" target="_blank">
                    <i class="icon-file-download"></i> <span>Audit by Techrate</span>
                </a>
            </li>  

          </ul>

          

          <ul class="docs">            
    <li class="title">Resources</li>

    <li>
        <a class="no-loader" href="https://coinmarketcap.com/currencies/koji/" target="_blank">
        <i class="icon-cmc svg"><img src="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/icon-cmc.svg" title="coinmsrketcap" /></i> <span>CoinMarketCap</span>
        </a>
    </li> 
    <li>
        <a class="no-loader" href="https://www.coingecko.com/en/coins/koji" target="_blank">
        <i class="icon-cg svg"><img src="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/icon-cg-white.svg" title="coingecko" /></i> <span>Coingecko</span>
        </a>
    </li> 
    <li>
        <a class="no-loader" href="https://www.dextools.io/app/uniswap/pair-explorer/0x42bf256e027f9d81f132a87881d2ca8d0615ba01" target="_blank">
        <i class="icon-dex png"><img src="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/icon-dex.png" title="dextool" /></i> <span>Dextools</span>
        </a>
    </li> 
    <li>
        <a class="no-loader" href="https://www.feixiaohao.com/currencies/koji/" target="_blank">
        <i class="icon-fx png"><img src="https://koji.earth/wp-core/wp-content/themes/koji.earth/assets/imgs/icon-fx.png" title="fx" /></i> <span>Fei Xiaohao - 非小号</span>
        </a>
    </li> 
    <li>
        <a class="no-loader" href="https://etherscan.io/address/0x1c8266a4369af6d80df2659ba47b3c98f35cb8be#code" target="_blank">
            <i><?php echo $et_logo; ?></i> <span>Contract on Etherscan</span>
        </a>
    </li>
    <li>
        <a class="no-loader" href="https://etherscan.io/token/0x1c8266a4369af6d80df2659ba47b3c98f35cb8be" target="_blank">
            <i><?php echo $et_logo; ?></i> <span>Token on Etherscan</span>
        </a>
    </li>  

   
    <li>
        <a class="no-loader" href="https://github.com/nodezy/kojiearth" target="_blank">
            <i class="icon-github"></i> <span>Code on GitHub</span>
        </a>
    </li>     

</ul>




<ul class="docs large">            
    <li class="title">Downloads</li>
  
    <li>
        <a class="no-loader" href="https://koji.earth/download/KOJI-whitepaper-2021.pdf" target="_blank">
            <i class="icon-file-download"></i> <span>Whitepaper</span>
        </a>
    </li>
    <li>
        <a class="no-loader" href="https://koji.earth/download/KOJI-fairpaper.pdf" target="_blank">
            <i class="icon-file-download"></i> <span>Fairpaper</span>
        </a>
    </li>
    <li>
        <a class="no-loader" href="https://koji.earth/download/KOJI-whitepaper-chinese.pdf" target="_blank">
            <i class="icon-file-download"></i> <span>白皮书</span>
        </a>
    </li>
    <li>
        <a class="no-loader" href="https://koji.earth/download/KOJI-token-audit-by-solidproof.pdf" target="_blank">
            <i class="icon-file-download"></i> <span>Audit by Solidproof</span>
        </a>
    </li>  
    <li>
        <a class="no-loader" href="https://koji.earth/download/KOJI-token-audit-by-soken.pdf" target="_blank">
            <i class="icon-file-download"></i> <span>Audit by Soken</span>
        </a>
    </li>  
    <li>
        <a class="no-loader" href="https://koji.earth/download/KOJI-token-audit-by-techrate-org.pdf" target="_blank">
            <i class="icon-file-download"></i> <span>Audit by Techrate</span>
        </a>
    </li>   
    


    

</ul>



        </div><!-- .ul-wrapper -->


      </div><!-- .inner-wrapper -->


    </div><!-- #footer -->
      

    </div><!-- #page -->




  </body>
</html>
}
?>



