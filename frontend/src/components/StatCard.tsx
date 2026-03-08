import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'cyan';
  subtitle?: string;
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  yellow: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  cyan: 'bg-cyan-50 text-cyan-600',
};

export default function StatCard({
  title, value, icon: Icon, change, changeType = 'neutral', color = 'blue', subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('p-2.5 rounded-lg', colorMap[color])}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={clsx('text-xs font-medium px-2 py-1 rounded-full', {
            'bg-emerald-50 text-emerald-700': changeType === 'positive',
            'bg-red-50 text-red-700': changeType === 'negative',
            'bg-gray-50 text-gray-600': changeType === 'neutral',
          })}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
