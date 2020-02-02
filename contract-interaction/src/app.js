const Web3 = require('web3')
const ethers = require('ethers')
const ganache = require('ganache-cli')
const server = ganache.server('mnemonic')
const port = 8545
let web3=new Web3('http://localhost:'+port)
let privateKey= ethers.Wallet.fromMnemonic(Object.values(Object.values(server.provider)[3])[16]).privateKey
let wallet= web3.eth.accounts.privateKeyToAccount(privateKey)
console.log(wallet)

