
import type { Book, BooksResponse } from "../types";

const API_URL = "https://openlibrary.org/search.json";

export async function searchBooks(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<BooksResponse> {
  const params = new URLSearchParams({
    q: query.trim() || "fiction",
    page: String(page),
    limit: "12",
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки книг: ${response.status}`);
  }

  const data: BooksResponse = await response.json();

  return {
    docs: data.docs as Book[],
    numFound: data.numFound,
  };
}
