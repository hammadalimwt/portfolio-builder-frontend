import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Layers } from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Email is invalid';
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { user, tokens } = response.data.data;
      login(user, tokens.accessToken);
      toast.success('Successfully logged in!');
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
      setErrors({ form: msg });
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
        }
        .pb-auth-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          <span>PortfolioBuilder</span>
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', lineHeight: '1.2' }}>Powering the next gen of resume portfolios.</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>Join over 10,000 developers, creators, and freelancers who export and host production-ready resume files.</p>
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
          <h1 className="pb-auth-title">Welcome Back</h1>
          <p className="pb-auth-subtitle">Access your personal dashboard and portfolios</p>

          <form onSubmit={handleSubmit}>
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

            <div className="pb-auth-row">
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 'semibold' }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="pb-auth-social-divider">Or Sign In With</div>
          
          <Button variant="secondary" fullWidth icon={Github} onClick={() => toast.info('GitHub Login coming soon!')} disabled>
            GitHub
          </Button>

          <p style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              Create Account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
