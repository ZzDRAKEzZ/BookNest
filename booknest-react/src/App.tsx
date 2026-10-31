
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Book, Filters, LoadStatus } from "./types";
import { searchBooks } from "./api/booksApi";
import Header from "./components/Header";
import FiltersPanel from "./components/FiltersPanel";
import BookList from "./components/BookList";
import Wishlist from "./components/Wishlist";
import Pagination from "./components/Pagination";
import Spinner from "./components/Spinner";
import EmptyState from "./components/EmptyState";
import ErrorBox from "./components/ErrorBox";
import "./App.css";

const initialFilters: Filters = {
  query: "fantasy",
  genre: "",
  sortBy: "title",
  availableOnly: false,
};

function readWishlist(): Book[] {
  try {
    const saved = localStorage.getItem("booknest-wishlist");
    return saved ? (JSON.parse(saved) as Book[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState<Book[]>(readWishlist);

  const loadBooks = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const result = await searchBooks(filters.query, page);
      setBooks(result.docs);
      setTotalBooks(result.numFound);
      setStatus(result.docs.length > 0 ? "success" : "empty");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось загрузить книги",
      );
      setStatus("error");
    }
  }, [filters.query, page]);

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setStatus("loading");
      setError("");

      try {
        const result = await searchBooks(filters.query, page);

        if (cancelled) return;

        setBooks(result.docs);
        setTotalBooks(result.numFound);
        setStatus(result.docs.length > 0 ? "success" : "empty");
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить книги",
        );
        setStatus("error");
      }
    }

    void fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [filters.query, page]);

  useEffect(() => {
    localStorage.setItem("booknest-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const genres = useMemo(
    () =>
      [...new Set(books.flatMap((book) => book.subject ?? []))]
        .sort()
        .slice(0, 30),
    [books],
  );

  const visibleBooks = useMemo(() => {
    let result = [...books];

    if (filters.genre) {
      result = result.filter((book) =>
        book.subject?.includes(filters.genre),
      );
    }

    if (filters.availableOnly) {
      result = result.filter((book) => book.available === true);
    }

    result.sort((a, b) => {
      if (filters.sortBy === "year") {
        return (b.first_publish_year ?? 0) - (a.first_publish_year ?? 0);
      }

      if (filters.sortBy === "rating") {
        return (b.ratings_average ?? 0) - (a.ratings_average ?? 0);
      }

      return a.title.localeCompare(b.title);
    });

    return result;
  }, [books, filters.genre, filters.availableOnly, filters.sortBy]);

  function updateFilters(nextFilters: Filters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function toggleWishlist(book: Book) {
    setWishlist((current) =>
      current.some((item) => item.key === book.key)
        ? current.filter((item) => item.key !== book.key)
        : [...current, book],
    );
  }

  return (
    <main className="app">
      <Header wishlistCount={wishlist.length} />

      <FiltersPanel
        filters={filters}
        genres={genres}
        onFiltersChange={updateFilters}
        onReset={() => updateFilters(initialFilters)}
      />

      <p className="results-count">
        Найдено книг: {totalBooks.toLocaleString("ru-RU")}
      </p>

      {status === "loading" && <Spinner />}

      {status === "error" && (
        <ErrorBox
          message={error}
          onRetry={() => void loadBooks()}
        />
      )}

      {status === "empty" && <EmptyState />}

      {status === "success" && (
        <>
          {visibleBooks.length > 0 ? (
            <BookList
              books={visibleBooks}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          ) : (
            <EmptyState
              title="Нет совпадений"
              message="Попробуйте изменить фильтры."
            />
          )}

          <Pagination
            currentPage={page}
            totalPages={Math.max(1, Math.ceil(totalBooks / 12))}
            onPageChange={setPage}
          />
        </>
      )}

      <Wishlist
        books={wishlist}
        onToggleWishlist={toggleWishlist}
      />
    </main>
  );
}
