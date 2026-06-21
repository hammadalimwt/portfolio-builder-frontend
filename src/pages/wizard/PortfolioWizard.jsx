import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Code,
  Palette,
  GraduationCap,
  Briefcase,
  UserCheck,
  Layout,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle,
  FileCode,
  Globe,
  Trophy,
  Heart,
  Smile,
  Upload,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram, Facebook } from '../../components/ui/BrandIcons';
import { portfolioAPI, templateAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import { toast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import { compileTemplate } from '../../utils/templateCompiler';

const categoryMapping = {
  Developer: ['developer'],
  Designer: ['designer', 'creative'],
  Freelancer: ['freelancer'],
  Student: ['student'],
  Business: ['business']
};

export default function PortfolioWizard() {

  const { id } = useParams(); // exists if editing
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewZoom, setPreviewZoom] = useState(80);

  // Main Form State
  const [formData, setFormData] = useState({
    title: '',
    portfolioType: 'Developer',
    templateId: '',
    personal: { fullName: '', title: '', bio: '', location: '', email: '', phone: '', website: '', profileImage: '' },
    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '', facebook: '' },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certificates: [],
    additionalInfo: { achievements: [], languages: [], interests: [], hobbies: [] },
  });

  // Real-time preview states
  const [selectedTemplateDetail, setSelectedTemplateDetail] = useState(null);
  const [previewTemplateDetail, setPreviewTemplateDetail] = useState(null);

  // Fetch detailed template code when template selection changes
  useEffect(() => {
    if (formData.templateId) {
      templateAPI.getOne(formData.templateId).then(res => {
        const t = res.data?.data?.template || res.data;
        setSelectedTemplateDetail(t);
      }).catch(err => {
        console.error('Failed to load selected template details:', err);
      });
    } else {
      setSelectedTemplateDetail(null);
    }
  }, [formData.templateId]);

  // Fetch preview template detail when preview modal template changes
  useEffect(() => {
    if (previewTemplateId) {
      templateAPI.getOne(previewTemplateId).then(res => {
        const t = res.data?.data?.template || res.data;
        setPreviewTemplateDetail(t);
      }).catch(err => {
        console.error('Failed to load preview template detail:', err);
      });
    } else {
      setPreviewTemplateDetail(null);
    }
  }, [previewTemplateId]);


  // Auto-select template of matching category when portfolioType changes
  useEffect(() => {
    if (templates.length > 0) {
      const allowedCategories = categoryMapping[formData.portfolioType] || [];
      const filtered = templates.filter(t => {
        const catSlug = (t.category?.slug || t.category || '').toLowerCase();
        return allowedCategories.includes(catSlug);
      });
      
      if (filtered.length > 0 && !filtered.some(t => t.id === formData.templateId)) {
        setFormData(prev => ({ ...prev, templateId: filtered[0].id }));
      }
    }
  }, [formData.portfolioType, templates]);

  // Load templates and existing portfolio if edit
  useEffect(() => {
    const init = async () => {
      try {
        const tRes = await templateAPI.getAll();
        const templatesList = tRes.data?.data?.items || tRes.data || [];
        setTemplates(templatesList);
        
        // Auto-select first template if not set
        // NOTE: DTO exposes 'id' (not '_id') — must use t.id
        if (templatesList.length > 0 && !formData.templateId) {
          setFormData(prev => ({ ...prev, templateId: templatesList[0].id }));
        }

        if (id) {
          const pRes = await portfolioAPI.getOne(id);
          const p = pRes.data?.data?.portfolio || pRes.data;
          // portfolioDetailDTO exposes templateId as the raw ObjectId string
          // (or a populated object if using .populate())
          const resolvedTemplateId =
            typeof p.templateId === 'object' && p.templateId !== null
              ? String(p.templateId._id || p.templateId.id || p.templateId)
              : String(p.templateId || '');
          setFormData({
            title:          p.title || '',
            portfolioType:  p.portfolioType || 'Developer',
            templateId:     resolvedTemplateId,
            personal:       { ...formData.personal, ...p.personal },
            socialLinks:    { ...formData.socialLinks, ...p.socialLinks },
            skills:         p.skills || [],
            experience:     p.experience || [],
            education:      p.education || [],
            projects:       p.projects || [],
            certificates:   p.certificates || [],
            additionalInfo: { ...formData.additionalInfo, ...p.additionalInfo },
          });
        }
      } catch (err) {
        toast.error('Failed to initialize editor.');
      }
    };
    init();
  }, [id]);

  // Handle simple form fields
  const handlePersonalChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [key]: val }
    }));
  };

  const handleSocialChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: val }
    }));
  };

  const handleAdditionalInfoChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, [key]: val }
    }));
  };

  // Profile Image upload
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          personal: { ...prev.personal, profileImage: reader.result } // Save Base64 preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Skill Add / Remove
  const [skillInput, setSkillInput] = useState('');
  const handleAddSkill = (skill) => {
    const s = skill || skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, s] }));
    }
    setSkillInput('');
  };
  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Suggested Skills mapping
  const skillSuggestions = {
    Developer: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Docker', 'AWS', 'Git'],
    Designer: ['Figma', 'Adobe Photoshop', 'Illustrator', 'UI/UX Design', 'Branding', 'Typography'],
    Freelancer: ['Project Management', 'Copywriting', 'SEO', 'Consulting', 'Marketing'],
    Student: ['Leadership', 'Public Speaking', 'Data Analysis', 'Research', 'Collaboration'],
    Business: ['Strategic Planning', 'Financial Analysis', 'Negotiation', 'Public Relations'],
  };

  // Repeatable sections handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }]
    }));
  };
  const removeExperience = (idx) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };
  const handleExperienceChange = (idx, key, val) => {
    const list = [...formData.experience];
    list[idx][key] = val;
    setFormData(prev => ({ ...prev, experience: list }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', description: '' }]
    }));
  };
  const removeEducation = (idx) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };
  const handleEducationChange = (idx, key, val) => {
    const list = [...formData.education];
    list[idx][key] = val;
    setFormData(prev => ({ ...prev, education: list }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: [], githubLink: '', liveDemo: '', image: '' }]
    }));
  };
  const removeProject = (idx) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };
  const handleProjectChange = (idx, key, val) => {
    const list = [...formData.projects];
    list[idx][key] = val;
    setFormData(prev => ({ ...prev, projects: list }));
  };

  const handleProjectImageChange = (idx, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const list = [...formData.projects];
        list[idx].image = reader.result;
        setFormData(prev => ({ ...prev, projects: list }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addCertificate = () => {
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, { name: '', organization: '', date: '', verificationLink: '' }]
    }));
  };
  const removeCertificate = (idx) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== idx)
    }));
  };
  const handleCertificateChange = (idx, key, val) => {
    const list = [...formData.certificates];
    list[idx][key] = val;
    setFormData(prev => ({ ...prev, certificates: list }));
  };

  // Save drafts / submits — with full pre-flight validation matching backend Joi schema
  const handleSave = async (status = 'DRAFT') => {
    // ── Required field checks (mirrors backend createPortfolioSchema) ──────────
    if (!formData.templateId || !/^[0-9a-fA-F]{24}$/.test(formData.templateId)) {
      toast.error('Please select a template before saving (Step 2).');
      setCurrentStep(2);
      return;
    }
    if (!formData.personal?.fullName?.trim()) {
      toast.error('Full name is required in the Personal Info step (Step 3).');
      setCurrentStep(3);
      return;
    }
    if (!formData.title?.trim()) {
      toast.error('Portfolio title is required on the final Overview step (Step 10).');
      setCurrentStep(10);
      return;
    }

    setSaveLoading(true);
    try {
      // 1. Separate base64 image strings from payload to prevent saving huge base64 in MongoDB
      const personalData = { ...formData.personal };
      const base64ProfileImage = personalData.profileImage && personalData.profileImage.startsWith('data:') ? personalData.profileImage : null;
      if (base64ProfileImage) {
        personalData.profileImage = ''; // Clear so we don't save large base64 in DB
      }

      const projectsData = formData.projects.map(p => {
        const pCopy = { ...p };
        const base64ProjImage = pCopy.image && pCopy.image.startsWith('data:') ? pCopy.image : null;
        if (base64ProjImage) {
          pCopy.image = ''; // Clear so we don't save large base64 in DB
        }
        return pCopy;
      });

      const payload = {
        templateId:     formData.templateId,
        title:          formData.title.trim(),
        portfolioType:  formData.portfolioType || 'Developer',
        personal:       personalData,
        socialLinks:    formData.socialLinks,
        skills:         formData.skills,
        experience:     formData.experience,
        education:      formData.education,
        projects:       projectsData,
        certificates:   formData.certificates,
        additionalInfo: formData.additionalInfo,
        status,
      };

      let portfolioId = id;
      let isNew = !id;

      if (id) {
        await portfolioAPI.update(id, payload);
      } else {
        const res = await portfolioAPI.create(payload);
        const portfolio = res.data?.data?.portfolio || res.data;
        portfolioId = portfolio.id || portfolio._id;
      }

      // Helper to convert Base64 Data URI to a File object
      const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      };

      // 2. Upload profile image to Cloudinary if it was changed to a base64 string
      if (base64ProfileImage) {
        const file = dataURLtoFile(base64ProfileImage, 'profile-image.jpg');
        await portfolioAPI.uploadProfileImage(portfolioId, file);
      }

      // 3. Upload project images to Cloudinary if they were changed to base64 strings
      const hasBase64ProjImages = formData.projects.some(p => p.image && p.image.startsWith('data:'));
      if (hasBase64ProjImages) {
        const resDetail = await portfolioAPI.getOne(portfolioId);
        const updatedPortfolio = resDetail.data?.data?.portfolio || resDetail.data;
        
        // Match original projects in state to updated projects in database (by index)
        if (updatedPortfolio && Array.isArray(updatedPortfolio.projects)) {
          for (let i = 0; i < formData.projects.length; i++) {
            const origProj = formData.projects[i];
            if (origProj.image && origProj.image.startsWith('data:')) {
              const savedProj = updatedPortfolio.projects[i];
              if (savedProj) {
                const file = dataURLtoFile(origProj.image, `project-${i}.jpg`);
                const projId = savedProj.id || savedProj._id;
                await portfolioAPI.uploadProjectImage(portfolioId, projId, file);
              }
            }
          }
        }
      }

      toast.success(isNew ? 'Portfolio created successfully!' : 'Portfolio saved successfully!');
      navigate('/dashboard/portfolios');
    } catch (err) {
      // Surface the real server error — validation details or generic message
      const serverMsg = err.response?.data?.message;
      const details   = err.response?.data?.errors;
      if (details?.length) {
        // Show every field that failed, e.g. "templateId: must be a valid id"
        details.forEach(d => toast.error(`${d.field}: ${d.message}`));
      } else {
        toast.error(serverMsg || 'Failed to save portfolio. Please check all fields.');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const stepList = [
    { num: 1, label: 'Type' },
    { num: 2, label: 'Template' },
    { num: 3, label: 'Personal' },
    { num: 4, label: 'Socials' },
    { num: 5, label: 'Skills' },
    { num: 6, label: 'Experience' },
    { num: 7, label: 'Education' },
    { num: 8, label: 'Projects' },
    { num: 9, label: 'Certificates' },
    { num: 10, label: 'Overview' },
  ];

  return (
    <div className="pb-wizard pb-wizard-two-cols">
      <style>{`
        .pb-wizard {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
          font-family: var(--font-family);
          height: calc(100vh - 120px);
        }
        .pb-wizard-two-cols {
          grid-template-columns: 1fr;
        }
        .pb-wizard-three-cols {
          grid-template-columns: 1fr;
        }
        .pb-wiz-sidebar {
          display: none;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          flex-direction: column;
          gap: var(--space-6);
        }
        .pb-wiz-body {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .pb-wiz-header {
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pb-wiz-content {
          padding: var(--space-6);
          overflow-y: auto;
          flex-grow: 1;
        }
        .pb-wiz-footer {
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-secondary);
        }

        /* Live preview panel styles */
        .pb-wiz-preview-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .pb-wiz-preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background-color: white;
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

        @media (max-width: 1023px) {
          .pb-wiz-preview-panel { display: none !important; }
        }

        /* Steps navigation vertical */
        .pb-step-nav-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .pb-step-nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--fw-semibold);
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        .pb-step-nav-active {
          color: white;
          background: var(--gradient-primary);
          box-shadow: var(--shadow-primary);
        }

        /* Type Grid select cards */
        .pb-type-select-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 480px) {
          .pb-type-select-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Template Grid select */
        .pb-template-select-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 480px) {
          .pb-template-select-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Form Grid responsiveness */
        .pb-wiz-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }
        @media (min-width: 576px) {
          .pb-wiz-form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .pb-wiz-footer {
            padding: var(--space-3) var(--space-4) !important;
            gap: var(--space-2) !important;
          }
          .pb-wiz-footer .pb-btn {
            padding: var(--space-2) var(--space-3) !important;
            font-size: var(--font-size-xs) !important;
            gap: 4px !important;
          }
          .pb-wiz-footer .pb-btn svg {
            width: 14px !important;
            height: 14px !important;
          }
        }
        .pb-type-select-card {
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--space-6);
          cursor: pointer;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          transition: var(--transition-bounce);
        }
        .pb-type-select-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .pb-type-card-active { border-color: var(--primary); background: var(--gradient-card); }

        /* Social Links */
        .pb-socials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        /* Skill list */
        .pb-skills-box {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-top: var(--space-4);
        }

        /* Repeatable Cards */
        .pb-repeater-box {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .pb-rep-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          background-color: var(--bg-secondary);
          position: relative;
        }

        @media (min-width: 1024px) {
          .pb-wizard-two-cols { grid-template-columns: 240px 1fr; }
          .pb-wizard-three-cols { grid-template-columns: 240px 1fr 480px; }
          .pb-wiz-sidebar { display: flex; }
          .pb-socials-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Left Sidebar Steps Map */}
      <aside className="pb-wiz-sidebar">
        <h4 style={{ margin: 0 }}>Progress</h4>
        <ProgressBar value={(currentStep / 10) * 100} showValue label={`${currentStep * 10}% Complete`} />
        <div className="pb-step-nav-list">
          {stepList.map(step => (
            <div
              key={step.num}
              className={`pb-step-nav-item ${currentStep === step.num ? 'pb-step-nav-active' : ''}`}
            >
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Step {step.num}</span>
              <strong>{step.label}</strong>
            </div>
          ))}
        </div>
      </aside>

      {/* Main wizard frame */}
      <div className="pb-wiz-body">
        <div className="pb-wiz-header">
          <h2 style={{ margin: 0, fontSize: '18px' }}>
            {stepList[currentStep - 1].label}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Step {currentStep} of 10</span>
        </div>

        <div className="pb-wiz-content">
          {/* Step 1: Type selection */}
          {currentStep === 1 && (
            <div className="pb-type-select-grid">
              {[
                { title: 'Developer', desc: 'Code portfolio showing projects, skills, terminal aesthetics.', icon: Code },
                { title: 'Designer', desc: 'Sleek portfolios containing gallery sections and design flows.', icon: Palette },
                { title: 'Freelancer', desc: 'CV landing with pricing columns and client logs.', icon: Briefcase },
                { title: 'Student', desc: 'Clean cards highlighting academics, sports, certifications.', icon: GraduationCap },
                { title: 'Business', desc: 'Executive profiles with testimonials, stats, resume blocks.', icon: UserCheck },
              ].map(item => (
                <div
                  key={item.title}
                  className={`pb-type-select-card ${formData.portfolioType === item.title ? 'pb-type-card-active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, portfolioType: item.title }))}
                >
                  <item.icon size={32} style={{ color: 'var(--primary)' }} />
                  <strong>{item.title}</strong>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Choose template */}
          {currentStep === 2 && (
            <div className="pb-template-select-grid">
              {templates.length === 0 ? (
                <div style={{ gridColumn: 'span 2' }}>
                  <Skeleton variant="card" />
                </div>
              ) : (
                templates
                  .filter(t => {
                    const catSlug = (t.category?.slug || t.category || '').toLowerCase();
                    const allowedCategories = categoryMapping[formData.portfolioType] || [];
                    return allowedCategories.includes(catSlug);
                  })
                  .map(t => (
                    <div
                      key={t.id}
                      className={`pb-type-select-card ${formData.templateId === t.id ? 'pb-type-card-active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, templateId: t.id }))}
                      style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
                    >
                      {formData.templateId === t.id && (
                        <span style={{
                          position: 'absolute', top: '10px', right: '10px',
                          background: 'var(--primary)', borderRadius: '50%',
                          width: '20px', height: '20px', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                          zIndex: 10
                        }}>✓</span>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Layout size={32} style={{ color: 'var(--accent)' }} />
                        <strong>{t.name}</strong>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{t.description}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplateId(t.id);
                          setPreviewModalOpen(true);
                        }}
                        style={{ marginTop: 'var(--space-3)', width: '100%' }}
                      >
                        Preview Template
                      </Button>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Step 3: Personal Information */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formData.personal.profileImage ? (
                    <img src={formData.personal.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} style={{ position: 'absolute', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} />
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Add your profile image</span>
              </div>
              <Input label="Full Name *" value={formData.personal.fullName} onChange={(e) => handlePersonalChange('fullName', e.target.value)} fullWidth />
              <Input label="Professional Title" value={formData.personal.title} onChange={(e) => handlePersonalChange('title', e.target.value)} placeholder="e.g. Full Stack Web Developer" fullWidth />
              <Input label="Location" value={formData.personal.location} onChange={(e) => handlePersonalChange('location', e.target.value)} placeholder="e.g. New York, USA" fullWidth />
              <Input label="Email Address *" value={formData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} fullWidth />
              <Input label="Phone" value={formData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} fullWidth />
              <Input label="Website" value={formData.personal.website} onChange={(e) => handlePersonalChange('website', e.target.value)} fullWidth />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Short Biography</label>
                <textarea
                  value={formData.personal.bio}
                  onChange={(e) => handlePersonalChange('bio', e.target.value)}
                  placeholder="Introduce yourself briefly..."
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', color: 'var(--text-primary)', minHeight: '80px', outline: 'none' }}
                />
              </div>
            </div>
          )}

          {/* Step 4: Social Links */}
          {currentStep === 4 && (
            <div className="pb-socials-grid">
              <Input label="GitHub URL" icon={Github} value={formData.socialLinks.github} onChange={(e) => handleSocialChange('github', e.target.value)} fullWidth />
              <Input label="LinkedIn URL" icon={Linkedin} value={formData.socialLinks.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} fullWidth />
              <Input label="Twitter/X URL" icon={Twitter} value={formData.socialLinks.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} fullWidth />
              <Input label="Instagram URL" icon={Instagram} value={formData.socialLinks.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} fullWidth />
              <Input label="Facebook URL" icon={Facebook} value={formData.socialLinks.facebook} onChange={(e) => handleSocialChange('facebook', e.target.value)} fullWidth />
            </div>
          )}

          {/* Step 5: Skills */}
          {currentStep === 5 && (
            <div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Input
                  label="Skill Name"
                  placeholder="e.g. React"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(); }}
                  fullWidth
                />
                <Button onClick={() => handleAddSkill()} variant="secondary" style={{ marginTop: '22px' }}>Add</Button>
              </div>
              <div className="pb-skills-box">
                {formData.skills.map(skill => (
                  <Badge key={skill} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => handleRemoveSkill(skill)}>
                    {skill} <span style={{ color: 'red', fontWeight: 'bold' }}>&times;</span>
                  </Badge>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-8)' }}>
                <h4 style={{ marginBottom: 'var(--space-2)' }}>Suggested Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skillSuggestions[formData.portfolioType]?.map(skill => (
                    <Badge key={skill} variant="secondary" style={{ cursor: 'pointer' }} onClick={() => handleAddSkill(skill)}>
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Experience */}
          {currentStep === 6 && (
            <div className="pb-repeater-box">
              <Button onClick={addExperience} variant="secondary" icon={Plus}>Add Work Experience</Button>
              {formData.experience.map((exp, idx) => (
                <div key={exp.id || `exp-${idx}`} className="pb-rep-card animate-fadeIn">
                  <button onClick={() => removeExperience(idx)} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                  <div className="pb-wiz-form-grid">
                    <Input label="Company" value={exp.company} onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)} />
                    <Input label="Position" value={exp.position} onChange={(e) => handleExperienceChange(idx, 'position', e.target.value)} />
                    <Input label="Start Date" value={exp.startDate} placeholder="e.g. Jan 2023" onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)} />
                    <Input label="End Date" value={exp.endDate} placeholder="e.g. Present" onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Roles & Accomplishments</label>
                    <textarea value={exp.description} onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)} style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 7: Education */}
          {currentStep === 7 && (
            <div className="pb-repeater-box">
              <Button onClick={addEducation} variant="secondary" icon={Plus}>Add Education Background</Button>
              {formData.education.map((edu, idx) => (
                <div key={edu.id || `edu-${idx}`} className="pb-rep-card animate-fadeIn">
                  <button onClick={() => removeEducation(idx)} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                  <div className="pb-wiz-form-grid">
                    <Input label="Institution" value={edu.institution} onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)} />
                    <Input label="Degree / Course" value={edu.degree} onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)} />
                    <Input label="Graduation Year" value={edu.year} onChange={(e) => handleEducationChange(idx, 'year', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Description / Honors</label>
                    <textarea value={edu.description} onChange={(e) => handleEducationChange(idx, 'description', e.target.value)} style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 8: Projects */}
          {currentStep === 8 && (
            <div className="pb-repeater-box">
              <Button onClick={addProject} variant="secondary" icon={Plus}>Add Project Card</Button>
              {formData.projects.map((proj, idx) => (
                <div key={proj.id || `proj-${idx}`} className="pb-rep-card animate-fadeIn">
                  <button onClick={() => removeProject(idx)} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                  <div className="pb-wiz-form-grid">
                    <Input label="Project Name" value={proj.name} onChange={(e) => handleProjectChange(idx, 'name', e.target.value)} />
                    <Input label="GitHub Link" icon={Github} value={proj.githubLink} onChange={(e) => handleProjectChange(idx, 'githubLink', e.target.value)} />
                    <Input label="Live Demo URL" icon={Globe} value={proj.liveDemo} onChange={(e) => handleProjectChange(idx, 'liveDemo', e.target.value)} />
                    <Input label="Technologies Used (comma separated)" value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''} onChange={(e) => handleProjectChange(idx, 'technologies', e.target.value.split(',').map(s => s.trim()))} placeholder="e.g. React, Node.js, CSS" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: '12px', marginBottom: '12px' }}>
                    <div style={{ position: 'relative', width: '60px', height: '45px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                      {proj.image ? (
                        <img src={proj.image} alt="Project" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Upload size={18} style={{ color: 'var(--text-muted)' }} />
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleProjectImageChange(idx, e)} style={{ position: 'absolute', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Upload project preview image</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Project Description</label>
                    <textarea value={proj.description} onChange={(e) => handleProjectChange(idx, 'description', e.target.value)} style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 9: Certifications */}
          {currentStep === 9 && (
            <div className="pb-repeater-box">
              <Button onClick={addCertificate} variant="secondary" icon={Plus}>Add Certificate</Button>
              {formData.certificates.map((cert, idx) => (
                <div key={cert.id || `cert-${idx}`} className="pb-rep-card animate-fadeIn">
                  <button onClick={() => removeCertificate(idx)} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                  <div className="pb-wiz-form-grid">
                    <Input label="Certificate Name" value={cert.name} onChange={(e) => handleCertificateChange(idx, 'name', e.target.value)} />
                    <Input label="Organization" value={cert.organization} onChange={(e) => handleCertificateChange(idx, 'organization', e.target.value)} />
                    <Input label="Date Issued" value={cert.date} onChange={(e) => handleCertificateChange(idx, 'date', e.target.value)} />
                    <Input label="Verification Link" value={cert.verificationLink} onChange={(e) => handleCertificateChange(idx, 'verificationLink', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 10: Final overview / Title check */}
          {currentStep === 10 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <Input
                label="Portfolio Title * (Name of draft/reference)"
                placeholder="e.g. My Developer Resume"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                fullWidth
              />

              <Card glass={true} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={22} style={{ color: 'var(--success)' }} />
                  Wizard Verification
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Review the information sets gathered:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Career Theme:</strong> {formData.portfolioType}</div>
                  <div><strong>Personal Name:</strong> {formData.personal.fullName || 'Not set'}</div>
                  <div><strong>Skills Added:</strong> {formData.skills.length} skills</div>
                  <div><strong>Experience Cards:</strong> {formData.experience.length} items</div>
                  <div><strong>Project Cards:</strong> {formData.projects.length} items</div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Wizard Navigation Footer */}
        <div className="pb-wiz-footer">
          <Button
            variant="ghost"
            icon={ChevronLeft}
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Prev
          </Button>

          <Button
            variant="secondary"
            icon={Save}
            loading={saveLoading}
            onClick={() => handleSave('DRAFT')}
          >
            Save Draft
          </Button>

          {currentStep === 10 ? (
            <Button
              variant="primary"
              icon={CheckCircle}
              loading={saveLoading}
              onClick={() => handleSave('COMPLETED')}
            >
              Finish & Exit
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              Next <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </div>

      {previewTemplateId && (
        <Modal
          isOpen={previewModalOpen}
          title={`Template Preview: ${templates.find(t => t.id === previewTemplateId)?.name || ''}`}
          onClose={() => {
            setPreviewModalOpen(false);
            setPreviewTemplateId(null);
            setPreviewDevice('desktop');
            setPreviewZoom(80);
          }}
          size="xxl"
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
            {/* Device Switcher & Zoom Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'var(--fw-semibold)' }}>Responsive View:</span>
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 'var(--fw-semibold)',
                      cursor: 'pointer',
                      backgroundColor: previewDevice === 'desktop' ? 'var(--primary)' : 'transparent',
                      color: previewDevice === 'desktop' ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Monitor size={14} /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 'var(--fw-semibold)',
                      cursor: 'pointer',
                      backgroundColor: previewDevice === 'tablet' ? 'var(--primary)' : 'transparent',
                      color: previewDevice === 'tablet' ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Tablet size={14} /> Tablet
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 'var(--fw-semibold)',
                      cursor: 'pointer',
                      backgroundColor: previewDevice === 'mobile' ? 'var(--primary)' : 'transparent',
                      color: previewDevice === 'mobile' ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Smartphone size={14} /> Mobile
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'var(--fw-semibold)' }}>Zoom:</span>
                <select
                  value={previewZoom}
                  onChange={(e) => setPreviewZoom(Number(e.target.value))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 'var(--fw-semibold)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value={100}>100%</option>
                  <option value={90}>90%</option>
                  <option value={80}>80% (Recommended)</option>
                  <option value={70}>70%</option>
                  <option value={60}>60%</option>
                  <option value={50}>50%</option>
                </select>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setPreviewModalOpen(false);
                    setPreviewTemplateId(null);
                    setPreviewDevice('desktop');
                    setPreviewZoom(80);
                  }}
                >
                  Close Preview
                </Button>
              </div>
            </div>

            {/* Frame Sandbox */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              backgroundColor: 'var(--bg-secondary)',
              padding: '24px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              flexGrow: 1,
              overflow: 'hidden',
              minHeight: '62vh'
            }}>
              <div style={{
                width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                maxWidth: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: previewDevice === 'desktop' ? '1px solid var(--border)' : '10px solid #1a1b26',
                borderRadius: previewDevice === 'desktop' ? 'var(--radius-md)' : '24px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                backgroundColor: 'white',
                height: '60vh',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Simulated Phone Speaker / Camera Notch */}
                {previewDevice === 'mobile' && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '18px',
                    backgroundColor: '#1a1b26',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#333' }}></div>
                  </div>
                )}

                <iframe
                  srcDoc={previewTemplateDetail ? compileTemplate(
                    previewTemplateDetail.htmlCode,
                    previewTemplateDetail.cssCode,
                    previewTemplateDetail.javascriptCode,
                    formData
                  ) : ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    zoom: previewZoom / 100
                  }}
                  title="Template Preview"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
