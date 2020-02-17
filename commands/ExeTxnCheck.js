var HASH1 = "0x88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589";
var HASH2 = "0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

idmanagement.txnCheck.call(HASH1, HASH2, {from: eth.accounts[0], gas: 3000000}, function(err, res) {
	if(!err) {
		console.log(res);
	}
	else {
		console.log(err);
	}
});
