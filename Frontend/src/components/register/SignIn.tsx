import { TOKEN } from "../../config/Config";
import { useDispatch, useSelector } from "react-redux";
import { AuthReducerState, LoginRequestDTO } from "../../redux/auth/AuthModel";
import { useNavigate } from "react-router-dom";
import React, { Dispatch, useEffect, useState, useRef } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
      const canvas = canvasRef.current;
      // Handle null canvas reference
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      // Handle missing context
      if (!ctx) return;
  
      // Add type annotations to function parameters
      const drawBlurredCircle = (x: number, y: number, radius: number) => {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, 'rgba(40, 167, 69, 0.8)');
          gradient.addColorStop(1, 'rgba(40, 167, 69, 0)');
          
          ctx.save(); // Save current context state
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.filter = 'blur(50px)';
          ctx.fill();
          ctx.restore(); // Restore original state (removes filter)
      };
  
      const renderCircles = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          // Set canvas dimensions (this automatically clears the canvas)
          canvas.width = width;
          canvas.height = height;
          
          // Draw new circles
          for (let i = 0; i < 5; i++) {
              const x = Math.random() * width;
              const y = Math.random() * height;
              const radius = 100 + Math.random() * 200;
              drawBlurredCircle(x, y, radius);
          }
      };
  
      const handleResize = () => {
          renderCircles();
      };
  
      // Initial render
      renderCircles();
  
      // Setup resize handler
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  return (
    <div className={styles.outerContainer}>
      <canvas 
        ref={canvasRef} 
        className="background-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
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
