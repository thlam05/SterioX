type TermsCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  return (
    <div>
      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="terms"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary-light"
        />
        <label
          htmlFor="terms"
          className="text-xs text-secondary leading-relaxed"
        >
          Tôi đồng ý với{' '}
          <a href="#" className="underline text-foreground font-medium">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="underline text-foreground font-medium">
            Chính sách bảo mật
          </a>{' '}
          của SterioX.
        </label>
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
