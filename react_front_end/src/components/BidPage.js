import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Countdown from "react-countdown-now";
import Typography from "@material-ui/core/Typography";

import { getHighestBid, getCurrentBid, bid } from "../bitBnBInterac";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

// function createData(weekNumber, userBid, maxBid, isOpen) {
//   return { weekNumber, userBid, maxBid, isOpen };
// }

export default function BidPage({ time, state }) {
  const classes = useStyles();

  //states for tracking bids
  const [amountToBid, setAmountToBid] = React.useState(0);
  const [bidWeek, setBidWeek] = React.useState(1);
  const [msg, setMsg] = React.useState(""); //any error messages will be sent here

  // const rows = [createData(1, 20, 30, true), createData(2, 25, 32, false)];
  const rows = [...Array(13).keys()]; //array with [0, 13) for iterating

  //place bid callback
  const placeBid = (event) => {
    event.preventDefault(); //prevents an automatic refresh
    if (amountToBid < 1) {
      setMsg("Bid must be greater than 0"); //displays error if condition met
    } else {
      bid(bidWeek - 1, amountToBid); //sends bid to backend
      window.location.reload(); //reloads page to refresh all numbers
    }
  };

  return (
    <div>
      <Grid
        justify="center"
        container
        style={{ flexGrow: 1, margin: 10 }}
        spacing={2}
      >
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Week #</TableCell>
                  <TableCell align="center">Your Bid</TableCell>
                  <TableCell align="center">Highest Bid</TableCell>
                  <TableCell align="center">Current Winner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <BiddingRow key={row} week={row} state={state} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={5}>
          <Paper>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="bid_week"
                label="Bidding for week:"
                name="week"
                type="number"
                autoFocus
                value={bidWeek}
                onChange={e => {
                  if (e.target.value >= 1 && e.target.value <= 13) {
                    setBidWeek(parseInt(e.target.value));
                  } else if (e.target.value === "") {
                    setBidWeek(e.target.value);
                  }
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="number"
                label="Increase bid by:"
                name="number"
                type="number"
                autoFocus
                value={amountToBid}
                onChange={e => {
                  if (e.target.value >= 0) {
                    setAmountToBid(parseInt(e.target.value));
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!state}
                onClick={placeBid}
              >
                Bid
              </Button>
              <Typography component="h1" variant="h5" align="center">
                Time remaining until bidding is {state ? "closed" : "opened"}:{" "}
                <Countdown key={time} date={time * 1000} />
              </Typography>
              <Typography variant="caption" align="center" display="block">
                Please refresh the page for the most up to date bids
              </Typography>
              <Typography
                variant="caption"
                align="center"
                display="block"
                color="secondary"
              >
                {msg}
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

//component for each bidding row
const BiddingRow = ({ week, state }) => {
  //inputs are week number and if bidding is open or closed

  const [userBid, setUserBid] = React.useState(0);
  const [topBid, setTopBid] = React.useState(0);
  const [winner, setWinner] = React.useState("N/A");

  //useeffect mainly triggered by state change in open/closed bidding
  React.useEffect(() => {
    //get current bid for the user for a given week
    getCurrentBid(week).then(res => setUserBid(res));

    //get top bid for current week
    //get current winner for week
    getHighestBid(week).then(res => {
      setTopBid(res._amount);
      let address = res._address;
      if (res._address === "0x0000000000000000000000000000000000000000") {
        address = "N/A";
      }
      setWinner(address);
    });
  }, [userBid, topBid, winner, state, week]);

  return (
    <TableRow key={`week${week}`}>
      <TableCell component="th" scope="row" key="week">
        {week + 1}
      </TableCell>
      <TableCell align="center" key="userbid">
        {userBid}
      </TableCell>
      <TableCell align="center" key="topbid">
        {topBid}
      </TableCell>
      <TableCell align="center" key="winner">
        {winner}
      </TableCell>
    </TableRow>
  );
};
