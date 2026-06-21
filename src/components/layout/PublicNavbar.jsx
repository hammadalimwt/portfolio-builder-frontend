import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Layers } from 'lucide-react';
import Button from '../ui/Button';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <nav className={`pb-navbar ${isScrolled ? 'pb-navbar-scrolled' : ''}`}>
      <style>{`
        .pb-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          display: flex;
          align-items: center;
          z-index: var(--z-sticky);
          transition: var(--transition-base);
          background-color: transparent;
          border-bottom: 1px solid transparent;
        }
        .pb-navbar-scrolled {
          background-color: var(--topbar-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .pb-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .pb-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--fw-bold);
          font-size: var(--font-size-lg);
          color: var(--text-primary);
        }
        .pb-logo-icon {
          color: var(--primary);
        }
        .pb-nav-links {
          display: none;
          align-items: center;
          gap: var(--space-8);
        }
        .pb-nav-link {
          font-size: var(--font-size-sm);
          font-weight: var(--fw-medium);
          color: var(--text-secondary);
          transition: var(--transition-fast);
          cursor: pointer;
        }
        .pb-nav-link:hover {
          color: var(--primary);
        }
        .pb-nav-actions {
          display: none;
          align-items: center;
          gap: var(--space-4);
        }
        .pb-menu-btn {
          display: block;
          color: var(--text-primary);
          cursor: pointer;
        }
        
        /* Mobile Overlay Menu */
        .pb-mobile-overlay {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-primary);
          z-index: var(--z-overlay);
          display: flex;
          flex-direction: column;
          padding: var(--space-8) var(--space-6);
          gap: var(--space-6);
          border-top: 1px solid var(--border);
          animation: fadeInDown 0.3s ease forwards;
        }
        .pb-mobile-nav-link {
          font-size: var(--font-size-lg);
          font-weight: var(--fw-semibold);
          color: var(--text-primary);
          padding: var(--space-2) 0;
          border-bottom: 1px solid var(--border);
        }

        @media (min-width: 768px) {
          .pb-nav-links { display: flex; }
          .pb-nav-actions { display: flex; }
          .pb-menu-btn { display: none; }
          .pb-mobile-overlay { display: none; }
        }
      `}</style>
      <div className="container pb-nav-container">
        <Link to="/" className="pb-logo">
          <Layers className="pb-logo-icon" size={24} />
          <span className="gradient-text">PortfolioBuilder</span>
        </Link>

        <div className="pb-nav-links">
          <span onClick={() => handleNavClick('hero')} className="pb-nav-link">Home</span>
          <span onClick={() => handleNavClick('features')} className="pb-nav-link">Features</span>
          <span onClick={() => handleNavClick('templates')} className="pb-nav-link">Templates</span>
          <span onClick={() => handleNavClick('how-it-works')} className="pb-nav-link">How it Works</span>
          <span onClick={() => handleNavClick('faq')} className="pb-nav-link">FAQ</span>
        </div>

        <div className="pb-nav-actions">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>

        <button className="pb-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="pb-mobile-overlay">
          <span onClick={() => handleNavClick('hero')} className="pb-mobile-nav-link">Home</span>
          <span onClick={() => handleNavClick('features')} className="pb-mobile-nav-link">Features</span>
          <span onClick={() => handleNavClick('templates')} className="pb-mobile-nav-link">Templates</span>
          <span onClick={() => handleNavClick('how-it-works')} className="pb-mobile-nav-link">How it Works</span>
          <span onClick={() => handleNavClick('faq')} className="pb-mobile-nav-link">FAQ</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'auto' }}>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" fullWidth>Login</Button>
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <Button variant="primary" fullWidth>Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
