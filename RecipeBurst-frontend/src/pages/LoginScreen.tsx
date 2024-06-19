import { useDispatch } from 'react-redux';
import { login } from '../services/api';
import { loginSuccess } from '../redux/actions/authActions';
import AuthForm from '../components/Commmon/AuthForm';
import { useState } from 'react';
import { Snackbar } from '@mui/material';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const handleSignIn = async (data: FormData) => {
    try {
      const payload = Object.fromEntries(data.entries());
        const result = await login({
          ...payload,
          recaptchaToken: payload.recaptchaToken,
        });

      if (result.user && typeof result.user.firstName === 'string' && typeof result.user.lastName === 'string') {
        const initials = (result.user.firstName[0] ?? '') + (result.user.lastName[0] ?? '');
        dispatch(loginSuccess({
          name:`${result.user.firstName} ${result.user.lastName}`,
          initials:initials,
          userId:result.user.userId,
          firstName:result.user.firstName,
          lastName:result.user.lastName,
          emailId:result.user.emailId
        }));
      }
    } catch (error:any) {
      console.error(error);
      setError(error.message || 'Failed to sign in.');
    }
  };

  const signInFields = [
    { id: 'emailId', label: 'Email Address', name: 'emailId', type: 'email', autoComplete: 'email', required: true },
    { id: 'password', label: 'Password', name: 'password', type: 'password', autoComplete: 'current-password', required: true },
  ];

  return (
  <>
    <AuthForm title="Sign in" fields={signInFields} onSubmit={handleSignIn} isLoggedIn={false} onLogout={() => {}} />;
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={() => setError('')}
      message={error}
    />
  </>
  )
}
