import { Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#about', label: 'About' },
];

export default function Navbar({ onNavigate, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLinkClick = (href) => {
    setMenuOpen(false);
    onNavigate?.(href);
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a
          href="#home"
          className="navbar__brand"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#home');
          }}
        >
          <div className="navbar__logo" aria-hidden="true">
            <Shield />
          </div>
          <div className="navbar__brand-text">
            <div className="navbar__name">Web Security Assessment</div>
            <div className="navbar__tagline">Web Security Health Scanner</div>
          </div>
        </a>

        <nav className="navbar__nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`navbar__link${activeSection === href ? ' navbar__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(href);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <div className="navbar__status" role="status" aria-label="Security First status active">
            <span className="navbar__status-dot" aria-hidden="true" />
            Security First
          </div>

          <button
            type="button"
            className="navbar__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        className={`navbar__mobile-menu${menuOpen ? ' navbar__mobile-menu--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={`navbar__mobile-link${activeSection === href ? ' navbar__mobile-link--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(href);
            }}
          >
            {label}
          </a>
        ))}
        <div className="navbar__mobile-status">
          <div className="navbar__status" role="status">
            <span className="navbar__status-dot" aria-hidden="true" />
            Security First
          </div>
        </div>
      </nav>
    </header>
  );
}
