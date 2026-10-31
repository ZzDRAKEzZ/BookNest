
import type { Book } from "../types";
import Badge from "./Badge";
import Button from "./Button";

interface BookCardProps {
  book: Book;
  isInWishlist: boolean;
  onToggleWishlist: (book: Book) => void;
}

export default function BookCard({
  book,
  isInWishlist,
  onToggleWishlist,
}: BookCardProps) {
  const author = book.author_name?.join(", ") || "Автор не указан";

  return (
    <article className="book-card">
      {book.cover_i && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
          alt={`Обложка книги ${book.title}`}
          loading="lazy"
        />
      )}

      <div className="book-card__content">
        <h2>{book.title}</h2>
        <p>{author}</p>

        {book.first_publish_year && (
          <p>Год издания: {book.first_publish_year}</p>
        )}

        {book.subject?.[0] && (
          <Badge>{book.subject[0]}</Badge>
        )}

        <Button onClick={() => onToggleWishlist(book)}>
          {isInWishlist ? "Убрать из желаемого" : "В желаемое"}
        </Button>
      </div>
    </article>
  );
}
