import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMountedState } from "react-use";
import Webcam from "react-webcam";
import { useAuth } from "../context/AuthContext";
import "./Webcam.css";
import useWindowDimensions from "../windowDimensions";

///////////////////////////// DEPRECATED /////////////////////

function WebcamComp() {
  const navigate = useNavigate();
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const { userToken } = useAuth();
  const { height, width } = useWindowDimensions();

  let user = true;
  const isMounted = useMountedState();

  const [image, setImage] = useState("");
  const [receivedData, setReceivedData] = useState();
  const videoConstraints = {
    facingMode: FACING_MODE_ENVIRONMENT,
    height: height,
    width: width,
    aspectRatio: 1.5,
  };

  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
  const webcamRef = React.useRef(null);

  const handleSwitch = () => {
    user = !user;
    user
      ? setFacingMode(FACING_MODE_USER)
      : setFacingMode(FACING_MODE_ENVIRONMENT);
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    console.log(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    if (receivedData != null) {
      for (let [key, value] of Object.entries(receivedData)) {
        console.log(`${key}: ${value}`);
      }
      navigate("/receipt", { state: receivedData });
    }
  }, [receivedData]);

  async function handleSendPhoto(e) {
    if (isMounted) {
      e.preventDefault(); // prevent form from refreshing
      // try {
      console.log("User token that sometimes is null: " + userToken);
      fetch("http://localhost:8000/app/capture", {
        method: "POST",
        body: JSON.stringify({ photo: image }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${userToken}`,
        },
      })
        .then((resp) =>
          resp.json().then((resp) => {
            setReceivedData(resp["data"]);
          })
        )
        .catch((error) => {
          console.log("error: " + error);
        });
    }
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div>
        <Webcam
          screenshotFormat="jpeg" // Intelege asta
          ref={webcamRef}
          videoConstraints={{
            ...videoConstraints,
            facingMode,
          }}
          className="webcam"
        />
      </div>

      <button onClick={handleSwitch} className="button switch-button">
        Switch camera
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          setImage("");
          capture();
        }}
        className="button snap-button"
      >
        Snap!
      </button>

      <div className="webcam-container">
        <div className="webcam-img">{image != "" && <img src={image} />}</div>
        {image != "" && (
          <button onClick={handleSendPhoto} className="button confirm-button">
            Confirm
          </button>
        )}
      </div>
      <button>My dashboard</button>
    </div>
  );
}

// https://www.npmjs.com/package/react-webcam
export default WebcamComp;
