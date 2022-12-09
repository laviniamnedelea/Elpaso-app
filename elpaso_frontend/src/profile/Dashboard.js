import React, { forwardRef, useRef, useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../windowDimensions";
import KeyboardArrowRightOutlinedIcon from "@material-ui/icons/KeyboardArrowRightOutlined";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import no_results from "../icons/no_results.jpg";
import "semantic-ui-css/semantic.min.css";
import LineChart from "./LineChart";
import "./Dashboard.css";
import { Icon, IconButton } from "@material-ui/core";
import ProgressBar from "../receipt_processing/ProgressBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 4, // keep right padding when drawer closed
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
    marginRight: 6,
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
    width: "100%",
    backgroundColor: "#292727",
    marginBottom: "10%",
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

function Dashboard(props) {
  const classes = useStyles();
  const { state } = useLocation();
  const [formFields, setFormFields] = useState(state);
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
  // const COLORS_SAMPLE_3 = [
  //   "#fffafa",
  //   "#00ff7f",
  //   "#4682b4",
  //   `#d2b48c`,
  //   `#008080`,
  //   `#d8bfd8`,
  //   `#ff6347`,
  //   `#40e0d0`,
  //   `#ee82ee`,
  //   `#f5deb3`,
  //   `#ffffff`,
  //   `#f5f5f5`,
  //   `#ffff00`,
  //   `#9acd32`,
  // ];
  // const COLORS_SAMPLE_4 = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const current = new Date();
  const date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;

  const navigate = useNavigate();

  const { userToken } = useAuth();
  const isMounted = useRef(false);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    console.log(
      "Component DataCalendar mounted with dimensions " + width + " " + height
    );
    if (width < height) {
      setPieHeight(100);
      setPieWidth(250);
      setInnerRadius(45);
      setOuterRadius(65);
      setcx("35%");
      setWidthWrapper(250);
      setcy("55%");
      setlegendleft("5%");
      setTop("5%");
      setTop2("5%");
      setWidthResponsive("95%");
    }
    if (width > height) {
      setPieHeight(350);
      setPieWidth(400);
      setInnerRadius(90);
      setOuterRadius(110);
      setcx("50%");
      setWidthWrapper(850);
      setcy("70%");
      setlegendleft("100%");
      setTop("30%");
      setTop2("25%");
      setWidthResponsive("100%");
    }
    isMounted.current = true;
    if (formFields == null) {
      props.func(date);
    }
    return () => {
      console.log("Component DataCalendar unmounted ");
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    console.log("Data value in prop changed in " + props.value);

    if (isMounted.current && props.value != null) {
      console.log("Will submit data..");
      fetch("https://elpaso.zapto.org/app/dashboard", {
        method: "POST",
        body: JSON.stringify(props.value),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${userToken}`,
        },
      }).then((resp) =>
        resp
          .json()
          .then((resp) => {
            console.log(resp["status"]);
            if (
              resp["data"] != "" &&
              resp["prices_data"] != "" &&
              resp["products_prices_data"] != ""
            ) {
              // console.log(resp["products_prices_data"]);
              console.log(" Response received ");
            }
            if (resp != null)
              setFormFields([
                resp["data"],
                resp["prices_data"],
                resp["products_prices_data"],
              ]);
          })
          .catch((error) => {
            console.log("error: " + error);
          })
      );
    }
  }, [props.value]);

  return (
    <>
      {formFields != null &&
        formFields[0] != null &&
        formFields[1] != null &&
        formFields[0] != "" &&
        formFields[1] != "" &&
        formFields[2] != "" && (
          <Container maxWidth="lg" className={classes.container}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <PieChart width={widthWrapper} height={300}>
                  <Pie
                    dataKey="value"
                    data={formFields[0]}
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill="#82ca9d"
                    label="name"
                  >
                    {formFields[0].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_SAMPLE_1[index % COLORS_SAMPLE_1.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="left"
                    align="center"
                    wrapperStyle={{
                      fontSize: "8px",
                      top: top,
                      left: legendleft,
                    }}
                  />
                </PieChart>

                <PieChart width={widthWrapper} height={300}>
                  <Pie
                    dataKey="value"
                    data={formFields[1]}
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill="#82ca9d"
                    label="name"
                  >
                    {formFields[1].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_SAMPLE_2[index % COLORS_SAMPLE_2.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="left"
                    align="center"
                    wrapperStyle={{
                      fontSize: "8px",
                      top: top2,
                      left: legendleft,
                    }}
                  />
                </PieChart>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <LineChart data={formFields[2]} height={height} width={width} />
              </Paper>
            </Grid>
          </Container>
        )}
      {formFields != null && formFields[0] == "" && formFields[1] == "" && (
        <img src={no_results} className="dashboard-image-no-results" />
      )}
      {/* <Icon className="next-arrow dashboard-next-arrow">
        <KeyboardArrowRightOutlinedIcon
          onClick={() => {
            navigate("/statistics");
          }}
        />
      </Icon> */}
      <br /> <br />
      {<ProgressBar props="4" />}
    </>
  );
}
export default Dashboard;
