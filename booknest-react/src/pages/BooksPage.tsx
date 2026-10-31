
import { useEffect, useMemo, useState } from "react";
import type { Book, Filters } from "../types";
import { useBooks } from "../hooks/useBooks";
import { useDebounce } from "../hooks/useDebounce";
import Header from "../components/Header";
import FiltersPanel from "../components/FiltersPanel";
import BookList from "../components/BookList";
import Wishlist from "../components/Wishlist";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import ErrorBox from "../components/ErrorBox";
import "../App.css";

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

export default function BooksPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const [wishlist, setWishlist] = useState<Book[]>(readWishlist);

  const debouncedQuery = useDebounce(filters.query, 350);

  const {
    books,
    total,
    loading,
    error,
    refetch,
  } = useBooks(debouncedQuery, page);

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
      result = result.filter(
        (book) =>
          book.available === true ||
          book.availability?.available === true,
      );
    }

    result.sort((a, b) => {
      if (filters.sortBy === "year") {
        return (b.first_publish_year ?? 0) -
          (a.first_publish_year ?? 0);
      }

      if (filters.sortBy === "rating") {
        return (b.ratings_average ?? 0) -
          (a.ratings_average ?? 0);
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
        Найдено книг: {total.toLocaleString("ru-RU")}
      </p>

      {loading && <Spinner />}

      {!loading && error && (
        <ErrorBox message={error} onRetry={refetch} />
      )}

      {!loading && !error && books.length === 0 && <EmptyState />}

      {!loading && !error && books.length > 0 && (
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
            totalPages={Math.max(1, Math.ceil(total / 12))}
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
