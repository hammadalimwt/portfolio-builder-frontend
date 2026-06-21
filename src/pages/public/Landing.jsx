import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Layout,
  Zap,
  Eye,
  Download,
  Smartphone,
  Check,
  ChevronRight,
  Star,
  Layers,
  ArrowRight,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Accordion from '../../components/ui/Accordion';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('All');

  const templates = [
    { id: 1, name: 'Nebula Pro', category: 'Developer', desc: 'Vibrant indigo coding resume template with terminal layout options.', color: 'linear-gradient(135deg, #4f6ef7 0%, #06b6d4 100%)' },
    { id: 2, name: 'Aurora Creative', category: 'Designer', desc: 'Glassmorphism portfolio highlighting graphics, projects, and design tools.', color: 'linear-gradient(135deg, #9b5cf6 0%, #ec4899 100%)' },
    { id: 3, name: 'Prism Clean', category: 'Student', desc: 'Elegant and simple CV showcasing coursework, achievements, and goals.', color: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' },
    { id: 4, name: 'Solar Flex', category: 'Freelancer', desc: 'Bold template optimized for services, client testimonials, and case studies.', color: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
  ];

  const filteredTemplates = activeTab === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeTab);

  const faqItems = [
    { question: 'Do I need coding experience to use PortfolioBuilder?', answer: 'Absolutely not! PortfolioBuilder is designed for non-technical users. Choose a template, fill in your details in our structured forms, and we generate a fully functional website for you.' },
    { question: 'What formats can I download?', answer: 'You download a production-ready ZIP file containing highly optimized HTML, CSS, and JavaScript. You can run it locally, upload it to any host (Netlify, Vercel, Github Pages, etc.) or open the files to make edits.' },
    { question: 'Is my data secure?', answer: 'Yes, your data is stored securely in our MongoDB database and only accessible by you. Any images you upload are managed via professional Cloudinary storage.' },
    { question: 'Can I change my template later?', answer: 'Yes, you can duplicate your portfolio or switch templates at any time without losing the information you already entered.' },
  ];

  return (
    <div className="pb-landing">
      <style>{`
        .pb-landing {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-family);
          overflow-x: hidden;
        }

        /* Hero */
        .pb-hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          padding: 120px 0 80px 0;
          background: var(--gradient-hero);
        }
        .pb-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-12);
          align-items: center;
        }
        .pb-hero-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .pb-hero-title {
          font-size: var(--font-size-4xl);
          font-weight: var(--fw-black);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .pb-hero-desc {
          font-size: var(--font-size-base);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }
        .pb-hero-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          justify-content: center;
          align-items: center;
        }
        .pb-hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          z-index: 2;
        }
        .pb-mockup-card {
          width: 100%;
          max-width: 500px;
          height: 320px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-2xl);
          animation: float 6s ease-in-out infinite;
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        /* Stats */
        .pb-stats-bar {
          margin-top: -50px;
          position: relative;
          z-index: 10;
        }
        .pb-stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        .pb-stat-card {
          text-align: center;
          padding: var(--space-2);
        }
        .pb-stat-card-middle {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: var(--space-4) 0;
        }
        .pb-stat-num {
          font-size: var(--font-size-2xl);
          font-weight: var(--fw-extrabold);
          color: var(--primary);
        }
        .pb-stat-label {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }
        @media (min-width: 576px) {
          .pb-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .pb-stat-card-middle {
            border-top: none;
            border-bottom: none;
            border-left: 1px solid var(--border);
            border-right: 1px solid var(--border);
            padding: var(--space-2);
          }
        }

        /* Features */
        .pb-section {
          padding: var(--space-24) 0;
        }
        .pb-section-header {
          text-align: center;
          margin-bottom: var(--space-16);
        }
        .pb-section-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--fw-extrabold);
          margin-bottom: var(--space-3);
        }
        .pb-section-subtitle {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }
        .pb-features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        .pb-feat-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .pb-feat-icon-box {
          width: 48px;
          height: 48px;
          background: var(--gradient-card);
          color: var(--primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* How it works */
        .pb-steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }
        .pb-step-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }
        .pb-step-num {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Filter Tabs */
        .pb-tabs {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
          margin-bottom: var(--space-10);
          flex-wrap: wrap;
        }
        .pb-tab-btn {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--fw-semibold);
          color: var(--text-secondary);
          background-color: var(--bg-secondary);
          transition: var(--transition-fast);
        }
        .pb-tab-btn-active {
          background-color: var(--primary);
          color: white;
        }

        /* Templates Showcase */
        .pb-templates-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        .pb-temp-thumbnail {
          height: 180px;
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        /* Orbs background */
        .pb-glow-orb {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,110,247,0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
        .orb-1 { top: 20%; left: 10%; animation: orb-1 10s infinite; }
        .orb-2 { bottom: 20%; right: 10%; animation: orb-2 12s infinite; }

        @media (min-width: 768px) {
          .pb-hero-grid { grid-template-columns: 1.2fr 0.8fr; text-align: left; }
          .pb-hero-content { text-align: left; }
          .pb-hero-title { font-size: var(--font-size-6xl); }
          .pb-hero-actions { flex-direction: row; justify-content: flex-start; }
          .pb-features-grid { grid-template-columns: repeat(3, 1fr); }
          .pb-steps-grid { grid-template-columns: repeat(4, 1fr); }
          .pb-templates-grid { grid-template-columns: repeat(2, 1fr); }
          .pb-stat-card { padding: var(--space-4); }
          .pb-stat-num { font-size: var(--font-size-4xl); }
        }
      `}</style>

      <PublicNavbar />

      {/* Floating background decorations */}
      <div className="pb-glow-orb orb-1" />
      <div className="pb-glow-orb orb-2" />

      {/* Hero Section */}
      <section id="hero" className="pb-hero-section">
        <div className="container pb-hero-grid">
          <div className="pb-hero-content animate-fadeInUp">
            <h1 className="pb-hero-title">
              Build Your <span className="gradient-text">Professional Portfolio</span> in Minutes
            </h1>
            <p className="pb-hero-desc">
              Stunning modern layouts, interactive editor, and immediate zip exports. Tailored templates for developers, designers, students, and freelancers.
            </p>
            <div className="pb-hero-actions">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={ArrowRight}>Create Your Portfolio</Button>
              </Link>
              <a href="#templates">
                <Button variant="secondary" size="lg">View Templates</Button>
              </a>
            </div>
          </div>
          
          <div className="pb-hero-visual animate-fadeIn">
            <div className="pb-mockup-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ height: '20px', width: '60%', background: 'var(--border)', borderRadius: '4px' }} />
                <div style={{ height: '40px', width: '100%', background: 'var(--border)', borderRadius: '4px' }} />
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <div style={{ height: '12px', width: '30%', background: 'var(--primary)', opacity: 0.5, borderRadius: '4px' }} />
                  <div style={{ height: '12px', width: '40%', background: 'var(--accent)', opacity: 0.5, borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ height: '80px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={24} style={{ color: 'var(--primary)', marginRight: '8px' }} />
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Live Preview Auto-Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="pb-stats-bar">
        <div className="container-md">
          <Card glass={true} className="pb-stats-grid">
            <div className="pb-stat-card">
              <div className="pb-stat-num">10k+</div>
              <div className="pb-stat-label">Portfolios Built</div>
            </div>
            <div className="pb-stat-card pb-stat-card-middle">
              <div className="pb-stat-num">50+</div>
              <div className="pb-stat-label">Premium Assets</div>
            </div>
            <div className="pb-stat-card">
              <div className="pb-stat-num">100%</div>
              <div className="pb-stat-label">Zip File Exports</div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pb-section">
        <div className="container">
          <div className="pb-section-header">
            <h2 className="pb-section-title">Fully Loaded SaaS Builder</h2>
            <p className="pb-section-subtitle">Everything you need to ship a top-tier resume portfolio fast.</p>
          </div>
          <div className="pb-features-grid">
            <Card hoverable className="pb-feat-card">
              <div className="pb-feat-icon-box"><Code size={24} /></div>
              <h3>No Coding Needed</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Fill out clean form fields. We build the semantic HTML5/CSS3 templates for you instantly.</p>
            </Card>
            <Card hoverable className="pb-feat-card">
              <div className="pb-feat-icon-box"><Layout size={24} /></div>
              <h3>Stunning Templates</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Choose from modern dark-mode layouts, glassmorphism designs, and classic CV themes.</p>
            </Card>
            <Card hoverable className="pb-feat-card">
              <div className="pb-feat-icon-box"><Zap size={24} /></div>
              <h3>Instant Reload</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Watch your preview site update dynamically side-by-side as you edit details.</p>
            </Card>
            <Card hoverable className="pb-feat-card">
              <div className="pb-feat-icon-box"><Eye size={24} /></div>
              <h3>Cross-Device Preview</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Click toolbars to toggle desktop, tablet, and mobile views of the draft portfolio.</p>
            </Card>
            <Card hoverable className="pb-feat-card">
              <div className="pb-feat-icon-box"><Download size={24} /></div>
              <h3>One-Click ZIP Export</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Generate clean, build-less web archives containing all assets in a single bundle.</p>
            </Card>
            <Card hoverable className="pb-feat-card">
              <div className="pb-feat-icon-box"><Smartphone size={24} /></div>
              <h3>Fully Responsive</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>All layouts are mobile-first, ensuring great layout renders on phones, tablets, and screens.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="pb-section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="pb-section-header">
            <h2 className="pb-section-title">How It Works</h2>
            <p className="pb-section-subtitle">A streamlined, 4-step wizard workflow.</p>
          </div>
          <div className="pb-steps-grid">
            <div className="pb-step-card">
              <div className="pb-step-num">1</div>
              <h4>Pick Template</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Select from career-specific structures.</p>
            </div>
            <div className="pb-step-card">
              <div className="pb-step-num">2</div>
              <h4>Fill Information</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Add projects, experience, skills, and links.</p>
            </div>
            <div className="pb-step-card">
              <div className="pb-step-num">3</div>
              <h4>Check Preview</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Review how it displays on mobile & desktop.</p>
            </div>
            <div className="pb-step-card">
              <div className="pb-step-num">4</div>
              <h4>Download ZIP</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Deploy directly to Vercel, Netlify, or Github.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="pb-section">
        <div className="container">
          <div className="pb-section-header">
            <h2 className="pb-section-title">Explore Stunning Templates</h2>
            <p className="pb-section-subtitle">Highly customized, high-conversion layouts.</p>
          </div>

          <div className="pb-tabs">
            {['All', 'Developer', 'Designer', 'Student', 'Freelancer'].map((tab) => (
              <button
                key={tab}
                className={`pb-tab-btn ${activeTab === tab ? 'pb-tab-btn-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pb-templates-grid">
            {filteredTemplates.map((t) => (
              <Card key={t.id} hoverable>
                <div className="pb-temp-thumbnail" style={{ background: t.color }}>
                  <Layers size={40} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <h3 style={{ margin: 0 }}>{t.name}</h3>
                  <Badge variant="primary">{t.category}</Badge>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: 'var(--space-6)' }}>{t.desc}</p>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <Link to="/register" style={{ flexGrow: 1 }}>
                    <Button variant="primary" fullWidth>Use Template</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="pb-section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container-md">
          <div className="pb-section-header">
            <h2 className="pb-section-title">Frequently Asked Questions</h2>
            <p className="pb-section-subtitle">Need help? We have answers.</p>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
