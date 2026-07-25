export function LoadingSpinner() {
  return (
    <div className="w-full bg-background text-foreground font-sans flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
