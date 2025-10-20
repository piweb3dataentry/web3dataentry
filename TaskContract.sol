// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
 * TaskContract for web3dataentry
 *
 * Responsibilities:
 * - Allow a requester (client) or platform admin to create a task record with metadata and reward.
 * - Allow workers to submit results linked to a task.
 * - Allow admin to approve or reject a submission.
 * - When approved, TaskContract calls Escrow.payout(...) to perform the token transfer.
 *
 * Design choice:
 * - TaskContract does NOT hold tokens; Escrow does. TaskContract references Escrow contract address.
 * - The owner (platform admin) is authorized to approve submissions and trigger payout.
 */

interface IEscrow {
    function payout(uint256 taskId, address worker, uint256 amount) external;
    function getTaskBalance(uint256 taskId) external view returns (uint256);
}

contract TaskContract {
    address public owner;
    IEscrow public escrow; // Escrow contract address

    enum TaskState { Open, Assigned, Completed, Paid, Cancelled }

    struct Task {
        address requester;      // who created task
        uint256 reward;         // reward in token smallest unit
        TaskState state;
        string metadataURI;     // ipfs or json pointer describing the task
    }

    struct Submission {
        address worker;
        string resultURI;       // pointer to submission (ipfs, etc)
        bool approved;
        bool exists;
    }

    mapping(uint256 => Task) public tasks; // taskId -> Task
    // submissions: taskId -> submissionId -> Submission
    mapping(uint256 => mapping(uint256 => Submission)) public submissions;
    mapping(uint256 => uint256) public submissionCount;

    event TaskCreated(uint256 indexed taskId, address indexed requester, uint256 reward);
    event SubmissionCreated(uint256 indexed taskId, uint256 indexed submissionId, address indexed worker);
    event SubmissionApproved(uint256 indexed taskId, uint256 indexed submissionId, address indexed worker, uint256 amount);
    event SubmissionRejected(uint256 indexed taskId, uint256 indexed submissionId, address indexed worker);
    event TaskCancelled(uint256 indexed taskId);

    modifier onlyOwner() {
        require(msg.sender == owner, "TaskContract: only owner");
        _;
    }

    constructor(address _escrow) {
        require(_escrow != address(0), "TaskContract: escrow zero");
        owner = msg.sender;
        escrow = IEscrow(_escrow);
    }

    function setEscrow(address _escrow) external onlyOwner {
        require(_escrow != address(0), "TaskContract: escrow zero");
        escrow = IEscrow(_escrow);
    }

    // Create a new task record. The requester should fund the corresponding taskId in Escrow
    // before workers can be paid. taskId is external identifier (platform may choose a scheme).
    function createTask(uint256 taskId, uint256 reward, string calldata metadataURI) external {
        Task storage t = tasks[taskId];
        require(!t.requester != address(0) ? false : true, "TaskContract: task exists"); // avoid overwriting
        // Simpler guard:
        require(t.requester == address(0), "TaskContract: task exists");

        tasks[taskId] = Task({
            requester: msg.sender,
            reward: reward,
            state: TaskState.Open,
            metadataURI: metadataURI
        });

        emit TaskCreated(taskId, msg.sender, reward);
    }

    // Worker submits result
    function submitResult(uint256 taskId, string calldata resultURI) external {
        Task storage t = tasks[taskId];
        require(t.requester != address(0), "TaskContract: task not found");
        require(t.state == TaskState.Open || t.state == TaskState.Assigned, "TaskContract: not accepting submissions");

        uint256 sid = submissionCount[taskId] + 1;
        submissions[taskId][sid] = Submission({
            worker: msg.sender,
            resultURI: resultURI,
            approved: false,
            exists: true
        });
        submissionCount[taskId] = sid;

        // Optionally move task to Assigned state
        t.state = TaskState.Assigned;

        emit SubmissionCreated(taskId, sid, msg.sender);
    }

    // Owner (platform admin) approves a submission and triggers payout via Escrow
    function approveSubmission(uint256 taskId, uint256 submissionId) external onlyOwner {
        Submission storage s = submissions[taskId][submissionId];
        Task storage t = tasks[taskId];

        require(s.exists, "TaskContract: submission missing");
        require(!s.approved, "TaskContract: already approved");
        require(t.state == TaskState.Assigned || t.state == TaskState.Open, "TaskContract: invalid task state");

        // Check escrow has enough funds
        uint256 escrowBalance = escrow.getTaskBalance(taskId);
        require(escrowBalance >= t.reward, "TaskContract: insufficient escrow balance");

        // mark approved (pre-state)
        s.approved = true;
        t.state = TaskState.Paid;

        // trigger payout in escrow (owner of Escrow must be platform owner)
        escrow.payout(taskId, s.worker, t.reward);

        emit SubmissionApproved(taskId, submissionId, s.worker, t.reward);
    }

    // Owner can reject a submission
    function rejectSubmission(uint256 taskId, uint256 submissionId) external onlyOwner {
        Submission storage s = submissions[taskId][submissionId];
        require(s.exists, "TaskContract: submission missing");
        require(!s.approved, "TaskContract: already approved");

        emit SubmissionRejected(taskId, submissionId, s.worker);
        // keep record for audit; do not delete
    }

    // Owner can cancel a task (e.g., before any payout). Caller should also refund via Escrow.refund if needed.
    function cancelTask(uint256 taskId) external onlyOwner {
        Task storage t = tasks[taskId];
        require(t.requester != address(0), "TaskContract: task not found");
        t.state = TaskState.Cancelled;
        emit TaskCancelled(taskId);
    }

    // Read helpers
    function getSubmission(uint256 taskId, uint256 submissionId) external view returns(address worker, string memory resultURI, bool approved) {
        Submission storage s = submissions[taskId][submissionId];
        require(s.exists, "TaskContract: submission missing");
        return (s.worker, s.resultURI, s.approved);
    }

    function getTask(uint256 taskId) external view returns(address requester, uint256 reward, TaskState state, string memory metadataURI) {
        Task storage t = tasks[taskId];
        require(t.requester != address(0), "TaskContract: task not found");
        return (t.requester, t.reward, t.state, t.metadataURI);
    }
}
