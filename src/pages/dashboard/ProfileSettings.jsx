import React, { useState, useEffect } from 'react';
import { User, Lock, Settings, Camera, Check } from 'lucide-react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import ProgressBar from '../../components/ui/ProgressBar';
import { toast } from '../../components/ui/Toast';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('profile'); // profile | security | preferences
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile Form
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityErrors, setSecurityErrors] = useState({});

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Name is required.');
      return;
    }
    setProfileLoading(true);
    try {
      const res = await userAPI.updateProfile({ name, bio });
      updateUser(res.data?.data?.user);
      toast.success('Profile updated.');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarLoading(true);
      try {
        const res = await userAPI.uploadAvatar(file);
        updateUser(res.data.user);
        toast.success('Avatar updated.');
      } catch {
        toast.error('Avatar upload failed.');
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return { val: 0, label: 'None', color: 'var(--border)' };
    let score = 0;
    if (newPassword.length >= 6) score += 20;
    if (newPassword.length >= 10) score += 20;
    if (/[A-Z]/.test(newPassword)) score += 20;
    if (/[0-9]/.test(newPassword)) score += 20;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 20;

    if (score <= 40) return { val: score, label: 'Weak', color: 'var(--error)' };
    if (score <= 80) return { val: score, label: 'Medium', color: 'var(--warning)' };
    return { val: score, label: 'Strong', color: 'var(--success)' };
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setSecurityErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSecurityLoading(true);
    try {
      await userAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed.');
    } finally {
      setSecurityLoading(false);
    }
  };

  const pwStrength = getPasswordStrength();

  return (
    <div className="pb-settings-page">
      <style>{`
        .pb-settings-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          font-family: var(--font-family);
        }
        .pb-settings-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        .pb-settings-nav {
          display: flex;
          flex-direction: row;
          gap: var(--space-1);
          border-bottom: 1px solid var(--border);
          padding-bottom: 2px;
          flex-wrap: wrap;
        }
        .pb-settings-tab {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-6);
          color: var(--text-secondary);
          font-weight: var(--fw-semibold);
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .pb-settings-tab-active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        /* Avatar Box */
        .pb-avatar-uploader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }
        .pb-avatar-circle-box {
          position: relative;
          cursor: pointer;
        }
        .pb-avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(10,11,20,0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: var(--transition-fast);
        }
        .pb-avatar-circle-box:hover .pb-avatar-overlay {
          opacity: 1;
        }

        /* Themes Grid */
        .pb-themes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        .pb-theme-card {
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          cursor: pointer;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          transition: var(--transition-fast);
        }
        .pb-theme-card-active {
          border-color: var(--primary);
          background-color: var(--bg-secondary);
        }

        @media (max-width: 480px) {
          .pb-settings-tab {
            padding: var(--space-2) var(--space-3);
            font-size: var(--font-size-xs);
          }
          .pb-themes-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 768px) {
          .pb-settings-nav { flex-direction: row; }
        }
      `}</style>

      <div className="pb-settings-nav">
        <button
          className={`pb-settings-tab ${activeTab === 'profile' ? 'pb-settings-tab-active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Profile Info
        </button>
        <button
          className={`pb-settings-tab ${activeTab === 'security' ? 'pb-settings-tab-active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={16} /> Security
        </button>
        <button
          className={`pb-settings-tab ${activeTab === 'preferences' ? 'pb-settings-tab-active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Settings size={16} /> Preferences
        </button>
      </div>

      <div className="pb-settings-layout">
        {activeTab === 'profile' && (
          <Card glass={true}>
            <div className="pb-avatar-uploader">
              <div className="pb-avatar-circle-box" onClick={() => document.getElementById('avatar-input').click()}>
                <Avatar src={user?.avatar} name={user?.name} size="xl" />
                <div className="pb-avatar-overlay">
                  <Camera size={20} />
                </div>
              </div>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {avatarLoading ? 'Uploading avatar...' : 'Click circle to update avatar'}
              </span>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <Input
                id="settings-name"
                label="Full Name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-6)' }}>
                <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Introduce yourself..."
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    height: '100px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>
              <Button type="submit" variant="primary" loading={profileLoading}>
                Save Changes
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card glass={true}>
            <form onSubmit={handleSecuritySubmit}>
              <Input
                id="current-password"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={securityErrors.currentPassword}
                fullWidth
              />
              <Input
                id="new-password"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={securityErrors.newPassword}
                fullWidth
              />

              {newPassword && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <ProgressBar value={pwStrength.val} color={pwStrength.color} label={`Strength: ${pwStrength.label}`} showValue />
                </div>
              )}

              <Input
                id="confirm-password"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={securityErrors.confirmPassword}
                fullWidth
              />
              <Button type="submit" variant="primary" loading={securityLoading}>
                Change Password
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'preferences' && (
          <Card glass={true} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ margin: '0 0 var(--space-4) 0' }}>Theme Preference</h3>
              <div className="pb-themes-grid">
                <div
                  className={`pb-theme-card ${theme === 'dark' ? 'pb-theme-card-active' : ''}`}
                  onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-primary)' }} />
                  <strong>Dark Mode (Default)</strong>
                </div>
                <div
                  className={`pb-theme-card ${theme === 'light' ? 'pb-theme-card-active' : ''}`}
                  onClick={() => { if (theme !== 'light') toggleTheme(); }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f8f9ff', border: '1px solid #ddd' }} />
                  <strong>Light Mode</strong>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
