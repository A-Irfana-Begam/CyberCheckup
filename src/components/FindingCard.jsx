import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function FindingCard({ finding }) {
  const [expanded, setExpanded] = useState(false);
  const isIssue = finding.status !== 'pass';

  return (
    <article className={`finding-card${isIssue ? ' finding-card--issue' : ''}`}>
      <button
        type="button"
        className="finding-card__header"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls={`finding-detail-${finding.id}`}
      >
        <div className="finding-card__heading">
          <div className="finding-card__category">{finding.category}</div>
          <h3 className="finding-card__name">{finding.name}</h3>
          <p className="finding-card__result">{finding.result}</p>
        </div>
        <div className="finding-card__meta">
          <SeverityBadge severity={finding.severity} />
          <span className="finding-card__chevron" aria-hidden="true">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </button>

      {expanded && (
        <div id={`finding-detail-${finding.id}`} className="finding-card__detail">
          <div className="finding-detail__item">
            <h4 className="finding-detail__label">What we found</h4>
            <p className="finding-detail__text">{finding.what}</p>
          </div>
          <div className="finding-detail__item">
            <h4 className="finding-detail__label">Why it matters</h4>
            <p className="finding-detail__text">{finding.why}</p>
          </div>
          <div className="finding-detail__item">
            <h4 className="finding-detail__label">How to fix</h4>
            <p className="finding-detail__text">{finding.fix}</p>
          </div>
          <div className="finding-detail__item">
            <h4 className="finding-detail__label">Priority</h4>
            <span className={`finding-detail__priority finding-detail__priority--${finding.severity}`}>
              {finding.priority}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
