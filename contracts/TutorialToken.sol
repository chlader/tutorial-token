// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TutorialToken {
    string public name = 'Tutorial Token';
    string public symbol = 'TUT';
    string public standard = 'Tutorial Token v1.0';
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Transfer
    
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // exception if account doesn't have enough
        require(balanceOf[msg.sender] >= _value);
        // transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        // return bool
        // Transfer event

        return true;
    }
}