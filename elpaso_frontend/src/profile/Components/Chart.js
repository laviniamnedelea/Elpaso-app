import React, { useCallback, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useWindowDimensions from "../../windowDimensions";
import { Typography } from "@material-ui/core";

export default function Chart(props) {
  const { height, width } = useWindowDimensions();

  const [opacity, setOpacity] = useState({
    pv: 1,
  });

  const handleMouseEnter = useCallback(
    (o) => {
      const { dataKey } = o;

      setOpacity({ ...opacity, [dataKey]: 0.5 });
    },
    [opacity, setOpacity]
  );

  const handleMouseLeave = useCallback(
    (o) => {
      const { dataKey } = o;
      setOpacity({ ...opacity, [dataKey]: 1 });
    },
    [opacity, setOpacity]
  );

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Anul curent
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={props.data}
          height={height}
          width={width}
          margin={{
            top: 20,
            right: 15,
            left: 15,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="luna" />
          <YAxis>
            <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
              Suma (RON)
            </Label>
          </YAxis>
          <Tooltip />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Line
            type="monotone"
            dataKey="suma"
            strokeOpacity={opacity.pv}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />{" "}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
