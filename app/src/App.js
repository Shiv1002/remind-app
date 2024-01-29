import { useEffect, useState } from "react";
import "./App.css";
import Remind from "./Remind";
import auth from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, Toaster } from "react-hot-toast";
function App() {
  const [user, setUser] = useState({
    uid: localStorage.getItem("userUid"),
    email: localStorage.getItem("userEmail"),
  });
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPass, setPass] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userUid")) {
      setIsLogged(true);
    } else {
      console.log("No user found ");
    }
  }, []);

  const clearInput = () => {
    setEmail("");
    setPassword("");
    setPasswordError("");
    setEmailError("");
    setPass(false);
  };

  const setLogin = () => {
    setIsLogged(true);
    toast.success("logged In");
  };
  const setLogout = () => {
    clearInput();
    setIsLogged(false);
    setUser();
    localStorage.removeItem("userUid");
    localStorage.removeItem("userEmail");
    toast.success("Logged out");
  };

  const handleLogin = () => {
    //userCredentials->user->uid
    //userCredentials->user->email
    if (!email) {
      toast.error("Invalid email");
      return;
    }
    if (!password) {
      toast.error("Invalid password");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        setUser(userCred.user);
        setLogin();
        localStorage.setItem("userUid", userCred.user.uid);
        localStorage.setItem("userEmail", userCred.user.email);
      })
      .catch((err) => {
        console.log(err, err.code);
        setEmailError(err.code);
        toast.error(err.code);
      });
  };

  const signUp = () => {
    if (!email) {
      toast.error("Invalid email");
      return;
    }
    if (!password) {
      toast.error("Invalid password");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log("Creating user", userCred.user.uid);
        setUser(userCred.user);
        axios
          .post("/user/postUser", {
            uid: userCred.user.uid,
            reminders: [],
            email: userCred.user.email,
          })
          .then((rs) => {
            console.log(rs);
            localStorage.setItem("userUid", userCred.user.uid);
            localStorage.setItem("userEmail", userCred.user.email);
          })
          .catch((err) => {
            console.log(err, err.code);
            setPasswordError(err.code);
            toast.error(err.code);
          });

        setLogin();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const showToast = (msg) => {};

  return (
    <>
      <Toaster />
      <div className="root position-relative p-4 ">
        {isLogged ? (
          <div>
            <span className="d-flex justify-content-end">
              <button
                className="btn position-absolute btn-success z-3 m-2 border-4"
                onClick={setLogout}
              >
                logout
              </button>
            </span>

            <Remind User={user} showToast={showToast} />
          </div>
        ) : (
          <div className="container   rounded-4 col-xl-4 col-md-6 col-sm-8 col-xs-6  p-3 my-4">
            <div className="login_page  d-flex flex-column align-items-center p-2 ">
              <h1 className="text-light">Reminder</h1>
              <div className="d-flex align-items-center justify-content-between px-4">
                <input
                  type="email"
                  value={email}
                  autoFocus
                  required
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FontAwesomeIcon icon={faUser} color="white" />
              </div>

              <span className="errorMsg">{emailError}</span>
              <div className="d-flex align-items-center justify-content-between px-4">
                <input
                  id="password"
                  type="password"
                  value={password}
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPass ? (
                  <FontAwesomeIcon
                    color="white"
                    onClick={() => {
                      setPass(false);
                      document.getElementById("password").type = "password";
                    }}
                    icon={faEye}
                  />
                ) : (
                  <FontAwesomeIcon
                    color="white"
                    onClick={() => {
                      setPass(true);
                      document.getElementById("password").type = "text";
                    }}
                    icon={faEyeSlash}
                  />
                )}
              </div>
              <span className="errorMsg">{passwordError}</span>
              <button onClick={handleLogin}>Login</button>
              <button onClick={signUp}>Sign up</button>
            </div>
          </div>
        )}

        <div
          id="cus-toast"
          className="op position-absolute end-0 bottom-0  m-3 rounded-2  "
        >
          <p className="p-3 m-0">{toast} </p>
          <span className="progress-bar"></span>
        </div>
      </div>
    </>
  );
}

export default App;
