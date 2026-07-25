type FormAlertProps = {
  message: string;
};

export function FormAlert({ message }: FormAlertProps) {
  return (
    <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
      {message}
    </p>
  );
}
