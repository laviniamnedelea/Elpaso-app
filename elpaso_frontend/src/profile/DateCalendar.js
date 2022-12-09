import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import { useRef } from "react";

function DateCalendar(props) {
  const [value, setValue] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const isMounted = useRef(false);

  const handleChange = (newValue) => {
    setValue(newValue.toISOString().slice(0, 10));
    console.log("New date: " + value);
  };

  useEffect(() => {
    console.log("Component DataCalendar mounted ");
    isMounted.current = true;
    return () => {
      console.log("Component DataCalendar unmounted ");
      isMounted.current = false;
    };
  }, []);

  const handleAcceptDate = () => {
    console.log("Will send data to process..");
    props.func(value);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          inputFormat="yyyy/MM/dd"
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              autoFocus={true}
              variant="filled"
              sx={{
                variant: "outlined",
                input: { color: "black", fontSize: "17px" },
                width: "200px",
                position: "relative",
                background: "white",
                boxShadow: 1,
                borderRadius: 2,
              }}
              {...params}
            />
          )}
          onAccept={handleAcceptDate}
        />
      </LocalizationProvider>
    </div>
  );
}
export default DateCalendar;
