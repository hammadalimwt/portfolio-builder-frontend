import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Grid,
  List as ListIcon,
  Eye,
  Edit,
  Copy,
  Download,
  Trash2,
  FileCode,
} from 'lucide-react';
import { portfolioAPI, downloadAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

export default function MyPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('updatedAt'); // updatedAt | title

  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const loadPortfolios = async () => {
    try {
      const res = await portfolioAPI.getAll();
      setPortfolios(res.data?.data?.items || []);
    } catch {
      toast.error('Failed to load portfolios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await portfolioAPI.delete(deleteId);
      toast.success('Portfolio deleted.');
      setPortfolios(prev => prev.filter(p => p.id !== deleteId));
    } catch {
      toast.error('Delete failed.');
    } finally {
      setDeleteId(null);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await portfolioAPI.duplicate(id);
      toast.success('Portfolio duplicated.');
      setPortfolios(prev => [res.data.data.portfolio, ...prev]);
    } catch {
      toast.error('Duplicate failed.');
    }
  };

  const handleDownload = async (portfolio) => {
    try {
      toast.info('Generating ZIP archive...');
      await downloadAPI.generate(portfolio.id);
      
      const dlRes = await downloadAPI.download(portfolio.id);
      const blob = new Blob([dlRes.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${portfolio.title.replace(/\s+/g, '_')}_portfolio.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('ZIP download complete!');
      loadPortfolios(); // refresh status
    } catch (err) {
      toast.error('ZIP generation failed.');
    }
  };

  const filteredPortfolios = portfolios
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => statusFilter === 'ALL' || p.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      case 'DOWNLOADED': return <Badge variant="primary">Downloaded</Badge>;
      default: return <Badge variant="warning">Draft</Badge>;
    }
  };

  return (
    <div className="pb-my-portfolios">
      <style>{`
        .pb-my-portfolios {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          font-family: var(--font-family);
        }
        .pb-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pb-controls-bar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          justify-content: space-between;
          align-items: center;
        }
        .pb-filter-controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          align-items: center;
          flex-grow: 1;
        }
        
        .pb-search-box {
          position: relative;
          max-width: 280px;
          width: 100%;
        }
        .pb-search-box input {
          width: 100%;
          padding: var(--space-2) var(--space-4) var(--space-2) var(--space-10);
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          outline: none;
        }
        .pb-search-box input:focus { border-color: var(--primary); }
        .pb-search-box-icon { position: absolute; left: 12px; top: 10px; color: var(--text-muted); }

        .pb-select-control {
          padding: var(--space-2) var(--space-4);
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
        }

        .pb-view-toggle {
          display: flex;
          background: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 2px;
        }
        .pb-toggle-btn {
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }
        .pb-toggle-btn-active {
          background-color: var(--bg-card);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        /* Portfolio Grid */
        .pb-grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        .pb-portfolio-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .pb-p-card-thumb {
          height: 160px;
          background: var(--gradient-card);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          border-radius: var(--radius-md);
          position: relative;
          margin-bottom: var(--space-4);
        }
        .pb-p-card-actions {
          display: flex;
          gap: var(--space-2);
          margin-top: auto;
          border-top: 1px solid var(--border);
          padding-top: var(--space-4);
        }

        /* List view table */
        .pb-table-container {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow-x: auto;
        }
        .pb-list-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .pb-list-table th, .pb-list-table td {
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--border);
          font-size: var(--font-size-sm);
        }
        .pb-list-table th {
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          font-weight: var(--fw-semibold);
        }
        .pb-list-table tr:hover td {
          background-color: var(--bg-card-hover);
        }

        @media (min-width: 768px) {
          .pb-grid-container { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .pb-grid-container { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="pb-header-row">
        <h2 style={{ margin: 0 }}>My Portfolios</h2>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/dashboard/create')}>
          New Portfolio
        </Button>
      </div>

      <div className="pb-controls-bar">
        <div className="pb-filter-controls">
          <div className="pb-search-box">
            <Search size={16} className="pb-search-box-icon" />
            <input
              type="text"
              placeholder="Search portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="pb-select-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="COMPLETED">Completed</option>
            <option value="DOWNLOADED">Downloaded</option>
          </select>

          <select
            className="pb-select-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="updatedAt">Sort by: Last Updated</option>
            <option value="title">Sort by: Title</option>
          </select>
        </div>

        <div className="pb-view-toggle">
          <button
            className={`pb-toggle-btn ${viewMode === 'grid' ? 'pb-toggle-btn-active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            className={`pb-toggle-btn ${viewMode === 'list' ? 'pb-toggle-btn-active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
          <Skeleton variant="card" count={3} />
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No portfolios found"
          description="Try adapting filters or write a new portfolio wizard page."
          actionLabel="Create Portfolio"
          onAction={() => navigate('/dashboard/create')}
        />
      ) : viewMode === 'grid' ? (
        <div className="pb-grid-container">
          {filteredPortfolios.map((p) => (
            <Card key={p.id} hoverable className="pb-portfolio-card">
              <div className="pb-p-card-thumb">
                <FileCode size={40} />
                <div style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }}>
                  {getStatusBadge(p.status)}
                </div>
              </div>
              <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: '16px' }}>{p.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 var(--space-4) 0' }}>
                Type: {p.portfolioType} | Updated: {new Date(p.updatedAt).toLocaleDateString()}
              </p>
              <div className="pb-p-card-actions">
                <Button variant="secondary" size="sm" icon={Edit} onClick={() => navigate(`/dashboard/edit/${p.id}`)}>Edit</Button>
                <Button variant="secondary" size="sm" icon={Eye} onClick={() => navigate(`/dashboard/preview/${p.id}`)} />
                <Button variant="secondary" size="sm" icon={Copy} onClick={() => handleDuplicate(p.id)} />
                <Button variant="secondary" size="sm" icon={Download} onClick={() => handleDownload(p)} />
                <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleteId(p.id)} style={{ color: 'var(--error)', marginLeft: 'auto' }} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="pb-table-container">
          <table className="pb-list-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolios.map((p) => (
                <tr key={p.id}>
                  <td><strong style={{ fontSize: '14px' }}>{p.title}</strong></td>
                  <td>{p.portfolioType}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="secondary" size="sm" icon={Edit} onClick={() => navigate(`/dashboard/edit/${p.id}`)}>Edit</Button>
                      <Button variant="secondary" size="sm" icon={Eye} onClick={() => navigate(`/dashboard/preview/${p.id}`)} />
                      <Button variant="secondary" size="sm" icon={Download} onClick={() => handleDownload(p)} />
                      <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleteId(p.id)} style={{ color: 'var(--error)' }} />
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
        title="Delete Portfolio"
        message="Are you sure you want to permanently delete this portfolio? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
