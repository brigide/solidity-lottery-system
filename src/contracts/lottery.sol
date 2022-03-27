// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

contract Lottery {
    address payable[] public players; //array of all players participating the lottery
    address public manager; // the lottery manager

    constructor() {
        manager = msg.sender; // sets the lottery manager as the deployer account
    }

    // function  modifier to allow only the manager to access certain functions
    modifier authorizeManager() {
        require(msg.sender == manager);
        _;
    }

    // automatic called function when the contract receives externally owned accounts transferences
    receive() external payable {
        require(msg.value == 0.1 ether, "INVALID_ETHER_AMOUNT");
        players.push(payable(msg.sender)); // push the eth sender to players array, counting it's entry to the lottery
    }

    // returns the contract balance in wei
    function getBalance() public view authorizeManager returns (uint256) {
        return address(this).balance;
    }

    function getPlayersLength() public view returns (uint256) {
        return players.length;
    }

    function random() public view returns (uint256) {
        // WARNING: do not use this random generator in real apps
        // TODO: search about chainlink to implement a real random generator
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        players.length
                    )
                )
            );
    }

    function clearPlayers() public authorizeManager {
        delete (players);
    }

    function pickWinner() public authorizeManager returns (address) {
        require(players.length >= 3, "LESS THAN 3 PLAYERS");

        uint256 randomNumber = random();
        uint256 winnerIndex = randomNumber % players.length;
        address payable winner = players[winnerIndex];

        winner.transfer(getBalance());

        clearPlayers();

        return winner;
    }
}
