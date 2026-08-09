import { ArrowUp, Search } from 'lucide-react';

export default function CTASection({ onStartScan }) {
  const scrollToHero = () => {
    onStartScan?.();
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section cta" aria-labelledby="cta-heading">
      <div className="container cta__inner">
        <h2 id="cta-heading" className="cta__title">
          Ready to Check Your Security Health?
        </h2>
        <p className="cta__description">
          Get a comprehensive security assessment in seconds. No signup required —
          just enter your URL and start improving your defenses today.
        </p>
        <div className="cta__actions">
          <button type="button" className="btn btn-primary" onClick={scrollToHero}>
            <Search size={18} aria-hidden="true" />
            Scan Your Website
          </button>
          <a href="#how-it-works" className="btn btn-secondary">
            <ArrowUp size={18} aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
            Learn How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
