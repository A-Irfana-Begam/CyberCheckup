import { Shield } from 'lucide-react';

const FOOTER_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#about', label: 'About' },
];

export default function Footer({ onNavigate }) {
  const handleClick = (e, href) => {
    e.preventDefault();
    onNavigate?.(href);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">
              <Shield size={22} aria-hidden="true" />
              Web Security Assessment
            </div>
            <p className="footer__description">
              A modern web security health scanner that helps you understand and improve
              your website&apos;s defensive posture — non-invasive and privacy-first.
            </p>
          </div>

          <div>
            <h3 className="footer__heading">Navigation</h3>
            <ul className="footer__links">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="footer__link" onClick={(e) => handleClick(e, href)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer__heading">Product</h3>
            <ul className="footer__links">
              <li>
                <span className="footer__link">Security Scanner</span>
              </li>
              <li>
                <span className="footer__link">Health Reports</span>
              </li>
              <li>
                <span className="footer__link">Recommendations</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} Web Security Assessment. All rights reserved.</span>
          <span>Built for defensive web security.</span>
        </div>
      </div>
    </footer>
  );
}
