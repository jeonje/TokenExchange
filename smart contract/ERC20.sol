pragma solidity 0.5.0;

import "./IERC20.sol";
import "./SafeMath.sol";

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 * Originally based on code by FirstBlood:
 * https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 *
 * This implementation emits additional Approval events, allowing applications to reconstruct the allowance status for
 * all accounts just by listening to said events. Note that this isn't required by the specification, and other
 * compliant implementations may not do it.
 */
contract ERC20 is IERC20 {
    using SafeMath for uint256;

    mapping (address => uint256) internal balances;

    mapping (address => mapping (address => uint256)) internal allowed;

    uint256  total;


    /**
     * @dev Total number of tokens in existence
     */
     function totalSupply() public view returns (uint256) {
        return total;
     }

    /**
     * @dev Gets the balance of the specified address.
     * @param _owner The address to query the balance of.
     * @return An uint256 representing the amount owned by the passed address.
     */
     function balanceOf(address _owner) public view returns (uint256) {
          return balances[_owner];
     }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param _owner address The address which owns the funds.
     * @param _spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
     */
     function allowance(address _owner, address _spender) public view returns (uint256) {
         return allowed[_owner][_spender];
     }

    /**
     * @dev Transfer token for a specified address
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
     function transfer(address _to, uint256 _value) public returns (bool) {
         _transfer(msg.sender, _to, _value);
         return true;
     }

    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
     */
     function approve(address _spender, uint256 _value) public returns (bool) {
         _approve(msg.sender, _spender, _value);
         return true;
     }

    /**
     * @dev Transfer tokens from one address to another.
     * Note that while this function emits an Approval event, this is not required as per the specification,
     * and other compliant implementations may not emit the event.
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint256 the amount of tokens to be transferred
     */
     function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
         require(_to != address(0));
         require(_value <= balances[_from]);
         require(_value <= allowed[_from][msg.sender]);
         
         balances[_from] = balances[_from].sub(_value);
         balances[_to] = balances[_to].add(_value);
         emit Transfer(_from, _to, _value);
         //_transfer(from, to, value);
         _approve(_from, msg.sender, allowed[_from][msg.sender].sub(_value));
         return true;
     }

    /**
     * @dev Increase the amount of tokens that an owner allowed to a spender.
     * approve should be called when allowed_[_spender] == 0. To increment
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * From MonolithDAO Token.sol
     * Emits an Approval event.
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to increase the allowance by.
     */
     //add namkyu 
    function increaseApprove(address _spender, uint256 _value) public returns (bool success) { //add approved token amount

         require(_spender > address(0));
         allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_value);
         emit Approval(msg.sender, _spender, _value);
         return true;
    }

    /**
     * @dev Decrease the amount of tokens that an owner allowed to a spender.
     * approve should be called when allowed_[_spender] == 0. To decrement
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * From MonolithDAO Token.sol
     * Emits an Approval event.
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to decrease the allowance by.
     */
     //add namkyu
     function decreaseApprove(address _spender, uint256 _value) public returns (bool success) { // sub approved token amount

         uint oldValue = allowed[msg.sender][_spender];
         if (_value > oldValue) {
           allowed[msg.sender][_spender] = 0;
           } else {
               allowed[msg.sender][_spender] = oldValue.sub(_value);
           }
       emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
       return true;
    }
    /**
     * @dev Transfer token for a specified addresses
     * @param _from The address to transfer from.
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
     function _transfer(address _from, address _to, uint256 _value) internal {
         require(_to != address(0));
         require(_value <= balances[_from]);// add namkyu
         
         balances[_from] = balances[_from].sub(_value);
         balances[_to] = balances[_to].add(_value);
         emit Transfer(_from, _to, _value);
     }

    /**
     * @dev Internal function that mints an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param account The account that will receive the created tokens.
     * @param value The amount that will be created.
     */
    // function _mint(address account, uint256 value) internal {
    //     require(account != address(0));

    //     _totalSupply = _totalSupply.add(value);
    //     _balances[account] = _balances[account].add(value);
    //     emit Transfer(address(0), account, value);
    // }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account.
     * @param account The account whose tokens will be burnt.
     * @param value The amount that will be burnt.
     */
    // function _burn(address account, uint256 value) internal {
    //     require(account != address(0));

    //     _totalSupply = _totalSupply.sub(value);
    //     _balances[account] = _balances[account].sub(value);
    //     emit Transfer(account, address(0), value);
    // }

    /**
     * @dev Approve an address to spend another addresses' tokens.
     * @param _owner The address that owns the tokens.
     * @param _spender The address that will spend the tokens.
     * @param _value The number of tokens that can be spent.
     */
     function _approve(address _owner, address _spender, uint256 _value) internal {
         require(_spender != address(0));
         require(_owner != address(0));

         allowed[_owner][_spender] = _value;
         emit Approval(_owner, _spender, _value);
     }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account, deducting from the sender's allowance for said account. Uses the
     * internal burn function.
     * Emits an Approval event (reflecting the reduced allowance).
     * @param account The account whose tokens will be burnt.
     * @param value The amount that will be burnt.
     */
    // function _burnFrom(address account, uint256 value) internal {
    //     _burn(account, value);
    //     _approve(account, msg.sender, _allowed[account][msg.sender].sub(value));
    // }
}