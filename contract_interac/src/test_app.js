const app=require('./bitBnBInterac.js')
const Web3=require('web3')
const web3=new Web3('http://localhost:8545')


web3.eth.getAccounts().then(res=>{
     

    
}).catch(err=>{
    console.error('Error:',err.message)
})