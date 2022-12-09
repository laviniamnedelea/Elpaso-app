import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits(props) {
  const classes = useStyles();
  const [date] = React.useState(new Date().toISOString().slice(0, 10));
  return (
    <React.Fragment>
      <Title>Cheltuieli Anuale</Title>
      <Typography component="p" variant="h4">
        {props.sum} RON
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        pe data de {date}
      </Typography>
      {/* <div>
        <Link color="primary">Anii trecuti</Link>
      </div> */}
    </React.Fragment>
  );
}
