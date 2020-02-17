pragma solidity ^0.4.25;

/*
    TEST USER HASHES (256 bit)
    
    0x88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589
    0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
*/

contract IDManagement {
    
    uint64 keyLen = 4;
    
    struct User {
        bool exists;
        string subHash;
    }
    
    mapping (uint64 => User) public Userdb;

/*============================================================================
    USER REGISTRATION
    
    Registers a new user. It splits input hash into key-subHash pairs
    key     : 8 bytes (64 bits)
    subHash     : 24 bytes (192 bits)
    1 byte  : 8 bits = 2 chars in hexadecimal representation (00-ff)
============================================================================*/

    function registerUser(string hash) public returns (int status) {
        
        uint64 key = stringToUint64(substring(hash, 2, keyLen+2));
        string memory checkVal = substring(hash, keyLen+2, 66);
        
        if (Userdb[key].exists == false) {
            // Register new user in the system
            User memory newUser;
            
            newUser.exists = true;
            newUser.subHash = checkVal;
            Userdb[key] = newUser;
            
            // New user registered
            status = 1;
            return status;
        }
        else if (Userdb[key].exists == true) {
            if (equalStrings(Userdb[key].subHash, checkVal) == false) {
                // Invalid user credentials or Key collision
                status = 0;
                return status;
            }
            else if (equalStrings(Userdb[key].subHash, checkVal) == true) {
                // Raise alert
                status = -1;
                return status;
            }
        }
    }



/*============================================================================  
    USER VALIDATION
    
    Validates the user to perform various operations on the network
    As every user we create has a unique subHash as a property
============================================================================*/

    function validateUser(string hash) view internal returns(int) {
        uint64 key = stringToUint64(substring(hash, 2, keyLen+2));
        string memory checkVal = substring(hash, keyLen+2, 64);
        
        User memory temp = Userdb[key];
        
        if (temp.exists == false) {
            // User does not exists, Ask user to register
            return -1;
        }
        else if (temp.exists == true) {
            
            if (equalStrings(temp.subHash, checkVal) == true) {
                // User is valid, Permitted to transact
                return 1;
            }
            else if(equalStrings(temp.subHash, checkVal) == false) {
                // Raise alert, Invalid user credentials
                return 0;
            }
        }
    }

    
/*============================================================================
    INTERACTION ELIGIBILITY
    
    Forwards the interaction to ethereum ONLY IF both users are registered
    Validates this condition using resX return value from validateUser()
    
    For resX = -1    : User does not exists; Ask user to register
    For resX = 0     : Invalid details. Re-enter/update account credentials
============================================================================*/
    
    function txnCheck(string hash1, string hash2) public view returns (bool) {
        
        // Local var to store return values from validate function
        int res1 = 0;
        int res2 = 0;
        
        res1 = validateUser(hash1);
        res2 = validateUser(hash2);
        
        if (res1 == 1 && res2 == 1) {
            // Allows interaction
            return true;
        }
        else {
            // Raise alert - User is not permitted to transact
            // Txn not authorised
            return false;
        }
    }
    
/*============================================================================
    VIEW FUNCTIONS
    
    We define 'view' functions for each process, required for 'geth' console
    As solidity shows output only for 'view' or 'pure' functions
============================================================================*/


    function regStatus(string hash) view public returns (bool) {
        uint64 key = stringToUint64(substring(hash, 2, keyLen+2));
        
        if(Userdb[key].exists == true) {
            return true;
        }
        else {
            return false;
        }
    }


/*============================================================================
    OTHER FUNCTIONS
    
    Contains the code for some necessary functions,
    Since solidity does not have predefined libraries or modules
============================================================================*/

    
    // Solidity does not have pre-defined substring function
    function substring(string str, uint startIndex, uint endIndex) pure public returns (string) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }
    
    // Mapping is not defined for dynamic-sized keys (eg. strings)
    // This converts the key from : string -> bytes8 -> uint64
    function stringToUint64(string memory source) pure public returns (uint64) {
        bytes8 ans = stringToBytes8(source);
        return uint64(ans);
    }
    
    function stringToBytes8(string memory source) pure internal returns (bytes8 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
        return result;
    }
    
    // Checks string equality; Returns true if equal, false otherwise
    function equalStrings (string memory a, string memory b) pure internal returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
