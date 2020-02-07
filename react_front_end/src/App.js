import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {
  remainingBids,
  balanceOf,
  getEndTime,
  toggleBidding,
  getOpenVoting,
} from "./bitBnBInterac";

import PurchasePage from "./components/PurchasePage";
import BidPage from "./components/BidPage";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    textAlign: "right"
  }
}));

const App = () => {
  const classes = useStyles();

  const [balance, setBalance] = React.useState(0);
  const [totalShares, setTotalShares] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const [biddingIsOpen, setBiddingIsOpen] = React.useState();
  const userAddress = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";

  const rows = [...Array(13).keys()];
  // console.log(rows);

  React.useEffect(() => {
    balanceOf(userAddress).then(res => setTotalShares(res));
    remainingBids(userAddress).then(res => setBalance(res));
    getEndTime().then(res => setEndTime(parseInt(res)));
    getOpenVoting().then(res => setBiddingIsOpen(res));
  }, [biddingIsOpen]);

  React.useEffect(() => {

    const keepUpdated = () => {
      //toggle bidding based on endTime
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > endTime && endTime !== 0) {
        console.log("bidding toggled");
        toggleBidding();
        setTimeout(() => {
          getEndTime().then(res => setEndTime(parseInt(res)));
          getOpenVoting().then(res => setBiddingIsOpen(res));
        }, 250);
      }

      //update user balances every seconds
      if (currentTime % 10 === 0) {
        balanceOf(userAddress).then(res => setTotalShares(res));
        remainingBids(userAddress).then(res => setBalance(res));
      }
    };

    const timer = setInterval(() => {
      keepUpdated();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            BitBnB
          </IconButton>
          <Link to="/purchase">
            <Button>Purchase Shares</Button>
          </Link>
          <Link to="/bid">
            <Button>Bid</Button>
          </Link>
          <Typography className={classes.title}>
            {balance === null ? "" : `Bids Remaining This Period: ${balance}`}
          </Typography>
          <Typography className={classes.title}>
            {totalShares === null
              ? ""
              : `Total Shares Per Period: ${totalShares}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/purchase">
          <PurchasePage />
        </Route>
        <Route path="/bid">
          <BidPage time={endTime} state={biddingIsOpen} />
        </Route>
        <Route path="/">
          <PurchasePage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
