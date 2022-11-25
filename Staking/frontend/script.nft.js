
 
  
//NFT Functions//////////////////////////////////////////////////////////////////////////

// GALLERY - Gets all NFTs added to the contract struct that can be minted

async function getAllNFT(id) { //first get all nfts added

	var nftcontract = new web3.eth.Contract(JSON.parse(bscnftmintABI),bscnftaddress);
	var theDiv = document.getElementById(id); //Get the gallery div
	var nftids;

	//console.log('function called');

	let mobile = false;

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		mobile = true;    
	}

	////console.log("fetchStakingData");

	window.web3 = new Web3(ethereum);

	
	// Get list of accounts of the connected wallet
	  const accounts =  await web3.eth.getAccounts();

	  // MetaMask does not give you all accounts, only the selected account
	  ////console.log("Got accounts", accounts);
	  selectedAccount = accounts[0];
	  ////console.log(selectedAccount);


	nftcontract.methods._NFTIds().call(function(err,res){
		if(!err) {
			//console.log('total number of nfts in system :' + res);

				//theDiv.innerHTML = "";

				nftcontract.methods.getNFTInfo(id).call(function(err,res){
					if(!err) {
						//console.log(res);

						var collectionName = res[0][0];
						var nftName = res[0][1];
						var tier1uri = res[0][2];
						var tier2uri = res[0][3];
						var timestart = res[1][0];
						var timeend = res[1][1];
						var supermintend = res[1][2];
						var nftorder = res[1][3];
						var redeemable = res[2][0];
						var smable = res[2][1];
						var bnbable = res[2][2];
						var exists = res[2][3];

						//console.log('Metadata for NFT '+id+' : '+ tier2uri);

						//user checks can go here to see if user owns the NFT

						nftcontract.methods.checkWalletforNFT(selectedAccount, tier1uri).call(function(err,res){ //check if user holds tier1 version
							if(!err) {
								var tier1holder = res[0];

								nftcontract.methods.checkWalletforNFT(selectedAccount, tier2uri).call(function(err,res){ //check if user holds tier1 version
									if(!err) {
										var tier2holder = res[0];

										var page;
										var specialclass;
										var specialimg;
										var specialimglink;

                    if(id == 0){
                    	 page = "Poster";
                    	 specialimg = "page";
                    	 specialimglink = "poster";
                    }

                    if(id > 1){
                    	page = 'Page '+(id - 1)+'';
                    	specialimg = "page";
                    	specialimglink = "page-"+(id - 1)+"";
                    }

                    if(id == 1 || id == 33){
                    	 page = "Cover";
                    	 specialclass = "cover";
                    	 specialimg = "cover";
                    	 specialimglink = "cover";

                    }

										if(!exists) {

												theDiv.innerHTML = "";
                        theDiv.classList.add("ui-col");
                        theDiv.classList.add("page");
                        theDiv.classList.add("unreleased");
                        if(id == 1 || id==33) {theDiv.classList.add(specialclass);}
                        theDiv.innerHTML = '<div class="ui-box"><img src="assets/imgs/nft-'+specialimg+'-dummy-img.png" />';
                        theDiv.innerHTML += '<div class="title">'+page+'</div><div class="status">Unreleased</div></div>';


										} else {

												//Add timer for mint window!!*******************************

												theDiv.innerHTML = "";
                        theDiv.classList.add("ui-col");
                        theDiv.classList.add("page");
                        if(id == 1 || id==33) {theDiv.classList.add(specialclass);}
                        if (tier1holder || tier2holder) {
                        		theDiv.classList.add("owned");
                        		var owned = 'owned';
                        		var img_owned = 'owned';
                        } else {
                        		theDiv.classList.add("not-owned");
                        		var owned = 'not owned';
                        		var img_owned = 'not-owned';
                        }
                       
                        theDiv.innerHTML = '<div class="ui-box"><img src="assets/imgs/thumbs/'+specialimglink+'-thumb-'+img_owned+'.jpg" />';
                        theDiv.innerHTML += '<div class="title">'+page+'</div><div class="status">'+owned+'</div>'
                        theDiv.innerHTML += '<button type="button" class="btn grey btn-sep page-'+id+'-modal-trigger"><div><i class="far fa-search-plus"></i></div><span>View</span></button>'
                        

										}


									}
								}); //checkwallerforNFT tier1

							}
						});  //checkwallerforNFT tier2

						//check to see if use is staked
							//check to see if user is tier 1 or 2
								//check to see if user has minted tier 1 or 2


						//var data = getJSON(res[0][3], {mode: 'cors'} ).then(data => populateimage(data, x)); //get the NFT metadata and subsequently image links

							
					}
				}); //getnftinfo

		}
	}); //nftids
}

async function populateimage(data, id) {

		//console.log(data);
		//console.log('id is: '+id+'');
		var img = document.getElementById(id).querySelector('.ui-box').getElementsByTagName('img')[0];
		//console.log(img);
		//img.src = data.image;
		////console.log(img);
}

