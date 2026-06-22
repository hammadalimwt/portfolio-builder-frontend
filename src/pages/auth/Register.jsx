import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Layers } from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import { toast } from '../../components/ui/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { val: 0, label: 'None', color: 'var(--border)' };
    let score = 0;
    if (password.length >= 6) score += 20;
    if (password.length >= 10) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;

    if (score <= 40) return { val: score, label: 'Weak', color: 'var(--error)' };
    if (score <= 80) return { val: score, label: 'Medium', color: 'var(--warning)' };
    return { val: score, label: 'Strong', color: 'var(--success)' };
  };

  const validate = () => {
    const tempErrors = {};
    if (!name) tempErrors.name = 'Full name is required';
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Email is invalid';
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) tempErrors.agreeTerms = 'You must agree to the terms';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await authAPI.register({ name, email, password });
      
      // Auto login right after registration
      const loginRes = await authAPI.login({ email, password });
      const { user, tokens } = loginRes.data.data;
      login(user, tokens.accessToken);
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength();

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
          margin-bottom: var(--space-4);
          justify-content: center;
        }
        .pb-auth-title {
          font-size: var(--font-size-2xl);
          font-weight: var(--fw-bold);
          text-align: center;
          margin-bottom: 1px;
        }
        .pb-auth-subtitle {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: var(--space-6);
        }
        .pb-auth-row {
          display: flex;
          align-items: center;
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }
        .pb-auth-social-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--text-muted);
          font-size: var(--font-size-xs);
          margin: var(--space-6) 0;
        }
        .pb-auth-social-divider::before,
        .pb-auth-social-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border);
        }
        .pb-auth-social-divider:not(:empty)::before { margin-right: .5em; }
        .pb-auth-social-divider:not(:empty)::after { margin-left: .5em; }

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'bold' }}>
          <Layers style={{ color: 'var(--primary)' }} />
          <span>PortfolioMaker</span>
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', lineHeight: '1.2' }}>Powering the next gen of resume portfolios.</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>Join over 10,000 developers, creators, and freelancers who export and host production-ready resume files.</p>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          &copy; {new Date().getFullYear()} PortfolioMaker SaaS MVP.
        </div>
      </div>

      {/* Right side form */}
      <div className="pb-auth-form-container">
        <Card className="pb-auth-card" glass={true}>
          <div className="pb-auth-logo">
            <Layers style={{ color: 'var(--primary)' }} />
            <span className="gradient-text">PortfolioMaker</span>
          </div>
          <h1 className="pb-auth-title">Create Account</h1>
          <p className="pb-auth-subtitle">Build your premium portfolio in minutes</p>

          <form onSubmit={handleSubmit}>
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="Full Name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              fullWidth
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="email@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              fullWidth
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              fullWidth
            />

            {password && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <ProgressBar value={pwStrength.val} color={pwStrength.color} label={`Strength: ${pwStrength.label}`} showValue />
              </div>
            )}

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              fullWidth
            />

            <div className="pb-auth-row">
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                I agree to the Terms of Service
              </label>
            </div>
            {errors.agreeTerms && <span style={{ color: 'var(--error)', fontSize: '11px', display: 'block', marginTop: '-12px', marginBottom: '12px' }}>{errors.agreeTerms}</span>}

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <p style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
