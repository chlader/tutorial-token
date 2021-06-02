// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./TutorialToken.sol";

contract TutorialTokenSale {
    address admin;
    TutorialToken public tokenContract;
    uint256 public tokenPrice;

    constructor (TutorialToken _tokenContract,  uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}