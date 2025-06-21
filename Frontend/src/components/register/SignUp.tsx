import styles from './Register.module.scss';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert } from '@mui/material';

import { TOKEN } from '../../config/Config';
import { RootState, AppDispatch } from '../../redux/Store';
import { AuthReducerState, SignUpRequestDTO } from '../../redux/auth/AuthModel';
import { currentUser, register } from '../../redux/auth/AuthAction';

const SignUp: React.FC = () => {
  const [form, setForm] = useState<SignUpRequestDTO>({ fullName: '', email: '', password: '' });
  const [alert, setAlert] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false,
    msg: '',
    sev: 'success',
  });

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN);
  const { reqUser, signup, error } = useSelector<RootState, AuthReducerState>((state) => state.auth);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (token && !reqUser) {
      dispatch(currentUser(token));
    }
  }, [token, reqUser, dispatch]);

  useEffect(() => {
    if (signup) {
      setAlert({ open: true, msg: 'Регистрация прошла успешно!', sev: 'success' });
      setTimeout(() => navigate('/'), 800);
    }
  }, [signup, navigate]);

  useEffect(() => {
    if (error) {
      setAlert({ open: true, msg: error, sev: 'error' });
    }
  }, [error]);

  const handleClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Валидация полей
    if (!form.fullName.trim()) {
      setAlert({ open: true, msg: 'Поле "Имя" не может быть пустым', sev: 'error' });
      return;
    }
    if (!form.email.trim()) {
      setAlert({ open: true, msg: 'Поле "Email" не может быть пустым', sev: 'error' });
      return;
    }
    if (!form.password.trim()) {
      setAlert({ open: true, msg: 'Поле "Пароль" не может быть пустым', sev: 'error' });
      return;
    }
    dispatch(register(form));
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
            <p className={styles.text}>Full Name</p>
            <TextField
              className={styles.textInput}
              label="Enter your full name"
              variant="outlined"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div>
            <p className={styles.text}>Email</p>
            <TextField
              className={styles.textInput}
              type="email"
              label="Enter your email"
              variant="outlined"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <p className={styles.text}>Password</p>
            <TextField
              className={styles.textInput}
              type="password"
              label="Enter your password"
              variant="outlined"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className={styles.button}>
            <Button fullWidth variant="contained" size="large" type="submit">
              Sign up
            </Button>
          </div>
        </form>
        <div className={styles.bottomContainer}>
          <p>Already signed up?</p>
          <Button variant="text" size="large" onClick={() => navigate('/signin')}>
            Login
          </Button>
        </div>
      </div>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alert.sev} variant="filled">
          {alert.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignUp;
