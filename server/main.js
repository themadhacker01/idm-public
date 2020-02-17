require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const readline = require('readline');

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '172.17.74.32';
const proj_dir = `/home/amey/ceeri/IDMTruffle`;

// Defining global variable to pass data from '/receive' to '/gethash'
var globalIdVal = "";
var id1 = "", id2 = "";

app.use(express.static('client'));
app.use(express.static('build/contracts'));

// Serves the home page of the project
app.get('/index', (req, res) => {
	res.sendFile(`${proj_dir}/client/index.html`);
});

// Serves the form for the admin to submit user id
app.get('/submitid', (req, res) => {
	res.sendFile(`${proj_dir}/client/submitid.html`);
});

// SUBMIT USER ID : Receives the id value submitted by the admin
app.post('/receive', (req, res) => {
	console.log("Received POST");
	var body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', () => {
		globalIdVal = JSON.parse(body).value;
		res.end("Responded to POST " + globalIdVal);
	});
});

// GET USER HASH : Called by 'Get Hash' button to retrieve the hash correesponding to the submitted id
app.get('/gethash', (req, res) => {
	var lineReader = readline.createInterface({
		input: fs.createReadStream(`${proj_dir}/data/GoldenRef.csv`)
	});

	lineReader.on('line', function (line) {
		var uid = line.split(',')[0];
		var hash = line.split(',')[1];

		if(uid == globalIdVal) {
			console.log("here", hash);
			res.json({value: hash});
			res.end();
		}
	});
});

// INTERACTION VALIDATION : Receives user id when 'Validate Interaction' is clicked
app.post('/val_post_id', (req, res) => {
	var body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', () => {
		id1 = JSON.parse(body).id1;
		id2 = JSON.parse(body).id2;
		console.log("Responded to POST " + id1 + " " + id2);
		res.end();
	});
});

// INTERACTION VALIDATION : Extracts hash value corresponding to submitted user id
app.get('/val_get_id', (req, res) => {
	console.log("--> Responded to GET " + id1 + " " + id2);
	var lineReader = readline.createInterface({
		input: fs.createReadStream(`${proj_dir}/data/GoldenRef.csv`)
	});

	var value1 = "", value2 = "";
	lineReader.on('line', function (line) {
		var uid = line.split(',')[0];
		var hash = line.split(',')[1];

		// Assign values corresponding to the user id
		if(uid == id1){
			value1 = hash;
		}
		if(uid == id2){
			value2 = hash;
		}
		// End the response once both hashes have been extracted
		if(value1 && value2){
			res.end(value1 + "," + value2);
		}
	});
});

// Serves the standard error page
app.get('*', (req, res) => {
	res.status(404);
	res.send('Oops... this URL does not exist');
});

app.listen(PORT, IP, () => {
	console.log(`IDMTruffle App running on port ${PORT}...`);
});
