pragma solidity ^0.5.16;

import "./openzeppelin-ERC20/IERC20.sol";
import "./openzeppelin-ERC20/SafeMath.sol";


//based on OpenZeppelin implementation found here:
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/9b3710465583284b8c4c5d2245749246bb2e0094/contracts/token/ERC20/ERC20.sol
/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 * Originally based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract BitBnBtoken is IERC20 {
  using SafeMath for uint256;

  mapping (address => uint256) private _balances; //equivalent to allottedBids
  mapping (address => mapping (address => uint256)) private _allowed;
  uint256 private _totalSupply;

  //custom data/parameters
  bool public openVoting; //true for voting is open, false for voting is closed
  uint256 public endTime; //time in seconds
  mapping (address => uint256) public remainingBids; //mapping that displays how many bids a user has left
  //struct used to track user & amount information together
  struct Bid {
      address _address;
      uint256 _amount;
  }

  //used to track weeks the user has bid on to efficiently clear them later
  struct bidderWeek {
      uint256 _week;
      address _address;
  }
  bidderWeek[] private bidHistory;

  mapping (uint256 => mapping (address => uint256)) public currentBid; //tracks the current bid for each user for each week
  mapping (uint256 => Bid) public highestBid; //tracks the highest bid per week (user + amount)
  address payable public contractOwner;
  uint256 public etherRate;
  uint256 private rate;
  address[] private users;
  uint256 private weeksInSeason; //NOTE: weeks are 0 indexed

  modifier onlyOwner {
      require(msg.sender == contractOwner, "only owner");
      _;
  }

  //custom functions
  constructor(uint256 _shares, uint256 _etherRate) public {
      require(_shares > 0, "number of shares must be greater than 0");
      require(_etherRate > 0, "etherRate must be greater than 0");
      contractOwner = msg.sender;
      _balances[address(this)] = _shares;
      _totalSupply = _shares;
      etherRate = _etherRate;
      rate = _etherRate.mul(1e18); //rate => x ether = 1 token
      openVoting = true;
      weeksInSeason = 13;

      endTime = block.timestamp + 120; //two minutes cycle
  }

  //method for purchasing tokens
  function() payable external {
      require(msg.value > 0, "no value sent");
      uint256 bids = msg.value.div(rate);
      require(bids <= _balances[address(this)], "not enough bids to purchase");
      uint256 remainder = msg.value.sub(bids.mul(rate));

      //add user to list if new
      if (_balances[msg.sender] == 0) {
          users.push(msg.sender);
      }

      //similar to transfer functionality
      _balances[address(this)] = _balances[address(this)].sub(bids); //reduce contract token balance
      _balances[msg.sender] = _balances[msg.sender].add(bids); //increase user token balance
      remainingBids[msg.sender] = remainingBids[msg.sender].add(bids); //increase user token balance for current bid cycle

      emit Transfer(address(this), msg.sender, bids);

     //useful if user sends partial amount for token
      if (remainder > 0) {
          msg.sender.transfer(remainder); //send extra money back
      }
  }

  //method for placing bids
  function bid(uint256 _week, uint256 _amount) external {
      require(block.timestamp < endTime, "bidding is now closed - if bidding should be open, please call toggleBidding"); //cannot bid even if toggleBidding has not been called
      require(openVoting == true, "bidding is not open yet");
      require(_week < weeksInSeason, "invalid week");
      uint256 topBid = highestBid[_week]._amount;
      uint256 newBid = currentBid[_week][msg.sender] + _amount;
      require(_amount <= remainingBids[msg.sender], "not enough bids");
      require(topBid < newBid, "bid does not beat winning bid");

      //indicates the user has bid on a week they have not bid on before
      if (currentBid[_week][msg.sender] == 0) {
        bidHistory.push(bidderWeek(_week, msg.sender));
      }

      remainingBids[msg.sender] -= _amount;
      currentBid[_week][msg.sender] = newBid;
      highestBid[_week] = Bid(msg.sender, newBid);
  }

  //method for owner to withdraw money
  function withdraw() onlyOwner external {
     contractOwner.transfer(address(this).balance);
  }

  //toggle open vs closed bidding seasons (called by the app)
  function toggleBidding() public {
      require(block.timestamp > endTime, "cannot toggle bidding - not time yet");
      if (openVoting == false) {
          //reset bidding tokens
          for (uint i = 0; i < users.length; i++) {
            remainingBids[users[i]] = _balances[users[i]];
            }
          //clear top bids
          for (uint i = 0; i < weeksInSeason; i++) {
              highestBid[i] = Bid(address(0),0);
          }
          //clear bids for each user for each week
          for (uint j = 0; j < bidHistory.length; j++) {
              currentBid[bidHistory[j]._week][bidHistory[j]._address] = 0;
          }
          openVoting = true; //after bids are reset, open bidding
      } else {
          openVoting = false; //close bidding
      }

      //insert code to call toggleBidding again at endTime
      endTime = block.timestamp + 120;
  }

  /**
  * @dev Total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param owner The address to query the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address owner) public view returns (uint256) {
    return _balances[owner];
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param owner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(
    address owner,
    address spender
   )
    public
    view
    returns (uint256)
  {
    return _allowed[owner][spender];
  }

  /**
  * @dev Transfer token for a specified address
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function transfer(address to, uint256 value) public returns (bool) {
    require(value <= _balances[msg.sender]);
    require(to != address(0));
    require(openVoting == false, "voting is currently open, transfer is closed"); //transfer between owners is closed during open voting

    _balances[msg.sender] = _balances[msg.sender].sub(value);
    _balances[to] = _balances[to].add(value);
    emit Transfer(msg.sender, to, value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param spender The address which will spend the funds.
   * @param value The amount of tokens to be spent.
   */
  function approve(address spender, uint256 value) public returns (bool) {
    require(spender != address(0));

    _allowed[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  /**
   * @dev Transfer tokens from one address to another
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param value uint256 the amount of tokens to be transferred
   */
  function transferFrom(
    address from,
    address to,
    uint256 value
  )
    public
    returns (bool)
  {
    require(value <= _balances[from]);
    require(value <= _allowed[from][msg.sender]);
    require(to != address(0));
    require(openVoting == false, "voting is currently open, transfer is closed"); //transfer between owners is closed during open voting


    _balances[from] = _balances[from].sub(value);
    _balances[to] = _balances[to].add(value);
    _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
    emit Transfer(from, to, value);
    return true;
  }


}
