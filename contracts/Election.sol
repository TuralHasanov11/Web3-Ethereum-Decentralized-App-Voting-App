// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;

    mapping(uint => Candidate) public candidates;

    uint public candidatesCount;

    event VoteEvent(uint indexed _candidateId);

    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // candidate exists
        require(!voters[msg.sender]);

        // candidate exists
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // vote for the candidate
        candidates[_candidateId].voteCount++;

        // set already voted
        voters[msg.sender] = true;

        emit VoteEvent(_candidateId);
    }
}
