import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Github, Twitter, Linkedin, Instagram } from '../ui/BrandIcons';
import Button from '../ui/Button';

export default function Footer() {
  return (
    <footer className="pb-footer">
      <style>{`
        .pb-footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border);
          padding: var(--space-16) 0 var(--space-8) 0;
          font-family: var(--font-family);
          position: relative;
        }
        .pb-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-primary);
        }
        .pb-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-10);
          margin-bottom: var(--space-12);
        }
        .pb-footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .pb-footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--fw-bold);
          font-size: var(--font-size-xl);
        }
        .pb-footer-logo-icon {
          color: var(--primary);
        }
        .pb-footer-tagline {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .pb-footer-socials {
          display: flex;
          gap: var(--space-4);
        }
        .pb-footer-social-link {
          color: var(--text-muted);
          transition: var(--transition-fast);
        }
        .pb-footer-social-link:hover {
          color: var(--primary);
          transform: translateY(-2px);
        }
        .pb-footer-links-col {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .pb-footer-links-title {
          font-size: var(--font-size-sm);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .pb-footer-link {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        .pb-footer-link:hover {
          color: var(--primary);
          padding-left: var(--space-1);
        }
        .pb-footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-8);
          border-top: 1px solid var(--border);
          gap: var(--space-4);
        }
        .pb-footer-copyright {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }
        .pb-footer-bottom-links {
          display: flex;
          gap: var(--space-6);
        }
        .pb-footer-bottom-link {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          transition: var(--transition-fast);
        }
        .pb-footer-bottom-link:hover {
          color: var(--text-secondary);
        }

        @media (min-width: 768px) {
          .pb-footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
          .pb-footer-bottom {
            flex-direction: row;
          }
        }
      `}</style>
      <div className="container">
        <div className="pb-footer-grid">
          <div className="pb-footer-brand">
            <div className="pb-footer-logo">
              <Layers className="pb-footer-logo-icon" size={26} />
              <span className="gradient-text">PortfolioBuilder</span>
            </div>
            <p className="pb-footer-tagline">
              Empowering developers, designers, and creatives to build and export production-quality portfolios in minutes.
            </p>
            <div className="pb-footer-socials">
              <a href="#" className="pb-footer-social-link" aria-label="Github"><Github size={20} /></a>
              <a href="#" className="pb-footer-social-link" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="pb-footer-social-link" aria-label="Linkedin"><Linkedin size={20} /></a>
              <a href="#" className="pb-footer-social-link" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>

          <div className="pb-footer-links-col">
            <h4 className="pb-footer-links-title">Product</h4>
            <Link to="/#features" className="pb-footer-link">Features</Link>
            <Link to="/#templates" className="pb-footer-link">Templates</Link>
            <Link to="/#how-it-works" className="pb-footer-link">How it Works</Link>
            <Link to="/login" className="pb-footer-link">Sign In</Link>
          </div>

          <div className="pb-footer-links-col">
            <h4 className="pb-footer-links-title">Resources</h4>
            <a href="#" className="pb-footer-link">Documentation</a>
            <a href="#" className="pb-footer-link">Help Center</a>
            <a href="#" className="pb-footer-link">Guides & Tutorials</a>
            <a href="#" className="pb-footer-link">Release Notes</a>
          </div>

          <div className="pb-footer-links-col">
            <h4 className="pb-footer-links-title">Company</h4>
            <a href="#" className="pb-footer-link">About Us</a>
            <a href="#" className="pb-footer-link">Careers</a>
            <a href="#" className="pb-footer-link">Contact Support</a>
            <a href="#" className="pb-footer-link">Privacy Policy</a>
          </div>
        </div>

        <div className="pb-footer-bottom">
          <span className="pb-footer-copyright">
            &copy; {new Date().getFullYear()} PortfolioBuilder SaaS. All rights reserved.
          </span>
          <div className="pb-footer-bottom-links">
            <a href="#" className="pb-footer-bottom-link">Terms of Service</a>
            <a href="#" className="pb-footer-bottom-link">Privacy Policy</a>
            <a href="#" className="pb-footer-bottom-link">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
