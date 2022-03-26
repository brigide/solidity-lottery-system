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
        require(msg.value == 0.1 ether);
        players.push(payable(msg.sender)); // push the eth sender to players array, counting it's entry to the lottery
    }

    // returns the contract balance in wei
    function getBalance() public view authorizeManager returns (uint256) {
        return address(this).balance;
    }

    function getPlayersLength() public view returns (uint256) {
        return players.length;
    }
}
