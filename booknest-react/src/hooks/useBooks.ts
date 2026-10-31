
import { useCallback, useEffect, useState } from "react";
import { searchBooks } from "../api/booksApi";
import type { Book } from "../types";

interface UseBooksResult {
  books: Book[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBooks(
  query: string,
  page: number,
): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const refetch = useCallback(() => {
    setReload((previous) => previous + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setLoading(true);
      setError(null);

      try {
        const result = await searchBooks(
          query,
          page,
          controller.signal,
        );

        setBooks(result.docs);
        setTotal(result.numFound);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить книги",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      controller.abort();
    };
  }, [query, page, reload]);

  return {
    books,
    total,
    loading,
    error,
    refetch,
  };
}
