<?php
// Start the session
// session_start();

include 'inc/header.php';


?>



      <div id="prepare">

          <div class="inner-wrapper">

              <?php include 'inc/wallet-not-con.php'; ?>

          </div>>

      </div><!-- #prepare -->


      <div id="disconnected">

        <div class="inner-wrapper">           
        </div>

      </div><!-- #disconnected -->    



      <div id="connected" style="display: none">


          <div class="inner-wrapper">
              <div class="ui-wrapper mt20 mb20" style="display:none">

                  <div class="alert alert-warning mt0 mb0">
                      <div class="alert-container">
                          <div class="alert-icon">
                              <i class="fas fa-exclamation-circle"></i>
                          </div>
                          <span class="alert-msg">
                              <span class="alert-title">PLEASE NOTE:</span>
                              Due to a recent discovered vulnerability in our dividend distribution contract we've
                              disabled the reinvest and withdraw function, the liquidity and all team funds are safe.
                              Read our full and official statement <a
                                  href="https://koji.earth/article/statement-dividend-distribution-vulnerability">here</a>.
                          </span>
                      </div>
                  </div>
              </div>
          </div>


          <div class="inner-wrapper">

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


              <!-- request bnb for gas & registrer holdings ------------------------------------------------------------>

              <div id="registration" style="display:none" class="ui-wrapper mt40">

                  <span class="ui-title"><i class="fas fa-exclamation-circle"></i>Register your holdings <strong>for
                          dividends</strong></span>

                  <div class="ui-row col-1 full mb15">

                      <div class="ui-col">

                          <div class="ui-box">


                              <div class="alert alert-warning mt0 mb20">
                                  <div class="alert-container">
                                      <div class="alert-icon">
                                          <i class="fas fa-exclamation-circle"></i>
                                      </div>
                                      <span class="alert-msg">
                                          <span class="alert-title">Important:</span>
                                          <strong>You will not receive dividends</strong> until you've registered your
                                          holdings with the distribution contract.

                                      </span>
                                  </div>

                              </div>

                              <small>Please note that to start receiving dividends after getting the Airdrop you need to
                                  register your KOJI BSC holdings. Do so using the register button and approve the
                                  transaction in your wallet. <span id="no-gas-text">If you don't have enough BNB for
                                      gas to cover the transaction please request some below and we will Airdrop you
                                      enough for free!</span></small>


                          </div>

                      </div>

                  </div>

                  <div id="reg-div-row" class="ui-row col-2">

                      <div id="req-gas-col" class="ui-col req-gas">

                          <span id="req-gas-loader" class="ui-loader"></span>

                          <div class="ui-box">


                              <button id="req-gas-btn" type="button" class="btn yellow btn-sep" disabled>
                                  <div><i class="fas fa-gas-pump"></i></div>
                                  <span><strong>Request BNB for gas</strong></span>
                              </button>
                          </div>


                      </div>

                      <div id="reg-holdings-col" class="ui-col reg-holdings">

                          <span id="reg-holdings-loader" class="ui-loader"></span>

                          <div class="ui-box reg-holdings">


                              <button id="reg-holdings-btn" type="button" class="btn green btn-sep" disabled>
                                  <div><i class="far fa-sack-dollar"></i></div>
                                  <span><strong>Register Holdings</strong></span>
                              </button>
                          </div>
                      </div>



                  </div><!-- .ui-row -->


              </div><!-- .ui-wrapper -->


              <!-- chart -------------------------------------------------------------------->

              <div class="ui-wrapper ui-toggle hide">

                  <span class="ui-title"><i class="far fa-chart-area"></i><strong>BNB</strong> Chart

                      <span class="toggle-icon"><i class="fas fa-chevron-down"></i></span></span>

                  <div class="ui-row price-chart col-1 full ui-toggleable">

                      <div class="ui-col chart">
                          <div class="ui-box">

                              <div class="tradingview-widget-container">
                                  <div id="tradingview-chart"></div>
                                  <div class="tradingview-widget"></div>
                              </div>

                          </div>
                          <span class="ui-note">* BNB chart only for reference, will be replaced with the KOJI chart
                              asap after launch.</span>
                      </div>



                  </div><!-- .ui-row.price chart -->

              </div><!-- .ui-wrapper -->

             

              <!-- price & stats ------------------------------------------------------------>


              <div class="tabs tab-content">

                  <div id="token-tab" class="tab active">


                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-chart-bar"></i><strong>KOJI</strong> Price & Total
                              Stats</span>

                          <div class="ui-row price-stats col-2">

                              <div class="ui-col price">
                                  <span id="update-price" class="ui-loader hide"></span>

                                  <div class="ui-box bottom-btn">

                                      <div class="data-row main clearfix">
                                          <div class="title">KOJI/USD:</div>
                                          <div class="value"><span class="" id="koji-usd">-</span></div>
                                      </div>

                                      <div class="data-row main clearfix">
                                          <div class="title">KOJI/BNB:</div>
                                          <div class="value"><span class="" id="koji-bnb">-</span></div>
                                          <input type="hidden" id="koji-bnb-unrounded" value="" />
                                      </div>

                                      <div class="data-row bnb clearfix">
                                          <div class="title">BNB/USD:</div>
                                          <div class="value"><span class="" id="bnb-usd">-</span></div>
                                      </div>

                                      <span class="ui-note">* Price data is updated every 15 seconds, please note there
                                          may be a slight
                                          delay/difference between price data and chart</span>

                                      <div class="partner-discount clearfix">


                                          <span id="partner-tokens-off" class="discount off" style="display:none">

                                              <div class="data-row clearfix">
                                                  <div class="title">Partner Tokens: <a class="partners-modal-trigger"
                                                          href="#"><i class="icon-question-circle"></i></a></div>
                                                  <div class="value">disabled <div class="dot-container">
                                                          <div class="dot red"></div>
                                                      </div>
                                                  </div>
                                              </div>

                                          </span>

                                          <span id="dynamic-discount-off" class="discount off" style="display:none">

                                              <div class="data-row clearfix">
                                                  <div class="title">Dynamic Discount: <a class="discount-modal-trigger"
                                                          href="#"><i class="icon-question-circle"></i></a></div>
                                                  <div class="value">disabled <div class="dot-container">
                                                          <div class="dot red"></div>
                                                      </div>
                                                  </div>
                                              </div>

                                          </span>

                                          <span id="partner-tokens-on" class="discount on" style="display:none">

                                              <div class="data-row clearfix">
                                                  <div class="title">Partner Tokens: <a class="partners-modal-trigger"
                                                          href="#"><i class="icon-question-circle"></i></a></a></div>
                                                  <div class="value">enabled <div class="dot-container">
                                                          <div class="dot green"></div>
                                                      </div>
                                                  </div>
                                              </div>

                                          </span>

                                          <span id="dynamic-discount-on" class="discount on" style="display:none">

                                              <div class="data-row clearfix">
                                                  <div class="title">Dynamic Discount: <a class="discount-modal-trigger"
                                                          href="#"><i class="icon-question-circle"></i></a></div>
                                                  <div class="value">enabled <div class="dot-container">
                                                          <div class="dot green"></div>
                                                      </div>
                                                  </div>
                                              </div>

                                          </span>
                                      </div>



                                      <a id="buy-link" class="no-loader"
                                          href="https://pancakeswap.finance/swap?outputCurrency=0x7eb567f5c781ee8e47c7100dc5046955503fc26a">
                                          <button type="button" class="btn btn-sep pancake green">
                                              <div><i><img src="assets/imgs/icon-pcs.svg" /></i></div>
                                              <span>Buy <strong>on PancakeSwap</strong> <i
                                                      class="icon-external-link extra-icon"></i></span>
                                          </button>
                                      </a>
                                      <a id="buy-link-test1" class="no-loader"
                                          href="https://www.flooz.trade/wallet/0x7eb567F5c781EE8e47C7100DC5046955503fc26A">
                                          <button type="button" class="btn btn-sep flooz green">
                                              <div><i><img src="assets/imgs/icon-flooz.png" /></i></div>
                                              <span>Buy <strong>on Flooz.Trade</strong> <i
                                                      class="icon-external-link extra-icon"></i></span>
                                          </button>
                                      </a>


                                  </div>

                              </div>



                              <div class="ui-col stats">

                                  <div class="ui-box">

                                      <div class="data-row main clearfix">
                                          <div class="title">Market Capitalization: </div>
                                          <div class="value"><span id="market-cap">-</span></div>
                                      </div>

                                      <div class="data-row main pool clearfix">
                                          <div class="title">Liquidity Pool:</div>
                                          <div class="value"><span class="pool-amount" id="pool-koji"></span><span
                                                  class="pool-amount" id="pool-bnb"></span></div>
                                      </div>

                                      <div class="data-row main clearfix">
                                          <div class="title"><strong>KOJI</strong> in circulation: </div>
                                          <div class="value"><span id="total-circ">-</span></div>
                                      </div>

                                      <div class="data-row main clearfix">
                                          <div class="title"><strong>KOJI</strong> burned:</div>
                                          <div class="value"><span id="total-burn">-</span></div>
                                      </div>

                                      <div class="small clearfix" style="margin-top:30px">
                                          <label><i class="far fa-sitemap"></i> Dividend Distribution:</label>
                                      </div>

                                      <div class="small clearfix">
                                          <div class="data-row">
                                              <div class="title">WBNB added to pool:</div>
                                              <div class="value"><span id="total-wbnb-added">-</span></div>
                                          </div>

                                          <div class="data-row">
                                              <div class="title">BNB distributed:</div>
                                              <div class="value"><span id="total-divs">-</span></div>
                                          </div>

                                          <div class="data-row">
                                              <div class="title">BNB reinvested:</div>
                                              <div class="value"><span id="total-reinvest">-</span></div>
                                          </div>

                                          <div class="data-row">
                                              <div class="title">BNB withdrawn:</div>
                                              <div class="value"><span id="total-withdraw">-</span></div>
                                          </div>
                                      </div>

                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->




                      <!-- wallet ------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-wallet"></i>My Wallet</span>

                          <div class="ui-row col-2 my-wallet">

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <div class="data-row clearfix">
                                          <div class="title">My Network: </div>
                                          <div class="value"><span id="network-name"></span></div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">My Address:</div>
                                          <div class="value"><span class="my-address">
                                                  <span id="selected-account"></span><i class="fas fa-copy to-clipboard"
                                                      data-clipboard-target="#selected-account"></i><span
                                                      id="selected-account-link"></span></span></div>
                                      </div>

                                      <div class="data-row my-bnb clearfix">
                                          <div class="title">My BNB balance:</div>
                                          <div class="value"><span id="account-balance"></span><span
                                                  id="bnb-balance-usd" class="usd-amount"></span></div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">KOJI Token Contract:</div>
                                          <div class="value"><span class="my-address">
                                                  <span id="token-address"></span><i class="fas fa-copy to-clipboard"
                                                      data-clipboard-target="#token-address"></i><span
                                                      id="token-address-link"></span></span></div>
                                          <div class="value"><span class="my-address">
                                                  <span id="add-metamask"><a href="#" class="btn grey small"
                                                          onclick="addKOJItoken();return false;"><i
                                                              class="fal fa-plus-square"></i> add token contract to
                                                          metamask</a></span></div>
                                      </div>

                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">


                                      <div class="data-row main clearfix">
                                          <div class="clearfix">
                                              <div class="title">My KOJI balance:</div>
                                              <div class="value"><span id="koji-balance"></span></div>
                                          </div>
                                          <div id="ineligible" class="alert alert-warning" style="display:none;">
                                              <div class="alert-container">
                                                  <div class="alert-icon">
                                                      <i class="fas fa-exclamation-circle"></i>
                                                  </div>
                                                  <span class="alert-msg">
                                                      You must hold minimum <span id="minhold"></span> KOJI to receive
                                                      dividends!
                                                  </span>
                                              </div>
                                          </div>

                                          <div id="eligible" class="alert alert-success" style="display:none;">
                                              <div class="alert-container">
                                                  <div class="alert-icon">
                                                      <i class="fas fa-thumbs-up"></i>
                                                  </div>
                                                  <span class="alert-msg">
                                                      You are receiving dividends, please note dividends are distributed
                                                      on sells only.
                                                  </span>
                                              </div>
                                          </div>

                                      </div>

                                      <div class="data-row main clearfix mt30">
                                          <div class="title">Unrealized Dividends:</div>
                                          <div class="value"><span id="koji-divs" class="yellow-text"></span><span
                                                  id="koji-divs-usd" class="usd-amount"></span></span>
                                              <input type="hidden" id="koji-divs-unrounded" value="" /></div>
                                      </div>

                                      <div class="data-row main clearfix">
                                          <div class="title">Total Realized:</div>
                                          <div class="value"><span id="koji-divs-realized"></span></div>
                                      </div>




                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->





                      <!-- reinvest & withdraw------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-sack-dollar"></i>Reinvest or withdraw your
                              dividends</span>

                          <div class="ui-row col-2 dividends">



                              <div class="ui-col reinvest">
                                  <span id="reinvest-loader" class="ui-loader"></span>

                                  <span id="reinvest-alert" class="ui-overlay" style="display:none;">

                                      <div class="alert alert-warning">
                                          <div class="alert-container">
                                              <span class="alert-msg">
                                                  <i class="fas fa-exclamation-circle"></i> You need at least 0.001 BNB
                                                  dividends to reinvest
                                              </span>
                                          </div>
                                      </div>

                                  </span>

                                  <div class="ui-box bottom-btn">

                                      <div class="ui-slider">


                                          <label for="slider2"><i class="far fa-sliders-h"></i>
                                              Reinvest <strong><output for="slider2" id="amount2">100</output>%</strong>
                                              (~<span id="ri-equivalent"></span>BNB) of your unrealized
                                              dividends.</label>

                                          <input type="range" id="slider2" min="25" max="100" value="100" step="25"
                                              aria-valuemin="25" aria-valuemax="100" aria-valuenow="100"
                                              oninput="outputUpdate2(value)">

                                      </div>





                                      <div class="data-row range-amount"><span id="koji-reinvested"
                                              class="amount"></span> <span>KOJI</span></div>

                                      <span class="ui-note">* Reinvesting places a market order at the current price so
                                          the above amount is estimated. </span>

                                      <button id="reinvest-btn" type="button" class="btn green btn-sep bottom ">
                                          <div><i class="icon-sync-alt"></i></div>
                                          <span><strong>Reinvest</strong></span>
                                      </button>
                                      <button id="reinvest-btn-inactive" type="button"
                                          class="btn green btn-sep bottom hide">
                                          <div><i class="icon-sync-alt"></i></div>
                                          <span><strong>Reinvest</strong></span>
                                      </button>
                                  </div>


                              </div>




                              <div class="ui-col withdraw">
                                  <span id="withdraw-loader" class="ui-loader"></span>
                                  <span id="withdraw-alert" class="ui-overlay" style="display:none;">

                                      <div class="alert alert-warning">
                                          <div class="alert-container">
                                              <span class="alert-msg">
                                                  <i class="fas fa-exclamation-circle"></i> Looks like you don't have
                                                  any dividends to withdraw
                                              </span>
                                          </div>
                                      </div>

                                  </span>

                                  <div class="ui-box bottom-btn">
                                      <div class="ui-slider withdraw">

                                          <label for="slider"><i class="far fa-sliders-h"></i>
                                              Withdraw <strong><output for="slider" id="amount">100</output>%</strong>
                                              of your unrealized dividends.</label>
                                          <input type="range" id="slider" min="25" max="100" value="100" step="25"
                                              aria-valuemin="25" aria-valuemax="100" aria-valuenow="100"
                                              oninput="outputUpdate(value)">

                                      </div>



                                      <div class="data-row range-amount"><span id="withdraw-divs" class="amount"></span>
                                          <span>BNB</span></div>

                                      <span class="ui-note">* Dividends are updated every on every sell.</span>

                                      <button id="withdraw-btn" type="button" class="btn yellow btn-sep bottom ">
                                          <div><i class="fas fa-inbox-out"></i></div>
                                          <span><strong>Withdraw</strong></span>
                                      </button>

                                      <button id="withdraw-btn-inactive" type="button"
                                          class="btn yellow btn-sep bottom hide">
                                          <div><i class="fas fa-inbox-out"></i></div>
                                          <span><strong>Withdraw</strong></span>
                                      </button>
                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->


                      <!-- Donations------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title donate"><i class="fas fa-heart"></i>Donate your dividends</span>

                          <div class="ui-row col-2 dividends donate">

                              <div class="ui-col">
                                  <span id="donate-loader" class="ui-loader"></span>
                                  <span id="donate-alert" class="ui-overlay" style="display:none;">

                                      <div class="alert alert-warning">
                                          <div class="alert-container">
                                              <span class="alert-msg">
                                                  <i class="fas fa-exclamation-circle"></i> Looks like you don't have
                                                  any dividends to donate
                                              </span>
                                          </div>
                                      </div>

                                  </span>

                                  <div class="ui-box bottom-btn">
                                      <div class="ui-slider donate">

                                          <label for="slider3"><i class="far fa-sliders-h"></i>
                                              Donate <strong><output for="slider3" id="amount3">100</output>%</strong>
                                              of your unrealized dividends.</label>
                                          <input type="range" id="slider3" min="25" max="100" value="100" step="25"
                                              aria-valuemin="25" aria-valuemax="100" aria-valuenow="100"
                                              oninput="outputUpdate3(value)">

                                      </div>



                                      <div class="data-row range-amount"><span id="donate-divs"
                                              class="amount donate"></span> <span>BNB</span></div>

                                      <span class="ui-note">* Donated dividends do not count towards your total
                                          realized.</span>

                                      <button id="donate-btn" type="button" class="btn donate btn-sep bottom">
                                          <div><i class="fas fa-hand-holding-heart"></i></div>
                                          <span><strong>Donate Divs</strong></span>
                                      </button>

                                      <div style="display:none">
                                          <hr style="margin-top:15px" />

                                          <label style="margin-top:5px"><i class="far fa-sliders-h"></i> Or make a
                                              custom donation from your wallet to our charity address:</label>

                                          <div class="row">
                                              <div style="display:inline-block;width:25%">
                                                  <button id="donate-btn-custom1" type="button"
                                                      class="btn donate btn-sep bottom"
                                                      onclick="donatewithoutdivs(100000000000000000);"
                                                      style="width:110px; border-radius: 12px;">
                                                      <div><i class="fas fa-hand-holding-heart"></i></div>
                                                      <span style="margin-left:36px; font-size:14px"><strong>Give .1
                                                              BNB</strong></span>
                                                  </button>
                                              </div>
                                              <div style="display:inline-table;width:23%;margin-left:0%;">
                                                  <button id="donate-btn-custom1" type="button"
                                                      class="btn donate btn-sep bottom"
                                                      onclick="donatewithoutdivs(250000000000000000);"
                                                      style="width:110px; border-radius: 12px;">
                                                      <div><i class="fas fa-hand-holding-heart"></i></div>
                                                      <span style="margin-left:36px; font-size:14px"><strong>Give .25
                                                              BNB</strong></span>
                                                  </button>
                                              </div>
                                              <div style="display:inline-table;width:23%;margin-left:2%;">
                                                  <button id="donate-btn-custom1" type="button"
                                                      class="btn donate btn-sep bottom"
                                                      onclick="donatewithoutdivs(500000000000000000);"
                                                      style="width:110px; border-radius: 12px;">
                                                      <div><i class="fas fa-hand-holding-heart"></i></div>
                                                      <span style="margin-left:36px; font-size:14px"><strong>Give .5
                                                              BNB</strong></span>
                                                  </button>
                                              </div>
                                              <div style="display:inline-table;float:right;width:23%;margin-left:2%;">
                                                  <button id="donate-btn-custom1" type="button"
                                                      class="btn donate btn-sep bottom"
                                                      onclick="donatewithoutdivs(1000000000000000000);"
                                                      style="width:110px; border-radius: 12px;">
                                                      <div><i class="fas fa-hand-holding-heart"></i></div>
                                                      <span style="margin-left:36px; font-size:14px"><strong>Give 1
                                                              BNB</strong></span>
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>


                              <div class="ui-col donation-leadboard">

                                  <div class="ui-box">



                                      <span class="ui-title"><i class="fas fa-trophy-alt"></i> Top Donors</span>
                                      <div class="leaderboard-fade">
                                          <div id="leaderboard" class="price-stats donations">



                                          </div>
                                      </div>

                                      <div class="total-donated my-wallet">
                                          <div class="data-row main clearfix total">
                                              <div class="title"><strong>Total Donated:</strong></div>
                                              <div class="value" id="total-donated"></div>
                                          </div>
                                      </div>
                                  </div>

                              </div><!-- .ui-col -->

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->


                      <!-- Extra donations------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title donate"><i class="fas fa-hand-holding-heart"></i>Make extra
                              donation</span>

                          <div class="ui-row col-1 full extra-donate">

                              <div class="ui-col">

                                  <div class="ui-box">


                                      <label>You can also make a custom donation from your wallet directly to our
                                          charity address:</label>


                                      <div class="clearfix">
                                          <button id="donate-btn-custom1" type="button"
                                              class="btn donate btn-sep bottom"
                                              onclick="donatewithoutdivs(100000000000000000);">
                                              Give .1 BNB
                                          </button>

                                          <button id="donate-btn-custom1" type="button"
                                              class="btn donate btn-sep bottom"
                                              onclick="donatewithoutdivs(250000000000000000);">
                                              Give .25 BNB
                                          </button>

                                          <button id="donate-btn-custom1" type="button"
                                              class="btn donate btn-sep bottom"
                                              onclick="donatewithoutdivs(500000000000000000);">
                                              Give .5 BNB
                                          </button>

                                          <button id="donate-btn-custom1" type="button"
                                              class="btn donate btn-sep bottom"
                                              onclick="donatewithoutdivs(1000000000000000000);">
                                              Give 1 BNB
                                          </button>
                                      </div>


                                  </div>

                              </div><!-- .ui-col -->

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->


                  </div><!-- #token-tab -->


                  <!-- NFT Tab ------------------------------------------------------------>

                  <div id="nft-tab" class="tab">
                      <div class="ui-wrapper">
                          <span class="ui-title"><i class="far fa-book-open"></i>Limited Mint KOJI Poster NFT</span>

                          <div class="ui-row col-1 full">

                              <div class="ui-col">
                                <span id="nft-holdings-loader" class="ui-loader"></span>
                                  <div class="ui-box">
                                      <div id="nftdisplay" style="display:none;">
                                        
                                          <div id="image" style="float:left;width:50%"></div>
                                          <div id="metadata" style="float:right;display:inline-block;width:47%"></div>
                                        
                                      </div>

                                      <div id="no-nft">
                                        <span style="color:red">No NFT's found at this wallet address</span>
                                      </div>

                                  </div> <!-- .ui-box -->
                              </div> <!-- .ui-col -->

                          </div><!-- .ui-row -->
                      </div><!-- .ui-wrapper -->

                      <span>Tentative NFT release schedule late January - Early February 2022 || NFT Comic pages will be released weekly for 16 weeks (32 pages + Cover)</span>
                      <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 1 - Release Date TBD</span>

                        <div class="ui-row col-3">

                            <div class="ui-col">
                                <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        <div class="title"></div>
                                        <div class="value fix2">NFT Comic wrap-around cover</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        <div class="title"></div>
                                        <div class="value fix2">NFT Comic page 1</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        <div class="title"></div>
                                        <div class="value fix2">NFT Comic page 2</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                    <style>
                      .fix {
                            width: 100% !important;
                            float: none !important;
                            text-align: center !important;
                            color: #fff;
                            word-break: none !important;
                            margin: 0 0 10px 0px !important;
                      }

                      .fix2 {
                            width: 100% !important;
                            float: none !important;
                            text-align: center !important;
                            color: #fff;
                            word-break: none !important;
                            margin: -5px 0 0px 0px !important;
                      }
                    </style>

                    <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 2 & 3 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 3</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 4</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 5</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic page 6</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                    <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 4 & 5 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 7</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 8</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 9</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic page 10</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                    <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 6 & 7 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                     <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 11</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 12</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 13</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic page 14</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                    <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 8 & 9 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 15</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 16</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 17</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic page 18</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                     <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 10 & 11 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 19</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 20</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 21</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic page 22</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                    <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 12 & 13 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 23</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 24</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 25</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic page 26</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                    <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 14 & 15 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 27</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 28</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 29</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic page 30</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->

                    <div class="ui-wrapper">

                        <span class="ui-title"><i class="far fa-calendar"></i>Week 16 - Release Date TBD</span>

                        <div class="ui-row col-4">

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 31</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic page 32</div>
                                    </div>

                                </div>
                            </div>

                            <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                        
                                        <div class="value fix">NFT Comic bonus #1</div>
                                    </div>

                                </div>
                            </div>

                             <div class="ui-col">
                                 <div class="ui-box">
                                    <div style="width:100%;text-align: center"><span><i style="font-size:10rem !important;color: #181818 !important" class="far fa-question-square"></i></span></div>
                                    <div class="data-row clearfix">
                                       
                                        <div class="value fix">NFT Comic bonus #2</div>
                                    </div>

                                </div>
                            </div>

                        </div><!-- .ui-row -->

                    </div><!-- .ui-wrapper -->


                  </div><!-- #nft-tab -->


                  <!-- Staking Tab ------------------------------------------------------------>
                  <div id="staking-tab" class="tab">



                      <!-- UI row with 3 column (staking)------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-book-open"></i>Stake your KOJI to mint the NFT
                              Comic</span>

                          <div class="ui-row col-3">

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <p>Stake your KOJI v2 to be eligible to mint the Tier 1 Animated NFT or Tier 2
                                          Static NFT Comic pages as they release weekly.</p>
                                      <p>You will also be rewarded in FLUX which can be converted into KOJI v2 or used
                                          to buy superMints which allow you to mint any pages you have missed.</p>

                                      <img style="margin-bottom:17px" src="./assets/imgs/kojiflux.jpg" />

                                      <span>FLUX will also be used in our ecosystem for games and lottery type
                                          activities.</span>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <p>Koji is landing soon!</p>
                                      <img src="./assets/imgs/tier2NFT.jpg" />
                                      <br><br>
                                      <!--sir!-->
                                      <span>Illustrated & Animated by</span>
                                      <img src="./assets/imgs/amco_london.jpg" />

                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box nft-tiers">
                                      <p>Pool Eligibility</p>
                                      <br>
                                      <span class="ui-note">Oracle-based Real-time Eligibility Equivalents:</span>
                                      <div class="holder tier-1 clearfix th" data-aos="fade-right" data-aos-delay="200"
                                          data-aos-easing="ease-in" data-aos-once="true" data-aos-duration="20000"
                                          data-aos-anchor=".staking-p1" style="width:100% !important; margin-top: 10px">
                                          <span class="tier">TIER<strong>1</strong></span>
                                          <span class="info">
                                              <span class="amount" id="tier1amount"></span>
                                              <span class="desc">Tier feauture: <strong>Animated NFT</strong></span>
                                          </span>
                                      </div>

                                      <div class="holder tier-2 clearfix th" data-aos="fade-left" data-aos-delay="200"
                                          data-aos-easing="ease-in" data-aos-once="true" data-aos-duration="20000"
                                          data-aos-anchor=".tier-1"
                                          style="width:100% !important; margin-left:0px; margin-top: 10px; margin-bottom:15px">
                                          <span class="tier">TIER<strong>2</strong></span>
                                          <span class="info">
                                              <span class="amount" id="tier2amount"></span>
                                              <span class="desc">Tier feauture: <strong>Still NFT</strong></span>
                                          </span>
                                      </div>

                                      <div class="clearfix"></div>

                                      <p>Pool Rewards & Taxes</p>

                                      <div class="data-row clearfix">
                                          <div class="title">Taxes: </div>
                                          <div class="value">None on deposit, 1% on withdraw</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">Early Unstake Penalty (resets on deposit/withdraw): </div>
                                          <div class="value">2% declining .1% per day for 20 days</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">Reward Pool 1 (Stake Pool): </div>
                                          <div class="value" style="word-break: break-word">All unstake % gets
                                              distribtued to existing stakers, proportionally claimable on any
                                              withdrawal amount</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">Reward Pool 2 (FLUX Pool): </div>
                                          <div class="value" style="word-break: break-word">KOJI FLUX is rewarded per
                                              block; can be redeemed for KOJI or used to purchase superMints</div>
                                      </div>
                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->

                      <!-- UI row with 4 column ------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-chart-pie"></i>Staking Pool Info</span>

                          <div class="ui-row col-4" style="margin-bottom:10px">

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <i class="fas fa-mask"></i>&nbsp;&nbsp;<span>Total KOJI Staked:</span>
                                      <div class="data-row clearfix">
                                          <div class="value" style="width:100%;text-align: center">
                                              <span id="total-koji-staked"></span>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <i class="fas fa-sack-dollar"></i>&nbsp;&nbsp;<span>Total Staked Value:</span>
                                      <div class="data-row clearfix">
                                          <div class="value" style="width:100%;text-align: center">
                                              <span id="total-staked-usd"></span>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <i class="fas fa-coins"></i>&nbsp;&nbsp;<span>Stake Rewards Pool:</span>
                                      <div class="data-row clearfix">
                                          <div class="value" style="width:100%;text-align: center">
                                              <span id="rewards-pool-one"></span>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <i class="fas fa-chart-network"></i>&nbsp;&nbsp;<span>Flux Rewards Pool:</span>
                                      <div class="data-row clearfix">
                                          <div class="value" style="width:100%;text-align: center">
                                              <span id="rewards-pool-two"></span>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                          <span class="ui-title"><i class="far fa-pennant"></i>Stake Your KOJI</span>

                          <div class="ui-row col-3">

                              <div class="ui-col">
                                  <span id="dep-holdings-loader" class="ui-loader"></span>
                                  <div class="ui-box">

                                      <p>Deposit</p>

                                      <div class="data-row clearfix">
                                          <div class="title">For Tier 1 minting, please deposit at least: </div>
                                          <div class="value" id="mintier1amount"></div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">For tier 2 minting, please deposit at least: </div>
                                          <div class="value" id="mintier2amount"></div>
                                      </div>

                                      <span class="ui-note">* Please note that you can only mint 1 (one) tier 1 OR tier
                                          2 NFT comic page per address, unless you purchase a superMint.</span>


                                      <input class="mt20 mb20" type="text" id="stakeDeposit" name="deposit"
                                          placeholder="enter amount you want to stake">

                                      <span class="ui-note" style="color:red;display:block;margin-top:-15px"
                                          id="depositalert"></span>


                                      <button type="button" class="btn btn-sep bottom" id="approve-staking"
                                          onclick="approvestaking();" style="background-color:#2976ab; display:none">
                                          <div><i class="fas fa-thumbs-up"></i></div>
                                          <span>Approve KOJI for staking</span>
                                      </button>

                                      <button type="button" class="btn btn-sep bottom" id="deposit-staking"
                                          onclick="validatedeposit();" style="background-color:#365036; display:none">
                                          <div><i class="fas fa-arrow-alt-to-bottom"></i></div>
                                          <span>Deposit KOJI</span>
                                      </button>
                                  </div>
                              </div>

                              <style>
                                  .right {
                                      text-align: right !important;
                                      padding-right: 5px !important;
                                  }
                              </style>

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <p>My Stake Info</p>
                                      <div class="data-row clearfix">
                                          <div class="title">My Total Stake: </div>
                                          <div class="value right" id="my-total-stake">0 KOJI</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">My Stake Value: </div>
                                          <div class="value right" id="my-stake-value">$0.00 USD</div>
                                      </div>
                                      <div class="data-row clearfix">
                                          <div class="title">My Mint Tier Eligibility: </div>
                                          <div class="value right" id="my-stake-tier">N/A</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">My Pool Rewards: </div>
                                          <div class="value right" id="my-pool-rewards">0 KOJI</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">My KOJI FLUX Rewards: </div>
                                          <div class="value right" id="my-flux-rewards">0 FLUX</div>
                                      </div>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <span id="wd-holdings-loader" class="ui-loader"></span>
                                  <div class="ui-box">
                                      <p>Withdraw</p>
                                      <div class="data-row clearfix">
                                          <div class="title">Withdraw Fees: </div>
                                          <div class="value" id="unstake-penalty">1% + any early unstake %</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title" id="unstake-tier">Tier preservation</div>
                                          <div class="value"><span>Max withdraw to keep Tier 1:</span><span
                                                  id="unstake-amount-1">&nbsp;N/A</span><br><span>Max withdraw to keep
                                                  Tier 2:</span><span id="unstake-amount-2">&nbsp;N/A</span></div>
                                      </div>

                                      <span class="ui-note" id="is-overage" style="display: none">* A withdrawal of
                                          <span id="overage-amt"></span> will result in <span id="pool-reward"></span>
                                          stake pool reward distribution. </span>

                                      <input class="mt20 mb20" type="text" id="stakeWithdraw" name="withdraw"
                                          placeholder="enter amount you want to withdraw">

                                      <span class="ui-note" style="color:red;display:block;margin-top:-15px"
                                          id="withdrawalert"></span>

                                      <button type="button" class="btn btn-sep" id="withdraw-staking"
                                          onclick="validatewithdrawal();" style="background-color:#365036">
                                          <div><i class="fas fa-arrow-alt-from-bottom"></i></div>
                                          <span>Withdraw KOJI</span>
                                      </button>
                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->

                      <!-- UI row with 2 column ------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-piggy-bank"></i>Manage Rewards || superMints</span>

                          <div class="ui-row col-2">

                              <div class="ui-col">
                                  <div class="ui-box bottom-btn">
                                      <p>UI row with 2 columns, <strong>column 1</strong> with button inside UI box.</p>
                                      <p>Sed cursus dui et lorem accumsan sodales. Cras et justo ligula. Aliquam auctor
                                          ante non tortor auctor placerat. Duis dictum purus quis eleifend sagittis.
                                      </p>
                                      <button type="button" class="btn btn-sep bottom" style="background-color:#365036">
                                          <div><i class="icon-external-link"></i></div>
                                          <span>Redeem FLUX for KOJI</span>
                                      </button>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">

                                      <p><strong>superMints</strong> are special currency that can be used to mint comic
                                          NFT pages that ordinarily cannot be minted otherwise.</p>
                                      <span>superMints allow the staker to do the following:</span>
                                      <ul>
                                          <li>Mint an NFT page after the minting window is closed</li>
                                          <li>Mint an NFT page from a tier the staker isn't eligible for</li>
                                          <li>Mint a duplicate NFT the staker already minted</li>
                                      </ul>
                                      <p>Stakers can only have one (1) superMint at a time, and also must hold the
                                          minimum stake amount in order to use the superMint. superMints cannot be sold
                                          or traded, and the purchase price of a superMint is subject to change based on
                                          the conversion price of FLUX and/or the market price of KOJI.</p>

                                      <div class="data-row clearfix">
                                          <div class="title">superMint purchase status: </div>
                                          <div class="value right" id="supermint-flux-enabled" style="display:none">FLUX
                                              superMint purchases enabled <div class="dot-container"
                                                  style="display: inline;">
                                                  <div class="dot green"
                                                      style="float:right;display:inline-block;margin: 5px 0 10px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="value right" id="supermint-flux-disabled">FLUX superMint purchases
                                              disabled <div class="dot-container" style="display: inline;">
                                                  <div class="dot red"
                                                      style="float:right;display:inline-block;margin: 5px 0 10px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="value right" id="supermint-koji-enabled"
                                              style="display:none;float:right;">KOJI superMint purchases enabled <div
                                                  class="dot-container" style="display: inline;">
                                                  <div class="dot green"
                                                      style="float:right;display:inline-block;margin: 5px -5px 10px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="value right" id="supermint-koji-disabled" style="float:right;">
                                              KOJI superMint purchases disabled <div class="dot-container"
                                                  style="display: inline;">
                                                  <div class="dot red"
                                                      style="float:right;display:inline-block;margin: 5px -5px 10px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">My superMint balance: </div>
                                          <div class="value right" id="supermint-balance">0 superMint</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">superMint FLUX price: </div>
                                          <div class="value right" id="flux-supermint-price"></div>
                                      </div>

                                      <button type="button" class="btn btn-sep" id="btn-supermint-flux"
                                          style="background-color:#365036">
                                          <div><i class="fas fa-chart-network"></i></div>
                                          <span>Buy superMint with FLUX</span>
                                      </button>

                                      <div class="data-row clearfix" style="margin-top:10px">
                                          <div class="title">superMint KOJI price: </div>
                                          <div class="value right" id="koji-supermint-price"></div>
                                      </div>

                                      <button type="button" class="btn btn-sep" id="btn-supermint-koji"
                                          style="background-color:#365036">
                                          <div><i class="fas fa-mask"></i></div>
                                          <span>Buy superMint with KOJI</span>
                                      </button>

                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->



                  </div><!-- #staking-tab -->


                  <!-- tax & team wallet tab ------------------------------------------------------------>
                  <div id="tax-wallets-tab" class="tab">



                      <!-- tokenomic ------------------------------------------------------------>


                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-chart-pie"></i>Tokenomics</span>

                          <div class="ui-row col-1 full tokenomics">


                              <div class="ui-col">
                                  <div class="ui-box">
                                      <div class="tax-overview">
                                          Current TAX: <span id="tax">7%</span> per transaction and distributed as per
                                          below:
                                      </div>
                                      <div class="tax-distribution lines bottom top first">
                                          <div class="bar line" style="flex-basis: calc(100% - 4px)"></div>
                                      </div>

                                      <div class="tax-distribution overview">
                                          <div class="bar burn" style="flex-basis: calc(14.285% - 4px)">1% burn</div>
                                          <div class="bar distribution" style="flex-basis: 85.715%">6% distributed as
                                              BNB</div>
                                      </div>
                                      <div class="tax-distribution lines top">
                                          <div class="bar" style="flex-basis: calc(14.285% + 3px)"></div>
                                          <div class="bar line" style="flex-basis: calc(85.715% - 3px)"></div>
                                      </div>

                                      <div class="tax-distribution lines bottom">
                                          <div class="bar line" style="flex-basis: calc(100% - 4px)"></div>
                                      </div>


                                      <div class="tax-distribution percentages">
                                          <div class="bar holders" style="flex-basis: 40%">40%</div>
                                          <div class="bar charity" style="flex-basis: 20%">20%</div>
                                          <div class="bar liq" style="flex-basis: 20%">20%</div>
                                          <div class="bar admin" style="flex-basis: 20%">20%</div>
                                      </div>
                                      <div class="tax-distribution labels">
                                          <div class="bar" style="flex-basis: 40%"><span>Holders</span></div>
                                          <div class="bar" style="flex-basis: 20%"><span>Charity</span></div>
                                          <div class="bar" style="flex-basis: 20%"><span>Liquidity</span></div>
                                          <div class="bar" style="flex-basis: 20%"><span>Marketing</span></div>
                                      </div>


                                      <span class="ui-note">* Please note that the total TAX % and breakdown will change
                                          slightly when the pools for Staking and NFT's are activated. Read more abour
                                          or tokenomics and tax <a href="https://koji.earth/tokenomics">here</a>.
                                      </span>

                                  </div>
                              </div>
                          </div>


                          <div class="ui-row col-1 full hide">


                              <div class="ui-col">
                                  <div class="ui-box">
                                      <div class="tax-overview">
                                          <span id="tax">8%</span> total TAX per transaction:
                                      </div>


                                      <div class="tax-distribution overview">
                                          <div class="bar burn" style="flex-basis: 12.5%">1% burn</div>
                                          <div class="bar stake" style="flex-basis: 12.5%">1% staking</div>
                                          <div class="bar distribution" style="flex-basis: 75%">6% distributed as BNB
                                          </div>
                                      </div>
                                      <div class="tax-distribution lines top">
                                          <div class="bar" style="flex-basis: 12.5%"></div>
                                          <div class="bar" style="flex-basis: 12.5%"></div>
                                          <div class="bar line" style="flex-basis: calc(75% - 2px)"></div>
                                      </div>

                                      <div class="tax-distribution lines bottom">
                                          <div class="bar line" style="flex-basis: calc(100% - 2px)"></div>
                                      </div>


                                      <div class="tax-distribution percentages">
                                          <div class="bar holders" style="flex-basis: 40%">40%</div>
                                          <div class="bar charity" style="flex-basis: 15%">15%</div>
                                          <div class="bar liq" style="flex-basis: 15%">15%</div>
                                          <div class="bar admin" style="flex-basis: 15%">15%</div>
                                          <div class="bar nft" style="flex-basis: 15%">15%</div>
                                      </div>
                                      <div class="tax-distribution labels">
                                          <div class="bar" style="flex-basis: 40%"><span>Holders</span></div>
                                          <div class="bar" style="flex-basis: 15%"><span>Charity</span></div>
                                          <div class="bar" style="flex-basis: 15%"><span>Liquidity</span></div>
                                          <div class="bar" style="flex-basis: 15%"><span>Marketing</span></div>
                                          <div class="bar" style="flex-basis: 15%"><span>NFT</span></div>
                                      </div>


                                  </div>
                              </div>
                          </div>


                      </div>



                      <!-- project wallets ------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="far fa-list"></i><strong>koji.earth</strong> Wallets</span>

                          <div class="ui-row col-1 full team-wallets">


                              <div class="ui-col">
                                  <div class="ui-box">

                                      <div class="data-row wallet charity clearfix">

                                          <span class="contract-address">
                                              <span class="wallet-name">Charity Wallet: </span>
                                              <span id="charity-address"></span>
                                              <i class="fas fa-copy to-clipboard"
                                                  data-clipboard-target="#charity-address"></i><span
                                                  id="charity-address-link"></span>
                                          </span>
                                          <div class="amount">
                                              <div class="balance">Current Balance: <span id="charity-balance"></span>
                                              </div>
                                              <div class="div">Total Dividends: <span id="charity-divs"></span></div>
                                              <div class="donated">Total Donated: <span id="donated"><a
                                                          href="https://koji.earth/charity"
                                                          target="_blank">$50,079</a></span></div>
                                          </div>

                                      </div>



                                      <div class="data-row wallet admin clearfix">

                                          <span class="contract-address">
                                              <span class="wallet-name">Marketing & Project Development Wallet: </span>
                                              <span id="admin-address"></span>
                                              <i class="fas fa-copy to-clipboard"
                                                  data-clipboard-target="#admin-address"></i><span
                                                  id="admin-address-link"></span>
                                          </span>
                                          <div class="amount">
                                              <div class="balance">Current Balance: <span id="admin-balance"></span>
                                              </div>
                                              <div class="div">Total Dividends: <span id="admin-divs"></span></div>
                                          </div>

                                      </div>

                                      <div id="poolActive" style="display:none" class="data-row wallet stake clearfix">

                                          <span class="contract-address">
                                              <span class="wallet-name">Stake Pool Wallet: </span>
                                              <span id="stake-address1"></span>
                                              <i class="fas fa-copy to-clipboard"
                                                  data-clipboard-target="#stake-address1"></i><span
                                                  id="stake-address1-link"></span>
                                          </span>
                                          <div class="amount">
                                              <div class="balance">Current Balance: <span id="stake-balance"></span>
                                              </div>
                                              <div class="div">Total KOJI: <span id="stake-divs"></span></div>
                                          </div>

                                      </div>

                                      <div id="poolInactive" style="display:none"
                                          class="data-row wallet inactive stake clearfix">

                                          <span class="contract-address clearfix">
                                              <span class="wallet-name">Stake Pool Wallet: </span>
                                              <span id="stake-address2"></span>
                                              <i class="fas fa-copy to-clipboard"
                                                  data-clipboard-target="#stake-address2"></i><span
                                                  id="stake-address2-link"></span>
                                          </span>

                                          <div class="alert alert-info">
                                              <div class="alert-container">
                                                  <div class="alert-icon">
                                                      <i class="icon-info-circle2"></i>
                                                  </div>
                                                  <span class="alert-msg">
                                                      Staking Pool is currently inactive

                                                  </span>
                                              </div>
                                          </div>


                                      </div>

                                      <div id="nftActive" style="display:none" class="data-row wallet nft clearfix">

                                          <span class="contract-address">
                                              <span class="wallet-name">NFT Reward Wallet: </span>
                                              <span id="nft-address"></span>
                                              <i class="fas fa-copy to-clipboard"
                                                  data-clipboard-target="#nft-address"></i><span
                                                  id="nft-address-link"></span>
                                          </span>
                                          <div class="amount">
                                              <div class="balance">Current Balance: <span id="nft-balance"></span></div>
                                              <div class="div">Total Dividends: <span id="nft-divs"></span></div>
                                          </div>

                                      </div>

                                      <div id="nftInactive" style="display:none"
                                          class="data-row wallet inactive nft clearfix">

                                          <span class="contract-address clearfix">
                                              <span class="wallet-name">NFT Reward Wallet: </span>
                                              <span id="nft-address2"></span>
                                              <i class="fas fa-copy to-clipboard"
                                                  data-clipboard-target="#nft-address2"></i><span
                                                  id="nft-address2-link"></span>
                                          </span>

                                          <div class="alert alert-info" style="margin-top:60px">
                                              <div class="alert-container">
                                                  <div class="alert-icon">
                                                      <i class="icon-info-circle2"></i>
                                                  </div>
                                                  <span class="alert-msg">
                                                      NFT Reward Pool is currently inactive

                                                  </span>
                                              </div>
                                          </div>


                                      </div>


                                  </div>
                              </div>

                          </div><!-- .ui-row -->
                      </div><!-- .ui-wrapper -->

                  </div><!-- #tax-wallets-tab -->

              </div><!-- .tabs.tabs-content -->

          </div><!-- .inner-wrapper -->
      </div><!-- #connected -->


<?php

include 'inc/footer.php';

?>
