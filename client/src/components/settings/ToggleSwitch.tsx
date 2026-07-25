type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary"
    />
  );
}
