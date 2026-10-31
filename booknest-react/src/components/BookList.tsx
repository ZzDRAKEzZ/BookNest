
import type { Book } from "../types";
import BookCard from "./BookCard";

interface BookListProps {
  books: Book[];
  wishlist: Book[];
  onToggleWishlist: (book: Book) => void;
}

export default function BookList({
  books,
  wishlist,
  onToggleWishlist,
}: BookListProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="book-list" aria-label="Каталог книг">
      {books.map((book) => (
        <BookCard
          key={book.key}
          book={book}
          isInWishlist={wishlist.some((item) => item.key === book.key)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </section>
  );
}
