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

export default function BidPage() {
  const classes = useStyles();

  const [timeLeft, setTimeLeft] = React.useState(1000000);
  const [amountToBid, setAmountToBid] = React.useState(0);
  const [bidWeek, setBidWeek] = React.useState(1);
  const [openBidding, setOpenBidding] = React.useState(true);

  // const rows = [createData(1, 20, 30, true), createData(2, 25, 32, false)];
  const rows = [...Array(13).keys()];

  return (
    <div>
      <Grid container style={{ flexGrow: 1, margin: 10 }} spacing={2}>
        <Grid item xs={5}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Week #</TableCell>
                  <TableCell align="right">Your Bid</TableCell>
                  <TableCell align="right">Highest Bid</TableCell>
                  <TableCell align="right">Current Winner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <BiddingRow week={row} />
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
                disabled={!openBidding}
              >
                Bid
              </Button>
              <Typography component="h1" variant="h5" align="center">
                Time remaining until bidding is{" "}
                {openBidding ? "closed" : "opened"}:{" "}
                <Countdown date={Date.now() + timeLeft} />
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const BiddingRow = ({ week }) => {

  const [userBid, setUserBid] = React.useState(0);
  const [topBid, setTopBid] = React.useState(0);
  const [winner, setWinner] = React.useState("");

  React.useEffect(() => {
    //get userBid
    //get topBid
    //get current winner
  }, [userBid, topBid, winner])

  return (
    <TableRow key={`week${week}`}>
      <TableCell component="th" scope="row" key="week">
        {week+1}
      </TableCell>
      <TableCell align="right" key="userbid">{userBid}</TableCell>
      <TableCell align="right" key="topbid">{topBid}</TableCell>
      <TableCell align="right" key="winner">{winner}</TableCell>
    </TableRow>
  );
};

// const BiddingRow = ({ data }) => {
//
//   return (
//     <TableRow key={data.name}>
//       <TableCell component="th" scope="row" key="week">
//         {data.weekNumber}
//       </TableCell>
//       <TableCell align="right" key="userbid">{data.userBid}</TableCell>
//       <TableCell align="right" key="topbid">{data.maxBid}</TableCell>
//       <TableCell align="right" key="winner">{data.isOpen ? "Open" : "Closed"}</TableCell>
//     </TableRow>
//   );
// };
