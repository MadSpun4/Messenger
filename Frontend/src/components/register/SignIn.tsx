import { TOKEN } from "../../config/Config";
import { useDispatch, useSelector } from "react-redux";
import { AuthReducerState, LoginRequestDTO } from "../../redux/auth/AuthModel";
import { useNavigate } from "react-router-dom";
import React, { Dispatch, useEffect, useState } from "react";
import { currentUser, loginUser } from "../../redux/auth/AuthAction";
import { RootState } from "../../redux/Store";
import { Button, TextField, Snackbar, Alert } from "@mui/material";
import styles from "./Register.module.scss";

const SignIn = () => {
  const [signInData, setSignInData] = useState<LoginRequestDTO>({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const token: string | null = localStorage.getItem(TOKEN);
  const state: AuthReducerState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (state.error) {
      setSnackbar({ open: true, message: state.error, severity: "error" });
    }
  }, [state.error]);

  useEffect(() => {
    if (state.reqUser) {
      setSnackbar({ open: true, message: "Успешный вход!", severity: "success" });
      setTimeout(() => navigate("/"), 1000);
    }
  }, [state.reqUser, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(signInData));
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <form onSubmit={onSubmit}>
          <div>
            <p className={styles.text}>Email</p>
            <TextField
              className={styles.textInput}
              id="email"
              type="email"
              label="Enter your email"
              variant="outlined"
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
              value={signInData.email}
            />
          </div>
          <div>
            <p className={styles.text}>Password</p>
            <TextField
              className={styles.textInput}
              id="password"
              type="password"
              label="Enter your password"
              variant="outlined"
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              value={signInData.password}
            />
          </div>
          <div className={styles.button}>
            <Button fullWidth variant="contained" size="large" type="submit">
              Sign in
            </Button>
          </div>
        </form>
        <div className={styles.bottomContainer}>
          <p>Create new account</p>
          <Button variant="text" size="large" onClick={() => navigate("/signup")}>
            Signup
          </Button>
        </div>
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignIn;
