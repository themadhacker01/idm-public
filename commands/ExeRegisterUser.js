var HASH = "0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

idmanagement.registerUser.sendTransaction(HASH, {from: eth.accounts[0], gas: 3000000}, function(err, res) {
	if(!err) {
		console.log(res);
	}
	else {
		console.log(err);
	}
});
