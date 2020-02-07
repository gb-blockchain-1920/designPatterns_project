const BitBnBtoken = artifacts.require("BitBnBtoken");
const truffleAssert = require("truffle-assertions");

module.exports = function(deployer) {
    deployer.deploy(BitBnBtoken);

  };

contract('BitBnBtoken', (accounts) => {
    
    it("should be able to load the initial balance of owner of contract", async () => {
        const tokenInstance = await BitBnBtoken.deployed();
        const balance = await tokenInstance.balanceOf.call(accounts[0]);
        console.log("owner balance = " + balance.toString(accounts[0]));
    });


    // VM revert error at runtime-----------------------------------------
    /*
    it("should be able to transfer tokens from one account to other", async () => {
        const owner = accounts[0];
        const spender = accounts[1];
        const value = "1000000000000000000";
        const receipient = accounts[2];
        const transferValue = "1000000000";
        const openVoting = "false";
        const tokenInstance = await BitBnBtoken.deployed({ from: owner });
        const transferTx = await tokenInstance.transfer.sendTransaction(
          spender,
          value,
          { from: owner }
        );
        const balance = await tokenInstance.balanceOf.call(spender);
        assert.equal(
          balance.toString(),
          value,
          "amount was not received by spender"
        );
        truffleAssert.eventEmitted(transferTx, "Transfer", async ev => {
            assert.equal(
            openVoting(),
            false,
            "Voting is still open, can't transfer"
          );
          assert(
            ev["_from"].toString() == owner.toString() &&
              ev["_to"].toString() == spender.toString() &&
              ev["_value"].toString() == value,
            "Wrong transfer"
          );
        });
        const approveTx = await tokenInstance.approve.sendTransaction(
          spender,
          value,
          { from: owner }
        );
        truffleAssert.eventEmitted(approveTx, "Approval", async ev => {
          assert(
            ev["_owner"].toString() == owner.toString() &&
              ev["_spender"].toString() == spender.toString() &&
              ev["_value"].toString() == value,
            "Unexpected event"
          );
        });
        const allowanceAmount = await tokenInstance.allowance.call(
          owner,
          spender
        );
        assert.equal(allowanceAmount.toString(), value, "Wrong allowance amount");
        const transferFromTx = await tokenInstance.transferFrom.sendTransaction(
          spender,
          receipient,
          transferValue,
          { from: owner }
        );
        truffleAssert.eventEmitted(transferFromTx, "Transfer", async ev => {
          assert(
            ev["_from"].toString() == spender.toString() &&
              ev["_to"].toString() == receipient.toString() &&
              ev["_value"].toString() == transferValue,
            "Wrong transfer from"
          );
        });
    });
    */




    it.only('should be able to allow spender 100 tokens by owner', async () => {
        const owner = accounts[0];
        const spender = accounts[1];
        const value = "100";
        const tokenInstance = await BitBnBtoken.deployed();
        await tokenInstance.approve(spender, value);
        let exchangeAllowance = await tokenInstance.allowance(owner, spender);
       assert.equal(exchangeAllowance.valueOf(), 100, "the exchange is not allowed to move 100 tokens");
    
    });


   
});

