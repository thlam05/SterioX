type RememberMeCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function RememberMeCheckbox({
  checked,
  onChange,
}: RememberMeCheckboxProps) {
  return (
    <div className="flex items-center pt-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="remember"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-accent text-primary focus:ring-primary-light cursor-pointer"
        />
        <label
          htmlFor="remember"
          className="text-xs text-secondary font-medium cursor-pointer select-none"
        >
          Ghi nhớ đăng nhập
        </label>
      </div>
    </div>
  );
}
