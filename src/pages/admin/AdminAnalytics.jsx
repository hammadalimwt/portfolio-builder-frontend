import React from 'react';
import Card from '../../components/ui/Card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function AdminAnalytics() {
  const userGrowth = [
    { month: 'Jan', users: 20 },
    { month: 'Feb', users: 45 },
    { month: 'Mar', users: 80 },
    { month: 'Apr', users: 130 },
    { month: 'May', users: 210 },
    { month: 'Jun', users: 382 },
  ];

  const templatePopularity = [
    { name: 'Nebula', count: 184 },
    { name: 'Aurora', count: 132 },
    { name: 'Prism', count: 48 },
    { name: 'Solar', count: 28 },
  ];

  return (
    <div className="pb-admin-analytics">
      <style>{`
        .pb-admin-analytics {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          font-family: var(--font-family);
        }
        .pb-charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        @media (min-width: 1024px) {
          .pb-charts-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <h2 style={{ margin: 0 }}>System Analytics</h2>

      <div className="pb-charts-grid">
        {/* User Growth */}
        <Card glass={true}>
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '15px' }}>User Registration Trend</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Area type="monotone" dataKey="users" stroke="var(--primary)" fill="rgba(79, 110, 247, 0.2)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Template Downloads */}
        <Card glass={true}>
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '15px' }}>Template Popularity (Usage Count)</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={templatePopularity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
