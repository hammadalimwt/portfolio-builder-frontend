import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Download,
  CheckCircle,
  FileText,
  Plus,
  ArrowRight,
  Eye,
  Trash2,
  Edit,
  History,
  Layout,
  Settings,
} from 'lucide-react';
import { portfolioAPI, downloadAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

export default function DashboardHome() {
  const [portfolios, setPortfolios] = useState([]);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const pRes = await portfolioAPI.getAll();
      setPortfolios(pRes.data?.data?.items || []);

      const dRes = await downloadAPI.getHistory();
      setDownloadsCount(dRes.data?.data?.items?.length || 0);
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await portfolioAPI.delete(deleteId);
      toast.success('Portfolio deleted.');
      setPortfolios((prev) => prev.filter((p) => p.id !== deleteId));
    } catch {
      toast.error('Delete failed.');
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      case 'DOWNLOADED': return <Badge variant="primary">Downloaded</Badge>;
      default: return <Badge variant="warning">Draft</Badge>;
    }
  };

  const stats = [
    { label: 'Total Portfolios', val: portfolios.length, icon: FolderOpen, color: '#4f6ef7', link: '/dashboard/portfolios' },
    { label: 'Total Downloads', val: downloadsCount, icon: Download, color: '#9b5cf6', link: '/dashboard/downloads' },
    { label: 'Completed', val: portfolios.filter(p => p.status === 'COMPLETED' || p.status === 'DOWNLOADED').length, icon: CheckCircle, color: '#22c55e', link: '/dashboard/portfolios' },
    { label: 'Drafts', val: portfolios.filter(p => p.status === 'DRAFT').length, icon: FileText, color: '#f59e0b', link: '/dashboard/portfolios' },
  ];

  return (
    <div className="pb-dash-home">
      <style>{`
        .pb-dash-home {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          font-family: var(--font-family);
        }
        .pb-stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }
        .pb-stat-box {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .pb-stat-icon-wrapper {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .pb-stat-details {
          display: flex;
          flex-direction: column;
        }
        .pb-stat-number {
          font-size: var(--font-size-xl);
          font-weight: var(--fw-bold);
        }
        .pb-stat-label {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }

        .pb-dash-portfolios-col {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        
        .pb-quick-actions-col {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        
        .pb-inspiration-col {
          display: flex;
          flex-direction: column;
        }
        
        /* Quick actions */
        .pb-quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        .pb-action-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
        }

        /* Portfolio list */
        .pb-portfolio-mini-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .pb-portfolio-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
        }
        .pb-portfolio-row:hover {
          border-color: var(--primary);
          background: var(--bg-card-hover);
        }
        .pb-portfolio-row-info {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .pb-portfolio-thumbnail {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          background: var(--gradient-card);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .pb-portfolio-meta {
          display: flex;
          flex-direction: column;
        }
        .pb-row-actions {
          display: flex;
          gap: var(--space-2);
        }

        @media (min-width: 1024px) {
          .pb-dash-home {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            grid-auto-flow: row;
            gap: var(--space-8);
          }
          .pb-stats-row {
            grid-template-columns: repeat(4, 1fr);
            grid-column: span 2;
          }
          .pb-dash-portfolios-col {
            grid-column: 1;
            grid-row: 2 / 4;
          }
          .pb-quick-actions-col {
            grid-column: 2;
            grid-row: 2;
          }
          .pb-inspiration-col {
            grid-column: 2;
            grid-row: 3;
          }
        }
        @media (max-width: 1023px) {
          .pb-quick-actions-col {
            order: 1;
          }
          .pb-stats-row {
            order: 2;
          }
          .pb-dash-portfolios-col {
            order: 3;
          }
          .pb-inspiration-col {
            order: 4;
          }
        }
        @media (max-width: 768px) {
          .pb-stats-row {
            gap: var(--space-3);
          }
          .pb-stats-row .pb-stat-box {
            padding: var(--space-3) !important;
            gap: var(--space-3);
          }
          .pb-stat-icon-wrapper {
            width: 40px;
            height: 40px;
          }
          .pb-stat-icon-wrapper svg {
            width: 20px !important;
            height: 20px !important;
          }
          .pb-stat-number {
            font-size: var(--font-size-lg);
            line-height: 1.2;
          }
          .pb-stat-label {
            font-size: 11px;
          }
        }
        @media (max-width: 480px) {
          .pb-portfolio-row {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-3);
          }
          .pb-row-actions {
            width: 100%;
            justify-content: flex-end;
          }
          .pb-quick-actions {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 380px) {
          .pb-stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Stats row */}
      <div className="pb-stats-row">
        {loading ? (
          <Skeleton variant="card" count={4} height="80px" />
        ) : (
          stats.map((s, idx) => (
            <Card
              key={idx}
              className="pb-stat-box"
              hoverable={true}
              onClick={() => navigate(s.link)}
            >
              <div className="pb-stat-icon-wrapper" style={{ backgroundColor: s.color }}>
                <s.icon size={22} />
              </div>
              <div className="pb-stat-details">
                <span className="pb-stat-number">{s.val}</span>
                <span className="pb-stat-label">{s.label}</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Left Side: Portfolios */}
      <div className="pb-dash-portfolios-col">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Recent Portfolios</h3>
          {portfolios.length > 0 && (
            <Link to="/dashboard/portfolios" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'semibold', display: 'flex', alignItems: 'center' }}>
              View All <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </Link>
          )}
        </div>

        {loading ? (
          <Skeleton variant="table-row" count={3} height="70px" />
        ) : portfolios.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No portfolios yet"
            description="Kickstart your professional page in just a few clicks."
            actionLabel="Create Portfolio"
            onAction={() => navigate('/dashboard/create')}
          />
        ) : (
          <div className="pb-portfolio-mini-list">
            {portfolios.slice(0, 4).map((p) => (
              <div key={p.id} className="pb-portfolio-row">
                <div className="pb-portfolio-row-info">
                  <div className="pb-portfolio-thumbnail">
                    <FileText size={20} />
                  </div>
                  <div className="pb-portfolio-meta">
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.title}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Type: {p.portfolioType} | Updated: {new Date(p.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="pb-row-actions">
                  {getStatusBadge(p.status)}
                  <button className="pb-icon-btn" onClick={() => navigate(`/dashboard/edit/${p.id}`)} title="Edit">
                    <Edit size={16} />
                  </button>
                  <button className="pb-icon-btn" onClick={() => navigate(`/dashboard/preview/${p.id}`)} title="Live Preview">
                    <Eye size={16} />
                  </button>
                  <button className="pb-icon-btn" onClick={() => setDeleteId(p.id)} title="Delete" style={{ color: 'var(--error)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Quick Actions */}
      <div className="pb-quick-actions-col">
        <h3 style={{ margin: 0, fontSize: '18px' }}>Quick Actions</h3>
        <div className="pb-quick-actions">
          <Card hoverable className="pb-action-card" onClick={() => navigate('/dashboard/create')}>
            <Plus size={20} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '12px', fontWeight: 'semibold' }}>Create Portfolio</span>
          </Card>
          <Card hoverable className="pb-action-card" onClick={() => navigate('/dashboard/downloads')}>
            <History size={20} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '12px', fontWeight: 'semibold' }}>Downloads</span>
          </Card>
          <Card hoverable className="pb-action-card" onClick={() => navigate('/dashboard/settings')}>
            <Settings size={20} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: '12px', fontWeight: 'semibold' }}>Settings</span>
          </Card>
        </div>
      </div>

      {/* Right Side: Help/Inspiration */}
      <div className="pb-inspiration-col">
        <Card glass={true} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layout size={18} style={{ color: 'var(--primary)' }} />
            Need Inspiration?
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
            Check out our design showcases and build responsive layout sets optimized for tech and creative roles.
          </p>
          <a href="/#templates" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>
            Browse templates &rarr;
          </a>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Portfolio"
        message="Are you sure you want to permanently delete this portfolio? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
