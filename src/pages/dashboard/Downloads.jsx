import React, { useState, useEffect } from 'react';
import { Download, History, Search, ArrowRight, ExternalLink, Trash2 } from 'lucide-react';
import { downloadAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { toast } from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadDownloads = async () => {
    try {
      const res = await downloadAPI.getHistory();
      setDownloads(res.data?.data?.items || []);
    } catch {
      toast.error('Failed to load download history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  const handleDownload = async (item) => {
    try {
      toast.info('Downloading file...');
      const res = await downloadAPI.download(item.portfolioId?._id || item.portfolioId);
      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Get name from portfolio context or default
      const name = item.portfolioId?.title || 'portfolio';
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}_v${item.version || 1}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download triggered!');
    } catch {
      toast.error('Download failed.');
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleteConfirmOpen(false);
    try {
      await downloadAPI.deleteHistory(itemToDelete._id);
      toast.success('Record deleted successfully!');
      loadDownloads();
    } catch (err) {
      toast.error('Failed to delete history record.');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const filtered = downloads.filter((d) => {
    const title = d.portfolioId?.title || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pb-downloads">
      <style>{`
        .pb-downloads {
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
        .pb-controls {
          display: flex;
          gap: var(--space-4);
          align-items: center;
          flex-wrap: wrap;
        }
        .pb-table-container {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow-x: auto;
        }
        .pb-downloads-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .pb-downloads-table th, .pb-downloads-table td {
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--border);
          font-size: var(--font-size-sm);
        }
        .pb-downloads-table th {
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          font-weight: var(--fw-semibold);
        }
        .pb-downloads-table tr:hover td {
          background-color: var(--bg-card-hover);
        }

        @media (max-width: 768px) {
          .pb-table-container {
            border: none;
            background: transparent;
          }
          .pb-downloads-table thead {
            display: none;
          }
          .pb-downloads-table, 
          .pb-downloads-table tbody, 
          .pb-downloads-table tr, 
          .pb-downloads-table td {
            display: block;
            width: 100%;
          }
          .pb-downloads-table tr {
            background-color: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: var(--space-4);
            margin-bottom: var(--space-4);
            box-shadow: var(--shadow-sm);
          }
          .pb-downloads-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-3) 0 !important;
            border-bottom: 1px dashed var(--border) !important;
            text-align: right;
            font-size: var(--font-size-xs);
          }
          .pb-downloads-table td:last-child {
            border-bottom: none !important;
            padding-top: var(--space-4) !important;
            justify-content: flex-end;
          }
          .pb-downloads-table td::before {
            content: attr(data-label);
            font-weight: var(--fw-bold);
            color: var(--text-secondary);
            text-align: left;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.05em;
          }
        }
      `}</style>

      <div className="pb-header-row">
        <h2 style={{ margin: 0 }}>Download History</h2>
      </div>

      <div className="pb-controls">
        <div className="pb-search-box" style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by portfolio title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
      </div>

      {loading ? (
        <Skeleton variant="table-row" count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No downloads found"
          description="Your download history is currently empty. Complete your portfolio draft and download a ZIP file to see logs here."
        />
      ) : (
        <div className="pb-table-container">
          <table className="pb-downloads-table">
            <thead>
              <tr>
                <th>Portfolio</th>
                <th>Template Used</th>
                <th>Version</th>
                <th>Status</th>
                <th>Downloaded Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id}>
                  <td data-label="Portfolio">
                    <strong>{item.portfolioId?.title || 'Unknown Portfolio'}</strong>
                  </td>
                  <td data-label="Template Used">{item.templateId?.name || 'Default Template'}</td>
                  <td data-label="Version">v{item.version || 1}</td>
                  <td data-label="Status">
                    <Badge variant={item.status === 'SUCCESS' ? 'success' : 'error'}>
                      {item.status || 'SUCCESS'}
                    </Badge>
                  </td>
                  <td data-label="Downloaded Date">{new Date(item.createdAt).toLocaleString()}</td>
                  <td data-label="Action" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Download}
                        onClick={() => handleDownload(item)}
                      >
                        Download ZIP
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteClick(item)}
                        aria-label="Delete History Record"
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
        isOpen={deleteConfirmOpen}
        title="Delete Download History"
        message={`Are you sure you want to delete the download history record for "${itemToDelete?.portfolioId?.title || 'Unknown Portfolio'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
}
