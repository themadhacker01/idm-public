TO-DO LIST

Complete "System Setup" content
Testing a smart contract on Remix IDE

************************************************************************************************************
SYSTEM CONFIG

truffle v4 supports only upto node v8.11.3 

nvm use 8.11.3
nvm alias default 8.11.3

npm install -g truffle@4.1.16

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04

************************************************************************************************************
NODE CONFIG & ACCOUNT CREATION

Run commands for Node-1, create an account
Start mining and stop after 5-10 blocks, when the account has sufficient gas

************************************************************************************************************
TRUFFLE SET-UP

mkdir IDMTuffle
cd IDMTuffle

touch customGenesis.json
Then, type in the configurations

************************************************************************************************************
SMART CONTRACT

In the contracts directory, type in the code for your contract after having tested on Remix IDE
Create a 2_deploy_contract.js file in the migrations folder and type the code

************************************************************************************************************
LINKING WITH ETHEREUM NETWORK

Paste this to truffle-config.js
These specify node configurations of the Node-1 of the blockchain

Copy the account address from the terminal where you created this account
You can run personal.listAccounts[0] for the same.

rpc: {
	host: "127.0.0.1",	// Running on localhost
	port: 8081
},

networks: {
    development: {
		host: "127.0.0.1",
		port: 8081,
		network_id: "*",
		from: "",	
		gas: 0
}

Restart Node-1, start mining. To deploy the contract, run on a new terminal window -
truffle compile
truffle migrate

This creates a .json file for the contract. Create a IDMinit.js file, copy and paste abi from IDManagement.json and type the rest of the code

Run loadScript("./IDMinit.js") which initialises a variable idm with the contract abi.
You can now run commands on the geth console to interact with the blockchain

************************************************************************************************************
LINKING WITH FRONTEND VIA NODEJS SERVER

In IDMTruffle directory, follow steps as given in https://techbrij.com/web-ui-smart-contract-ethereum-dapp-part-4 EXCEPT the modifications as given below :

MODIFICATIONS

Under "Client" heading, run in IDMTruffle directory :

sudo apt-get install build-essential
npm install truffle-contract@4.0.0-beta.2 --save-dev

Edit app.js file according to your requirements


Under "Webpack" heading, run in IDMTruffle directory :

npm install webpack webpack-cli --save-dev

************************************************************************************************************
TO START

Restart the Eth node using geth
npm run webpack	
npm run start

************************************************************************************************************
MINE ONLY TXNS

Also shows how JS scripts can be preloaded

https://ethereum.stackexchange.com/questions/3151/how-to-make-miner-to-mine-only-when-there-are-pending-transactions

************************************************************************************************************
USE FROM BROWSER SCRIPTS

npm install browserify-fs --save-dev

************************************************************************************************************
FOR NPM EACCESS ERROR

Deleted node_modules, package.json, package-lock.json

npm init
npm install express --save
npm install dotenv --save

Add following command in scripts of package.json >> "start": "node server/main.js"

<!-- npm install -g truffle@4.1.16 -->

sudo apt-get install build-essential
npm install truffle-contract@4.0.0-beta.2 --save-dev
npm install web3@1.0.0-beta.36 --save-dev

npm install webpack webpack-cli --save-dev

************************************************************************************************************
CHAINID vs NETWORKID

1. How is chainID different than networkID?

Network identifier (networkID) protects a node from connecting to the nodes that are synchronizing with other networks. As soon as connection between two nodes is established, these nodes exchange Status messages that, among other things, contain network identifiers of the sending nodes. When node receives Status message from its peer, it compares networkID in the message with node's own networkID and terminates the connection in case of mismatch.

Chain identifier (chainID) protects transaction included into one chain from being included into another chain. Basically, chain identifier is an integer number being used in the processes of signing transactions and verifying transaction signatures. If different chain identifiers are used for signing and verifying the transaction, then transaction verification will fail.

2. Is chainID and networkID needed in every block or just the genesis block?

network ID is not included into blocks, neither it is used when signing transactions or mining blocks. It is just an attribute of Ethereum Wire protocol that prevents nodes of different chains to connect to each other. Chain ID is not included into blocks, but is used during transaction signing and verification processes, effectively protecting transaction aiming one chain to appear on another chain.

networkId is used for the peer-to-peer communication between nodes and it isn't actually concern about the integrity of transactions of the blockchain.

************************************************************************************************************

To run an operation, execute the corresponding `.js` file (from the `Commands` directory) as `loadScript("filename.js")` in the console opened by either methods.

************************************************************************************************************

https://flaviocopes.com/node-http-post/
https://blog.fullstacktraining.com/res-json-vs-res-send-vs-res-end-in-express/
https://www.w3schools.com/jquery/jquery_ajax_get_post.asp
https://dev.to/williamragstad/how-to-use-ajax-3b5e


COOKIES

https://www.smashingmagazine.com/2010/10/local-storage-and-how-to-use-it/


************************************************************************************************************
NEW SYSTEM

delete node_modules, run `npm init`
put `fs: "empty"` in webpack.config.js
change proj_dir in files
create/restart Node-1
Run `truffle migrate` (if creating Node-1 from scratch)

************************************************************************************************************
WEB TEMPLATES

https://colorlib.com/wp/template/login-form-v18/
https://codepen.io/suez/pen/RpNXOR
https://codepen.io/khadkamhn/pen/ZGvPLo
https://colorlib.com/wp/template/dizzi/
https://colorlib.com/wp/template/oneschool/

************************************************************************************************************
GIT COMMANDS

git clone
git status