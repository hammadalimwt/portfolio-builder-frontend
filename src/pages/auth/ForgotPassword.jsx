import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle, ArrowLeft, Key, Layers } from 'lucide-react';
import { authAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState('REQUEST_CODE'); // 'REQUEST_CODE' | 'VERIFY_CODE' | 'RESET_PASSWORD' | 'SUCCESS'
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Cooldown timer for resending code
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const validateRequestCode = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email address is invalid';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateVerifyCode = () => {
    const tempErrors = {};
    if (!code) {
      tempErrors.code = 'Verification code is required';
    } else if (code.trim().length !== 6) {
      tempErrors.code = 'Verification code must be exactly 6 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateResetPassword = () => {
    const tempErrors = {};
    if (!newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      tempErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();
    if (!validateRequestCode()) return;
    setLoading(true);
    setErrors({});

    try {
      await authAPI.forgotPassword(email);
      setStep('VERIFY_CODE');
      toast.success('Verification code sent successfully.');
      setCooldown(30); // 30 seconds cooldown
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send verification code. Please try again.';
      toast.error(msg);
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await authAPI.forgotPassword(email);
      toast.success('A new verification code has been generated.');
      setCooldown(60); // 60 seconds cooldown for subsequent resends
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!validateVerifyCode()) return;
    setLoading(true);
    setErrors({});

    try {
      await authAPI.verifyResetCode(email, code.trim());
      setStep('RESET_PASSWORD');
      toast.success('Verification code verified. Please set your new password.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired verification code.';
      toast.error(msg);
      setErrors({ code: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateResetPassword()) return;
    setLoading(true);
    setErrors({});

    try {
      await authAPI.resetPassword({
        email,
        token: code.trim().toUpperCase(),
        newPassword
      });
      setStep('SUCCESS');
      toast.success('Your password has been reset successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(msg);
      setErrors({ newPassword: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-auth-page">
      <style>{`
        .pb-auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          font-family: var(--font-family);
          background-color: var(--bg-primary);
        }
        .pb-auth-sidebar {
          display: none;
          background: var(--gradient-hero);
          color: white;
          padding: var(--space-12);
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .pb-auth-form-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8) var(--space-6);
        }
        .pb-auth-card {
          width: 100%;
          max-width: 440px;
        }
        .pb-auth-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--fw-bold);
          font-size: var(--font-size-xl);
          margin-bottom: var(--space-6);
          justify-content: center;
        }
        .pb-auth-title {
          font-size: var(--font-size-2xl);
          font-weight: var(--fw-bold);
          text-align: center;
          margin-bottom: var(--space-1);
        }
        .pb-auth-subtitle {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: var(--space-8);
          line-height: 1.5;
        }

        /* Stepper styles */
        .pb-forgot-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          margin-bottom: var(--space-8);
        }
        .pb-forgot-step {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xs);
          font-weight: var(--fw-bold);
          border: 2px solid var(--border);
          color: var(--text-muted);
          transition: var(--transition-base);
        }
        .pb-forgot-step-active {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-50);
          box-shadow: 0 0 10px rgba(79,110,247,0.2);
        }
        .pb-forgot-step-completed {
          border-color: var(--success);
          color: white;
          background-color: var(--success);
        }
        .pb-forgot-step-line {
          flex: 0 0 40px;
          height: 2px;
          background-color: var(--border);
          transition: var(--transition-base);
        }
        .pb-forgot-step-line-active {
          background-color: var(--primary);
        }
        
        /* Debug Banner styles */
        .pb-debug-banner {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          background-color: rgba(79, 110, 247, 0.08);
          border: 1px dashed var(--primary-300);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-6);
          font-size: var(--font-size-xs);
          color: var(--text-primary);
          text-align: left;
          line-height: 1.4;
        }
        .pb-debug-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary);
          box-shadow: 0 0 0 0 rgba(79, 110, 247, 0.7);
          animation: pulse 1.6s infinite;
          flex-shrink: 0;
          margin-top: 4px;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(79, 110, 247, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(79, 110, 247, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(79, 110, 247, 0);
          }
        }

        /* Success view style */
        .pb-success-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-4) 0;
        }
        .pb-success-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background-color: var(--success-bg);
          color: var(--success);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-6);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);
        }

        /* Back button link */
        .pb-back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          transition: var(--transition-base);
          text-decoration: none;
          margin-top: var(--space-6);
        }
        .pb-back-link:hover {
          color: var(--text-primary);
          transform: translateX(-2px);
        }

        /* Resend text styles */
        .pb-resend-text {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
          margin-top: var(--space-4);
          text-align: center;
        }
        .pb-resend-button {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: var(--fw-semibold);
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          text-decoration: underline;
        }
        .pb-resend-button:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
          text-decoration: none;
        }

        @media (min-width: 1024px) {
          .pb-auth-page {
            grid-template-columns: 1fr 1fr;
          }
          .pb-auth-sidebar {
            display: flex;
          }
        }
      `}</style>

      {/* Left side info block */}
      <div className="pb-auth-sidebar">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>
          <Layers style={{ color: 'var(--primary)' }} />
          <span>PortfolioBuilder</span>
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', lineHeight: '1.2', color: 'white' }}>Recover Your Account Easily.</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.6' }}>Regain access to your personal dashboards, templates, and resume portfolios with our secure password recovery system.</p>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          &copy; {new Date().getFullYear()} PortfolioBuilder SaaS MVP.
        </div>
      </div>

      {/* Right side form */}
      <div className="pb-auth-form-container">
        <Card className="pb-auth-card" glass={true}>
          <div className="pb-auth-logo">
            <Layers style={{ color: 'var(--primary)' }} />
            <span className="gradient-text">PortfolioBuilder</span>
          </div>

          {/* Stepper */}
          <div className="pb-forgot-stepper">
            <div className={`pb-forgot-step ${step === 'REQUEST_CODE' ? 'pb-forgot-step-active' : 'pb-forgot-step-completed'}`}>1</div>
            <div className={`pb-forgot-step-line ${step !== 'REQUEST_CODE' ? 'pb-forgot-step-line-active' : ''}`}></div>
            <div className={`pb-forgot-step ${step === 'VERIFY_CODE' ? 'pb-forgot-step-active' : (step === 'RESET_PASSWORD' || step === 'SUCCESS') ? 'pb-forgot-step-completed' : ''}`}>2</div>
            <div className={`pb-forgot-step-line ${(step === 'RESET_PASSWORD' || step === 'SUCCESS') ? 'pb-forgot-step-line-active' : ''}`}></div>
            <div className={`pb-forgot-step ${step === 'RESET_PASSWORD' ? 'pb-forgot-step-active' : step === 'SUCCESS' ? 'pb-forgot-step-completed' : ''}`}>3</div>
          </div>

          {step === 'REQUEST_CODE' && (
            <>
              <h1 className="pb-auth-title" style={{ fontSize: '24px', margin: '0 0 var(--space-1) 0' }}>Forgot Password</h1>
              <p className="pb-auth-subtitle">Enter your email and we'll generate a verification code to reset your password.</p>

              <form onSubmit={handleRequestCode}>
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  fullWidth
                  required
                />
                
                <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: 'var(--space-2)' }}>
                  Send Verification Code
                </Button>
              </form>
            </>
          )}

          {step === 'VERIFY_CODE' && (
            <>
              <h1 className="pb-auth-title" style={{ fontSize: '24px', margin: '0 0 var(--space-1) 0' }}>Verify OTP</h1>
              <p className="pb-auth-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
                We've sent a 6-digit code to <strong>{email}</strong>.
              </p>
              <form onSubmit={handleVerifyCode}>
                <Input
                  id="code"
                  label="6-Digit Verification Code"
                  type="text"
                  placeholder="e.g. A1B2C3"
                  icon={Key}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  error={errors.code}
                  maxLength={6}
                  fullWidth
                  required
                  style={{ textTransform: 'uppercase' }}
                />

                <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: 'var(--space-2)' }}>
                  Verify Code
                </Button>
              </form>

              <p className="pb-resend-text">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  className="pb-resend-button"
                  onClick={handleResendCode}
                  disabled={cooldown > 0 || resending}
                >
                  {resending ? 'Resending...' : cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
                </button>
              </p>
            </>
          )}

          {step === 'RESET_PASSWORD' && (
            <>
              <h1 className="pb-auth-title" style={{ fontSize: '24px', margin: '0 0 var(--space-1) 0' }}>New Password</h1>
              <p className="pb-auth-subtitle">Create a secure new password for your account.</p>

              <form onSubmit={handleResetPassword}>
                <Input
                  id="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                  fullWidth
                  required
                />

                <Input
                  id="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  fullWidth
                  required
                />

                <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: 'var(--space-2)' }}>
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {step === 'SUCCESS' && (
            <div className="pb-success-container">
              <div className="pb-success-icon-circle">
                <CheckCircle size={32} />
              </div>
              <h1 className="pb-auth-title" style={{ fontSize: '24px', margin: '0 0 var(--space-1) 0' }}>Success!</h1>
              <p className="pb-auth-subtitle" style={{ marginBottom: 'var(--space-6)' }}>
                Your password has been successfully reset. You can now use your new password to sign in.
              </p>
              
              <Button onClick={() => navigate('/login')} variant="primary" fullWidth>
                Back to Sign In
              </Button>
            </div>
          )}

          {step !== 'SUCCESS' && (
            <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
              <Link to="/login" className="pb-back-link" style={{ marginTop: 0 }}>
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