// getwalletnft() will get the first NFT in the users wallet and then call populatenft() to show the data

async function getwalletnft() {
	////console.log("function called");
	functioncalled = true;
	const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
     try {
              await ethereum.enable();
              var account = await web3.eth.getAccounts();
      } catch {
        ////console.log(err);
      }
	
	nftcontract.methods.tokenOfOwnerByIndex(account[0], 0).call(function(err,res){
	        if(!err){

	        	document.getElementById("no-nft").style.display = "none";
	        	document.getElementById("nftdisplay").style.display = "block";
	        	document.getElementById("nft-holdings-loader").classList.add('ui-loading');

	        	var id = res;
	        	////console.log("result is " +res);
	        	nftcontract.methods.tokenURI(id).call(function(err,res){
			        if(!err){
			        	//get all JSON data
			        	var mintedURI = res;        		

		                var data = getJSON(mintedURI, {mode: 'cors'} ).then(data => populatenft(data, id));

			        }
		    	});
	        } else {

	        	////console.log("returned error");
	        	document.getElementById("no-nft").style.display = "block";
	        	document.getElementById("nftdisplay").style.display = "none";


	        }
	});

	
}

async function populatenft(data, id) {
	if (data !== null) {
		////console.log(data);
		////console.log(data.attributes[5].value);

		const web3 = new Web3(provider);
		
		nftcontract.methods.mintedtier1().call(function(err,res){
		        if(!err){
		        	var tier1total = res;
		        	nftcontract.methods.mintedtier2().call(function(err,res){
				        if(!err){
				        	//get all JSON data
				        	var tier2total = res;        		

			                var tempdata = "<div class='row'><span class='type'>" + data.attributes[0].trait_type + ": </span><span class='data'>" + data.attributes[0].value + "</span></div>"; //project
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[1].trait_type + ": </span><span class='data'>" + data.attributes[1].value + "</span></div>"; //type
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[2].trait_type + ": </span><span class='data'>" + data.attributes[2].value + "</span></div>"; //id
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[3].trait_type + ": </span><span class='data'>" + data.attributes[3].value + "</span></div>"; //titel
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[4].trait_type + ": </span><span class='data'>" + data.attributes[4].value + "</span></div>"; //rarity
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[5].trait_type + ": </span><span class='data'>" + data.attributes[5].value + "</span></div>"; //tier
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[6].trait_type + ": </span><span class='data'>" + data.attributes[6].value + "</span></div>"; //requirements
					    	tempdata += "<div class='row'><span class='type'>" + data.attributes[7].trait_type + ": </span><span class='data'>" + data.attributes[7].value + "</span></div>"; //royalties
					    	tempdata += "<span class='description'>" +data.description + "</span>";
							tempdata += "<span class='total'>Tier 1 Total: <strong>" + tier1total + " mints</strong></span>";
							tempdata += "<span class='total'>Tier 2 Total: <strong>" + tier2total + " mints</strong></span>";
					    	

						document.getElementById("nftdisplay").style.display = "block";
						if (data.attributes[5].value == "Tier 1") {
							document.getElementById("image").innerHTML = '<video width="100%" controls autoplay loop muted="muted"><source src="'+data.mp4+'" type="video/mp4">Your browser does not support the video tag.</video><br><div class="row"><span class="type" style="font-size:x-small">Contract: '+bscnftaddress+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="data" style="font-size:x-small">TokenID: '+id+'</span></div>';
						} else {
							document.getElementById("image").innerHTML = '<img src="'+data.image+'"><br><div class="row"><span class="type" style="font-size:x-small">Contract: '+bscnftaddress+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="data" style="font-size:x-small">TokenID: '+id+'</span></div>';
						}
						
						document.getElementById("metadata").innerHTML = tempdata;
						document.getElementById("nft-holdings-loader").classList.remove('ui-loading');

				        }
			    	});
		        }
		});
	}
}



  function RefreshNFT(interval) {
		refreshinterval = window.setInterval(function() {
			if (!txinprogress) {
				//getwalletnft();
				//getAllNFT(); 
				//console.log('updating nft data')

				//edit by andreas
				//document.getElementById("update-price").innerHTML = "<img src='https://app.koji.earth/assets/imgs/loading-buffering.gif' width='16px' height='16px'>";
				//document.getElementById("update-price").classList.add("ui-loading");

				window.clearTimeout(updating);
					var updating = window.setTimeout(function () {
					  //edit by andreas
						//document.getElementById("update-price").innerHTML = "";
					 // document.getElementById("update-price").classList.remove("ui-loading")
					},2000);
				}

		},interval);
	}

	

$(document).ready(function () {
	

	if (!functioncalled) {
   	//getwalletnft();
   	//getAllNFT(); 
  }


 for (var i = 1; i < 99999; i++)
        window.clearInterval(i);

 //RefreshNFT(15000); //nodezy - no need to refresh the NFT area yet, it can load once for now

});
