
interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBox({
  message,
  onRetry,
}: ErrorBoxProps) {
  return (
    <div className="error-box" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}
