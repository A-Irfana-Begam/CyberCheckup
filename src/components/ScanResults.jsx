import { ArrowLeft, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Circle as XCircle, Lightbulb, Shield, ChevronRight } from 'lucide-react';
import ScoreRing from './ScoreRing';
import SeverityBadge from './SeverityBadge';
import FindingCard from './FindingCard';
import { getRatingLevel, getRatingLabel, SEVERITY_RANK } from '../data/demoResults';

const RATING_ICONS = {
  good: CheckCircle2,
  fair: AlertTriangle,
  poor: XCircle,
};

export default function ScanResults({ results, onNewScan }) {
  const {
    url,
    score,
    passed,
    warnings,
    issues,
    findings,
    recommendations,
    scannedAt,
    categories,
    totalChecks,
    critical,
  } = results;
  const ratingLevel = getRatingLevel(score);
  const ratingLabel = getRatingLabel(score);
  const RatingIcon = RATING_ICONS[ratingLevel];

  const formattedDate = new Date(scannedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const sortedFindings = [...findings].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
  );

  return (
    <section className="results" aria-labelledby="results-heading">
      <div className="container">
        <div className="results__header">
          <div className="results__url-info">
            <p className="results__label">Scan Results</p>
            <h1 id="results-heading" className="results__url">
              {url}
            </h1>
            <p className="results__meta">Scanned on {formattedDate} • {totalChecks} checks performed</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onNewScan}>
            <ArrowLeft size={18} aria-hidden="true" />
            New Scan
          </button>
        </div>

        <div className="results__overview">
          <ScoreRing score={score} />

          <div className="results__overview-content">
            <div className={`rating-badge rating-badge--${ratingLevel}`}>
              <RatingIcon size={16} aria-hidden="true" />
              Security Rating: {ratingLabel}
            </div>

            <div className="results__summary">
              <div className="summary-stat">
                <div className="summary-stat__value summary-stat__value--score">{score}</div>
                <div className="summary-stat__label">Score / 100</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat__value summary-stat__value--good">{passed}</div>
                <div className="summary-stat__label">Passed</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat__value summary-stat__value--warn">{warnings}</div>
                <div className="summary-stat__label">Warnings</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat__value summary-stat__value--bad">{issues}</div>
                <div className="summary-stat__label">Issues</div>
              </div>
            </div>
          </div>
        </div>

        {critical > 0 && (
          <div className="results__alert" role="alert">
            <XCircle size={18} aria-hidden="true" />
            <span>
              <strong>{critical} critical {critical === 1 ? 'issue' : 'issues'} detected.</strong>{' '}
              We recommend addressing these first to protect your visitors.
            </span>
          </div>
        )}

        <div className="results__findings">
          <h2 className="results__section-title">
            <Shield size={20} aria-hidden="true" />
            Security Findings
          </h2>
          <p className="results__section-subtitle">
            {findings.length} checks across {categories.length} categories. Tap any finding to see what it means, why it matters, and how to fix it.
          </p>

          {categories.map((category) => {
            const categoryFindings = sortedFindings.filter((f) => f.category === category);
            if (categoryFindings.length === 0) return null;
            return (
              <div key={category} className="finding-group">
                <h3 className="finding-group__title">{category}</h3>
                <div className="finding-group__list">
                  {categoryFindings.map((finding) => (
                    <FindingCard key={finding.id} finding={finding} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="recommendations">
          <h2 className="results__section-title">
            <Lightbulb size={20} aria-hidden="true" />
            Priority Recommendations
          </h2>
          <p className="results__section-subtitle">
            Sorted by importance. Start at the top and work your way down to strengthen your defenses.
          </p>

          {recommendations.length === 0 ? (
            <div className="recommendations__empty">
              <CheckCircle2 size={28} aria-hidden="true" />
              <p>No recommendations needed — your website passed every check. Excellent work!</p>
            </div>
          ) : (
            <div className="recommendations__list">
              {recommendations.map((rec, index) => (
                <article key={rec.id} className={`recommendation-item recommendation-item--${rec.severity}`}>
                  <div className="recommendation-item__rank">{index + 1}</div>
                  <div className="recommendation-item__content">
                    <div className="recommendation-item__heading">
                      <h3 className="recommendation-item__title">{rec.title}</h3>
                      <SeverityBadge severity={rec.severity} />
                    </div>
                    <p className="recommendation-item__text">{rec.text}</p>
                    <span className="recommendation-item__priority">
                      <ChevronRight size={14} aria-hidden="true" />
                      {rec.priority}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
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
