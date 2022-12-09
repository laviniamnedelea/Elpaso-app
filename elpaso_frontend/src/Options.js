import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SideNavbar from "./SideNavbar";
import "./Options.css";
import { useFilePicker } from "use-file-picker";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import useWindowDimensions from "./windowDimensions";

import "./Animation.css";
const Options = () => {
  // Opening browser file selector.
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: true,
    limitFilesConfig: { max: 1 },
    maxFileSize: 150,
  });
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (filesContent != "") navigate("/select", { state: filesContent });
  }, [filesContent]);

  const { setUserToken, userToken, currentUser } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedFiles, setSelectedFiles] = useState();

  const handleClickCapture = (e) => {
    navigate("/capture");
  };

  const handleClickAdd = (e) => {
    navigate("/receipt");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length) {
    console.log(errors);

    return <div>Error...</div>;
  } else {
    console.log(filesContent);
  }

  return (
    <div className="information-container">
      <SideNavbar />
      <div className="col-1 animation-options-image">
        <img
          src="https://i.postimg.cc/15wjX33x/mclassan.png"
          className="static-options-image"
        />
        <img
          src="https://i.postimg.cc/2SYXZN11/elements.png"
          className="elements"
        />
      </div>
      <div className="option-buttons-container">
        <label className="options-label">Alegeti metoda de incarcare:</label>
        {currentUser && (
          <div className="file file--upload ">
            <label
              className="input-file options-button"
              onClick={() => {
                openFileSelector();
              }}
            >
              {width > height && <CloudUploadIcon />}
              {width < height && <PhotoCameraIcon />}
            </label>
          </div>
        )}
        <br></br>
        <div>
          {currentUser && width > height && (
            <div className="file file--upload ">
              <label
                className="input-file options-button"
                onClick={() => {
                  handleClickCapture();
                }}
              >
                <PhotoCameraIcon />
              </label>
            </div>
          )}
        </div>
        <br></br>
        <div>
          {currentUser && (
            <div className="file file--upload ">
              <label
                className="input-file options-button"
                onClick={() => {
                  handleClickAdd();
                }}
              >
                Adaug manual
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Options;
