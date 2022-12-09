import React, { useState } from "react";
import DateCalendar from "./DateCalendar";
import Dashboard from "./Dashboard";
import SideNavbar from "../SideNavbar";
import "./Profile.css";

function Profile() {
  const [value, setValue] = useState();

  const get_data = (value) => {
    setValue(value);
    console.log(" Data value in profile changed in " + value);
  };

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="day-dashboard">
        <div className="date-calendar">
          <DateCalendar func={get_data} />
        </div>
        <div className="dashboard-data">
          <Dashboard value={value} func={setValue} />
        </div>
      </div>
    </div>
  );
}
export default Profile;
