interface AlertErrorProps {
  message: string;
  className?: string;
}

export const AlertError = ({ message, className = "" }: AlertErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={`rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 ${className}`}
    >
      {message}
    </div>
  );
};
