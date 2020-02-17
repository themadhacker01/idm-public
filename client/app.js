const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const request = require('request');
 
App = {

/*======================================================================================================
    DEFINE ESSENTIALS
======================================================================================================*/

    web3Provider: null,
    contracts: {},
	currentAccount:{},
	
	// Integrates web3 with our web app
    initWeb3 : async function (){
        if (process.env.MODE == 'development' || typeof window.web3 === 'undefined'){
            App.web3Provider = new Web3.providers.HttpProvider(process.env.LOCAL_NODE);
        }
        else{
             App.web3Provider = web3.currentProvider;
        }
        web3 = new Web3(App.web3Provider);
        return  await App.initContractIDM(); 
	},
	
	// Initialises a variable with IDManagement contract JSON
    initContractIDM : async function (){
        await $.getJSON('IDManagement.json',function(data){
            var IDMArtifact = data;
            App.contracts.IDManagement = TruffleContract(IDMArtifact);
            App.contracts.IDManagement.setProvider(App.web3Provider);        
        })
        return App.bindEvents();
	},
	
	// Binds button clicks to the repective functions
    bindEvents: function() { 
		$('#regUserBtn').click(App.ExeRegisterUser);
		$('#getRegStatusBtn').click(App.CallRegStatus);
		$("#validateTxnBtn").click(App.ExeValInteraction);
		$("#submitIdBtn").click(App.ExeSubmitId);
		$("#getIdBtn").click(App.CallGetHash);
	},

	// Defines functionality for OUTPUT label
    showMessage: function (msg){
		document.getElementById('output').value = msg;
		console.log(msg);
		$('#output').show();
		$('#errorHolder').hide();
	},
	
	// Defines functionality for ERROR label
    showError: function(err){
        document.getElementById('errorHolder').value = err;
		$('#errorHolder').show();
		$('#output').hide();
	},


/*======================================================================================================
	SUBMIT USER ID : Submits the user id value (ID) to '/receive' url as a POST query
======================================================================================================*/

	ExeSubmitId: function () {
		const ID = $('#enterId').val();
		console.log("In app.js ExeSubmitId", ID);

		// Sends POST to server to accept user id value
		request.post("http://172.17.74.32:3000/receive", {
				json: {
					value: ID
				}
			}, function(err, res, body) {
				if(err) {
					App.showError(err);
				}
				else {
					// prints to browser console
					console.log(body);
				}
		});
		App.showMessage("ID submitted for registration");

		if(ID == "") {
			App.showError("Valid ID value is required");
		}
	},


/*======================================================================================================
	GET USER HASH
	
	Gets the user hash corresponding to the user id POSTed to '/submitid'
	Uses GET request to retrieve value to 'index.html'
======================================================================================================*/

	CallGetHash: function () {
		console.log("In app.js CallGetHash");

		// Sends GET request to server to retrieve the user hash value
		$.get("http://172.17.74.32:3000/gethash", function(body, status) {
			if(status == "success") {
				console.log(body.value);
				if(body.value) {
					document.getElementById('userHash').value = body.value;
					App.showMessage("Hash received");
				}
				else {
					document.getElementById('userHash').value = "Invalid user ID submitted";
					App.showError("Valid hash value is required");
				}
			}
		});
	},


/*======================================================================================================
    USER REGISTRATION
======================================================================================================*/

	ExeRegisterUser: function (){
		console.log("In app.js ExeRegisterUser");
		
		const HASH = $('#userHash').val();
		if(HASH == "Invalid user ID submitted") {
			App.showError('Valid hash value is required');
			return;
		}

		// Verifies that user has entered a valid hash value
		// Currently, only checks that HASH is non-empty
		else if (HASH){
			// Retrieves user account to perform operations
			web3.eth.getAccounts(function (error,accounts){
			if (error){
				console.log("ERROR ExeRegisterUser");
				App.showError(error);
			}
			App.currentAccount = accounts[0];

			// First checks whether HASH already exists on the blockchain
			App.contracts.IDManagement.deployed().then(function(instance){
				return instance.regStatus.call(HASH, {from:App.currentAccount});
			}).then(function(result){
				console.log("ExeRegisterUser returns : ", result);
				
				// Submits transaction to network only if entered HASH is unregistered
				if(result == false)
				{
					App.contracts.IDManagement.deployed().then(function(obj){
						return obj.registerUser.sendTransaction(HASH, {from:App.currentAccount})
					}).then(function(result){
						console.log(result);
						App.showMessage("Transaction submitted");
					}).catch(function (error){
						console.log("ERROR ExeRegisterUser");
						App.showError(error);
					});
				}
				// Display appropriate message if HASH is already registered
				else
					App.showMessage("User already registered or key collision");
				}).catch(function (error){
					console.log("ERROR ExeRegisterUser");
					App.showError(error);
				})
			})
		}
		else {
			App.showError('Valid hash value is required');
		}
	},



/*======================================================================================================
	VIEW FUNCTIONS : Gets status of user registration
======================================================================================================*/

	CallRegStatus : function (){
		console.log("In app.js CallRegStatus");

		// If value POSTed to '/submitid' was invalid, show message accordingly
		const HASH = $('#userHash').val();
		if(HASH == "Invalid user ID submitted") {
			App.showError("Valid hash value is required");
			return;
		}
		
		else if(HASH) {
			web3.eth.getAccounts(function (error,accounts){
				if (error){
					console.log("ERROR CallRegStatus");
					App.showError(error);
				}
				App.currentAccount = accounts[0];
				
				App.contracts.IDManagement.deployed().then(function(instance){
					return instance.regStatus.call(HASH, {from:App.currentAccount})
				}).then(function(result) {
					console.log("CallRegStatus returns : ", result);
					if(result == true) {
						App.showMessage("Registered user");
					}
					else {
						App.showMessage("Unregistered user");
					}
				}).catch(function (error){
					console.log("ERROR CallRegStatus");
					App.showError(error);
				})
			});
		}
		else {
			App.showError('Valid hash value is required');
		}
	},




/*======================================================================================================
    INTERACTION VALIDATION : Checks whether the 2 users are allowed to interact
======================================================================================================*/

    ExeValInteraction: function(){
		console.log("In app.js ExeValInteraction");

		const ID1 = $('#chkId1').val();
		const ID2 = $('#chkId2').val();
		var HASH1 = "", HASH2 = "";

		if(ID1 == ""){
			// Both are null
			if(ID2 == ""){
				App.showError('Valid hash-1 and hash-2 values are required');
				return;
			}
			// Only hash-1 is null
			else{
				App.showError('Valid hash-1 values is required');
				return;
			}
		}
		// Only hash-2 is null
		if(ID1 != "" && ID2 == ""){
			App.showError('Valid hash-2 values is required');
			return;
		}

        if (ID1 && ID2){
			request.post("http://172.17.74.32:3000/val_post_id", {
					json: {
						id1: ID1,
						id2: ID2
					}
				},function(err, res, body){
					if(err){
						App.showError(err);
					}
					else {
						console.log("in success");
						$.get("http://172.17.74.32:3000/val_get_id", function(body, status){
							if(status == "success"){
								HASH1 = body.split(',')[0];
								HASH2 = body.split(',')[1];
								console.log("in get", HASH1, HASH2);
							}
						});
					}
			});
            web3.eth.getAccounts(function (error,accounts){
            if (error){
				console.log("ERROR ExeValInteraction");
                App.showError(error);
            }
			App.currentAccount = accounts[0];
			
            App.contracts.IDManagement.deployed().then(function(instance){
				// First check registration status of hash-1
				return instance.regStatus.call(HASH1, {from:App.currentAccount})
			}).then(function(res1) {
				console.log("ExeValInteraction returns 1 : ", res1);
				if(res1 == true) {
					// If hash-1 is registered, check reg status of hash-2
					App.contracts.IDManagement.deployed().then(function(instance){
						return instance.regStatus.call(HASH2, {from:App.currentAccount})
					}).then(function(res2) {
						console.log("ExeValInteraction returns 2 : ", res2);
						// If hash-2 is also registered, show appropriate msg
						if(res2 == true) {
							App.showMessage("Both users are registered (hash-1, hash-2)");
						} else {
							App.showMessage("hash-1 is registered, hash-2 unregistered");
						}
					});
				}
				else {
					// Check reg status of hash-2 even if hash-1 is unregistered
					App.contracts.IDManagement.deployed().then(function(instance){
						return instance.regStatus.call(HASH2, {from:App.currentAccount})
					}).then(function(res2) {
						console.log("ExeValInteraction returns 2 : ", res2);
						// If hash-2 is registered, show appropriate msg
						if(res2 == true) {
							App.showMessage("hash-1 is unregistered, hash-2 registered");
						} else {
							App.showMessage("Both users are unregistered (hash-1, hash-2)");
						}
					});
				}
            }).catch(function (error){
				console.log("ERROR ExeValInteraction");
                App.showError(error);
			})
          })
		}
        else {
            App.showError('Valid hash value is required');
        }
	},


/*======================================================================================================
	INITIALISATION : Intialises web3 when webpage is loaded onto browser
======================================================================================================*/

    init : async function (){
		await App.initWeb3();
		console.log("In app.js init, initiated App");
    }
 
}  
 
$(function() {
    $(window).load(function() {         
      	App.init();
    });
});
