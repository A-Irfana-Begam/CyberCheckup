import { getRatingLevel } from '../data/demoResults';

export default function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;
  const level = getRatingLevel(score);

  return (
    <div className="score-ring" role="img" aria-label={`Security score: ${score} out of 100`}>
      <div className="score-ring__glow" aria-hidden="true" />
      <svg className="score-ring__svg" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id="scoreGradientGood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="scoreGradientFair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="scoreGradientPoor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
        <circle className="score-ring__bg" cx="60" cy="60" r={radius} />
        <circle
          className={`score-ring__progress score-ring__progress--${level}`}
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring__value">
        <span className="score-ring__number">{score}</span>
        <span className="score-ring__max">/ 100</span>
      </div>
    </div>
  );
}
