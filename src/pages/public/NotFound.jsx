import React from 'react';
import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';

export default function NotFound() {
  return (
    <div className="pb-not-found">
      <style>{`
        .pb-not-found {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-family);
        }
        .pb-nf-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px var(--space-6) 80px var(--space-6);
        }
        .pb-nf-error-code {
          font-size: 120px;
          font-weight: var(--fw-black);
          line-height: 1;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: var(--space-4);
          animation: float 6s ease-in-out infinite;
        }
        .pb-nf-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--fw-bold);
          margin-bottom: var(--space-2);
        }
        .pb-nf-desc {
          font-size: var(--font-size-base);
          color: var(--text-secondary);
          max-width: 480px;
          margin-bottom: var(--space-8);
          line-height: 1.6;
        }
        .pb-nf-actions {
          display: flex;
          gap: var(--space-4);
        }
      `}</style>
      <PublicNavbar />
      <div className="pb-nf-content">
        <div className="pb-nf-error-code">404</div>
        <h1 className="pb-nf-title">Lost in Space?</h1>
        <p className="pb-nf-desc">
          We couldn't find the page you were looking for. The link might be broken, or the page has moved.
        </p>
        <div className="pb-nf-actions">
          <Link to="/">
            <Button variant="primary" icon={Home}>Go Back Home</Button>
          </Link>
          <a href="/#faq">
            <Button variant="secondary" icon={HelpCircle}>FAQs</Button>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
