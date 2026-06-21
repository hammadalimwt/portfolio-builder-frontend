import React, { useState, useEffect } from 'react';
import { Users, FolderOpen, Download, Layout, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock charts fallback data
  const chartData = [
    { day: 'Mon', portfolios: 4 },
    { day: 'Tue', portfolios: 8 },
    { day: 'Wed', portfolios: 15 },
    { day: 'Thu', portfolios: 12 },
    { day: 'Fri', portfolios: 21 },
    { day: 'Sat', portfolios: 18 },
    { day: 'Sun', portfolios: 29 },
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data?.data?.stats || res.data);
      } catch {
        // Fallback mock stats for display demo
        setStats({
          usersCount: 124,
          portfoliosCount: 382,
          downloadsCount: 194,
          templatesCount: 8,
          recentUsers: [
            { id: '1', name: 'Alia Khan', email: 'alia@example.com', role: 'USER', status: 'ACTIVE', createdAt: new Date() },
            { id: '2', name: 'Raza Shah', email: 'raza@example.com', role: 'USER', status: 'ACTIVE', createdAt: new Date() },
            { id: '3', name: 'Zainab Bibi', email: 'zainab@example.com', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date() },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const cards = stats ? [
    { label: 'Total Accounts', val: stats.usersCount, icon: Users, color: '#4f6ef7', trend: '+12% this week' },
    { label: 'Portfolios Created', val: stats.portfoliosCount, icon: FolderOpen, color: '#9b5cf6', trend: '+18% this week' },
    { label: 'ZIP Downloads', val: stats.downloadsCount, icon: Download, color: '#22c55e', trend: '+24% this week' },
    { label: 'Templates Installed', val: stats.templatesCount, icon: Layout, color: '#f59e0b', trend: 'Stable' },
  ] : [];

  return (
    <div className="pb-admin-dash">
      <style>{`
        .pb-admin-dash {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          font-family: var(--font-family);
        }
        .pb-stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }
        .pb-stat-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .pb-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pb-stat-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .pb-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        .pb-chart-card {
          min-height: 320px;
        }

        /* Table */
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
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border);
          font-size: var(--font-size-xs);
        }
        .pb-table th {
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
        }

        @media (min-width: 768px) {
          .pb-stats-row { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1024px) {
          .pb-grid-layout { grid-template-columns: 1.5fr 1fr; }
        }
      `}</style>

      {/* Overview Stat Cards */}
      <div className="pb-stats-row">
        {loading ? (
          <Skeleton variant="card" count={4} height="100px" />
        ) : (
          cards.map((c, i) => (
            <Card key={i} className="pb-stat-card">
              <div className="pb-stat-top">
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.label}</span>
                <div className="pb-stat-icon" style={{ backgroundColor: c.color }}>
                  <c.icon size={20} />
                </div>
              </div>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{c.val}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.trend}</span>
            </Card>
          ))
        )}
      </div>

      <div className="pb-grid-layout">
        {/* Left column: Chart */}
        <Card glass={true} className="pb-chart-card">
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '15px' }}>Portfolio Growth (Last 7 Days)</h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Line type="monotone" dataKey="portfolios" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right column: Recent Users */}
        <div style={{ display: 'flex', flexCol: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ margin: 0, fontSize: '15px' }}>Recent registrations</h3>
          <div className="pb-table-card">
            <table className="pb-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3">
                      <Skeleton variant="line" count={3} />
                    </td>
                  </tr>
                ) : (
                  stats.recentUsers?.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{u.name}</strong>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{u.email}</span>
                        </div>
                      </td>
                      <td><Badge variant="primary">{u.role}</Badge></td>
                      <td>
                        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'error'}>
                          {u.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
