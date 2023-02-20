import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  loadingToggleAction,
  loginAction,
} from "../../store/actions/AuthActions";

import { UserLogin, LoginRequested } from "../../store/actions/UserLogin";

// image
import logo from "../../images/logo-white.png";
import logoWhite from "../../images/logo-whiite-text.png";
import loginbg from "../../images/bg-login.jpg";

import { ToastContainer, toast } from "react-toastify";

function Login(props) {
  console.log(props, "props-----");
  const dispatch = useDispatch();
  const history = useHistory();

  const loginSuccess = useSelector((state) => {
    console.log(state, "Login State");
    return state.UserLogin.data;
  });

  const loginLoading = useSelector((state) => {
    console.log(state, "Login State");
    return state.UserLogin.loading;
  });

  const loginError = useSelector((state) => {
    console.log(state, "Login State");
    return state.UserLogin.error;
  });

  const [email, setEmail] = useState("");
  // const [email, setEmail] = useState("demo@example.com");
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  // const [password, setPassword] = useState("123456");

  function onLogin(e) {
    e.preventDefault();
    console.log(email, password, "login data----");

    // return;

    let error = false;
    const errorObj = { ...errorsObj };
    if (email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }

    dispatch(LoginRequested());
    let data = {
      email,
      password,
    };
    dispatch(UserLogin(data));
    // dispatch(loadingToggleAction(true));
    // dispatch(loginAction(email, password, props.history));
  }

  useEffect(() => {
    if (loginSuccess) {
      console.log(loginSuccess, "if useEffect login data");
      // history.push("/home");

      // history.push("/dashboard");

      // if (loginSuccess) {
      // setAuthLoading(false);
      // console.log("true");
      // toast.success(" Admin Login Successfully!", {
      //   position: "top-center",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "colored",
      // });
      // console.warn("login data successssssss", loginData);
      // const session_token = loginData.data.token;
      // const id = loginData.data._id;
      // const { name } = loginData.data;
      // const { email } = loginData.data;
      // const { phone } = loginData.data;
      // const data = [session_token, id, name, email, phone];
      // localStorage.setItem("SessionData", JSON.stringify(data));
      // setAdminEmail("");
      // setPassword("");
      // history.push("/dashboard");
      // dispatch(resetloginAdmin());
      // } else if (loginSuccess) {
      // setAuthLoading(false);
      // console.log("false");
      // setErrMsg(true);
      // dispatch(resetloginAdmin());
      // }
    } else if (loginError) {
      // setAuthLoading(false);
      // setErrMsg(true);
      console.log(loginError, "else if useEffect login data");
      toast.error(`❌ ${loginError.message} !`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      // console.log(loginData, "else useEffect login data");
      // setAuthLoading(false);
      // toast.error("Something Went Wrong", {
      //   position: "top-center",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "colored",
      // });
      // dispatch(resetloginAdmin());
    }

    // return () => {
    //   dispatch(resetloginAdmin());
    // };
  }, [loginSuccess, loginLoading, loginError]);

  return (
    <>
      <ToastContainer />
      <div
        className="login-main-page"
        style={{ backgroundImage: "url(" + loginbg + ")" }}
      >
        <div className="login-wrapper">
          <div className="login-aside-left">
            <Link to={"#"} className="login-logo">
              <img src={logo} alt="" width="50px" />
              <img src={logoWhite} alt="" className="ms-3" />
            </Link>
            <div className="login-description">
              <h2 className="main-title mb-2">Welcome To Invome</h2>
              <p className="">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters,
              </p>
              <ul className="social-icons mt-4">
                <li>
                  <Link to={"#"}>
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                <li>
                  <Link to={"#"}>
                    <i className="fab fa-twitter"></i>
                  </Link>
                </li>
                <li>
                  <Link to={"#"}>
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </li>
              </ul>
              <div className="mt-5 bottom-privacy">
                <Link to={"#"} className="mr-4">
                  Privacy Policy
                </Link>
                <Link to={"#"} className="mr-4">
                  Contact
                </Link>
                <Link to={"#"} className="">
                  © 20222 DexignLab
                </Link>
              </div>
            </div>
          </div>
          <div className="login-aside-right">
            <div className="row m-0 justify-content-center h-100 align-items-center">
              <div className="p-5">
                <div className="authincation-content">
                  <div className="row no-gutters">
                    <div className="col-xl-12">
                      <div className="auth-form-1">
                        <div className="mb-4">
                          <h3 className="dz-title mb-1">Sign in</h3>
                          <p className="">
                            Sign in by entering information below
                          </p>
                        </div>
                        {props.errorMessage && (
                          <div className="bg-red-300 text-red-900 border border-red-900 p-1 my-2">
                            {props.errorMessage}
                          </div>
                        )}
                        {props.successMessage && (
                          <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                            {props.successMessage}
                          </div>
                        )}
                        <form onSubmit={onLogin}>
                          <div className="form-group">
                            <label className="mb-2 ">
                              <strong>Email</strong>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Type Your Email Address"
                            />
                            {errors.email && (
                              <div className="text-danger fs-12">
                                {errors.email}
                              </div>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="mb-2 ">
                              <strong>Password</strong>
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              value={password}
                              placeholder="Type Your Password"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                              <div className="text-danger fs-12">
                                {errors.password}
                              </div>
                            )}
                          </div>
                          <div className="form-row d-flex justify-content-between mt-4 mb-2">
                            <div className="form-group">
                              <div className="form-check custom-checkbox ml-1">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="basic_checkbox_1"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="basic_checkbox_1"
                                >
                                  Remember my preference
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block"
                            >
                              {loginLoading ? <>Loading...</> : <>Sign In</>}
                            </button>
                          </div>
                        </form>
                        <div className="new-account mt-2">
                          <p className="">
                            Don't have an account?{" "}
                            <Link className="text-primary" to="./page-register">
                              Sign up
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);
