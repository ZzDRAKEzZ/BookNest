
interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "Книги не найдены",
  message = "Попробуйте изменить поисковый запрос или фильтры.",
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
