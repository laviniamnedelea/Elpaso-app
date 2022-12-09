import React, { useEffect, useState } from "react";
import ImageCrop from "react-image-crop-component";
import "react-image-crop-component/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useMountedState } from "react-use";
import { useAuth } from "../context/AuthContext";
import SideNavbar from "../SideNavbar";
import ProgressBar from "./ProgressBar";
import "./Crop.css";
const Crop = () => {
  const [croppedImage, setCroppedImage] = useState();
  const { state } = useLocation();
  const [image] = useState(state);
  const isMounted = useMountedState();
  const { userToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [receivedData, setReceivedData] = useState();
  const navigate = useNavigate();

  const onCropped = (e) => {
    setCroppedImage(e.image);
    return false;
  };

  useEffect(() => {
    if (receivedData != null) {
      for (let [key, value] of Object.entries(receivedData)) {
        console.log(`${key}: ${value}`);
      }
      navigate("/receipt", { state: receivedData });
    }
  }, [receivedData]);

  async function handleSendPhoto(e) {
    setLoading(true);
    if (isMounted) {
      e.preventDefault(); // prevent form from refreshing
      // try {
      console.log("User token that sometimes is null: " + userToken);
      console.log("LOADINGGGGGGGGG    " + loading);
      fetch("https://elpaso.zapto.org/app/capture", {
        method: "POST",
        body: JSON.stringify({ photo: croppedImage }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${userToken}`,
        },
      })
        .then((resp) =>
          resp.json().then((resp) => {
            setLoading(false);
            console.log(loading);
            setReceivedData(resp["data"]);
          })
        )
        .catch((error) => {
          setLoading(false);
          console.log(loading);
          console.log("error: " + error);
        });
    }
  }

  return (
    <div className="crop-container">
      <SideNavbar />
      <div className="crop-button">
        <div className="just-crop-button">
          <div className="crop-image">
            {!loading && (
              <ImageCrop
                src={image}
                setWidth={400}
                setHeight={520}
                square={false}
                resize={true}
                border={"dashed #ffffff 2px"}
                onCrop={onCropped}
              />
            )}
            {loading && (
              <div className="overlay">
                <div className="wrap">
                  <div className="center">
                    <div className="document-loader">
                      <span className="heading short"></span>
                      <span className="line short"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line short"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line short"></span>
                      <span className="heading"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line short"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line short"></span>
                    </div>
                    <p>Loading</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!loading && image && (
            <button onClick={handleSendPhoto} className="receipt-button-crop">
              Confirm
            </button>
          )}{" "}
        </div>
        {!loading && <ProgressBar props="2" />}
      </div>
    </div>
  );
};

export default Crop;
