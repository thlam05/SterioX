import { Input } from '@/components/ui/Input';

type EmailFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function EmailField({ value, onChange, error }: EmailFieldProps) {
  return (
    <div>
      <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
        Địa chỉ Email
      </label>
      <Input
        type="text"
        placeholder="example@email.com"
        value={value}
        error={!!error}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
