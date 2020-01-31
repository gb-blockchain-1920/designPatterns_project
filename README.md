# Design Patterns for Blockchain

## BitBnB - Timeshare reservation token
### Functionality
- People are able to purchase fractional shares of property
- Every cycle (a certain number of weeks) they are allotted tokens to bid on weeks in that season
- Highest bidder wins the week to use the property

### Components
**Front end (React)**
- purchase fractional shares
  - display shares left that can be purchased
  - form for purchasing + submit button
  - continue to voting when all shares are purchased
- voting open
  - button to submit votes
  - show available tokens for the user
  - rows showing each week
    - show dates
    - current maximum bid
    - space to submit bid
  - display error when insufficient balance for all bids
  - display when voting closes
- voting closed
  - show winning addresses for each week
  - display when voting is next open

**Connection between front & back end (ethers.js or web3.js)**
- Functions
  - get user address
  - purchase shares (_`fallback`_ function)
  - get number of shares left (`balanceOf` function)
  - place bid (`bid` function)
  - get highest bid for a week (`highestBid` mapping)
  - get time left from `startTime` & `endTime`
  - optional: listener for when data changes on blockchain (updating without refreshing)

**Back end (solidity+ remix smart contract)**
- Basic ERC20 token
- Store
  - allotted tokens (fractional shares) - could be equal to number of ethers submitted
  - current top bid for each week + account
- Additional functions beyond ERC20 functions
  - `bid(week, amount)`
  - _`fallback`_ function - purchase tokens
  - `constructor` - specify number of shares available
- Data structures
  - `uint public startTime` & `uint public endTime`
  - `mapping (address => uint) public allottedTokens`
  - `mapping (address => uint) public remainingTokens`
  - `mapping (uint => Bid) public highestBid;`
  - `struct Bid {address, amount}`

### Questions
- if you get outbid, can you use those tokens elsewhere? (do the tokens get returned or are they one time bids)


### Links
- [ERC20](https://eips.ethereum.org/EIPS/eip-20)
