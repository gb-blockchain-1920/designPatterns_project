import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import Web3 from "web3";
import {
  BitBnB_Contract_ABI,
  BitBnB_Contract_ADDRESS,
  BitBnB_Contract_ByteCode,
  BitBnB_Contract_Data_Param
} from "./bitBnBTokenContract";

const web3 = new Web3("http://127.0.0.1:8545");

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <div>
        <BitBnBFrontEnd></BitBnBFrontEnd>
      </div>
    </div>
  );
}

function BitBnBFrontEnd() {
  Integration();
  return (
    <div>
      <Typography variant="h3">
        Implement front end for BitBnB Token here..!!
      </Typography>
    </div>
  );
}

function Integration() {

  const [accounts, setAccounts] = React.useState([]);
  const [contractOwner, setContractOwner] = React.useState();
  const [bitBnBcontractInstance, setBitBnBcontractInstance] = React.useState();
  const [totalSupply, setTotalSupply] = React.useState(0);
  const [balance, setBalance] = React.useState(0);

  var totalShares = 10000;
  var etherRate = 1;

  // Get Accounts from Ganache and set acccounts and owner of contract
  React.useEffect(() => {
    const getAccounts = async () => {
      const accountsTemp = await web3.eth.getAccounts();
      setAccounts(accountsTemp);
      setContractOwner(accountsTemp[0]);
    };
    getAccounts();
  }, []);
  
  
  // Deploy contract and create BitBnBContractInstance
  React.useEffect(() => {

    if (Boolean(contractOwner)) {
      // Create contract
      const bitBnBContract = new web3.eth.Contract(
        BitBnB_Contract_ABI,
        BitBnB_Contract_ADDRESS,
        { from: contractOwner }
        );
        
        // Deploy contract and set contract instance after deployment
        bitBnBContract.deploy({
          data: BitBnB_Contract_Data_Param,
          arguments: [Number(totalShares), Number(etherRate)]
        }).send({from: contractOwner,
          gas: '4700000'
        }, 
        function (error, txHash) {
          console.log(txHash)
        })
        .then((contractInstance) => {
          console.log(contractInstance.options.address);
          setBitBnBcontractInstance(contractInstance);
        })
    }

    }, [accounts, contractOwner, etherRate, totalShares])
    

    //  Get Total Supply
    React.useEffect(() => {
      if (Boolean(bitBnBcontractInstance)) {
        var totalSupply = bitBnBcontractInstance.methods
        .totalSupply()
        .call();
        
        totalSupply.then(data => {
          // console.log(data);
          setTotalSupply(data);
        });
      }
    }, [bitBnBcontractInstance]);

    const onClickTotalSupply = () => {
      if (Boolean(totalSupply))
        console.log(totalSupply);
    };
    onClickTotalSupply();
  return <div></div>;
}

export default App;
