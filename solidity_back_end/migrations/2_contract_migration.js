const tokenInstance = artifacts.require("BitBnBtoken");

module.exports = function(deployer) {
  deployer.deploy(tokenInstance, 100, 1);
};


