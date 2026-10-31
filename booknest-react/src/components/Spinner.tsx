
interface SpinnerProps {
  message?: string;
}

export default function Spinner({
  message = "Загрузка книг...",
}: SpinnerProps) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__icon" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
