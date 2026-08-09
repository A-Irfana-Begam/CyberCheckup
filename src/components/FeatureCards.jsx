import { Cookie, Globe, Lock, Server, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Lock,
    title: 'Transport Security',
    description:
      'Verifies HTTPS, TLS certificate validity, and HSTS to ensure data traveling between your visitors and your site stays encrypted and protected.',
  },
  {
    icon: ShieldCheck,
    title: 'Security Headers',
    description:
      'Checks Content-Security-Policy, X-Frame-Options, and other browser security headers that defend against script injection and clickjacking.',
  },
  {
    icon: Cookie,
    title: 'Cookie Security',
    description:
      'Reviews cookie attributes like Secure, HttpOnly, and SameSite to prevent session hijacking and cross-site request forgery.',
  },
  {
    icon: Globe,
    title: 'Cross-Origin Security',
    description:
      'Evaluates COOP, COEP, and CORP headers that isolate your site from malicious origins and block cross-origin attack vectors.',
  },
  {
    icon: Server,
    title: 'Browser Protection',
    description:
      'Detects MIME sniffing risks, clickjacking exposure, referrer leaks, and server information disclosure that help attackers target you.',
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="section" aria-labelledby="features-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Capabilities</span>
          <h2 id="features-heading" className="section-title">
            Five Layers of Security Analysis
          </h2>
          <p className="section-description">
            CyberCheckup evaluates five key areas that matter most for your website&apos;s
            defensive posture — 18 checks total, all completely free.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="card feature-card"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="feature-card__top">
                <div className="feature-card__icon" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <span className="feature-card__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__description">{description}</p>
              <div className="feature-card__bar" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
