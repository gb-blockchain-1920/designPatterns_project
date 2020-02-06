import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

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

  const [balance, setBalance] = React.useState(1);
  const [totalShares, setTotalShares] = React.useState(1);

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
            {totalShares === null ? "" : `Total Shares Per Period: ${totalShares}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/purchase">
          <PurchasePage />
        </Route>
        <Route path="/bid">
          <BidPage />
        </Route>
        <Route path="/">
          <PurchasePage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
