pragma solidity 0.5.0;

import "./Ownable.sol";

contract Mortal is Ownable {
  function  kill() public onlyOwner {
    selfdestruct(msg.sender);
  }
}