var HASH = "0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

idmanagement.regStatus.call(HASH, {from: eth.accounts[0], gas: 3000000}, function(err, res) {
	if(!err){
		console.log("OUTPUT : ", res);
		if(res == true) {
			console.info("INFO : User successfully registered");
		}
		else {
			console.info("ALERT : Un-registered user");
		}
	}
	else {
		console.log(err);
	}
});
