var TutorialToken = artifacts.require("./TutorialToken.sol");
var TutorialTokenSale = artifacts.require("./TutorialTokenSale.sol");

module.exports = function(deployer) {
    deployer.deploy(TutorialToken, 1000000).then(function() {
        // token price is 0.001 ETH
        var tokenPrice = 1000000000000000;
        return deployer.deploy(TutorialTokenSale, TutorialToken.address, tokenPrice);
    });
};