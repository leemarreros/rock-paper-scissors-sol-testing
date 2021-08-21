const RockPaperScissors = artifacts.require("./RockPaperScissors.sol");
const {
  asciiToHex,
  computeResults,
  numberToHex,
  sha3_Web3,
} = require("./helpers");

const ADDRESS_0 = "0x0000000000000000000000000000000000000000";
const ALICE_ERROR =
  "Returned error: VM Exception while processing transaction: revert Alice's hash is not the same as found in storage";
const BOB_ERROR =
  "Returned error: VM Exception while processing transaction: revert Bob's hash is not the same as found in storage";
const PAPER = "PAPER";
const ROCK = "ROCK";
const SCISSORS = "SCISSORS";

require("chai").use(require("chai-as-promised")).should();

contract("RockPaperScissors", ([Alice, Bob, Carlos]) => {
  let choiceAlice,
    choiceBob,
    keccackAlice,
    keccackBob,
    randomValAlice,
    randomValBob,
    rockPaperScissors,
    winnerAddress;

  beforeEach(async () => {
    rockPaperScissors = await RockPaperScissors.new();
    randomValAlice = Math.floor(Math.random() * 1000000);
    randomValBob = Math.floor(Math.random() * 1000000);
  });

  describe("Randomize choices...", () => {
    it("players' hashes are correctly stored and returned ", async () => {
      // Alice plays ROCK
      choiceAlice = ROCK;
      keccackAlice = sha3_Web3(choiceAlice, randomValAlice);
      await rockPaperScissors.play(keccackAlice, { from: Alice });
      const aliceChoice = await rockPaperScissors.choices(Alice);
      expect(keccackAlice).to.be.eq(aliceChoice.toString());

      // Bob plays PAPER
      choiceBob = PAPER;
      keccackBob = sha3_Web3(choiceBob, randomValAlice);
      await rockPaperScissors.play(keccackBob, { from: Bob });
      const bobChoice = await rockPaperScissors.choices(Bob);
      expect(keccackBob).to.be.eq(bobChoice.toString());
    });
  });

  describe("Hashing in Solidity and Web3...", () => {
    it("hashing value is the same in Solidity and web3", async () => {
      // Alice
      choiceAlice = ROCK;
      keccackAliceWeb3 = sha3_Web3(choiceAlice, randomValAlice);
      await rockPaperScissors.play(keccackAliceWeb3, { from: Alice });
      let resKeccakAliceSolidity = await rockPaperScissors.keccak(
        asciiToHex(choiceAlice),
        numberToHex(randomValAlice)
      );
      expect(resKeccakAliceSolidity).to.be.eq(keccackAliceWeb3);
      // Bob
      choiceBob = SCISSORS;
      keccackBobWeb3 = sha3_Web3(choiceBob, randomValBob);
      await rockPaperScissors.play(keccackBobWeb3, { from: Bob });
      let resKeccakBobSolidity = await rockPaperScissors.keccak(
        asciiToHex(choiceBob),
        numberToHex(randomValBob)
      );
      expect(resKeccakBobSolidity).to.be.eq(keccackBobWeb3);
    });
  });

  describe("Playing the game...", () => {
    describe("success", () => {
      beforeEach(async () => {
        rockPaperScissors = await RockPaperScissors.new();
        randomValAlice = Math.floor(Math.random() * 1000000);
        randomValBob = Math.floor(Math.random() * 1000000);
      });
      it("Alice's ROCK wins against Bob's SCISSORS ", async () => {
        // Alice's choice
        choiceAlice = ROCK;
        keccackAlice = sha3_Web3(choiceAlice, randomValAlice);
        await rockPaperScissors.play(keccackAlice, { from: Alice });

        // Bob's choice
        choiceBob = SCISSORS;
        keccackBob = sha3_Web3(choiceBob, randomValBob);
        await rockPaperScissors.play(keccackBob, { from: Bob });

        // Evalute
        winnerAddress = await rockPaperScissors.evaluate(
          Alice,
          asciiToHex(choiceAlice), // bytes32
          numberToHex(randomValAlice), //bytes32
          Bob,
          asciiToHex(choiceBob), // bytes32
          numberToHex(randomValBob), // bytes32
          { from: Alice }
        );
        expect(winnerAddress).to.be.eq(Alice);
      });
      it("Alice's ROCK loses against Bob's PAPER ", async () => {
        choiceAlice = ROCK;
        choiceBob = PAPER;
        const winner = Bob;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
      it("Alice's PAPER wins against Bob's ROCK ", async () => {
        choiceAlice = PAPER;
        choiceBob = ROCK;
        const winner = Alice;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
      it("Alice's PAPER loses against Bob's SCISSORS ", async () => {
        choiceAlice = PAPER;
        choiceBob = SCISSORS;
        const winner = Bob;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
      it("Alice's SCISSORS wins against Bob's PAPER ", async () => {
        choiceAlice = SCISSORS;
        choiceBob = PAPER;
        const winner = Alice;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
      it("Alice's SCISSORS loses against Bob's ROCK ", async () => {
        choiceAlice = SCISSORS;
        choiceBob = ROCK;
        const winner = Bob;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
      it("Alice's SCISSORS draws against Bob's SCISSORS ", async () => {
        choiceAlice = SCISSORS;
        choiceBob = SCISSORS;
        const winner = ADDRESS_0;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
      it("Alice's PAPER draws against Bob's PAPER ", async () => {
        choiceAlice = PAPER;
        choiceBob = PAPER;
        const winner = ADDRESS_0;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
      it("Alice's ROCK draws against Bob's ROCK ", async () => {
        choiceAlice = ROCK;
        choiceBob = ROCK;
        const winner = ADDRESS_0;
        winnerAddress = await computeResults(
          choiceAlice,
          randomValAlice,
          choiceBob,
          randomValBob,
          rockPaperScissors,
          Alice,
          Bob
        );
        expect(winnerAddress).to.be.eq(winner);
      });
    });
    describe("failure", () => {
      it("Alice should be rejected", async () => {
        // Alice Plays ROCK
        choiceAlice = ROCK;
        keccackAlice = sha3_Web3(choiceAlice, randomValAlice);
        await rockPaperScissors.play(keccackAlice, { from: Alice });

        // Bob plays PAPER
        choiceBob = PAPER;
        keccackBob = sha3_Web3(choiceBob, randomValAlice);
        await rockPaperScissors.play(keccackBob, { from: Bob });

        let error = null;
        try {
          await rockPaperScissors.evaluate(
            Carlos,
            asciiToHex(choiceAlice), // bytes32
            numberToHex(randomValAlice), //bytes32
            Bob,
            asciiToHex(choiceBob), // bytes32
            numberToHex(randomValBob), // bytes32
            { from: Carlos }
          );
        } catch (err) {
          error = err.message;
        }
        expect(error).to.be.eq(ALICE_ERROR);
      });
      it("Bob should be rejected", async () => {
        // Alice Plays ROCK
        choiceAlice = ROCK;
        keccackAlice = sha3_Web3(choiceAlice, randomValAlice);
        await rockPaperScissors.play(keccackAlice, { from: Alice });

        // Bob plays PAPER
        choiceBob = PAPER;
        keccackBob = sha3_Web3(choiceBob, randomValAlice);
        await rockPaperScissors.play(keccackBob, { from: Bob });

        let error = null;
        try {
          await rockPaperScissors.evaluate(
            Alice,
            asciiToHex(choiceAlice), // bytes32
            numberToHex(randomValAlice), //bytes32
            Carlos,
            asciiToHex(choiceBob), // bytes32
            numberToHex(randomValBob), // bytes32
            { from: Carlos }
          );
        } catch (err) {
          error = err.message;
        }
        expect(error).to.be.eq(BOB_ERROR);
      });
    });
  });
});
