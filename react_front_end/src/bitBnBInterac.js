const con = require('./bitBnBParams.js')
const Web3 = require('web3')
const port = 8545
const web3=new Web3('http://localhost:'+port)
const contract= new web3.eth.Contract(
    con.abi,
    con.address
)
web3.eth.getAccounts().then(res=>{
    
}).catch(err=>{
    console.error('Error:',err.message)
})

// Fixed call parameters to send to contract call

// Function checks if the given address is valid ethereum address
function isAddress(address){
    return (web3.utils.isAddress(address))
}

// Function checks if the given numnerical value is a valid numerical value
function isValidValue(value){
    return (Number(value) > 0)
}

// Function to tansfer value from addr1 to addr2
exports.transferFrom= async function (from, to , value){
    if (isAddress(from) && isAddress(to) && (from != to)) {
           if(isValidValue(value)){
        return new Promise((resolve,reject)=>{
        let result 
         contract.methods.transferFrom(from,to,value).send(con.fixed_call).then(()=>{
            

            contract.methods.transferFrom(from,to,value).call(con.sendfixed_call).then(res=>{
             result=res
             resolve(result)
            }).catch(err=>{
               console.error(err)
            })
            
         }).catch(err=>{
             reject(err.message + "\nError: Transcation unsuccesful")
         })
         
        })
        }
           else
            console.error('Error: ', "Invalid amount entered")
    }
    else{
     console.error('Error: ', " Invalid address input")
}
}



// Function to call a bid on a week with amount given
exports.bid= async function (week, amount){
       if ((Number(week)>=1 && Number(week)<=52) && Number(amount) >=1){
        return new Promise((resolve, reject) => {
            let result
            contract.methods.bid(Number(week),Number(amount)).send(con.fixed_call).then(()=>{
                contract.methods.bid(Number(week),Number(amount)).call(con.fixed_call).then(res=>{
                    result = res
                    resolve(result)
                }).catch(err=>{
                    console.error('Error: ',err)
                })
            }).catch(err=>{
                reject(err.message + "\nError: Transcation unsuccesful")
            }) 
          })  
   }
   else
   console.error('Error: ', 'Invalid args (week>=1, amount>=1)')
}


// Function to withdraw amount from the contract 
// Only the owner can call this function 
exports.withdraw=async function (){
    return new Promise((resolve, reject) => {
        let result
        contract.methods.withdraw().call(con.fixed_call).then(res=>{
            result = res
            resolve(result)
            console.log(res)
        }).catch(err=>{
            reject(err.message + "\nError: Transcation unsuccesful")
        }) 
      })  
}


// Function to see the total balance of the contract
exports.totalSupply=async function(){
    return new Promise((resolve, reject) => {
        let result
        contract.methods.totalSupply().call(con.fixed_call).then(res=>{
            result = res
            resolve(result)
            console.log(res)
        }).catch(err=>{
            reject(err.message + "\nError: Transcation unsuccesful")
        }) 
      })  
   
}

// Function to get balance of the address provided
exports.balanceOf=async function(address){
    if(isAddress(address)){
    return new Promise((resolve,reject)=>{
        let result 
        contract.methods.balanceOf(address).call(con.fixed_call).then(res=>{
            result=res
            resolve(result)
        }).catch(err=>{
            reject(err.message + "\nError: Transcation unsuccesful")
        })
    })
  }
  else
    console.error('Error: Invalid address')
}

// Function alllows to transfer amount from owner to spender
exports.allowance=async function(owner, spender){
 if(isAddress(owner)&& isAddress(spender)&& owner != spender){
   return new Promise((resolve,reject)=>{
       let result 
       contract.methods.allowance(owner,spender).call(con.fixed_call).then(res=>{
           result=res
           resolve(result)
       }).catch(err=>{
        reject(err.message + "\nError: Transcation unsuccesful")
       })
   })
 }
 else
 console.error('Error: Invalid addresses')
}

// Function calls the approve function in the contract 
exports.approve=async function(spender, value){
       if (isAddress(spender) && Number(value) > 1){
            contract.methods.approve(spender,value).send(con.fixed_call).then(()=>{
                return new Promise((resolve,reject)=>{
                    let result
                   contract.methods.approve.call(con.fixed_Call).then(res=>{
                       result=res
                       resolve(result)
                   }).catch(err=>{
                       reject(err.message + "\nError: Transcation unsuccesful")
                   })
                })
            }).catch(err=>{
                console.error('Error: ',err)
            })
       }
       else
       console.error('Error: Invalid address or value')
}


// Function calls the transfer function in the contract
exports.transfer=async function(to, value){
    if (isAddress(to) && Number(value) > 1){
         contract.methods.transfer(to,value).send(con.fixed_call).then((data)=>{
             console.log(data);
             return new Promise((resolve,reject)=>{
                 let result
                contract.methods.transfer.call(con.fixed_Call).then(res=>{
                    result=res
                    resolve(result)
                }).catch(err=>{
                    reject(err.message + "\nError: Transcation unsuccesful")
                })
             })
         }).catch(err=>{
             console.error('Error: ',err)
         })
    }
    else
    console.error('Error: Invalid address or value')
}


// Function to call the toggleBidding transcation in the contract 
exports.toggleBidding= async function(){
    return new Promise((resolve,reject)=>{
        let result
        contract.methods.toggleBidding().send(con.fixed_call).then(res=>{
            result=res
            resolve(result)
        }).catch(err=>{
            reject(err.message + "\nError: Transcation unsuccesful")
        })
    })
}

// Function to call the fallback function 
exports.fallback=async function(value){
    if(Number(value)>0){
    return new Promise((resolve,reject)=>{
        let result
        web3.eth.sendTransaction({
            to: contract.options.address,
            from: con.fixed_call.from,
            value: web3.utils.fromWei(value, 'ether')
        }).then(res=>{
            result=res
            resolve(result)
        }).catch(err=>{
            reject(err.message + "\nError: Transcation unsuccesful")
        })
    })
}
else
console.error('Error: Invalid value entered (value> 0)')
}