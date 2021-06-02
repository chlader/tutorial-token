var TutorialTokenSale = artifacts.require('../TutorialTokenSale.sol');
var TutorialToken = artifacts.require('../TutorialToken.sol');

contract('TutorialTokenSale', function(accounts) {
    var tokenInstance;
    var tokenSaleInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 1000000000000000; // in wei
    var tokensAvailable = 750000;
    var numberOfTokens;


    it('should initialize the contract with the correct values', () => {
        return TutorialTokenSale.deployed().then((instance) => {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then((address) => {
            assert.notEqual(address, 0x0, 'has contract adddresss');
            return tokenSaleInstance.tokenContract();
        }).then((address) => {
            assert.notEqual(address, 0x0, 'has token contract adddresss');
            return tokenSaleInstance.tokenPrice();
        }).then((price) => {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });

    it('facilitates token buying', function() {
        return TutorialToken.deployed().then(function(instance) {
          // Grab token instance first
          tokenInstance = instance;
          return TutorialTokenSale.deployed();
        }).then(function(instance) {
          // Then grab token sale instance
          tokenSaleInstance = instance;
          // Provision 75% of all tokens to the token sale
          return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
        }).then(function(receipt) {
          numberOfTokens = 10;
          return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
        }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
          assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
          assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
          return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
          assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
          return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), numberOfTokens);
          return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
          // Try to buy tokens different from the ether value
          return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
          return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
        });
      });

    it('should end token sale', () => {
        return TutorialToken.deployed().then((instance) => {
            // Grab token instance first
            tokenInstance = instance;
            return TutorialTokenSale.deployed();
        }).then(function(instance) {
            // Then grab token sale instance
            tokenSaleInstance = instance
            // try to end sale from account other than admin
            return tokenSaleInstance.endSale({ from: buyer });
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
            // end sale as admin
            return tokenSaleInstance.endSale({ from: admin });
        }).then((receipt) => {
            return tokenInstance.balanceOf(admin);
        }).then((balance) => {
            assert.equal(balance.toNumber(), 999990, 'returns all unsold tokens to admin');
            return tokenSaleInstance.tokenPrice();
        }).then((price) => {
            assert.equal(price.toNumber(), 0, 'token was reset');
        })
    });
});