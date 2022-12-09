import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useAuth } from "../../context/AuthContext";

export default function Orders(props) {
  const [data, setData] = useState(props.data);
  const { userToken } = useAuth();
  const [value, setValue] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const deleteEntry = (id) => {
    console.log(id);
    console.log("ceva");
    fetch("http://localhost:8000/app/general_dashboard", {
      method: "POST",
      body: JSON.stringify([value, "", "", "", id]),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userToken}`,
      },
    })
      .then((resp) =>
        resp.json().then((resp) => {
          if (resp["selected_day_products"] != null) {
            console.log(resp["selected_day_products"]);
            window.location.reload();
            const dataAux = [...data];
            dataAux.push(resp["selected_day_products"]);
            setData(dataAux);
          }
        })
      )
      .catch((error) => {
        console.log("error: " + error);
      });
  };
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Produse Recente
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Produs</TableCell>
            <TableCell>Bucati/kg</TableCell>
            <TableCell>Data</TableCell>
            <TableCell align="right">Pret</TableCell>
            <TableCell align="right">Categorie</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data &&
            props.data.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.nume}</TableCell>
                <TableCell>{data.bucati}</TableCell>
                <TableCell>{data.data}</TableCell>
                <TableCell align="right">{data.pret}</TableCell>
                <TableCell align="right">{data.categorie}</TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      deleteEntry(data.id);
                    }}
                  ></Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <br></br>
    </React.Fragment>
  );
}
