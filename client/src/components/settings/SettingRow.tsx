import type { ReactNode } from 'react';

type SettingRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
};

export function SettingRow({
  icon,
  title,
  description,
  action,
}: SettingRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-accent border border-accent rounded-xl">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h5 className="text-xs font-bold text-foreground">{title}</h5>
          <p className="text-[11px] text-secondary">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
