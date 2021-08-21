/**
 * Creates a hash combining the player's choice and a random number.
 * Equivalent to Solidity's keccak256(abi.encodePacked(param1,[param2...]))
 * @param {string} choice - One of "ROCK", "PAPER" or "SCISSORS".
 * @param {number} randomValue - A randomn generated value between 0 and 1000000.
 * @returns {string} Represents the same hash result as Solidity's keccak256(abi.encodePacked(param1,[param2...])).
 */
exports.sha3_Web3 = function (choice, randomValue) {
  return web3.utils.soliditySha3(
    // web3.utils.padRight(web3.utils.asciiToHex(choice), 32)
    { type: "bytes32", value: web3.utils.asciiToHex(choice) },
    { type: "bytes32", value: web3.utils.numberToHex(randomValue) }
  );
};

/**
 * Creates a hexadecimal representatino of a string. Required since
 * the Solidity's contract is expecting a 'bytes32' type of input.
 * @param {string} choice - One of "ROCK", "PAPER" or "SCISSORS".
 * @returns {string} String represented in hexadecimal to match 'bytes32' from Solidity.
 */
exports.asciiToHex = function (choice) {
  return web3.utils.asciiToHex(choice);
};

/**
 * Creates a hexadecimal representatino of a number. Required since
 * the Solidity's contract is expecting a 'bytes32' type of input.
 * @param {number} randomValue - A random number for hashing.
 * @returns {string} String represented in hexadecimal to match 'bytes32' from Solidity.
 */
exports.numberToHex = function (randomValue) {
  return web3.utils.numberToHex(randomValue);
};

/**
 * Simulates a match between Alice and Bob when it comes to play
 * ROCK, PAPER or SCISSORS game by calling methods from the contract.
 * Returns back  the winner address.
 * @param {string} choiceAlice - One of "ROCK", "PAPER" or "SCISSORS".
 * @param {number} randomValAlice - A random number for hashing.
 * @param {string} choiceBob - One of "ROCK", "PAPER" or "SCISSORS".
 * @param {number} randomValBob - A random number for hashing.
 * @param {Object} rockPaperScissors - An instance of the contract.
 * @param {address} Alice - An address with ether account for transacting.
 * @param {address} Bob - An address with ether account for transacting.
 * @returns {address} Winner address of the game
 */
exports.computeResults = async function (
  choiceAlice,
  randomValAlice,
  choiceBob,
  randomValBob,
  rockPaperScissors,
  Alice,
  Bob
) {
  // Alice's choice
  const keccackAlice = exports.sha3_Web3(choiceAlice, randomValAlice);
  await rockPaperScissors.play(keccackAlice, { from: Alice });

  // Bob's choice
  const keccackBob = exports.sha3_Web3(choiceBob, randomValBob);
  await rockPaperScissors.play(keccackBob, { from: Bob });

  // Evalute
  return await rockPaperScissors.evaluate(
    Alice,
    exports.asciiToHex(choiceAlice), // bytes32
    exports.numberToHex(randomValAlice), //bytes32
    Bob,
    exports.asciiToHex(choiceBob), // bytes32
    exports.numberToHex(randomValBob), // bytes32
    { from: Alice }
  );
};
