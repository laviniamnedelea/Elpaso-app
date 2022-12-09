import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import SideNavbar from "../../SideNavbar";
import { useAuth } from "../../context/AuthContext";
import StackedAreaChart from "./StackedAreaChart";
import BarChartNoPadding from "./BarChartNoPadding";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import useWindowDimensions from "../../windowDimensions";
import { AnalyticsOutlined } from "@mui/icons-material";
import "../Dashboard.css";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 400,
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    backgroundColor: "white",
    alignSelf: "flex-end",
  },
}));

export default function GeneralDashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { userToken } = useAuth();
  const [receivedData, setReceivedData] = useState();
  const [firstRecent, setFirstRecent] = useState();
  const [receivedTotalExpense, setReceivedTotalExpense] = useState();
  const [receivedExpensesLast4y, setReceivedExpensesLast4y] = useState();
  const [receivedRecentProducts, setReceivedRecentProducts] = useState();
  const [receivedThisMonthSpendings, setReceivedThisMonthSpendings] =
    useState();
  const [receivedCategoryExpenses, setReceivedCategoryExpenses] = useState("");

  const [value, setValue] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const [pieHeight, setPieHeight] = useState(0);
  const [pieWidth, setPieWidth] = useState(0);
  const [innerRadius, setInnerRadius] = useState(0);
  const [outerRadius, setOuterRadius] = useState(0);
  const [cx, setcx] = useState();
  const [cy, setcy] = useState();
  const [widthWrapper, setWidthWrapper] = useState(0);
  const [legendleft, setlegendleft] = useState();
  const [top, setTop] = useState();
  const [top2, setTop2] = useState();
  const [widthResponsive, setWidthResponsive] = useState();
  const [heightResponsive, setHeightResponsive] = useState();
  const { height, width } = useWindowDimensions();
  const [formFields, setFormFields] = useState();

  const COLORS_SAMPLE_1 = [
    "#7affec",
    "#00C49F",
    // "#342652",
    "#ff1493",
    "#ffd700",
    "#adff2f",
    "#90ee90",
    "#191970",
  ];
  const COLORS_SAMPLE_2 = [
    // "#342652",
    "#006400",
    "#fff8dc",
    "#7affec",
    "#ff8c00",
    "#00C49F",
    "#FF8042",
    "#2e8b57",
  ];
  useEffect(() => {
    console.log(value);
    fetch("http://localhost:8000/app/general_dashboard", {
      method: "POST",
      body: JSON.stringify([value, "", "", "", ""]),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userToken}`,
      },
    }).then((resp) =>
      resp
        .json()
        .then((resp) => {
          if (resp["data"] != null) setReceivedData(resp["data"]);
          setReceivedTotalExpense(resp["total"]);
          setReceivedExpensesLast4y(resp["data_past_4y"]);
          setReceivedRecentProducts(resp["selected_day_products"]);
          setReceivedThisMonthSpendings(resp["this_month_spendings"]);
          console.log(receivedRecentProducts);
          let temp = receivedRecentProducts.slice(0, 5);
          console.log("############");
          console.log(temp);
          setFirstRecent(temp);
        })
        .catch((error) => {
          console.log("error: " + error);
        })
    );

    if (width < height) {
      setPieHeight(100);
      setPieWidth(100);
      setInnerRadius(45);
      setOuterRadius(65);
      setcx("45%");
      setWidthWrapper(300);
      setcy("75%");
      setlegendleft("5%");
      setTop("5%");
      setWidthResponsive("95%");
    }
    if (width > height) {
      setPieHeight(350);
      setPieWidth(400);
      setInnerRadius(90);
      setOuterRadius(110);
      setcx("50%");
      setWidthWrapper(400);
      setcy("70%");
      setlegendleft("100%");
      setTop("30%");
      setWidthResponsive("100%");
    }
  }, []);

  const showCategories = (e) => {
    let zi = document.getElementById("zi").value;
    let luna = document.getElementById("luna").value;
    let an = document.getElementById("an").value;

    fetch("http://localhost:8000/app/general_dashboard", {
      method: "POST",
      body: JSON.stringify([value, zi, luna, an, ""]),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userToken}`,
      },
    }).then((resp) =>
      resp
        .json()
        .then((resp) => {
          if (resp["data"] != null) setReceivedData(resp["data"]);
          setReceivedCategoryExpenses(resp["category_expenses"]);
          console.log("rece ");
          console.log(receivedCategoryExpenses);
        })
        .catch((error) => {
          console.log("error: " + error);
        })
    );
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <SideNavbar />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                {receivedData && <Chart data={receivedData} />}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                {receivedThisMonthSpendings && (
                  <BarChartNoPadding data={receivedThisMonthSpendings} />
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <form className="form-general-dashboard">
                      <input
                        type="text"
                        name="zi"
                        id="zi"
                        placeholder="Zi"
                        className="input-text-general-dashboard"
                      />
                      <input
                        type="text"
                        name="luna"
                        id="luna"
                        placeholder="Luna"
                        className="input-text-general-dashboard"
                      />
                      <input
                        type="text"
                        name="an"
                        id="an"
                        placeholder="An"
                        className="input-text-general-dashboard"
                      />
                      <button
                        type="button"
                        className="bton-general-dasboard"
                        onClick={() => {
                          showCategories();
                        }}
                      >
                        Afiseaza
                      </button>
                    </form>{" "}
                    {receivedCategoryExpenses != "" && (
                      <div className="pie-charts-general-dashboard">
                        <PieChart width={widthWrapper} height={300}>
                          <Pie
                            dataKey="value"
                            data={receivedCategoryExpenses}
                            cx={cx}
                            cy={cy}
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            fill="#82ca9d"
                            label="name"
                          >
                            {receivedCategoryExpenses.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  COLORS_SAMPLE_1[
                                    index % COLORS_SAMPLE_1.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>

                          <Tooltip />
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{
                              fontSize: "8px",
                              top: top,
                              left: legendleft,
                            }}
                          />
                        </PieChart>
                      </div>
                    )}
                  </Paper>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                {receivedTotalExpense && (
                  <Deposits sum={receivedTotalExpense} />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                {receivedExpensesLast4y && (
                  <StackedAreaChart data={receivedExpensesLast4y} />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                {receivedRecentProducts && (
                  <div>
                    <Orders data={receivedRecentProducts.slice(0, 5)} />

                    <Link color="primary" href="/purchases">
                      Vezi mai mult
                    </Link>
                  </div>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
