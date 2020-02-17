var idmanagement = web3.eth.contract([
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "Userdb",
      "outputs": [
        {
          "name": "exists",
          "type": "bool"
        },
        {
          "name": "uid",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "hash",
          "type": "string"
        }
      ],
      "name": "registerUser",
      "outputs": [
        {
          "name": "status",
          "type": "int256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "hash1",
          "type": "string"
        },
        {
          "name": "hash2",
          "type": "string"
        }
      ],
      "name": "txnCheck",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "hash",
          "type": "string"
        }
      ],
      "name": "regStatus",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "str",
          "type": "string"
        },
        {
          "name": "startIndex",
          "type": "uint256"
        },
        {
          "name": "endIndex",
          "type": "uint256"
        }
      ],
      "name": "substring",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "source",
          "type": "string"
        }
      ],
      "name": "stringToUint64",
      "outputs": [
        {
          "name": "",
          "type": "uint64"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    }
  ]).at("0x07274cbff89b93d2793c3ec877aa82b5335055f4");