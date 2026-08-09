import { Cookie, Globe, Lock, Server, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Lock,
    title: 'HTTPS Protection',
    description:
      'Verify TLS configuration, certificate validity, and secure transport to protect data in transit.',
  },
  {
    icon: ShieldCheck,
    title: 'Security Headers',
    description:
      'Analyze HTTP security headers like CSP, HSTS, and X-Frame-Options that defend against common attacks.',
  },
  {
    icon: Cookie,
    title: 'Cookie Security',
    description:
      'Review cookie attributes including Secure, HttpOnly, and SameSite to prevent session hijacking.',
  },
  {
    icon: Globe,
    title: 'Cross-Origin Security',
    description:
      'Check COOP, COEP, and CORP headers that isolate your site and block cross-origin attacks.',
  },
  {
    icon: Server,
    title: 'Browser Protection',
    description:
      'Detect MIME sniffing, clickjacking exposure, referrer leaks, and server information disclosure.',
  },
];

export default function FeatureCards() {
  return (
    <section className="section" aria-labelledby="features-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Capabilities</span>
          <h2 id="features-heading" className="section-title">
            Comprehensive Security Analysis
          </h2>
          <p className="section-description">
            Web Security Assessment evaluates five key areas that matter most for web application security.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article key={title} className="card feature-card">
              <div className="feature-card__icon" aria-hidden="true">
                <Icon size={22} />
              </div>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__description">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
