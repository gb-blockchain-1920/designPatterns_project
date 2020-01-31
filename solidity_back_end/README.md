# Solidity Back-End Smart Contract

### Instructions
**Deploying**
- `_shares` can be any number
- `etherRate` can be any number (this number is in ether - I recommend using `1` which means 1 ether = 1 token)

**Operating**
- _`fallback`_ used to purchase tokens
- `bid` specify week and token amount
- `balanceOf` check number of tokens purchased
- `currentBid` check how much a user has already bid on a week
- `highestBid` check the highest bid for the week
- `remainingBids` check how many bids are left for a user in the cycle

### To Do
- [ ] implement closed & open bidding
- [ ] implement endTime
- [ ] implement reset tokens for next cycle
- [ ] user privacy? should everyone be able to see everyone's balances
