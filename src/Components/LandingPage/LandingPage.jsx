import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, Box } from "@mui/material";
import LoadingSpinner from "../LoaderSpinner";
import Logo from "../Assets/LOGOO.png";
import "./LandingPage.css";
import { cities } from "../../data";
import { useNavigate } from "react-router-dom";
import Firebase from "../../Firebase";
let id;
function Card(props) {
  return (
    <>
      <div className="car">
        <div>
          <img
            style={{ width: props.widthy, height: props.heighty }}
            src={props.imgsrc}
          />
        </div>
        <div>
          <h3>{props.texty}</h3>
        </div>
        <div>
          <p>{props.para}</p>
        </div>
      </div>
    </>
  );
}

export function LandingPage() {
  const [isDraweropen, setisDraweropen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [res, setRes] = useState([]);
  const [login, setLogin] = useState(true);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [otp_valid, setOtp_valid] = useState("");
  let navigate = useNavigate();
 

  function check() {
    let user = JSON.parse(localStorage.getItem("user_details"));
    if (!query) {
      document.querySelector(".trip1").style.display = "block";
    } else if (user.name == "" || user.email == "" || user.number == "") {
      alert(
        "You can visit the restaurants page\nYou have to login to place orders"
      );
      navigate("/restaurants");
    } else {
      alert("Welcome to restaurant page");
      navigate("/restaurants");
    }
  }

  useEffect(() => {
    if (!query) return;

    let temp = document.querySelector(".trip1");
    if (temp) temp.style.display = "none";
    id = setTimeout(() => {
      let temp = [];
      let c = 0;
      for (let i = 0; i < cities.length; i++) {
        if (c === 5) break;
        if (cities[i].toLowerCase().includes(query.toLowerCase())) {
          temp.push(cities[i]);
          c++;
        }
      }
      setRes(temp);
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  localStorage.setItem("Location", JSON.stringify(query));

  useEffect(() => {
    let id = JSON.parse(localStorage.getItem("verificationId"));
    let user = JSON.parse(localStorage.getItem("user_details"));
    if (
      user.name == "" ||
      user.email == "" ||
      user.number == "" ||
      id.verificationId == ""
    ) {
      let temp = {
        name: name,
        email: email,
        number: number,
      };
      localStorage.setItem("user_details", JSON.stringify(temp));
    }
  }, [name, email, number]);

  useEffect(() => {
    setOtp_valid(otp_valid);
  }, [otp_valid]);

  // Firebase OTP Authentication
  function handleSubmit_Otp_sigin(e) {
    e.preventDefault();
    const code = otp_valid;
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        const user = result.user;
        setVerificationId(user.uid);
        localStorage.setItem("verificationId", JSON.stringify(user.uid));
        alert("Account created successfully Login Now !");
      })
      .catch((error) => {
        alert(error.message);
      });
    setOtp(false);
    setisDraweropen(false);
  }

  function handleSubmit_Otp_login(e) {
    e.preventDefault();
    const code = otp_valid;
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        const user = result.user;
        let id = JSON.parse(localStorage.getItem("verificationId"));
        if (id !== user.uid) {
          alert(
            "Verification failed ! \n No User ID found But you can visit the resturants page"
          );
          navigate("/restaurants");
        } else {
          alert("User Verified Success!");
          navigate("/restaurants");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
    setOtp(false);
    setisDraweropen(false);
  }

  const configureCaptcha_signIn = () => {
    window.recaptchaVerifier = new Firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: () => {
          onSigninSubmit();
          alert("Recaptcha verified");
        },
        defaultCountry: "IN",
      }
    );
  };
  const configureCaptcha_login = () => {
    window.recaptchaVerifier = new Firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: () => {
          onLogInSubmit();
          alert("Recaptcha verified");
        },
        defaultCountry: "IN",
      }
    );
  };

  const onSigninSubmit = (e) => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("user_details"));
    if (user.name !== "" || user.email !== "" || user.number !== "") {
      configureCaptcha_signIn();
      const phoneNumber = "+91" + number;
      const appVerifier = window.recaptchaVerifier;
      Firebase.auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          alert("OTP Sent Successfully !");
        })
        .catch((error) => {
          alert(error.message);
        });

      setOtp(true);
      setisDraweropen(true);
    }
  };

  const onLogInSubmit = (e) => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("user_details"));
    if (user.number !== "") {
      configureCaptcha_login();
      const phoneNumber = "+91" + number;
      const appVerifier = window.recaptchaVerifier;
      Firebase.auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          alert("OTP Sent Successfully !");
        })
        .catch((error) => {
          alert(error.message);
        });

      setOtp(true);
      setisDraweropen(true);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isDraweropen}
        onClose={() => {
          setisDraweropen(false);
        }}
      >
        <Box role="presentation" p={4} width="500px">
          <CloseIcon
            className="close_icon"
            onClick={() => {
              setisDraweropen(false);
            }}
            style={{ cursor: "pointer" }}
          />
          {login ? (
            <div className="login_form">
              <div className="left_div">
                <h2>Login</h2>
                <p className="link_register">
                  or{" "}
                  <a
                    onClick={() => setLogin(false)}
                    style={{ cursor: "pointer" }}
                  >
                    Create an account
                  </a>
                </p>
              </div>
              <hr className="hr_line_drawer" />
              <div className="right_div">
                <img
                  src="https://images.app.goo.gl/3GnLyvhL5HD76X296"
                  alt=""
                  className="food_wrap"
                />
              </div>
              <form>
                <div id="sign-in-button"></div>
                <input
                  type="number"
                  name="Number"
                  placeholder="Phone Number"
                  className="Number_input"
                  autoFocus={true}
                  spellCheck={false}
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                />
                <br />
                <input
                  type="submit"
                  value="CONTINUE"
                  className="login_btn"
                  onClick={onLogInSubmit}
                />
              </form>
              <div className="foot_text">
                <p>
                  By clicking on Login, I accept the terms & Conditions &
                  Privacy Policy
                </p>
              </div>
            </div>
          ) : (
            <div className="login_form">
              <div className="left_div">
                <h2>Sign up</h2>
                <p className="link_register">
                  or{" "}
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => setLogin(true)}
                  >
                    Login to your account
                  </a>
                </p>
              </div>
              <hr className="hr_line_drawer" />
              <div className="right_div">
                <img
                  src="https://images.app.goo.gl/3GnLyvhL5HD76X296"
                  alt=""
                  className="food_wrap"
                />
              </div>
              <form>
                <div id="sign-in-button"></div>
                <input
                  type="number"
                  name="Number"
                  placeholder="Phone Number"
                  className="Number_input_1"
                  autoFocus={true}
                  spellCheck={false}
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                />
                <br />
                <input
                  type="text"
                  name="user_name"
                  placeholder="Name"
                  className="Number_input_1"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <br />
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="Number_input_1"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <br />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="Number_input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <br />

                <input
                  type="submit"
                  value="CONTINUE"
                  className="login_btn"
                  onClick={onSigninSubmit}
                />
              </form>

              <div className="foot_text">
                <p>
                  By clicking on Login, I accept the terms & Conditions &
                  Privacy Policy
                </p>
              </div>
            </div>
          )}
        </Box>
      </Drawer>

      {otp ? (
        <Drawer
          anchor="right"
          open={isDraweropen}
          onClose={() => {
            setisDraweropen(false);
          }}
        >
          <Box role="presentation" p={4} width="500px">
            <CloseIcon
              className="close_icon"
              onClick={() => {
                setisDraweropen(false);
              }}
              style={{ cursor: "pointer" }}
            />
            <div className="login_form">
              <div className="left_div">
                <h2>Enter OTP</h2>
              </div>
              <form>
                <input
                  type="number"
                  name="Number"
                  autoFocus={true}
                  placeholder="Enter the OTP"
                  className="Number_input"
                  value={otp_valid}
                  onChange={(e) => {
                    setOtp_valid(e.target.value);
                  }}
                />
                <br />
                <input
                  type="submit"
                  value="SUBMIT"
                  className="login_btn"
                  onClick={
                    login ? handleSubmit_Otp_login : handleSubmit_Otp_sigin
                  }
                />
              </form>
              <div className="foot_text">
                <p>
                  By clicking on Login, I accept the terms & Conditions &
                  Privacy Policy
                </p>
              </div>
            </div>
          </Box>
        </Drawer>
      ) : (
        ""
      )}

      <div
        className="split"
        onClick={() => {
          document.querySelector(".suggestion").style.display = "none";
        }}
      >
        <div className="left">
          <div className="check0">
            <div>
              <img src={Logo} className="logoImage" alt="Logo" />
            </div>

            <div className="hing">
              <div>
                <button
                  id="login"
                  onClick={() => {
                    setLogin(true);
                    setisDraweropen(true);
                  }}
                >
                  Login
                </button>
              </div>
              <div>
                <button
                  id="signup"
                  onClick={() => {
                    setLogin(false);
                    setisDraweropen(true);
                  }}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
          {/* <Animation /> */}
          <div className="trip" id="appending">
            <div className="check">
              <input
                className="chinu"
                id="inputt"
                type="text"
                placeholder="Enter your delivery location"
                autoFocus={true}
                spellCheck={false}
                onChange={(e) => setQuery(e.target.value)}
                value={isLoading ? "Fetching your current location..." : query}
              />

              <button onClick={check} id="changing" value="toogle_food">
                {isLoading ? <LoadingSpinner /> : "Find Food"}
              </button>
            </div>
          </div>
          <div className="trip1" style={{ display: query ? "" : "none" }}>
            Please add your delivery location
          </div>

          <div style={{ marginBottom: "40px", marginTop: "50px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "grey" }}>
              POPULAR CITIES IN INDIA
            </h3>
            <div style={{ paddingRight: "15px" }} className="popular alterflex">
              <div style={{ color: "grey" }}>Ahmedabad</div>
              <div style={{ color: "lightgray" }}>Bangalore</div>
              <div style={{ color: "grey" }}>Chennai</div>
              <div style={{ color: "lightgray" }}>Delhi</div>
              <div style={{ color: "grey" }}>Gurgaon</div>
              <div style={{ color: "lightgray" }}>Hyderabad</div>
              <div style={{ color: "grey" }}>Kolkata</div>
              <div style={{ color: "lightgray" }}>Mumbai</div>
              <div style={{ color: "grey" }}>Pune &nbsp;&</div>
              <div style={{ color: "lightgray" }}>more.</div>
            </div>
          </div>
        </div>
        <div className="right">
          <img
            style={{
              width: "755px",
              height: "100vh",
              objectFit: "cover",
              objectPosition: "-3px -27px",
            }}
            src="https://web.archive.org/web/20210903175246im_/https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_1340/Lunch1_vlksgq"
          />
        </div>
      </div>
    </>
  );
}
