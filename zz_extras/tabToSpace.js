const fs = require('fs');

var rawStr = "";
const filepath = "../client/index.html";

fs.readFile(filepath, function(err, data){
	if(err){
		console.log(err);
	}
	rawStr = data.toString();
	replaceTab();
})

function replaceTab(){
	console.log(rawStr);
	rawStr = rawStr.replace("\t", "")
	console.log(rawStr);
	fs.writeFile('./replaced.txt', rawStr, function(err){
		console.log("Replaced tabs with spaces");
		if(err){
			console.log(err);
		}
	});
}