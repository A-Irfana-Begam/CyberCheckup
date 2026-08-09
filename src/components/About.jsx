import { Eye, Shield, Zap } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Shield,
    title: 'Defensive by Design',
    text: 'Built for security teams and developers who want visibility without exploitation.',
  },
  {
    icon: Eye,
    title: 'Non-Invasive Scanning',
    text: 'Passive analysis only — no brute force, no credential testing, no harmful probes.',
  },
  {
    icon: Zap,
    title: 'Actionable Insights',
    text: 'Clear scores, categorized findings, and prioritized recommendations you can act on.',
  },
];

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">About</span>
          <h2 id="about-heading" className="section-title">
            Security Visibility, Simplified
          </h2>
        </div>

        <div className="about__content">
          <div className="about__text">
            <p>
              Web Security Assessment is a modern web security health scanner designed to give website
              owners and developers a clear, honest assessment of their defensive posture.
            </p>
            <p>
              Instead of overwhelming you with raw data, we translate security signals into
              an easy-to-understand score with categorized checks and practical recommendations
              — so you know exactly where to focus your efforts.
            </p>
            <p>
              Our approach is privacy-first and non-invasive. We analyze publicly accessible
              security indicators without requiring passwords, credentials, or intrusive testing.
            </p>
          </div>

          <div className="about__highlights">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card about__highlight">
                <div className="about__highlight-icon" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <div className="about__highlight-text">
                  <strong>{title}</strong>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
