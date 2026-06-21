import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deleteId, setDeleteId] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data?.data?.items || res.data || []);
    } catch {
      // Mock data fallback
      setUsers([
        { id: '1', name: 'Alia Khan', email: 'alia@example.com', role: 'USER', status: 'ACTIVE', createdAt: new Date() },
        { id: '2', name: 'Raza Shah', email: 'raza@example.com', role: 'USER', status: 'BLOCKED', createdAt: new Date() },
        { id: '3', name: 'Zainab Bibi', email: 'zainab@example.com', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusToggle = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await adminAPI.updateUser(user.id, { status: nextStatus });
      toast.success(`User set to ${nextStatus.toLowerCase()}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
    } catch {
      toast.error('Failed to change status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminAPI.deleteUser(deleteId);
      toast.success('User profile removed.');
      setUsers(prev => prev.filter(u => u.id !== deleteId));
    } catch {
      toast.error('Failed to delete user.');
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = users
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .filter(u => roleFilter === 'ALL' || u.role === roleFilter);

  return (
    <div className="pb-admin-users">
      <style>{`
        .pb-admin-users {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          font-family: var(--font-family);
        }
        .pb-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pb-controls {
          display: flex;
          gap: var(--space-4);
          align-items: center;
        }
        .pb-table-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow-x: auto;
        }
        .pb-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .pb-table th, .pb-table td {
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--border);
          font-size: var(--font-size-sm);
        }
        .pb-table th {
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
        }
        .pb-table tr:hover td {
          background-color: var(--bg-card-hover);
        }
      `}</style>

      <div className="pb-header">
        <h2 style={{ margin: 0 }}>Manage Accounts</h2>
      </div>

      <div className="pb-controls">
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-4) var(--space-2) var(--space-10)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {loading ? (
        <Skeleton variant="table-row" count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="No registered profiles match the search." />
      ) : (
        <div className="pb-table-card">
          <table className="pb-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><Badge variant={u.role === 'ADMIN' ? 'success' : 'primary'}>{u.role}</Badge></td>
                  <td>
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'error'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={u.status === 'ACTIVE' ? Ban : CheckCircle}
                        onClick={() => handleStatusToggle(u)}
                      >
                        {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteId(u.id)}
                        style={{ color: 'var(--error)' }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete User"
        message="Are you sure you want to permanently remove this user profile? All portfolios and archives belonging to them will be lost."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
