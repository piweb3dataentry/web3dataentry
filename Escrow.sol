// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
 * Escrow contract for web3dataentry
 *
 * Responsibilities:
 * - Hold Pi tokens deposited by requesters for a task.
 * - Keep per-task balances.
 * - On admin-approved payout: transfer amount to worker and keep a fixed fee in contract.
 * - Allow owner to withdraw accumulated fees.
 * - Provide refund functionality (owner-triggered) to requester if needed.
 *
 * Assumptions:
 * - Pi token is ERC20-style with 18 decimals. Fee is set in token smallest units.
 * - This contract uses a centralized owner (platform) to approve payouts.
 *   For higher decentralization replace 'onlyOwner' with multisig or DAO-based approvals.
 */

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Escrow {
    address public owner;
    IERC20 public piToken;
    uint256 public feePerPayout; // expressed in token smallest unit (e.g., 0.01 * 1e18)

    struct TaskFunds {
        address requester;
        uint256 amount; // total token amount reserved for task
        bool exists;
        bool paidOut;
    }

    mapping(uint256 => TaskFunds) public taskFunds; // taskId -> funds

    event TaskFunded(uint256 indexed taskId, address indexed requester, uint256 amount);
    event TaskPaid(uint256 indexed taskId, address indexed worker, uint256 amountPaid, uint256 feeTaken);
    event FeesWithdrawn(address indexed to, uint256 amount);
    event TokenAddressUpdated(address indexed oldAddress, address indexed newAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Escrow: only owner");
        _;
    }

    constructor(address _piToken, uint256 _feePerPayout) {
        require(_piToken != address(0), "Escrow: token zero");
        owner = msg.sender;
        piToken = IERC20(_piToken);
        feePerPayout = _feePerPayout;
    }

    // Admin can update token address if needed (e.g., after migration)
    function setTokenAddress(address _newToken) external onlyOwner {
        require(_newToken != address(0), "Escrow: token zero");
        address old = address(piToken);
        piToken = IERC20(_newToken);
        emit TokenAddressUpdated(old, _newToken);
    }

    // Requester must approve this contract to spend 'amount' tokens before calling.
    function fundTask(uint256 taskId, uint256 amount) external {
        require(amount > 0, "Escrow: amount>0");
        TaskFunds storage t = taskFunds[taskId];
        require(!t.paidOut, "Escrow: already paid");

        if (!t.exists) {
            t.exists = true;
            t.requester = msg.sender;
        } else {
            require(t.requester == msg.msg.sender || t.requester == msg.sender, "Escrow: not task owner");
        }

        // transfer tokens from requester to this contract
        bool ok = piToken.transferFrom(msg.sender, address(this), amount);
        require(ok, "Escrow: transferFrom failed");

        t.amount += amount;
        emit TaskFunded(taskId, msg.sender, amount);
    }

    // Owner approves payout to worker for a specific task.
    // amount is amount to send to worker (feePerPayout will be deducted from reserve).
    function payout(uint256 taskId, address worker, uint256 amount) external onlyOwner {
        require(worker != address(0), "Escrow: worker zero");
        TaskFunds storage t = taskFunds[taskId];
        require(t.exists, "Escrow: task not exists");
        require(!t.paidOut, "Escrow: already paid");
        require(amount > 0, "Escrow: amount>0");

        uint256 totalRequired = amount + feePerPayout;
        require(t.amount >= totalRequired, "Escrow: insufficient task funds");

        // transfer amount to worker
        bool ok1 = piToken.transfer(worker, amount);
        require(ok1, "Escrow: worker transfer failed");

        // keep fee inside contract balance (owner withdraws later)
        t.amount -= totalRequired;
        t.paidOut = true;

        emit TaskPaid(taskId, worker, amount, feePerPayout);
    }

    // Owner can withdraw collected fees to a chosen address
    function withdrawFees(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Escrow: to zero");
        bool ok = piToken.transfer(to, amount);
        require(ok, "Escrow: fee withdraw failed");
        emit FeesWithdrawn(to, amount);
    }

    // Owner may refund the entire remaining amount of a task to a given address (typically requester)
    function refund(uint256 taskId, address to) external onlyOwner {
        require(to != address(0), "Escrow: to zero");
        TaskFunds storage t = taskFunds[taskId];
        require(t.exists, "Escrow: not exists");
        require(!t.paidOut, "Escrow: already paid");

        uint256 amt = t.amount;
        require(amt > 0, "Escrow: nothing to refund");
        t.amount = 0;
        t.paidOut = true;

        bool ok = piToken.transfer(to, amt);
        require(ok, "Escrow: refund transfer failed");
    }

    // read-only helper: returns escrow balance for a task
    function getTaskBalance(uint256 taskId) external view returns (uint256) {
        return taskFunds[taskId].amount;
    }
}
