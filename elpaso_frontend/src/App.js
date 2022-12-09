import ParticleBackground from "./ParticleBackground";
import Home from "./Home";
import Login from "./authentication/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./authentication/signin";
import Start from "./Start";
import { AuthProvider } from "./context/AuthContext";
import ReceiptText from "./receipt_processing/ReceiptText.js";
import Options from "./Options.js";
import FileSelector from "./FileSelector";
import Profile from "./profile/Profile";
import Dashboard from "./profile/Components/Dashboard";
import SideNavbar from "./SideNavbar";
import React from "react";
import CameraComp from "./receipt_processing/CameraComp";
import Purchases from "./profile/Purchases";
import Crop from "./receipt_processing/Crop";
import { ContactsTwoTone } from "@material-ui/icons";
import Contact from "./contact/Contact";
import Information from "./contact/Information";
// "start": "export HTTPS=true&&SSL_CRT_FILE=./certificates/cert.pem&&SSL_KEY_FILE=./certificates/key.pem react-scripts start",

// HTTPS=true
// SSL_CRT_FILE=./certificates/cert.pem
// SSL_KEY_FILE=./certificates/key.pem

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                <>
                  <div>
                    <ParticleBackground />{" "}
                  </div>{" "}
                  <Login />
                </>
              }
            />
            <Route path="/information" element={<Information />} />
            <Route
              path="/contact"
              element={
                <>
                  <Contact />
                </>
              }
            />
            <Route
              path="/signin"
              element={
                <>
                  <div>
                    <ParticleBackground />{" "}
                  </div>{" "}
                  <Signin />
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <div>
                    <ParticleBackground />{" "}
                  </div>{" "}
                  <Home />
                </>
              }
            />
            <Route
              path="/start"
              element={
                <>
                  <div>
                    <ParticleBackground />{" "}
                  </div>{" "}
                  <SideNavbar />
                  <Start />
                </>
              }
            />
            <Route
              path="/capture"
              element={
                <>
                  {" "}
                  {/* <SideNavbar /> */}
                  <CameraComp />
                </>
              }
            />{" "}
            <Route
              path="/dashboard"
              element={
                <>
                  {" "}
                  <Profile />
                </>
              }
            />
            <Route
              path="/options"
              element={
                <>
                  <Options />
                </>
              }
            />
            <Route
              path="/select"
              element={
                <>
                  <FileSelector />
                </>
              }
            />
            <Route path="/statistics" element={<Dashboard />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/crop" element={<Crop />} />
            <Route
              path="/receipt"
              element={
                <>
                  <ReceiptText />
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

//192.168.1.143
