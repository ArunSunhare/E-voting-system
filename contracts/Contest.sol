pragma solidity 0.5.16;

contract Contest{
	
	struct Contestant{
		uint id;
		string name;
		uint voteCount;
		string party;
		uint age;
		string qualification;
	}

	struct Voter{
		bool hasVoted;
		uint vote;
		bool isRegistered;
	}

	address admin;
	mapping(uint => Contestant) public contestants; 
	mapping(address => Voter) public voters;
	uint public contestantsCount;
	enum PHASE { reg, voting, done }
	PHASE public state;

	modifier onlyAdmin(){
		require(msg.sender == admin, "Only admin can call this");
		_;
	}
	
	modifier validState(PHASE x){
	    require(state == x, "Invalid state for this operation");
	    _;
	}

	constructor() public{
		admin = msg.sender;
        state = PHASE.reg;
        // Default contestants add kar rahe hain:
        addContestant("Contestant 1", "Party 1", 30, "Qualification1");
        addContestant("Contestant 2", "Party 2", 25, "Qualification2");
	}

    function changeState(PHASE x) public onlyAdmin {
		require(x > state, "State can only move forward");
        state = x;
    }

	function addContestant(string memory _name, string memory _party, uint _age, string memory _qualification) 
	    public onlyAdmin validState(PHASE.reg) 
	{
		contestantsCount++;
		contestants[contestantsCount] = Contestant(contestantsCount, _name, 0, _party, _age, _qualification);
	}

	function voterRegisteration(address user) public onlyAdmin validState(PHASE.reg){
		voters[user].isRegistered = true;
	}

	function vote(uint _contestantId) public validState(PHASE.voting){
		require(voters[msg.sender].isRegistered, "Voter not registered");
		require(!voters[msg.sender].hasVoted, "Voter has already voted");
        require(_contestantId > 0 && _contestantId <= contestantsCount, "Invalid contestant ID");
		
		contestants[_contestantId].voteCount++;
		voters[msg.sender].hasVoted = true;
		voters[msg.sender].vote = _contestantId;

	}
	
}
