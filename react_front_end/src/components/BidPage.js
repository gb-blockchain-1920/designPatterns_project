import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Countdown from "react-countdown-now";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function BidPage() {
  const classes = useStyles();
  const bids = [4, 5, 6];

  const [amountToBid, setAmountToBid] = React.useState(0);

  return (
    <div>
      <Grid container style={{ flexGrow: 1, margin: 10 }} spacing={2}>
        <Grid item xs={5}>
          <Paper>
            <HorizontalBar
              labels={bids.map((val, index) => "Bid #" + index)}
              data={{
                labels: bids.map((val, index) => "Bid #" + index),
                datasets: [
                  {
                    label: "Bids",
                    backgroundColor: [
                      "#3e95cd",
                      "#8e5ea2",
                      "#3cba9f",
                      "#e8c3b9",
                      "#c45850"
                    ],
                    data: bids
                  }
                ]
              }}
            ></HorizontalBar>
          </Paper>
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
