// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract RockPaperScissors {
    bytes32 public constant ROCK = "ROCK"; // 0x524f434b0000000000000000000000
    bytes32 public constant PAPER = "PAPER"; // 0x504150455200000000000000000000
    bytes32 public constant SCISSORS = "SCISSORS"; // 0x53434953534f520000000000000000

    mapping(address => bytes32) public choices;

    function play(bytes32 choice) external {
        require(choices[msg.sender] == bytes32(0));
        choices[msg.sender] = choice;
    }

    // testing-purpose function
    function keccak(bytes32 choice, bytes32 randomValue)
        external
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(choice, randomValue));
    }

    function evaluate(
        address alice,
        bytes32 aliceChoice,
        bytes32 aliceRandomness,
        address bob,
        bytes32 bobChoice,
        bytes32 bobRandomness
    ) external view returns (address) {
        require(
            keccak256(abi.encodePacked(aliceChoice, aliceRandomness)) ==
                choices[alice],
            "Alice's hash is not the same as found in storage"
        );
        require(
            keccak256(abi.encodePacked(bobChoice, bobRandomness)) ==
                choices[bob],
            "Bob's hash is not the same as found in storage"
        );

        if (aliceChoice == bobChoice) {
            // this is draw
            return address(0);
        }

        if (aliceChoice == ROCK && bobChoice == PAPER) {
            return bob;
        } else if (bobChoice == ROCK && aliceChoice == PAPER) {
            return alice;
        } else if (aliceChoice == SCISSORS && bobChoice == PAPER) {
            return alice;
        } else if (bobChoice == SCISSORS && aliceChoice == PAPER) {
            return bob;
        } else if (aliceChoice == ROCK && bobChoice == SCISSORS) {
            return alice;
        } else if (bobChoice == ROCK && aliceChoice == SCISSORS) {
            return bob;
        }
    }
}
