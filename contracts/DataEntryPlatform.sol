// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PiCoin.sol";

contract DataEntryPlatform {
    PiCoin public piCoin;
    address public owner;

    struct Task {
        uint256 id;
        string title;
        string description;
        uint256 reward;
        address assignedTo;
        bool completed;
    }

    uint256 public nextTaskId = 1;
    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 indexed taskId, string title, uint256 reward);
    event TaskCompleted(uint256 indexed taskId, address user);

    constructor(address _piCoin) {
        piCoin = PiCoin(_piCoin);
        owner = msg.sender;
    }

    function createTask(string memory title, string memory description, uint256 reward) external {
        require(msg.sender == owner, "Only owner");
        tasks[nextTaskId] = Task(nextTaskId, title, description, reward, address(0), false);
        emit TaskCreated(nextTaskId, title, reward);
        nextTaskId++;
    }

    function completeTask(uint256 taskId) external {
        Task storage t = tasks[taskId];
        require(!t.completed, "Completed");
        t.assignedTo = msg.sender;
        t.completed = true;
        // Transfer from owner to user -- owner must approve this contract for transferFrom
        require(piCoin.balanceOf(owner) >= t.reward, "Insufficient platform token balance");
        piCoin.transferFrom(owner, msg.sender, t.reward);
        emit TaskCompleted(taskId, msg.sender);
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }
}
