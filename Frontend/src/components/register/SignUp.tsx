import styles from './Register.module.scss';
import React, { useEffect, useState } from 'react';
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

  return (
    <div className={styles.outerContainer}>
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
