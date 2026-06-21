import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Download,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { portfolioAPI, downloadAPI, templateAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';
import { compileTemplate } from '../../utils/templateCompiler';

export default function LivePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [device, setDevice] = useState('desktop'); // desktop | tablet | mobile
  const [zoom, setZoom] = useState(1);
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedTemplateDetail, setSelectedTemplateDetail] = useState(null);

  // Edit fields
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [skillsStr, setSkillsStr] = useState('');

  const loadPortfolio = async () => {
    try {
      const res = await portfolioAPI.getOne(id);
      const portfolioData = res.data?.data?.portfolio || res.data;
      setPortfolio(portfolioData);
      
      setFullName(portfolioData.personal?.fullName || '');
      setTitle(portfolioData.personal?.title || '');
      setBio(portfolioData.personal?.bio || '');
      setLocation(portfolioData.personal?.location || '');
      setEmail(portfolioData.personal?.email || '');
      setWebsite(portfolioData.personal?.website || '');
      setSkillsStr(portfolioData.skills?.join(', ') || '');

      const templateId = typeof portfolioData.templateId === 'object' && portfolioData.templateId !== null
        ? String(portfolioData.templateId.id || portfolioData.templateId._id || portfolioData.templateId)
        : String(portfolioData.templateId || '');

      if (templateId) {
        const tRes = await templateAPI.getOne(templateId);
        const tDetail = tRes.data?.data?.template || tRes.data;
        setSelectedTemplateDetail(tDetail);
      }
    } catch {
      toast.error('Failed to load portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, [id]);

  // Real-time compiling useEffect
  useEffect(() => {
    if (selectedTemplateDetail) {
      const skillsArr = skillsStr.split(',').map(s => s.trim()).filter(s => s !== '');
      const dataToCompile = {
        ...portfolio,
        personal: {
          ...portfolio?.personal,
          fullName,
          title,
          bio,
          location,
          email,
          website
        },
        skills: skillsArr
      };

      const html = compileTemplate(
        selectedTemplateDetail.htmlCode,
        selectedTemplateDetail.cssCode,
        selectedTemplateDetail.javascriptCode,
        dataToCompile
      );
      setIframeSrcDoc(html);
    }
  }, [fullName, title, bio, location, email, website, skillsStr, selectedTemplateDetail, portfolio]);

  const handleQuickSave = async () => {
    setSaveLoading(true);
    try {
      const skillsArr = skillsStr.split(',').map(s => s.trim()).filter(s => s !== '');
      const updated = {
        ...portfolio,
        personal: {
          ...portfolio.personal,
          fullName,
          title,
          bio,
          location,
          email,
          website
        },
        skills: skillsArr
      };
      await portfolioAPI.update(id, updated);
      toast.success('Changes saved.');
      setPortfolio(updated);
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.info('Generating ZIP archive...');
      await downloadAPI.generate(id);
      const dlRes = await downloadAPI.download(id);
      const blob = new Blob([dlRes.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${portfolio.title.replace(/\s+/g, '_')}_portfolio.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('ZIP download complete!');
    } catch {
      toast.error('Download failed.');
    }
  };

  const getWidth = () => {
    if (device === 'mobile') return '375px';
    if (device === 'tablet') return '768px';
    return '100%';
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><div className="spinner" /></div>;

  return (
    <div className="pb-live-preview">
      <style>{`
        .pb-live-preview {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          font-family: var(--font-family);
          height: calc(100vh - 120px);
        }
        .pb-preview-editor {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          overflow-y: auto;
          padding-right: 4px;
        }
        .pb-preview-frame-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .pb-preview-toolbar {
          height: 50px;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-4);
        }
        .pb-device-selector {
          display: flex;
          gap: var(--space-2);
        }
        .pb-iframe-wrapper {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          overflow: auto;
        }
        .pb-preview-iframe {
          height: 100%;
          border: none;
          background-color: white;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-lg);
          transition: width 0.3s ease;
        }
 
        @media (min-width: 1024px) {
          .pb-live-preview { grid-template-columns: 360px 1fr; }
        }
      `}</style>
 
      {/* Left Column: Quick Edits */}
      <div className="pb-preview-editor">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/dashboard/portfolios')}>
          Back to list
        </Button>
        
        <Card glass={true} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ margin: 0 }}>Quick Editor</h3>
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
          />
          <Input
            label="Professional Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
          <Input
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Input
            label="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            fullWidth
          />
          <Input
            label="Skills (comma separated)"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            fullWidth
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Short Biography</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Introduce yourself briefly..."
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                color: 'var(--text-primary)',
                minHeight: '80px',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '14px'
              }}
            />
          </div>
          <Button variant="primary" icon={Save} onClick={handleQuickSave} loading={saveLoading}>
            Save Changes
          </Button>
        </Card>
 
        <Card glass={true} style={{ textAlign: 'center' }}>
          <h4 style={{ marginTop: 0 }}>Export Assets</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Get the fully prepared offline bundle.</p>
          <Button variant="outline" icon={Download} onClick={handleDownload} fullWidth>
            Export ZIP
          </Button>
        </Card>
      </div>
 
      {/* Right Column: Live Iframe Preview */}
      <div className="pb-preview-frame-container">
        <div className="pb-preview-toolbar">
          <div className="pb-device-selector">
            <button
              className={`pb-icon-btn ${device === 'desktop' ? 'pb-toggle-btn-active' : ''}`}
              onClick={() => setDevice('desktop')}
              title="Desktop"
            >
              <Monitor size={18} />
            </button>
            <button
              className={`pb-icon-btn ${device === 'tablet' ? 'pb-toggle-btn-active' : ''}`}
              onClick={() => setDevice('tablet')}
              title="Tablet"
            >
              <Tablet size={18} />
            </button>
            <button
              className={`pb-icon-btn ${device === 'mobile' ? 'pb-toggle-btn-active' : ''}`}
              onClick={() => setDevice('mobile')}
              title="Mobile"
            >
              <Smartphone size={18} />
            </button>
          </div>
 
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="pb-icon-btn" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} title="Zoom Out"><ZoomOut size={16} /></button>
            <span style={{ fontSize: '12px', alignSelf: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button className="pb-icon-btn" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} title="Zoom In"><ZoomIn size={16} /></button>
            <button className="pb-icon-btn" onClick={() => { loadPortfolio(); toast.success('Preview reloaded.'); }} title="Refresh"><RefreshCw size={16} /></button>
          </div>
        </div>
 
        <div className="pb-iframe-wrapper">
          <iframe
            srcDoc={iframeSrcDoc}
            className="pb-preview-iframe"
            style={{
              width: getWidth(),
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            title="Portfolio Live Preview"
          />
        </div>
      </div>
    </div>
  );
}
