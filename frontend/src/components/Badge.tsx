import clsx from 'clsx';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple';

const variantMap: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
};

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  dot?: boolean;
}

export default function Badge({ label, variant, dot }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full', variantMap[variant])}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-emerald-500': variant === 'success',
        'bg-red-500': variant === 'danger',
        'bg-amber-500': variant === 'warning',
        'bg-blue-500': variant === 'info',
        'bg-gray-400': variant === 'neutral',
        'bg-purple-500': variant === 'purple',
      })} />}
      {label}
    </span>
  );
}
