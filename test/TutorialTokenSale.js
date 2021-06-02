var TutorialTokenSale = artifacts.require('../TutorialTokenSale.sol');

contract('TutorialTokenSale', function(accounts) {
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // in wei

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
});