import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CalloutType = 'info' | 'warning' | 'success' | 'danger';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const styles: Record<CalloutType, { bg: string; border: string; icon: string; label: string }> = {
  info: {
    bg: 'bg-accent/5',
    border: 'border-accent/30',
    icon: 'ℹ',
    label: 'Info',
  },
  warning: {
    bg: 'bg-yellow-500/5',
    border: 'border-yellow-500/30',
    icon: '⚠',
    label: 'Warning',
  },
  success: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/30',
    icon: '✓',
    label: 'Success',
  },
  danger: {
    bg: 'bg-red-500/5',
    border: 'border-red-500/30',
    icon: '✕',
    label: 'Danger',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = styles[type];

  return (
    <div
      className={cn(
        'my-6 rounded border-l-2 px-5 py-4',
        style.bg,
        style.border
      )}
    >
      <div className="mb-1 flex items-center gap-2 font-medium text-text-primary">
        <span className="text-base">{style.icon}</span>
        <span>{title || style.label}</span>
      </div>
      <div className="text-sm leading-relaxed text-text-secondary [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}