/*======================================================================================================

PACKAGE INFO

'sjcl' is Stanford Javascript Crypto Library. It is maintained by reputed cryptography researchers.
It contains a reliable JavaScriptJS implementation of SHA-256 function.

https://www.npmjs.com/package/sjcl
https://bitwiseshiftleft.github.io/sjcl/


TO USE

Run `node populate.js` from inside the `data` directory

======================================================================================================*/

const sjcl = require('sjcl');
const fs = require('fs');

// To clear your current file data for fresh batch of uid-hash pairs
fs.writeFile("GoldenRef.csv", "UID,HASH\n", function(err){
	console.log("Reset file");
	if(err)
		console.log(err);
});

// To account for submission of null ID value
var writeStr = "" + "," + "Invalid user ID submitted" + "\n";
fs.appendFile("GoldenRef.csv", writeStr, function(err){
	if(err)
		console.log(err);
});

// Populates the file with uid-hash pairs
const NUM = 50;
for(var i = 1; i <= NUM ; i++) {
	var uid = 4000 + i;
	var digest_sha256 = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash("" + uid));

	var writeStr = uid + "," + "0x" + digest_sha256 + "\n";
	fs.appendFile("GoldenRef.csv", writeStr, function(err){
		if(err)
			console.log(err);
	});
}
