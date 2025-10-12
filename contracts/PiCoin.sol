// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PiCoin is ERC20 {
    address public owner;

    constructor() ERC20("PiCoin", "PI") {
        owner = msg.sender;
        _mint(owner, 1000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        _burn(from, amount);
    }
}
