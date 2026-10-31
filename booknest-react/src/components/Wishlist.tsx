
import type { Book } from "../types";
import BookList from "./BookList";
import EmptyState from "./EmptyState";

interface WishlistProps {
  books: Book[];
  onToggleWishlist: (book: Book) => void;
}

export default function Wishlist({
  books,
  onToggleWishlist,
}: WishlistProps) {
  return (
    <section className="wishlist">
      <h2>Избранные книги ({books.length})</h2>

      {books.length === 0 ? (
        <EmptyState
          title="Список пуст"
          message="Добавляй книги из каталога, чтобы сохранить их здесь."
        />
      ) : (
        <BookList
          books={books}
          wishlist={books}
          onToggleWishlist={onToggleWishlist}
        />
      )}
    </section>
  );
}
