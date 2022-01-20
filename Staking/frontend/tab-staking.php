                     
                      <div class="ui-wrapper ui-toggle toggle-active" id="staking-info-wrapper">

                         <span class="ui-title clearfix"><i class="fad fa-book-open"></i>
                            <span>Stake KOJI to mint our NFTs</span> 
                            <a onclick="toggleinfo();"><!--sir, please leave this in, it allows the show/hide to survive refresh if the user wants to show it after its been auto-hidden-->                  
                              <span class="toggle-icon"><i class="fas fa-chevron-down"></i></span>   
                            </a><!--this too =) -->                        
                        </span>

                           

                          <div class="ui-row col-3 ui-toggleable" id="show-staking-info">

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

                      <!-- staking pool info ------------------------------------------------------------>

                      <div class="ui-wrapper pool-info">

                          <span class="ui-title"><i class="fad fa-chart-pie"></i>Staking Pool Info</span>

                          <div class="ui-row col-3">

                              <div class="ui-col">
                                  <div class="ui-box">
                                      <span class="title"><i class="fas fa-mask"></i>Total KOJI Staked:</span>
                                      <div class="data-row clearfix">
                                          <div class="value">
                                              <span id="total-koji-staked" class="pool-amount"></span>
                                              <span class="usd-amount">(<span id="total-staked-usd"></span>)</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">
                                  <span class="title"><i class="fas fa-coins"></i>Stake Rewards Pool:</span>
                                      <div class="data-row clearfix">
                                          <div class="value">
                                              <span id="rewards-pool-one" class="pool-amount"></span>
                                              <span class="usd-amount">(<span id="rewards-pool-one-usd"></span>)</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="ui-col">
                                  <div class="ui-box">
                                  <span class="title"><i class="fas fa-chart-network"></i>Flux Rewards Pool:</span>
                                      <div class="data-row clearfix">
                                          <div class="value">
                                              <span id="rewards-pool-two" class="pool-amount"></span>
                                              <span class="usd-amount">(<span id="rewards-pool-two-usd"></span>)</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                          </div><!-- .ui-wrapper -->


                        <!-- staking KOJI ------------------------------------------------------------>

                        <div class="ui-wrapper">

                          <span class="ui-title"><i class="fad fa-piggy-bank"></i>Stake Your KOJI</span>

                          <div class="ui-row col-3">

                              <div class="ui-col">
                                  <span id="dep-holdings-loader" class="ui-loader"></span>
                                  <div class="ui-box">

                                      <div class="value"><p>Deposit</p><span style="float:right;font-size:12px;margin-top:5px" id="koji-balance-1"></span></div>

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


                                      <button type="button" class="btn btn-sep mt30" id="approve-staking"
                                          onclick="approvestaking();" style="background-color:#2976ab; display:none">
                                          <div><i class="fas fa-thumbs-up"></i></div>
                                          <span>Approve KOJI for staking</span>
                                      </button>

                                      <button type="button" class="btn btn-sep mt30" id="deposit-staking"
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

                                      <button type="button" class="btn btn-sep mt30" id="withdraw-staking"
                                          onclick="validatewithdrawal();" style="background-color:#365036">
                                          <div><i class="fas fa-arrow-alt-from-bottom"></i></div>
                                          <span>Withdraw KOJI</span>
                                      </button>
                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->


                      <!-- manage staking rewards ------------------------------------------------------------>

                      <div class="ui-wrapper">

                          <span class="ui-title"><i class="fad fa-sack-dollar"></i>Manage Rewards</span>

                          <div class="ui-row col-1">

                              <div class="ui-col">
                                  <div class="ui-box">

                               
                                    <div class="alert alert-info mt0 alert-toggle">

                                            <span class="alert-title">
                                                <i class="fas fa-exclamation-circle"></i> Reward Info
                                                <span class="toggle-icon"><i class="fas fa-chevron-down"></i></span>
                                            </span>

                                            <div class="alert-toggleable">

                                            <span>There are two rewards pools for staking KOJI:</span>
                                                <ul>
                                                    <li>Rewards pool 1 (KOJI Pool rewards): This rewards pool is from the 1% - 3% taxes from unstaking. You will automatically receive rewards from this pool when you unstake any amount from the pool, proportional to how much you've unstaked.</li>
                                                    <li>The calculation for the net reward amount from pool 1 is: <strong>(withdrawal amount / total pooled KOJI) x total pool 1 rewards - (unstake fee + early unstake penalty)</strong></li>
                                                </ul>
                                                <ul>
                                                    <li>Rewards pool 2 (FLUX Pool rewards): <strong>KOJI FLUX</strong> is our custom staking rewards currency. This rewards pool is from the 1% tax on all KOJI buys/sells/transfers, as well as a pre-allocation of 10% of the total KOJI supply. You will automatically receive FLUX rewards from this pool per block, proportional to your stake amount in the pool.</li>
                                                    <li>FLUX can be converted to KOJI at any time based on the ratio conversion amount</li>
                                                    <li>FLUX can also be used to purchase superMints</li>
                                                </ul>

                                            </div>                                       
                                    </div>
               

                                      <div class="data-row clearfix">
                                            <div class="title">converstionRate: <span class="tooltip conversion" data-tooltip="converstionRate: used to adjust the FLUX -> KOJI conversion amount to balance the FLUX rewards pool. Can be used in conjunction with bonusRate below."><i class="icon-question-circle"></i></span></div>
                                          <div class="value ">1 FLUX = <span id="flux-koji"></span> KOJI v2</div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">bonusRate status: <span class="tooltip bonus" data-tooltip="bonusRate: used to adjust rewards for new stakers who could receive less FLUX if the price of KOJI increases. New stakers would receive less FLUX because if the price of KOJI increases, they are required to stake less KOJI and would thus receive less FLUX. This variable helps offset that."><i class="icon-question-circle"></i></span></div>

                                          <div class="value " id="bonusrate-enabled" style="display:none">bonusRate enabled <div class="dot-container"
                                                  style="display: inline;">
                                                  <div class="dot green"
                                                      style="float:;display:inline-block;margin: 5px 0 0px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="value " id="bonusrate-disabled">bonusRate disabled <div class="dot-container" style="display: inline;">
                                                  <div class="dot red"
                                                      style="float:;display:inline-block;margin: 5px 0 0px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                      </div>

                                      <div class="data-row clearfix">
                                          <div class="title">bonusRate: </div>
                                          <div class="value " id="bonusrate">120%</div>
                                      </div>

                                      <div class="data-row clearfix" style="margin-top:15px">
                                          <div class="title">net FLUX -> KOJI conversion: </div>
                                          <div class="value " id="netrate">N/A</div>
                                      </div>

                                      <button type="button" class="btn green btn-sep mt20">
                                          <div><i class="icon-external-link"></i></div>
                                          <span>Redeem FLUX for KOJI</span>
                                      </button>
                                  </div>
                              </div>

                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->


                      <!-- manage superMints ------------------------------------------------------------>

                       <div class="ui-wrapper">

                          <span class="ui-title"><i class="fad fa-file-plus"></i>Manage superMints</span>

                          <div class="ui-row col-1">

                              <div class="ui-col">
                                  <div class="ui-box">


                                    <div class="alert alert-info mt0 alert-toggle">

                                        <span class="alert-title">
                                            <i class="fas fa-exclamation-circle"></i> superMint Info
                                            <span class="toggle-icon"><i class="fas fa-chevron-down"></i></span>
                                        </span>

                                        <div class="alert-toggleable"> 
                                            
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

                                        </div>                                       
                                    </div>



                                      <div class="data-row clearfix">
                                          <div class="title">My superMint balance: </div>
                                          <div class="value " id="supermint-balance">0 superMint</div>
                                      </div>
                                      <div class="data-row clearfix" style="margin-top:15px !important">
                                          <div class="title">FLUX superMint purchases: </div>

                                          <div class="value " id="supermint-flux-enabled" style="display:none">enabled 
                                            <div class="dot-container"
                                                  style="display: inline;">
                                                  <div class="dot green"
                                                      style="float:;display:inline-block;margin: 5px 0 0px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="value " id="supermint-flux-disabled">disabled 
                                            <div class="dot-container" style="display: inline;">
                                                  <div class="dot red"
                                                      style="float:;display:inline-block;margin: 5px 0px 0px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="data-row clearfix">
                                          <div class="title">superMint FLUX price: </div>
                                          <div class="value " id="flux-supermint-price"></div>
                                      </div>

                                      <button type="button" class="btn green btn-sep mt20 mb40" id="btn-supermint-flux">
                                          <div><i class="fas fa-chart-network"></i></div>
                                          <span>Buy superMint with FLUX</span>
                                      </button>
                                      <div class="data-row clearfix" style="margin-top:15px !important">
                                          <div class="title">KOJI superMint purchases: </div>
                                          <div class="value " id="supermint-koji-enabled"
                                              style="display:none;">enabled 
                                              <div class="dot-container" style="display: inline;">
                                                  <div class="dot green"
                                                      style="float:;display:inline-block;margin: 5px 0px 0px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="value " id="supermint-koji-disabled">disabled 
                                            <div class="dot-container"
                                                  style="display: inline;float:right;margin-right:5px">
                                                  <div class="dot red"
                                                      style="float:;display:inline-block;margin: 5px 0px 0px 5px;">
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="data-row clearfix" >
                                          <div class="title">superMint KOJI price: </div>
                                          <div class="value " id="koji-supermint-price"></div>
                                      </div>

                                      <button type="button" class="btn green btn-sep mt20" id="btn-supermint-koji">
                                          <div><i class="fas fa-mask"></i></div>
                                          <span>Buy superMint with KOJI</span>
                                      </button>

                                  </div>
                              </div>


                          </div><!-- .ui-row -->

                      </div><!-- .ui-wrapper -->
