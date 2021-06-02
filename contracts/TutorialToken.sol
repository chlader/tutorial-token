// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TutorialToken {
    string public name = "Tutorial Token";
    string public symbol = "TUT";
    string public standard = "Tutorial Token v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    // allowance

    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    
    // Transfer function - will transfer a fixed value of tokens from the total supply to the account specified
    // arg1: transfer to account
    // arg2: transfer amount
    // Returns boolean
    function transfer(address _to, uint256 _value) public returns (bool success) {

        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // Approve function - approval of fixed value of tokens of spender account
    // arg1: approval of address specified
    // arg2: amount of tokens to approve
    // Returns boolean
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // TransferFrom function - will transfer a fixed value of tokens from one account to another account specified
    // arg1: transfer from account
    // arg2: transfer to account
    // arg3: amount of tokens
    // Returns boolean
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;
        
        
        emit Transfer(_from, _to, _value);
        return true;
    }
}