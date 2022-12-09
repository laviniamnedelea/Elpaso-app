import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { getAuth, updateProfile } from "firebase/auth";
import { useMountedState } from "react-use";
import { useAuth } from "../context/AuthContext";
import SideNavbar from "../SideNavbar";
import "./signin.css";
const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [repeat_password, setRepeatPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  // const { signup, currentUser, setUserInformation, setErrors } = useAuth();
  const isMounted = useMountedState();
  const auth = getAuth();
  const [usernameFlag, setUsernameFlag] = useState(false);
  const { setUserToken, signup, userToken } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isMounted && auth.currentUser && auth.currentUser.displayName != null) {
      // console.log(
      //   " Username from useeffect is " + auth.currentUser.displayName
      // );
      setIsPending(false);

      function check() {
        let localStorageToken = localStorage.getItem("token");
        if (localStorageToken == null && userToken == null) {
          localStorageToken = localStorage.getItem("token");
          window.setTimeout(check, 100);
        } else {
          // console.log(" localStorageToken " + localStorageToken);
          navigate("/");
        }
      }
      check();
    }
  }, [usernameFlag]);

  async function handleSubmit(e) {
    if (isMounted) {
      e.preventDefault(); // prevent form from refreshing
      setIsPending(true);

      signup(email, password)
        .then((res) => {
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: username,
            }).then(async () => {
              await auth.currentUser.reload();
              auth.currentUser.getIdToken(true).then((token) => {
                localStorage.setItem("token", JSON.stringify(token));
                setUserToken(token);
                fetch("https://elpaso.zapto.org/app/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                  },
                  body: JSON.stringify(token),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw Error(response.status);
                    }
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              });
              function check() {
                if (auth.currentUser.displayName == null) {
                  window.setTimeout(check, 100);
                } else {
                  setUsernameFlag(true);
                }
              }
              check();
            });
          }
        })
        .catch((error) => {
          // Daca introduci un mail care exista deja pica, nu stiu dc nu e prinsa eroarea asta
          console.log(error);
          setError(error);
          setIsPending(false);
        });
    }
    setUsernameFlag(false);
    console.log(" current user " + auth.currentUser);
  }

  return (
    <div className="signin-container">
      <SideNavbar />
      <div className="login">
        <form onSubmit={handleSubmit} className="signin-form">
          <h2>Creati cont nou</h2>
          <label>Email: </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <label>Nume de utilizator: </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <label>Parola: </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <label>Repetati parola: </label>
          <input
            type="password"
            required
            value={repeat_password}
            onChange={(e) => setRepeatPassword(e.target.value)}
          ></input>
          {!isPending && (
            <button
              type="submit"
              style={{
                height: "10%",
                width: "80%",
                marginTop: "15%",
                marginLeft: "10%",
              }}
            >
              Inregistrare
            </button>
          )}
          {!isPending && error && { error }}
          {isPending && <button disabled>Va inregistram...</button>}
          {password !== repeat_password && (
            <div style={{ color: "rgba(240, 240, 240, 0.815)" }}>
              {" "}
              Parolele nu se potrivesc
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signin;
