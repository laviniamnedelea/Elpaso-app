import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./Home.css";
import SideNavbar from "./SideNavbar";
import "./Animation.css";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    // console.log("Details: ", e, "\n User: " + currentUser);

    navigate("/options");
  };

  const handleClickNotLogged = (e) => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <SideNavbar />
      <div className="home_image_container">
        {!currentUser && (
          <img
            src="https://raw.githubusercontent.com/MohamedAridah/frontendmentor_url-shortening-api/main/images/illustration-working.svg"
            alt="Working Illustration"
            className="home-image"
            onClick={handleClickNotLogged}
          ></img>
        )}
        {currentUser && (
          <img
            src="https://raw.githubusercontent.com/MohamedAridah/frontendmentor_url-shortening-api/main/images/illustration-working.svg"
            alt="Working Illustration"
            className="home-image"
            onClick={handleClick}
          ></img>
        )}
        <div className="button-text-home">
          <div>
            {" "}
            {currentUser && (
              <button onClick={handleClick} className="button-general button">
                Start
              </button>
            )}
          </div>

          <div>
            {" "}
            {!currentUser && (
              <button
                onClick={handleClickNotLogged}
                className="button-general button"
              >
                Start
              </button>
            )}{" "}
          </div>
          <div className="home-text">
            Pastrati bonul si incepeti sa va gestionati finantele.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
