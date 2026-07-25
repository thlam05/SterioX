import { PRIVACY_OPTIONS } from '@/constants/streamSetup';

type PrivacySelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PrivacySelector({ value, onChange }: PrivacySelectorProps) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
        Quyền riêng tư
      </label>
      <div className="space-y-3">
        {PRIVACY_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = value === item.id;
          return (
            <label
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-primary/50 ${isSelected ? 'border-primary bg-selection' : 'border-accent'}`}
            >
              <input
                type="radio"
                name="status"
                className="hidden"
                checked={isSelected}
                onChange={() => onChange(item.id)}
              />
              <Icon
                className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-secondary'}`}
              />
              <div className="flex-grow">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-[10px] text-secondary">{item.desc}</p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-accent'}`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
