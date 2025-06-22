
// this libarary allow us to generate public and private keys 
// also has methods to sign and verify signature
const EC = require("elliptic").ec;

// this is the algorithm that also the basis of bitcoin wallets => secp256k1 
const ec = new EC("secp256k1");

// generate the keys using the ec methods
const key = ec.genKeyPair();
// this generate the public key and make it into hex form 
const publicKey = key.getPublic("hex");
// this generate the private key and make it into hex form 
const privateKey = key.getPrivate("hex");

console.log("private key : ", privateKey);

console.log(); // empty log line 

console.log("public key : ", publicKey);

