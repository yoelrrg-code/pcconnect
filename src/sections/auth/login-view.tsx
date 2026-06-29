import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Checkbox, 
  IconButton, 
  InputAdornment, 
  Link,
  useTheme,
  alpha,
  FormHelperText
} from '@mui/material';
import { Eye, ArrowLeft } from 'lucide-react';
import Logo from '../../components/logo';
import loginBg from '../../assets/login-bg.jpg';
import { GREY } from '../../theme/palette';

// ----------------------------------------------------------------------

// Custom SVG icon representing a closed eye with eyelashes (sleeping eye)
const ClosedEyeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Eyelid curve */}
    <path d="M3 10C6 15 18 15 21 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    {/* Eyelashes */}
    <path d="M5 11.5L3.5 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M8 12.8L7 15.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M12 13.5V16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M16 12.8L17 15.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M19 11.5L20.5 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const RecaptchaLogo = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v-3l4 4-4 4v-3c-3.31 0-6-2.69-6-6z" fill="#4A90E2" />
  </svg>
);

interface LoginViewProps {
  onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const theme = useTheme();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('demo@pcconnect.com');
  const [password, setPassword] = useState('password123');
  const [hipaaChecked, setHipaaChecked] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }
      if (!hipaaChecked) {
        setError('You must acknowledge and accept the HIPAA disclaimer.');
        return;
      }
      setError('');
      onLogin();
    } else if (view === 'forgot') {
      if (!registerEmail) {
        setError('Please enter your email address.');
        return;
      }
      if (!recaptchaChecked) {
        setError('Please check the reCAPTCHA box.');
        return;
      }
      setError('');
      alert('Password reset link sent successfully!');
      setView('login');
    } else {
      if (!registerEmail) {
        setError('Please enter your email address.');
        return;
      }
      if (!recaptchaChecked) {
        setError('Please check the reCAPTCHA box.');
        return;
      }
      setError('');
      alert('Registration request sent successfully!');
      setView('login');
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100%',
        bgcolor: 'background.default'
      }}
    >
      {/* LEFT PANEL: Login Form */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: '50%' }, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          px: { xs: 4, sm: 8, md: 5, lg: 12, xl: 25 },
          py: 6,
          bgcolor: 'background.paper',
          zIndex: 1
        }}
      >
        <Box sx={{ mb: 9.8 }}>
          <Logo disabledLink height={43} />
        </Box>

        {view === 'login' && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography 
                sx={{ 
                  fontWeight: 400, 
                  fontSize: '32px',
                  mb: 1.5
                }}
              >
                Welcome to PC connect
              </Typography>
              <Typography 
                sx={{ 
                  fontWeight: 600,
                  fontSize: 20,
                  mb: 2
                }}
              >
                Sign in to your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3.5}>
                {/* Email Address Input */}
                <TextField
                  fullWidth
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                      sx: {
                        color: GREY[700],
                        fontWeight: 600,
                        lineHeight: 2,
                        fontSize: '12px',
                        bgcolor: 'background.paper',
                        px: 0.5,
                        transform: 'translate(14px, -11px) scale(0.75)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        }
                      }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: '#FFFFFF',
                      height: 48,
                      '& fieldset': {
                        borderColor: GREY[500],
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(GREY[500], 0.35),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '1.5px',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: '#2B3445',
                      fontWeight: 500,
                    }
                  }}
                />

                {/* Password Input */}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ characters"
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                      sx: {
                        color: GREY[700],
                        fontWeight: 600,
                        lineHeight: 2,
                        fontSize: '12px',
                        bgcolor: 'background.paper',
                        px: 0.5,
                        transform: 'translate(14px, -11px) scale(0.75)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        }
                      }
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ }}>
                            {showPassword ? <Eye size={20} /> : <ClosedEyeIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: '#FFFFFF',
                      height: 48,
                      '& fieldset': {
                        borderColor: GREY[500],
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(GREY[500], 0.35),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '1.5px',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: '#2B3445',
                      fontWeight: 500,
                      '&::placeholder': {
                        color: alpha('#2B3445', 0.4),
                        opacity: 1
                      }
                    }
                  }}
                />

                {/* Links Area */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3.5, mt: -0.5 }}>
                  <Link 
                    component="button"
                    type="button"
                    onClick={() => { setView('register'); setError(''); }}
                    variant="body2" 
                    sx={{ 
                      fontWeight: 400, 
                      textDecoration: 'none',
                      fontSize: '12px',
                      color: GREY[700],
                      '&:hover': { textDecoration: 'underline', color: 'primary.main' }
                    }}
                  >
                    Register account
                  </Link>
                  <Link 
                    component="button"
                    type="button"
                    onClick={() => { setView('forgot'); setError(''); }}
                    variant="body2" 
                    sx={{ 
                      fontWeight: 400, 
                      textDecoration: 'none',
                      fontSize: '12px',
                      color: GREY[700],
                      '&:hover': { textDecoration: 'underline', color: 'primary.main' }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                {/* HIPAA Disclaimer Panel */}
                <Box 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: 1.5, 
                    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                    bgcolor: alpha(theme.palette.grey[500], 0.02),
                    mt: 1
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary', 
                      fontSize: '12px',
                      fontWeight: 400, 
                      lineHeight: '18px',
                      textAlign: 'justify'
                    }}
                  >
                    This site contains private health information (PHI) which is protected by HIPAA. Please do not distribute any content contained herein via electronic means. Printed materials from this site must be properly destroyed when no longer needed. Please acknowledge by clicking the box below.
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px' }}>
                      Check this box:
                    </Typography>
                    <Checkbox
                      checked={hipaaChecked}
                      onChange={(e) => setHipaaChecked(e.target.checked)}
                      sx={{ 
                        p: 0,
                        color: alpha(GREY[500], 1),
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 22,
                        }
                      }}
                    />
                  </Box>
                </Box>

                {error && (
                  <FormHelperText error sx={{ fontWeight: 600, textAlign: 'center', mt: 1 }}>
                    {error}
                  </FormHelperText>
                )}

                {/* Sign In Pill Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    height: '48px',
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: 24, // Fully pill-shaped matching mockup
                    mt: 2,
                    '&:hover': { bgcolor: theme.palette.primary.light }
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </>
        )}

        {view === 'register' && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography 
                sx={{ 
                  fontWeight: 400, 
                  fontSize: '32px',
                  mb: 1.5
                }}
              >
                Register your account
              </Typography>
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  mb: 2
                }}
              >
                Please enter your email address to request a new account.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3.5}>
                {/* Email Input */}
                <TextField
                  fullWidth
                  label="Email address"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                      sx: {
                        color: GREY[700],
                        fontWeight: 600,
                        lineHeight: 2,
                        fontSize: '12px',
                        bgcolor: 'background.paper',
                        px: 0.5,
                        transform: 'translate(14px, -11px) scale(0.75)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        }
                      }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: '#FFFFFF',
                      height: 48,
                      '& fieldset': {
                        borderColor: GREY[500],
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(GREY[500], 0.35),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '1.5px',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: '#2B3445',
                      fontWeight: 500,
                      '&::placeholder': {
                        color: alpha('#2B3445', 0.4),
                        opacity: 1
                      }
                    }
                  }}
                />

                {/* reCAPTCHA Simulator */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '10px 12px 10px 16px',
                    borderRadius: '3px',
                    border: '1px solid #d3d3d3',
                    bgcolor: '#f9f9f9',
                    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.05)',
                    width: '302px',
                    height: '76px',
                    alignSelf: { xs: 'center', sm: 'flex-start' },
                    mt: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Checkbox
                      checked={recaptchaChecked}
                      onChange={(e) => setRecaptchaChecked(e.target.checked)}
                      sx={{ 
                        p: 0,
                        width: '28px',
                        height: '28px',
                        color: '#c1c1c1',
                        '&.Mui-checked': {
                          color: '#009a44',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 28,
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Roboto, helvetica, arial, sans-serif',
                        fontWeight: 400, 
                        fontSize: '14px',
                        color: '#000000'
                      }}
                    >
                      I'm not a robot
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <RecaptchaLogo />
                    <Typography 
                      sx={{ 
                        fontFamily: 'Roboto, helvetica, arial, sans-serif',
                        fontSize: '8px', 
                        color: '#555555',
                        fontWeight: 400,
                        mt: 0.3
                      }}
                    >
                      reCAPTCHA
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.2 }}>
                      <Link href="https://google.com/recaptcha" target="_blank" sx={{ fontSize: '8px', color: '#555555', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Privacy</Link>
                      <Typography sx={{ fontSize: '8px', color: '#555555' }}>-</Typography>
                      <Link href="https://google.com/recaptcha" target="_blank" sx={{ fontSize: '8px', color: '#555555', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Terms</Link>
                    </Box>
                  </Box>
                </Box>

                {error && (
                  <FormHelperText error sx={{ fontWeight: 600, textAlign: 'center', mt: 1 }}>
                    {error}
                  </FormHelperText>
                )}

                {/* Send Request Pill Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    height: '48px',
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: 24,
                    mt: 2,
                    '&:hover': { bgcolor: theme.palette.primary.light }
                  }}
                >
                  Send request
                </Button>

                {/* Return to Sign In */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Link 
                    component="button"
                    type="button"
                    onClick={() => { setView('login'); setError(''); }}
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500, 
                      textDecoration: 'none',
                      fontSize: '14px',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <ArrowLeft size={16} /> Return to sign in
                  </Link>
                </Box>
              </Stack>
            </form>
          </>
        )}

        {view === 'forgot' && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', mb: 4 }}>
              <Typography 
                sx={{ 
                  fontWeight: 400, 
                  fontSize: '32px',
                  mb: 1.5
                }}
              >
                Forgot your password?
              </Typography>
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                }}
              >
                Please enter the email address associated with your account and we'll email you a link to reset your password.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3.5}>
                {/* Email Input */}
                <TextField
                  fullWidth
                  label="Email address"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                      sx: {
                        color: GREY[700],
                        fontWeight: 600,
                        lineHeight: 2,
                        fontSize: '12px',
                        bgcolor: 'background.paper',
                        px: 0.5,
                        transform: 'translate(14px, -11px) scale(0.75)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        }
                      }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: '#FFFFFF',
                      height: 48,
                      '& fieldset': {
                        borderColor: GREY[500],
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(GREY[500], 0.35),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '1.5px',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: '#2B3445',
                      fontWeight: 500,
                      '&::placeholder': {
                        color: alpha('#2B3445', 0.4),
                        opacity: 1
                      }
                    }
                  }}
                />

                {/* reCAPTCHA Simulator */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: '10px 12px 10px 16px',
                    borderRadius: '3px',
                    border: '1px solid #d3d3d3',
                    bgcolor: '#f9f9f9',
                    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.05)',
                    width: '302px',
                    height: '76px',
                    mt: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Checkbox
                      checked={recaptchaChecked}
                      onChange={(e) => setRecaptchaChecked(e.target.checked)}
                      sx={{ 
                        p: 0,
                        width: '28px',
                        height: '28px',
                        color: '#c1c1c1',
                        '&.Mui-checked': {
                          color: '#009a44',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 28,
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Roboto, helvetica, arial, sans-serif',
                        fontWeight: 400, 
                        fontSize: '14px',
                        color: '#000000'
                      }}
                    >
                      I'm not a robot
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <RecaptchaLogo />
                    <Typography 
                      sx={{ 
                        fontFamily: 'Roboto, helvetica, arial, sans-serif',
                        fontSize: '8px', 
                        color: '#555555',
                        fontWeight: 400,
                        mt: 0.3
                      }}
                    >
                      reCAPTCHA
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.2 }}>
                      <Link href="https://google.com/recaptcha" target="_blank" sx={{ fontSize: '8px', color: '#555555', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Privacy</Link>
                      <Typography sx={{ fontSize: '8px', color: '#555555' }}>-</Typography>
                      <Link href="https://google.com/recaptcha" target="_blank" sx={{ fontSize: '8px', color: '#555555', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Terms</Link>
                    </Box>
                  </Box>
                </Box>

                {error && (
                  <FormHelperText error sx={{ fontWeight: 600, textAlign: 'center', mt: 1 }}>
                    {error}
                  </FormHelperText>
                )}

                {/* Send Request Pill Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    height: '48px',
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: 24,
                    mt: 2,
                    '&:hover': { bgcolor: theme.palette.primary.light }
                  }}
                >
                  Send request
                </Button>

                {/* Return to Sign In */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Link 
                    component="button"
                    type="button"
                    onClick={() => { setView('login'); setError(''); }}
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500, 
                      textDecoration: 'none',
                      fontSize: '14px',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <ArrowLeft size={16} /> Return to sign in
                  </Link>
                </Box>
              </Stack>
            </form>
          </>
        )}
      </Box>

      {/* RIGHT PANEL: Mockup Background Image */}
      <Box 
        sx={{ 
          display: { xs: 'none', md: 'flex' },
          width: '50%', 
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------
// Mini Stack helper component to replace Stack dependency in LoginView
interface StackProps {
  children: ReactNode;
  spacing?: number;
}

function Stack({ children, spacing = 2 }: StackProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {children}
    </Box>
  );
}
