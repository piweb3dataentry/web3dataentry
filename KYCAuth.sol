// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KYCAuth {
    struct User {
        string name;
        string email;
        bool isKYCApproved;
        bool exists;
    }

    address public admin;
    mapping(address => User) private users;

    event UserRegistered(address indexed userAddress, string name, string email);
    event KYCApproved(address indexed userAddress);
    event UserRemoved(address indexed userAddress);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier userExists(address userAddress) {
        require(users[userAddress].exists, "User not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register a new user
    function registerUser(string memory _name, string memory _email) external {
        require(!users[msg.sender].exists, "User already registered");
        users[msg.sender] = User({
            name: _name,
            email: _email,
            isKYCApproved: false,
            exists: true
        });
        emit UserRegistered(msg.sender, _name, _email);
    }

    // Admin approves KYC
    function approveKYC(address _userAddress) external onlyAdmin userExists(_userAddress) {
        users[_userAddress].isKYCApproved = true;
        emit KYCApproved(_userAddress);
    }

    // Check if a user is KYC approved
    function isKYCApproved(address _userAddress) external view userExists(_userAddress) returns (bool) {
        return users[_userAddress].isKYCApproved;
    }

    // Remove user
    function removeUser(address _userAddress) external onlyAdmin userExists(_userAddress) {
        delete users[_userAddress];
        emit UserRemoved(_userAddress);
    }

    // Get user details
    function getUser(address _userAddress) external view userExists(_userAddress) returns (string memory, string memory, bool) {
        User memory u = users[_userAddress];
        return (u.name, u.email, u.isKYCApproved);
    }
}
