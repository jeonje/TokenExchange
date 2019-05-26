pragma solidity 0.5.0;

import "./SafeMath.sol";
import "./Mortal.sol";
import "./ERC20.sol";

contract TokenExchange is Mortal, ERC20 {
  using SafeMath for uint256;
  uint[] public token_rate = new uint[](6);

  event ResultForExchangeAndTransfer(address _from_user_addr, address _to_user_addr, uint _from_amount, uint _to_amount, ERC20 _from_token, ERC20 _to_token);  
  event ResultForsetRate(uint[] _rate);
  event ResultForDeposit(address _accountAddress, ERC20 _token, uint _amount, uint _balance);
  event ResultForWithdrawToken(address _toAddress, ERC20 _token, uint _amount, uint _balance);
  event ResultForWithdrawEther(address _owner, uint _amount); 
  event ResultForChangeOwner(address _newOwner);
  
  function () external payable {//fallback function (if user send ether to this contract directly, this function execute.)
    
  }
  //
  function exchange(address _to_user_addr, uint _from_amount, uint _to_amount, ERC20 _from_token_addr, ERC20 _to_token_addr, uint _token_Index, uint _token_rate ) public payable{
    require(_to_user_addr != address(0));
    require( 10000000 >= abs( token_rate[_token_Index] -_token_rate)); // Allow exchange rate differences to first decimal place
    
    _from_token_addr.transferFrom(msg.sender, address(this), _from_amount);//From_user(msg.sender) send from_token to this contract
    _to_token_addr.transfer(_to_user_addr, _to_amount);// this contract send to_token to To_user
    
    address(this).transfer(msg.value);
    emit ResultForExchangeAndTransfer(msg.sender, _to_user_addr, _from_amount, _to_amount, _from_token_addr, _to_token_addr);
  }
  
  function transfer(address _to_user_addr, uint _from_amount, uint _to_amount, ERC20 _from_token_addr, ERC20 _to_token_addr,uint _token_Index, uint _token_rate) public payable{
    require(_to_user_addr != address(0));
    require( 10000000 >= abs( token_rate[_token_Index] -_token_rate)); // Allow exchange rate differences to first decimal place
    
    _from_token_addr.transferFrom(msg.sender, address(this), _from_amount);//From_user(msg.sender) send from_token to this contract
    _to_token_addr.transfer(_to_user_addr, _to_amount);// this contract send to_token to To_user
    
    address(this).transfer(msg.value);
    emit ResultForExchangeAndTransfer(msg.sender, _to_user_addr, _from_amount, _to_amount, _from_token_addr, _to_token_addr);
  }
  
  //set new token rate 
  function setRate(uint[] memory _rate) public onlyOwner {// ex) input parameter : [1,2,3,4,5,6]
      token_rate = _rate;
      emit ResultForsetRate(token_rate);
  }
  
  //get token rate
  function getRate() public view returns(uint[]memory) {//output uint[] 256 : 1,2,3,4,5,6
      return token_rate;
  }
  
  //deposit token in contract
  function deposit(ERC20 _token, uint _amount) public onlyOwner {
      _token.transferFrom(msg.sender, address(this), _amount);
      emit ResultForDeposit(msg.sender, _token, _amount, _token.balanceOf(address(this)));
  }    
  
  //withdraw token in contract
  function withdrawToken(ERC20 _token,uint _amount) public onlyOwner {
      _token.transfer(msg.sender, _amount);// Token exchange contract send token to msg.sender 
      emit ResultForWithdrawToken(msg.sender, _token, _amount, _token.balanceOf(address(this)));
  }
  
  //withdraw ether in contract
  function withdrawEther(uint _amount) public onlyOwner{
      require (_amount > 0);// check wether _amount value is bigger than 0
      require(address(this).balance >= 0);// check wether this contract has ether
      
      address(uint160(msg.sender)).transfer(_amount);
      emit ResultForWithdrawEther(msg.sender, _amount);
  }
  
  //check token balacne in contract
  function Check_balanceForToken(ERC20 _token) public view returns(uint) {
    return _token.balanceOf(address(this)); //return contract's token amount    
  }
  
  //check ether balance in contract  
  function Check_Ether() public view onlyOwner returns(uint256) {
      return address(this).balance;
  }
  
  function change_owner(address _newOwner) public onlyOwner {
      transferOwnership(_newOwner);
      emit ResultForChangeOwner(_newOwner);
  }
  
   function abs(uint n) internal pure returns (uint) {
    if(n >= 0) return n;
    return -n;
  }
  
}