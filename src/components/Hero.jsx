import { useState, useEffect, useRef } from 'react';
import { Globe, Lock, Loader as Loader2, Search, ShieldAlert } from 'lucide-react';

const LOADING_STEPS = [
  { label: 'Connecting to website', detail: 'Establishing a secure connection' },
  { label: 'Checking HTTPS', detail: 'Verifying TLS certificate and transport' },
  { label: 'Analyzing security headers', detail: 'Reviewing CSP, HSTS, and frame protection' },
  { label: 'Checking cookie security', detail: 'Inspecting Secure, HttpOnly, and SameSite flags' },
  { label: 'Checking cross-origin protections', detail: 'Evaluating COOP, COEP, and CORP' },
  { label: 'Reviewing browser protections', detail: 'Checking MIME, clickjacking, and referrer policies' },
  { label: 'Preparing security report', detail: 'Compiling your findings and recommendations' },
];

export default function Hero({ url, onUrlChange, onScan, scanState, error }) {
  const isLoading = scanState === 'loading';
  const [activeStep, setActiveStep] = useState(0);
  const wasLoading = useRef(false);

  useEffect(() => {
    if (!isLoading) {
      wasLoading.current = false;
      return undefined;
    }

    wasLoading.current = true;
    const stepDuration = 2200 / LOADING_STEPS.length;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, stepDuration);

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
          Understand Your Website&apos;s{' '}
          <span className="hero__title-accent">Security.</span>
        </h1>

        <p className="hero__description">
          Analyze common web security configurations, identify weaknesses, and get clear
          recommendations to improve your website&apos;s protection.
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
                placeholder="Enter website URL"
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
                  Analyze Security
                </>
              )}
            </button>
          </div>

          <p id="url-privacy" className="hero__privacy">
            <Lock size={14} aria-hidden="true" />
            Non-invasive analysis &bull; No credentials required
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
            <div className="hero__loading-content">
              <p className="hero__loading-text">{LOADING_STEPS[activeStep].label}…</p>
              <p className="hero__loading-subtext">{LOADING_STEPS[activeStep].detail}</p>
            </div>
            <div className="hero__loading-steps">
              {LOADING_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className={`hero__loading-step${i === activeStep ? ' hero__loading-step--active' : ''}${i < activeStep ? ' hero__loading-step--done' : ''}`}
                >
                  <span className="hero__loading-step-dot" />
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
