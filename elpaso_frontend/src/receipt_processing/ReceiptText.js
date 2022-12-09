import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";
import "react-edit-text/dist/index.css";
import { useEffect } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMountedState } from "react-use";
import "./ReceiptText.css";
import SideNavbar from "../SideNavbar";
import { MDBBtn } from "mdb-react-ui-kit";
import ProgressBar from "./ProgressBar";
function ReceiptText(props) {
  const { userToken } = useAuth();
  const navigate = useNavigate();

  const { state } = useLocation();
  const [receivedData, setReceivedData] = useState();
  const [receivedPrices, setReceivedPrices] = useState();
  const [formFields, setFormFields] = useState(state);
  const [receivedProductsPrices, setReceivedProductsPrices] = useState(state);
  const current = new Date();
  const [loading, setLoading] = useState(false);
  const date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;
  useEffect(() => {
    console.log("changed received prices ");
    // console.log(receivedData);
    // console.log(receivedPrices);
    // console.log(receivedProductsPrices);

    if (
      receivedData != null &&
      receivedPrices != null &&
      receivedProductsPrices != null
    ) {
      navigate("/dashboard", {
        state: [receivedData, receivedPrices, receivedProductsPrices],
      });
    }
  }, [receivedProductsPrices]);

  const submitAndFinish = (e) => {
    console.log(" subm and finish ");
    e.preventDefault();
    submit(e);
  };
  const isMounted = useMountedState();

  const submit = (e) => {
    if (isMounted) {
      e.preventDefault();
      // console.log(formFields);
      console.log("Will submit data..");
      setLoading(true);
      fetch("http://localhost:8000/app/receipt", {
        method: "POST",
        body: JSON.stringify([formFields, date]),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${userToken}`,
        },
      }).then((resp) =>
        resp
          .json()
          .then((resp) => {
            setLoading(false);
            setReceivedData(resp["data"]);
            setReceivedPrices(resp["prices_data"]);
            setReceivedProductsPrices(resp["products_prices_data"]);
          })
          .catch((error) => {
            console.log("error: " + error);
          })
      );
    }
  };
  const handleFormChange = (event, index) => {
    event.preventDefault();
    console.log(" handle form change");
    let data = [...formFields];
    // console.log(event.target);
    // console.log(data[index]);
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const addFields = () => {
    let object = {
      product: "",
      quantity: "",
    };
    if (formFields != null) setFormFields([...formFields, object]);
    else setFormFields([object]);
  };

  const removeFields = (e, index) => {
    e.preventDefault();
    console.log("remove ");
    let data = [...formFields];
    data.splice(index, 1);
    // console.log(data);
    setFormFields(data);
    console.log("Delete successful");
  };

  const addPhoto = (e) => {
    console.log("add[hoto");
    submit(e);
    navigate("/options");
  };

  return (
    <div className="container-receipt-text">
      <SideNavbar />
      <div>
        <div className="receipt">
          <div className="upper-bar-receipt">
            <div className="tab"></div>
          </div>

          <div className="container-print">
            <div className="panel panel-dark panel-default pseudo">
              <div className="panel-body">
                <br></br>
                <form onSubmit={submit}>
                  {formFields &&
                    formFields.map((form, index) => {
                      return (
                        <div key={index}>
                          <input
                            className="receiptInput-all-screens receiptInput"
                            name="quantity"
                            placeholder="cantitate BUC/KG X pret"
                            onChange={(event) => handleFormChange(event, index)}
                            value={form.quantity}
                          />
                          <input
                            className="receiptInput-all-screens receiptInput"
                            name="product"
                            placeholder="produs"
                            onChange={(event) => handleFormChange(event, index)}
                            value={form.product}
                          />
                          <MDBBtn
                            className="close-button btn-close"
                            color="none"
                            aria-label="Close"
                            onClick={(e) => removeFields(e, index)}
                          ></MDBBtn>

                          <hr />
                        </div>
                      );
                    })}
                </form>
                <br />
                <button onClick={addPhoto} className="receipt-button add">
                  BON NOU
                </button>
                {!loading && (
                  <button onClick={submitAndFinish} className="receipt-button">
                    CONFIRM
                  </button>
                )}

                {loading && (
                  <button className=" receipt-button button-receipt">
                    Incarcare
                  </button>
                )}
                <button onClick={addFields} className="receipt-button">
                  ADAUGARE
                </button>
                <hr />
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        {<ProgressBar props="3" />}
      </div>
    </div>
  );
}

export default ReceiptText;
