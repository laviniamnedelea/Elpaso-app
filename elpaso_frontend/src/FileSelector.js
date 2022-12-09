import { useFilePicker } from "use-file-picker";
import React, { useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import "./FileSelector.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import ProgressBar from "./receipt_processing/ProgressBar";

const FileSelector = () => {
  const { userToken } = useAuth();
  const [receivedData, setReceivedData] = useState();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [filesContent, setFilesContent] = useState();
  const isMounted = useRef(false);

  useEffect(() => {
    if (receivedData != null) {
      for (let [key, value] of Object.entries(receivedData)) {
        console.log(`${key}: ${value}`);
      }
      navigate("/receipt", { state: receivedData });
    }
  }, [receivedData]);

  useEffect(() => {
    isMounted.current = true;
    setFilesContent(state);
    console.log("files content " + state);
    return () => {
      isMounted.current = false;
    };
  }, []);

  const select = (index, e) => {
    if (isMounted.current) {
      e.preventDefault();
      console.log(JSON.stringify(filesContent[index].content));
      navigate("/crop", { state: filesContent[index].content });
    }
  };

  return (
    <div className="photo-selector-container">
      <SideNavbar />
      <div className="button-item">
        {filesContent != null &&
          filesContent.map((file, index) => (
            <div key={index} className="button-item-flex">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "normal",
                }}
              >
                <img
                  alt={file.name}
                  src={file.content}
                  className="receipt-image"
                ></img>
              </div>

              <Button
                variant="outlined"
                endIcon={<SendIcon />}
                onClick={(e) => select(index, e)}
                sx={{
                  width: 300,
                  color: "#3f51b5",
                  backgroundColor: "white",
                  borderRadius: "100px",
                }}
              >
                Selectati
              </Button>
            </div>
          ))}
        <ProgressBar props="1" />
      </div>
    </div>
  );
};

export default FileSelector;
