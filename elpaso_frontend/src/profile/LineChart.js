import React, { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useWindowDimensions from "../windowDimensions";

export default function App(props) {
  const [opacity, setOpacity] = useState({
    pv: 1,
  });
  const { height, width } = useWindowDimensions();

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
    <div>
      {height < width && (
        <div>
          <LineChart
            width={props.width / 2}
            height={(props.height * 2) / 3}
            data={props.data}
            margin={{
              top: 50,
              right: 0,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="nume" />
            <YAxis />
            <Tooltip />
            <Legend
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <Line
              type="monotone"
              dataKey="pret"
              strokeOpacity={opacity.pv}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      )}

      {height >= width && (
        <div>
          <LineChart
            width={props.width * 0.8}
            height={props.height}
            data={props.data}
            margin={{
              top: 105,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nume" />
            <YAxis />
            <Tooltip />
            <Legend
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <Line
              type="monotone"
              dataKey="pret"
              strokeOpacity={opacity.pv}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      )}
    </div>
  );
}
