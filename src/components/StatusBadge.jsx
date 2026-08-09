import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pass: { label: 'Passed', icon: CheckCircle2, className: 'status-badge--pass' },
  warn: { label: 'Warning', icon: AlertTriangle, className: 'status-badge--warn' },
  fail: { label: 'Issue', icon: XCircle, className: 'status-badge--fail' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.warn;
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`}>
      <Icon size={12} aria-hidden="true" />
      {config.label}
    </span>
  );
}
