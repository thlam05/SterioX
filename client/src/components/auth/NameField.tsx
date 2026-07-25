import { Input } from '@/components/ui/Input';

type NameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function NameField({ value, onChange, error }: NameFieldProps) {
  return (
    <div>
      <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
        Họ và tên
      </label>
      <Input
        type="text"
        placeholder="Nhập họ và tên của bạn"
        value={value}
        error={!!error}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
