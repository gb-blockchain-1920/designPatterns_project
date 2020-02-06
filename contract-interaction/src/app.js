const con = require('./bitBnBParams.js')
const Web3 = require('web3')
const port = 8545
const web3=new Web3('http://localhost:'+port)
const contract= new web3.eth.Contract(
    con.abi,
    con.address
)

// Fixed call parameters to send to contract call
let fixed_call= {
        from: con.owner,
        gas: 3000000,
        gasPrice: 400000
}
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
         contract.methods.transferFrom(from,to,value).send(fixed_call).then(()=>{
            

            contract.methods.transferFrom(from,to,value).call(fixed_call).then(res=>{
             result=res
             resolve(result)
            }).catch(err=>{
               console.error(err)
            })
            
         }).catch(err=>{
             reject('Error: Transcation unsuccessful')
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
            contract.methods.bid(Number(week),Number(amount)).send(fixed_call).then(()=>{
                contract.methods.bid(Number(week),Number(amount)).call(fixed_call).then(res=>{
                    result = res
                    resolve(result)
                }).catch(err=>{
                    console.error('Error: ',err)
                })
            }).catch(err=>{
                reject('Error: Transcation unsuccessful')
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
        contract.methods.withdraw().call(fixed_call).then(res=>{
            result = res
            resolve(result)
            console.log(res)
        }).catch(err=>{
            reject('Error: Transcation unsuccessful')
        }) 
      })  
}


// Function to see the total balance of the contract
exports.totalSupply=async function(){
    return new Promise((resolve, reject) => {
        let result
        contract.methods.totalSupply().call(fixed_call).then(res=>{
            result = res
            resolve(result)
            console.log(res)
        }).catch(err=>{
            reject('Error: Transcation unsuccessful')
        }) 
      })  
   
}

// Function to get balance of the address provided
exports.balanceOf=async function(address){
    if(isAddress(address)){
    return new Promise((resolve,reject)=>{
        let result 
        contract.methods.balanceOf(address).call(fixed_call).then(res=>{
            result=res
            resolve(result)
        }).catch(err=>{
            reject('Error: Transcation unsuccessful')
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
       contract.methods.allowance(owner,spender).call(fixed_call).then(res=>{
           result=res
           resolve(result)
       }).catch(err=>{
        reject('Error: Transcation unsuccessful')
       })
   })
 }
 else
 console.error('Error: Invalid addresses')
}

// Function calls the approve function in the contract 
exports.approve=async function(spender, value){
       if (isAddress(spender) && Number(value) > 1){
            contract.methods.approve(spender,value).send(fixed_call).then(()=>{
                return new Promise((resolve,reject)=>{
                    let result
                   contract.methods.approve.call(fixed_Call).then(res=>{
                       result=res
                       resolve(result)
                   }).catch(err=>{
                       reject('Error: Transcation unsuccessful')
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
         contract.methods.transfer(to,value).send(fixed_call).then((data)=>{
             console.log(data);
             return new Promise((resolve,reject)=>{
                 let result
                contract.methods.transfer.call(fixed_Call).then(res=>{
                    result=res
                    resolve(result)
                }).catch(err=>{
                    reject('Error: Transcation unsuccessful')
                })
             })
         }).catch(err=>{
             console.error('Error: ',err)
         })
    }
    else
    console.error('Error: Invalid address or value')
}