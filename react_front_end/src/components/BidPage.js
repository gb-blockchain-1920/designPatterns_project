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

function createData(weekNumber, userBid, maxBid, isOpen) {
  return { weekNumber, userBid, maxBid, isOpen };
}

export default function BidPage() {
  const classes = useStyles();

  const [amountToBid, setAmountToBid] = React.useState(0);

  const rows = [createData(1, 20, 30, true), createData(2, 25, 32, false)];

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
                  <TableCell align="right">Bidding Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.weekNumber}
                    </TableCell>
                    <TableCell align="right">{row.userBid}</TableCell>
                    <TableCell align="right">{row.maxBid}</TableCell>
                    <TableCell align="right">
                      {row.isOpen ? "Open" : "Closed"}
                    </TableCell>
                  </TableRow>
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
                id="number"
                label="# of shares"
                name="number"
                type="number"
                autoFocus
                value={amountToBid}
                onChange={e => setAmountToBid(parseInt(e.target.value))}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Buy
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
