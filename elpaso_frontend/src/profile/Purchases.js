import React, { useEffect, useState } from "react";
import DateCalendar from "./DateCalendar";
import SideNavbar from "../SideNavbar";
import "./Profile.css";
import Orders from "./Components/Orders";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";
import { useAuth } from "../context/AuthContext";
import { CSVLink, CSVDownload } from "react-csv";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));
function Purchases() {
  const classes = useStyles();

  const [value, setValue] = useState(new Date().toISOString().slice(0, 10));
  const [receivedData, setReceivedData] = useState();
  const { userToken } = useAuth();

  const get_data = (value) => {
    setValue(value);
    console.log(" Data value in profile changed in " + value);
  };

  useEffect(() => {
    if (value != null)
      fetch("https://elpaso.zapto.org/app/general_dashboard", {
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
            if (resp["selected_day_products"] != null)
              setReceivedData(resp["selected_day_products"]);
            console.log(resp["selected_day_products"]);
          })
          .catch((error) => {
            console.log("error: " + error);
          })
      );
  }, [value]);

  return (
    <div>
      <Paper className={classes.paper}>
        <div className="dashboard-container">
          <SideNavbar />
          <div className="day-dashboard">
            <div className="date-calendar">
              <DateCalendar func={get_data} />
            </div>
            <div className="dashboard-data">
              {receivedData && <Orders data={receivedData} />}
              {receivedData && (
                <div>
                  {" "}
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignSelf: "center",
                    }}
                  ></label>
                  <CSVLink data={receivedData}>
                    <label>
                      <CloudUploadIcon /> Exportati CSV
                    </label>
                  </CSVLink>
                </div>
              )}
            </div>
          </div>
        </div>{" "}
      </Paper>
      ;
    </div>
  );
}
export default Purchases;
