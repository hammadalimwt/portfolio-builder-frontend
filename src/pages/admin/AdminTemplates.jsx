import React, { useState, useEffect } from 'react';
import { Layout, Plus, Edit, Trash2, CheckCircle, Ban } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Developer');
  const [description, setDescription] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadTemplates = async () => {
    try {
      const res = await adminAPI.getTemplates();
      setTemplates(res.data?.data?.items || res.data || []);
    } catch {
      // Mock data fallback
      setTemplates([
        { id: '1', name: 'Nebula', category: 'Developer', description: 'Indigo developer workspace style.', status: 'ACTIVE' },
        { id: '2', name: 'Aurora', category: 'Designer', description: 'Purple glassmorphism aesthetic.', status: 'ACTIVE' },
        { id: '3', name: 'Prism', category: 'Student', description: 'Clean emerald geometric theme.', status: 'ACTIVE' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setName('');
    setCategory('Developer');
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditId(t.id);
    setName(t.name);
    setCategory(t.category);
    setDescription(t.description);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error('All fields are required.');
      return;
    }
    setSubmitLoading(true);
    try {
      if (editId) {
        await adminAPI.updateTemplate(editId, { name, category, description });
        toast.success('Template updated.');
        setTemplates(prev => prev.map(t => t.id === editId ? { ...t, name, category, description } : t));
      } else {
        const res = await adminAPI.createTemplate({ name, category, description });
        toast.success('Template created.');
        setTemplates(prev => [...prev, res.data?.data?.template || res.data || { id: Date.now().toString(), name, category, description, status: 'ACTIVE' }]);
      }
      setModalOpen(false);
    } catch {
      toast.error('Save failed.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminAPI.updateTemplate(item.id, { status: nextStatus });
      toast.success(`Template set to ${nextStatus.toLowerCase()}`);
      setTemplates(prev => prev.map(t => t.id === item.id ? { ...t, status: nextStatus } : t));
    } catch {
      toast.error('Failed to change status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await adminAPI.deleteTemplate(id);
      toast.success('Template removed.');
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch {
      toast.error('Delete failed.');
    }
  };

  return (
    <div className="pb-admin-templates">
      <style>{`
        .pb-admin-templates {
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
        .pb-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        .pb-t-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .pb-t-thumb {
          height: 120px;
          background: var(--gradient-card);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin-bottom: var(--space-4);
          position: relative;
        }
        .pb-t-actions {
          display: flex;
          gap: var(--space-2);
          margin-top: auto;
          border-top: 1px solid var(--border);
          padding-top: var(--space-4);
        }

        @media (max-width: 480px) {
          .pb-header {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-3);
          }
          .pb-header button {
            width: 100%;
          }
        }

        @media (min-width: 768px) {
          .pb-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="pb-header">
        <h2 style={{ margin: 0 }}>Portfolio Templates</h2>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Add Template
        </Button>
      </div>

      {loading ? (
        <Skeleton variant="card" count={3} />
      ) : templates.length === 0 ? (
        <EmptyState icon={Layout} title="No templates installed" description="Add template configurations to start." />
      ) : (
        <div className="pb-grid">
          {templates.map(t => (
            <Card key={t.id} hoverable className="pb-t-card">
              <div className="pb-t-thumb">
                <Layout size={36} />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <Badge variant={t.status === 'ACTIVE' ? 'success' : 'error'}>
                    {t.status || 'ACTIVE'}
                  </Badge>
                </div>
              </div>
              <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: '16px' }}>{t.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Category: {t.category}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>{t.description}</p>
              
              <div className="pb-t-actions">
                <Button variant="secondary" size="sm" icon={Edit} onClick={() => handleOpenEdit(t)}>Edit</Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={t.status === 'ACTIVE' ? Ban : CheckCircle}
                  onClick={() => handleToggleStatus(t)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  style={{ color: 'var(--error)', marginLeft: 'auto' }}
                  onClick={() => handleDelete(t.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} title={editId ? 'Edit Template' : 'New Template'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Student">Student</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe template design layout..."
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                color: 'var(--text-primary)',
                minHeight: '80px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <Button type="submit" variant="primary" loading={submitLoading} fullWidth>
            {editId ? 'Save Changes' : 'Create Template'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
