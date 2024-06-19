import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface AuthFormProps {
  title: string;
  fields: Array<{
    id: string;
    label: string;
    name: string;
    type: string;
    autoComplete: string;
    required: boolean;
  }>;
  onSubmit: (data: FormData) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  user?: { name: string };
  showSuccessMessage?: boolean;
}

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          style: { color: '#000000' },
        },
        InputProps: {
          style: { color: '#000000', borderColor: '#1c1c1c' },
        },
        sx: { '& fieldset': { background: '#1c1c1c', color: '#ffffff' } },
      },
    },
    MuiButton: {
      defaultProps: {
        style: { backgroundColor: '#143d60', color: '#ffffff' },
      },
    },
    MuiLink: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiTypography: {
      defaultProps: {
        style: { color: '#000000' },
      },
    },
  },
  palette: {
    background: {
      default: '#1a1a1a',
    },
  },
});

const AuthForm: React.FC<AuthFormProps> = ({ title, fields, onSubmit, isLoggedIn, onLogout, user,showSuccessMessage  }) => {
  const linkText = title === 'Sign in' ? "Don't have an account? Sign Up" : 'Already have an account? Sign in';
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const formik = useFormik({
    initialValues: fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {} as Record<string, string>),
    
    validationSchema: yup.object().shape({
      ...fields.reduce((acc, field) => {
        let schema = yup.string();
        if (field.required) {
          const baseErrorMessage = `${field.label} is required`;
          switch (field.type) {
            case 'email':
              schema = yup.string().email('Enter a valid email address').required(baseErrorMessage);
              break;
            case 'password':
              schema = yup.string().min(6, 'Password must be at least 8 characters long').required(baseErrorMessage);
              break;
            default:
              schema = yup.string().required(baseErrorMessage);
          }
        }
        acc[field.name] = schema;
        return acc;
      }, {} as Record<string, yup.AnySchema>)
    }),
    onSubmit: (values) => {
      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'string') {
          data.append(key, value);
        }
      });
      data.append('recaptchaToken', recaptchaToken);
      onSubmit(data);
    },
  });

  const createTextField = (field:any) => (
    <TextField
      key={field.id}
      margin="normal"
      required={field.required}
      fullWidth
      id={field.id}
      label={field.label}
      name={field.name}
      type={field.type}
      autoComplete={field.autoComplete}
      InputLabelProps={{ style: { color: '#000000' } }}
      InputProps={{ style: { color: '#000000', borderColor: '#1c1c1c' } }}
      sx={{ '& fieldset': { color: '#000000', borderColor: '#1c1c1c' } }}
      error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
      helperText={formik.touched[field.name] && formik.errors[field.name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[field.name]}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',height:`calc(100vh - 68.5px)`, justifyContent:'center'}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            borderRadius: 8,
            backgroundColor: 'rgba(226, 114, 91, 0.50)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            color:'black'
          }}
        >
          {showSuccessMessage && (
            <Typography variant="body2" sx={{ color: '#4caf50', mt: 2 }}>
              Successfully registered! You can now log in.
            </Typography>
          )}
          {isLoggedIn && user && (
            <Typography variant="h6" component="div" sx={{ color: '#000000' }}>
              {user.name}
            </Typography>
          )}
          {!isLoggedIn && (
            <Avatar sx={{ m: 1, bgcolor: '#143d60' }}>
              <LockOutlinedIcon sx={{fill:'#000000'}}/>
            </Avatar>
          )}
          <Typography component="h1" variant="h5" style={{color:'#000000'}}>
            {title}
          </Typography>
          {isLoggedIn && (
            <Button variant="contained" fullWidth onClick={onLogout} sx={{ mt: 2, backgroundColor: '#ff5252' }}>
              Logout
            </Button>
          )}
          {!isLoggedIn && (
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
              {fields.filter((f) => f.name === 'firstName' ?? f.name === 'lastName').map((field) => (
                <>
                  <Grid item xs={12} sm={6}>
                {createTextField(fields.find((f) => f.name === 'firstName'))}
              </Grid>
              <Grid item xs={12} sm={6}>
                {createTextField(fields.find((f) => f.name === 'lastName'))}
              </Grid>
                </>
              ))}
              
              {fields.filter((f) => f.name !== 'firstName' && f.name !== 'lastName').map((field) => (
                <Grid item xs={12} key={field.id}>
                  {createTextField(field)}
                </Grid>
              ))}
            </Grid>
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <ReCAPTCHA
                  sitekey='6LfOXyspAAAAAE0cqulaG7mV2LYFWfZ2y5wWzQEy' // Replace with your site key
                  onChange={(value) => setRecaptchaToken(value ?? '')}
                />
              </div>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {title}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href={title === 'Sign in' ? '/signup' : '/login'} variant="body2" sx={{ color: '#000000' }}>
                    {linkText}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthForm;
