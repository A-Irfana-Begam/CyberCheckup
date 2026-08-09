import { OctagonAlert as AlertOctagon, TriangleAlert as AlertTriangle, ShieldAlert, Info, ShieldCheck } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', icon: AlertOctagon, className: 'severity-badge--critical' },
  high: { label: 'High', icon: ShieldAlert, className: 'severity-badge--high' },
  medium: { label: 'Medium', icon: AlertTriangle, className: 'severity-badge--medium' },
  low: { label: 'Low', icon: Info, className: 'severity-badge--low' },
  good: { label: 'Good', icon: ShieldCheck, className: 'severity-badge--good' },
};

export default function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.medium;
  const Icon = config.icon;

  return (
    <span className={`severity-badge ${config.className}`}>
      <Icon size={12} aria-hidden="true" />
      {config.label}
    </span>
  );
}
