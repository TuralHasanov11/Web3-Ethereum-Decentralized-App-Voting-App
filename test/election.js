var Election = artifacts.require("./Election.sol");

contract("Election", function (accounts) {
  var electionInstance;

  it("initializes with two candidates", async function () {
    electionInstance = await Election.deployed()
    const count = await electionInstance.candidatesCount()
    assert.equal(count, 2);
  });

  it("initializes with two candidates", async function () {
    electionInstance = await Election.deployed()
    const candidate1 = await electionInstance.candidates(1)

    assert.equal(candidate1[0], 1, "contains the correct id");
    assert.equal(candidate1[1], "Candidate 1", "contains the correct name");
    assert.equal(candidate1[2], 0, "contains the correct votes count");

    const candidate2 = await electionInstance.candidates(2)
    assert.equal(candidate2[0], 2, "contains the correct id");
    assert.equal(candidate2[1], "Candidate 2", "contains the correct name");
    assert.equal(candidate2[2], 0, "contains the correct votes count");
  });

  it("vote candidate", async function () {
    electionInstance = await Election.deployed()
    const candidateId = 1;

    const receipt = await electionInstance.vote(candidateId, { from: accounts[0] })

    assert.equal(receipt.logs.length, 1, "an event was triggered");
    assert.equal(receipt.logs[0].event, "VoteEvent", "the event type is correct");
    assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");

    const voted = await electionInstance.voters(accounts[0])
    assert.equal(voted, true, "The voter has voted")

    const candidate1 = await electionInstance.candidates(1)
    assert.equal(candidate1[2], 1, "vote count is increased");
  })

  it("cannot vote invalid candidate", async function () {
    electionInstance = await Election.deployed()

    try {
      const receipt = await electionInstance.vote(12, { from: accounts[0] })
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, "error must contain revert")
    }

    const candidate1 = await electionInstance.candidates(1)
    assert.equal(candidate1[2], 1, "Candidate 1 vote count is not changed");

    const candidate2 = await electionInstance.candidates(2)
    assert.equal(candidate2[2], 0, "Candidate 2 vote count is not changed");
  })

  it("cannot vote twice", async function () {
    electionInstance = await Election.deployed()

    const receipt = await electionInstance.vote(1, { from: accounts[0] })

    try {
      const receipt2 = await electionInstance.vote(1, { from: accounts[0] })
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, "error must contain revert")
    }

    const candidate1 = await electionInstance.candidates(1)
    assert.equal(candidate1[2], 1, "Candidate 1 vote count is not changed");
  })

});