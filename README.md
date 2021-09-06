# Developing testing cases for the game Rock, Paper and Scissors considering user's privacy at the Blockchain



This game requires confidentiality since the choice of each user must be private until the game finishes. That represents a problem since everythin in the blockchain could be retrieved. The user's privacy and offuscation of information becomes very important for complying with the confidentiality of this game.

This same pattern could be applied to other use cases. At this time, we'll illustrate how to hash the user's choice for keeping their decisions safe and outside of scrutinity.

At the heart of information offuscation, we have the following code:

`````javascript
// utils.js

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

// Test.js
randomValAlice = Math.floor(Math.random() * 1000000);
keccackAlice = sha3_Web3(choiceAlice, randomValAlice);
//...
await rockPaperScissors.play(keccackAlice, { from: Alice });

// Contract in solidity
keccak256(abi.encodePacked(choice, randomValue))
`````

1. We need to get a kind of salt that varies ofently so that the hash become really random. That is represented by `randomValAlice`. With this, we make sure that the calculated hash stays hard to guess.
2. We are using `sha3_Web3` which is a util that basically does the same thing as `keccak256(abi.encodePacked(choice, randomValue))` from the Solidity side. That means that we save the choice of each user using this hashing functions. This ensures that even when the data is retrieve, is offuscated.
3. Once the game starts, the users' choices are, again, hashed and compared to each other. Since we knoe that `randomValue` for each user, we could easly compare hashed values to find out who's the winner.

This strategy allow us to save offuscated data in the blockchain and at the same time retrieve later on for other purposes.
