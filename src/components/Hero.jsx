import { useState, useEffect, useRef } from 'react';
import { Globe, Lock, Loader as Loader2, Search, ShieldAlert, ShieldCheck, CircleCheck as CheckCircle2, Zap } from 'lucide-react';

const LOADING_STEPS = [
  { label: 'Connecting to website', detail: 'Establishing a secure connection' },
  { label: 'Checking HTTPS', detail: 'Verifying TLS certificate and transport' },
  { label: 'Analyzing security headers', detail: 'Reviewing CSP, HSTS, and frame protection' },
  { label: 'Checking cookie security', detail: 'Inspecting Secure, HttpOnly, and SameSite flags' },
  { label: 'Checking cross-origin protections', detail: 'Evaluating COOP, COEP, and CORP' },
  { label: 'Reviewing browser protections', detail: 'Checking MIME, clickjacking, and referrer policies' },
  { label: 'Preparing security report', detail: 'Compiling your findings and recommendations' },
];

const TRUST_BADGES = [
  { icon: CheckCircle2, text: 'No login required' },
  { icon: Zap, text: 'Results in seconds' },
  { icon: ShieldCheck, text: 'Completely free' },
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
      <div className="hero__scan-line" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="badge">
              <ShieldCheck size={12} aria-hidden="true" />
              Free Web Security Scanner
            </span>
          </div>

          <h1 className="hero__title">
            Check Your Website&apos;s{' '}
            <span className="hero__title-accent">Security Health</span>
            {' '}in Seconds
          </h1>

          <p className="hero__description">
            Enter any website URL and get a clear, easy-to-understand security report.
            No technical knowledge needed — we translate complex security signals into
            plain language with actionable recommendations.
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
                  placeholder="example.com"
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

            <div className="hero__trust-row">
              <p id="url-privacy" className="hero__privacy">
                <Lock size={14} aria-hidden="true" />
                Non-invasive analysis — no credentials needed
              </p>
              <div className="hero__trust-badges">
                {TRUST_BADGES.map(({ icon: Icon, text }) => (
                  <span key={text} className="hero__trust-badge">
                    <Icon size={14} aria-hidden="true" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

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

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__terminal">
            <div className="hero__terminal-bar">
              <div className="hero__terminal-dot hero__terminal-dot--red" />
              <div className="hero__terminal-dot hero__terminal-dot--yellow" />
              <div className="hero__terminal-dot hero__terminal-dot--green" />
              <span className="hero__terminal-title">security-check.sh</span>
            </div>
            <div className="hero__terminal-body">
              <div className="hero__terminal-line">
                <span className="hero__terminal-prompt">$</span> cybercheckup scan example.com
              </div>
              <div className="hero__terminal-line hero__terminal-line--muted">
                Connecting to example.com…
              </div>
              <div className="hero__terminal-line hero__terminal-line--ok">
                ✓ HTTPS: TLS 1.3 encrypted
              </div>
              <div className="hero__terminal-line hero__terminal-line--ok">
                ✓ HSTS: max-age=31536000
              </div>
              <div className="hero__terminal-line hero__terminal-line--warn">
                ! CSP: header not detected
              </div>
              <div className="hero__terminal-line hero__terminal-line--warn">
                ! X-Frame-Options: missing
              </div>
              <div className="hero__terminal-line hero__terminal-line--ok">
                ✓ Cookies: Secure + HttpOnly
              </div>
              <div className="hero__terminal-line hero__terminal-line--muted">
                Generating report…
              </div>
              <div className="hero__terminal-line hero__terminal-line--result">
                Score: 72/100 — Good
              </div>
              <div className="hero__terminal-line">
                <span className="hero__terminal-prompt">$</span>
                <span className="hero__terminal-cursor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
