import { lazy, Suspense, useEffect } from "react";

/// Components
import Index from "./jsx";
import { connect, useDispatch, useSelector } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
// action
import { checkAutoLogin } from "./services/AuthService";
import { checkAutoLoginUser } from "./services/AuthService";
import { isAuthenticated } from "./store/selectors/AuthSelectors";
/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";
import { useHistory } from "react-router-dom";

const SignUp = lazy(() => import("./jsx/pages/Registration"));
const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));

const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./jsx/pages/Login")), 500);
  });
});

const AdminLogin = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./jsx/pages/AdminLogin")), 500);
  });
});

function App(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const loginSuccess = useSelector((state) => {
    // console.log(state, "Login State");
    return state.UserLogin.data;
  });

  const loginLoading = useSelector((state) => {
    // console.log(state, "Login State");
    return state.UserLogin.loading;
  });

  const loginError = useSelector((state) => {
    // console.log(state, "Login State");
    return state.UserLogin.error;
  });
  useEffect(() => {
    console.log("logout");
    console.log(window.location.pathname, "pathname");
    if (window.location.pathname == "/react/demo/admin") {
      history.push("admin");
    } else {
      checkAutoLogin(dispatch, props.history);

      checkAutoLoginUser(dispatch, props.history);
    }
  }, [dispatch, props.history]);

  useEffect(() => {
    if (loginSuccess) {
      // console.log(loginSuccess, "if useEffect login data");
      localStorage.setItem("userDetails", JSON.stringify(loginSuccess));
      // history.push("/home");
      history.push("/dashboard");

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
      // console.log(loginError, "else if useEffect login data");
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

  let routes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/page-register" component={SignUp} />
      <Route path="/page-forgot-password" component={ForgotPassword} />
    </Switch>
  );
  if (loginSuccess) {
    return (
      <>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <Index />
        </Suspense>
      </>
    );
  } else {
    return (
      <div className="vh-100">
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          {routes}
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: isAuthenticated(state),
  };
};

export default withRouter(connect(mapStateToProps)(App));
