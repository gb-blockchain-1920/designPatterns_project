import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Countdown from "react-countdown-now";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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

export default function PurchasePage() {
  const classes = useStyles();

  const [timeLeft, setTimeLeft] = React.useState(1000000);
  const [tokenBalance, setTokenBalance] = React.useState(10);
  const [amountToBuy, setAmountToBuy] = React.useState(0);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Time Left <Countdown date={Date.now() + timeLeft} />
        </Typography>
        <Typography component="h1" variant="h5">
          Token Balance {tokenBalance}
        </Typography>
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
            value={amountToBuy}
            onChange={e => setAmountToBuy(parseInt(e.target.value))}
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
      </div>
    </Container>
  );
}
