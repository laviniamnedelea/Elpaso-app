import React, { useEffect, useState } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useNavigate } from "react-router-dom";
import { useMountedState } from "react-use";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import "./CameraComp.css";
import useWindowDimensions from "../windowDimensions";

function CameraComp() {
  const [image, setImage] = useState("");
  // const [receivedData, setReceivedData] = useState();
  const isMounted = useMountedState();
  // const { userToken } = useAuth();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (width >= 600) {
      setFullscreen(true);
      console.log("Set full screen");
    }
  }, []);

  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log(dataUri);
    setImage(dataUri);
  }

  function handleTakePhotoAnimationDone(dataUri) {
    // Do stuff with the photo...
    console.log(dataUri);
  }

  function handleCameraError(error) {
    console.log("handleCameraError", error);
  }

  function handleCameraStart(stream) {
    console.log("handleCameraStart");
  }

  function handleCameraStop() {
    console.log("handleCameraStop");
  }
  let user = true;
  const FACING_MODE_USER = FACING_MODES.USER;
  const FACING_MODE_ENVIRONMENT = FACING_MODES.ENVIRONMENT;
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_ENVIRONMENT);

  const handleSwitch = () => {
    user = !user;
    user
      ? setFacingMode(FACING_MODE_USER)
      : setFacingMode(FACING_MODE_ENVIRONMENT);
  };

  const handleBack = () => {
    setImage();
  };

  async function handleSendPhoto(e) {
    if (isMounted) {
      e.preventDefault();
      navigate("/crop", { state: image });
    }
  }

  return (
    <div>
      <div className="video-stream">
        {!image && (
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            onTakePhotoAnimationDone={(dataUri) => {
              handleTakePhotoAnimationDone(dataUri);
            }}
            onCameraError={(error) => {
              handleCameraError(error);
            }}
            idealFacingMode={facingMode}
            // idealResolution={{ width: 400, height: 700 }}
            imageType={IMAGE_TYPES.JPG}
            imageCompression={1}
            isMaxResolution={true}
            isImageMirror={false}
            isSilentMode={false}
            isDisplayStartCameraError={false}
            isFullscreen={true}
            sizeFactor={1}
            onCameraStart={(stream) => {
              handleCameraStart(stream);
            }}
            onCameraStop={() => {
              handleCameraStop();
            }}
          />
        )}
      </div>
      {!image && (
        <button
          image={CameraswitchIcon}
          className="switch-button"
          onClick={handleSwitch}
        >
          Switch camera
        </button>
      )}
      {image && (
        <button onClick={handleSendPhoto} className="submit-button">
          Confirm
        </button>
      )}
      {image && (
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
      )}
      {image && (
        <div className="camera-taken-image">
          {" "}
          <img src={image} className="camera-image" alt="" />{" "}
        </div>
      )}
    </div>
  );
}

export default CameraComp;
