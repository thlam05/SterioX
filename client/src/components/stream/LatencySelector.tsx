import { STREAM_LATENCY } from '@/constants/streamSetup';

type LatencySelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const latencyOptions = [
  { id: STREAM_LATENCY.NORMAL, label: 'Thường' },
  { id: STREAM_LATENCY.LOW, label: 'Thấp' },
  { id: STREAM_LATENCY.ULTRA, label: 'Cực thấp' },
];

export function LatencySelector({ value, onChange }: LatencySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-secondary uppercase">
        Độ trễ (Latency)
      </label>
      <div className="flex p-1 bg-accent rounded-xl border border-accent">
        {latencyOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${value === opt.id ? 'bg-background text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
