
export function filterBooks(books, filters) {
  const query = filters.query.trim().toLocaleLowerCase("ru");

  return books.filter((book) => {
    const matchesQuery =
      book.title.toLocaleLowerCase("ru").includes(query) ||
      book.author.toLocaleLowerCase("ru").includes(query);

    const matchesGenre =
      !filters.genre || book.genre === filters.genre;

    const matchesAvailability =
      !filters.availableOnly || book.available;

    return matchesQuery && matchesGenre && matchesAvailability;
  });
}

export function sortBooks(books, sortBy) {
  const result = [...books];

  switch (sortBy) {
    case "title":
      return result.sort((a, b) =>
        a.title.localeCompare(b.title, "ru")
      );

    case "year":
      return result.sort((a, b) => b.year - a.year);

    case "rating":
      return result.sort((a, b) => b.rating - a.rating);

    default:
      return result;
  }
}

export function getBooks(books, filters) {
  return sortBooks(filterBooks(books, filters), filters.sortBy);
}
