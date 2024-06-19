import * as React from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../services/api';
import { signupSuccess } from '../redux/actions/authActions';
import AuthForm from '../components/Commmon/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Snackbar } from '@mui/material';

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (data: FormData) => {
    try {
      const payload = Object.fromEntries(data.entries());
        const result = await signup({
          ...payload,
          recaptchaToken: payload.recaptchaToken,
        });
      if (result.user && typeof result.user.firstName === 'string' && typeof result.user.lastName === 'string') {
        const initials = (result.user.firstName[0] ?? '') + (result.user.lastName[0] ?? '');
        setShowSuccessMessage(true);
        dispatch(signupSuccess({ name: `${result.user.firstName} ${result.user.lastName}`, initials }));

        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign up.');
    }
  };


  const signUpFields = [
    { id: 'firstName', label: 'First Name', name: 'firstName', type: 'text', autoComplete: 'given-name', required: true },
    { id: 'lastName', label: 'Last Name', name: 'lastName', type: 'text', autoComplete: 'family-name', required: true },
    { id: 'emailId', label: 'Email Address', name: 'emailId', type: 'email', autoComplete: 'email', required: true },
    { id: 'password', label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password', required: true },
  ];

  return (
    <>
      <AuthForm
        title="Sign up"
        fields={signUpFields}
        onSubmit={handleSignUp}
        isLoggedIn={false}
        onLogout={() => {}}
        showSuccessMessage={showSuccessMessage}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />
    </>
  );
}
