<?php
// Start the session
// session_start();

include 'inc/header.php';


?>

    <div id="content-wrapper">

        <div id="prepare">     

            <?php include 'inc/wallet-not-con.php'; ?>       

        </div>


        <div id="disconnected"></div> 


        <div id="connected" style="display: none">         
              
            <div id="incorrectalert" class="ui-wrapper mt20 mb20">
                <div class="alert alert-warning mt0 mb0">
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
            </div>


            <div class="tabs tab-content">

                <span id="tab-loader" class="ui-loader hide"></span>

                <!-- token tab ------------------------------------------------------------>
                <div id="token-tab" class="tab active">

                    <?php include 'tab-token.php'; ?>

                </div>


                <!-- staking tab ------------------------------------------------------------>
                <div id="staking-tab" class="tab">

                    <?php include 'tab-staking.php'; ?>

                </div>


                <!-- NFT tab ------------------------------------------------------------>
                <div id="nft-tab" class="tab">

                    <?php include 'tab-nft.php'; ?>

                </div>


                <!-- tax & team wallet tab ------------------------------------------------------------>
                <div id="tax-wallets-tab" class="tab">

                    <?php include 'tab-tokenomics.php'; ?>

                </div>

            </div><!-- .tabs.tabs-content -->

        
        </div><!-- #connected -->

    </div><!-- #content-wrapper -->


<?php

include 'inc/footer.php';

?>
