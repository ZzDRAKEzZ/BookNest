
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../types";
import BookList from "../components/BookList";
import { useAuth } from "../contexts/AuthContext";

function readWishlist(): Book[] {
  try {
    const saved = localStorage.getItem("booknest-wishlist");
    return saved ? (JSON.parse(saved) as Book[]) : [];
  } catch {
    return [];
  }
}

export default function WishlistPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>(readWishlist);

  useEffect(() => {
    localStorage.setItem("booknest-wishlist", JSON.stringify(books));
  }, [books]);

  function toggleWishlist(book: Book) {
    setBooks((current) =>
      current.some((item) => item.key === book.key)
        ? current.filter((item) => item.key !== book.key)
        : [...current, book],
    );
  }

  if (!user) {
    return (
      <main className="app">
        <h1>Избранное</h1>
        <p>Для просмотра избранного необходимо войти.</p>
        <Link to="/login">Перейти ко входу</Link>
      </main>
    );
  }

  return (
    <main className="app">
      <h1>Избранное</h1>
      <p>Здесь находятся сохранённые книги.</p>

      {books.length === 0 ? (
        <p>В избранном пока нет книг.</p>
      ) : (
        <BookList
          books={books}
          wishlist={books}
          onToggleWishlist={toggleWishlist}
        />
      )}
    </main>
  );
}
