import type { StatItem } from '@/constants/streamDashboard';

type StatCardProps = {
  stat: StatItem;
  isActive?: boolean;
  dynamicValue?: string | number;
};

export function StatCard({ stat, isActive, dynamicValue }: StatCardProps) {
  const Icon = stat.icon;
  const displayValue = dynamicValue ?? stat.value;

  return (
    <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl bg-accent flex items-center justify-center ${stat.iconColor}`}
      >
        <Icon
          className={`w-5 h-5 ${stat.icon === stat.icon ? '' : ''} ${isActive ? 'animate-pulse' : ''}`}
        />
      </div>
      <div>
        <p className="text-xs text-secondary font-medium">{stat.label}</p>
        <span
          className={`text-sm font-black flex items-center gap-1 ${
            isActive ? 'text-danger' : 'text-secondary'
          }`}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}
