var KEY = 7089008002115567616;

idmanagement.Userdb.call(KEY, {from: eth.accounts[0], gas: 3000000}, function(err, res) {
	if(!err){
		console.log("OUTPUT (exists, uid) : ", res);
		if(res[0] == true) {
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
