import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Shield,
} from 'lucide-react';
import ScoreRing from './ScoreRing';
import StatusBadge from './StatusBadge';
import { getRatingLevel, getRatingLabel } from '../data/demoResults';

const RATING_ICONS = {
  good: CheckCircle2,
  fair: AlertTriangle,
  poor: XCircle,
};

export default function ScanResults({ results, onNewScan }) {
  const { url, score, passed, warnings, issues, checks, recommendations, scannedAt } = results;
  const ratingLevel = getRatingLevel(score);
  const ratingLabel = getRatingLabel(score);
  const RatingIcon = RATING_ICONS[ratingLevel];

  const formattedDate = new Date(scannedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <section className="results" aria-labelledby="results-heading">
      <div className="container">
        <div className="results__header">
          <div className="results__url-info">
            <p className="results__label">Scan Results</p>
            <h1 id="results-heading" className="results__url">
              {url}
            </h1>
            <p className="results__meta">Scanned on {formattedDate}</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onNewScan}>
            <ArrowLeft size={18} aria-hidden="true" />
            New Scan
          </button>
        </div>

        <div className="results__overview">
          <ScoreRing score={score} />

          <div>
            <div className={`rating-badge rating-badge--${ratingLevel}`}>
              <RatingIcon size={16} aria-hidden="true" />
              Security Rating: {ratingLabel}
            </div>

            <div className="results__summary">
              <div className="card summary-stat">
                <div className="summary-stat__value summary-stat__value--score">{score}</div>
                <div className="summary-stat__label">Score / 100</div>
              </div>
              <div className="card summary-stat">
                <div className="summary-stat__value summary-stat__value--good">{passed}</div>
                <div className="summary-stat__label">Passed Checks</div>
              </div>
              <div className="card summary-stat">
                <div className="summary-stat__value summary-stat__value--warn">{warnings}</div>
                <div className="summary-stat__label">Warnings</div>
              </div>
              <div className="card summary-stat">
                <div className="summary-stat__value summary-stat__value--bad">{issues}</div>
                <div className="summary-stat__label">Issues</div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="results__section-title">
          <Shield size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} aria-hidden="true" />
          Security Checks
        </h2>
        <div className="results__checks">
          {checks.map((check) => (
            <article key={check.id} className="card check-card">
              <div className="check-card__header">
                <div>
                  <p className="check-card__category">{check.category}</p>
                  <h3 className="check-card__title">{check.title}</h3>
                </div>
                <StatusBadge status={check.status} />
              </div>
              <p className="check-card__description">{check.description}</p>
            </article>
          ))}
        </div>

        <div className="recommendations">
          <h2 className="results__section-title">
            <Lightbulb size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} aria-hidden="true" />
            Recommendations
          </h2>
          <div className="recommendations__list">
            {recommendations.map((rec) => (
              <article key={rec.id} className="card recommendation-item">
                <div className="recommendation-item__icon" aria-hidden="true">
                  <Lightbulb size={16} />
                </div>
                <div className="recommendation-item__content">
                  <h3 className="recommendation-item__title">{rec.title}</h3>
                  <p className="recommendation-item__text">{rec.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="results__actions">
          <button type="button" className="btn btn-primary" onClick={onNewScan}>
            <ArrowLeft size={18} aria-hidden="true" />
            Scan Another Website
          </button>
        </div>
      </div>
    </section>
  );
}
