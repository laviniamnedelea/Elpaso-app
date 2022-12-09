import { Typography } from "@material-ui/core";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StackedAreaChartSection(props) {
  // console.log(props.data);

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Anii trecuti
      </Typography>
      <ResponsiveContainer>
        <AreaChart
          width={300}
          height={200}
          data={props.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Luna" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="2022"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="2021"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="monotone"
            dataKey="2020"
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
          />
          <Area
            type="monotone"
            dataKey="2019"
            stackId="1"
            stroke="#ffc658"
            fill="#5554d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
