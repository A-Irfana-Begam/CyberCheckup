import { useState, useEffect } from 'react';
import { Globe, Lock, Loader2, Search, ShieldAlert } from 'lucide-react';

const LOADING_STEPS = [
  'Checking HTTPS & TLS',
  'Analyzing security headers',
  'Reviewing cookie settings',
  'Scanning configuration',
];

export default function Hero({ url, onUrlChange, onScan, scanState, error }) {
  const isLoading = scanState === 'loading';
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setActiveStep(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 550);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onScan();
  };

  return (
    <section id="home" className="hero">
      <div className="container hero__inner">
        <div className="hero__badge">
          <span className="badge">Defensive Web Security</span>
        </div>

        <h1 className="hero__title">
          Know Your Website&apos;s{' '}
          <span className="hero__title-accent">Security Health.</span>
        </h1>

        <p className="hero__description">
          Web Security Assessment performs a non-invasive security analysis of your website —
          checking HTTPS, headers, cookies, and configuration to give you a clear
          picture of your defensive posture.
        </p>

        <form className="hero__form" onSubmit={handleSubmit} noValidate>
          <div className="hero__input-group">
            <div className="hero__input-wrapper">
              <Globe className="hero__input-icon" size={18} aria-hidden="true" />
              <label htmlFor="website-url" className="sr-only">
                Website URL
              </label>
              <input
                id="website-url"
                type="url"
                className={`hero__input${error ? ' hero__input--error' : ''}`}
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                disabled={isLoading}
                autoComplete="url"
                inputMode="url"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'url-error' : 'url-privacy'}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary hero__submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} aria-hidden="true" />
                  Scanning…
                </>
              ) : (
                <>
                  <Search size={18} aria-hidden="true" />
                  Scan Website
                </>
              )}
            </button>
          </div>

          <p id="url-privacy" className="hero__privacy">
            <Lock size={14} aria-hidden="true" />
            Non-invasive analysis &bull; No passwords required
          </p>

          {error && (
            <div id="url-error" className="hero__error" role="alert">
              <ShieldAlert size={16} aria-hidden="true" />
              {error}
            </div>
          )}
        </form>

        {isLoading && (
          <div className="hero__loading animate-fade-in" role="status" aria-live="polite">
            <div className="hero__loading-visual" aria-hidden="true">
              <div className="hero__loading-ring" />
              <div className="hero__loading-ring hero__loading-ring--inner" />
              <div className="hero__loading-core" />
            </div>
            <p className="hero__loading-text">Analyzing security configuration…</p>
            <div className="hero__loading-steps">
              {LOADING_STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`hero__loading-step${i === activeStep ? ' hero__loading-step--active' : ''}`}
                >
                  <span className="hero__loading-step-dot" />
                  {step}
                </div>
              ))}
            </div>
            <p className="hero__loading-subtext">
              This may take a few seconds
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
