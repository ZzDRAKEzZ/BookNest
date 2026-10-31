
export function renderBooks(container, books, wishlist) {
  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    const card = document.createElement("article");
    card.className = "book-card";
    card.dataset.bookId = String(book.id);

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `Автор: ${book.author}`;

    const details = document.createElement("p");
    details.textContent =
      `Год: ${book.year} · Жанр: ${book.genre} · Рейтинг: ${book.rating}`;

    const availability = document.createElement("p");
    availability.textContent = book.available
      ? "Доступна"
      : "Нет в наличии";

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = "wishlist";
    button.setAttribute("aria-pressed", String(wishlist.includes(book.id)));

    const isSaved = wishlist.includes(book.id);
    button.textContent = isSaved ? "В моём списке" : "Хочу прочитать";
    button.classList.toggle("is-saved", isSaved);

    card.append(title, author, details, availability, button);
    fragment.append(card);
  });

  container.replaceChildren(fragment);
}

export function renderWishlist(container, books, wishlist) {
  const fragment = document.createDocumentFragment();
  const savedBooks = books.filter((book) => wishlist.includes(book.id));

  savedBooks.forEach((book) => {
    const item = document.createElement("li");
    item.dataset.bookId = String(book.id);

    const title = document.createElement("span");
    title.textContent = `${book.title} — ${book.author}`;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = "remove-wishlist";
    button.textContent = "Удалить";
    button.setAttribute("aria-label", `Удалить книгу ${book.title}`);

    item.append(title, button);
    fragment.append(item);
  });

  container.replaceChildren(fragment);
}

export function renderCount(element, count, total) {
  element.textContent = `Найдено книг: ${count} из ${total}`;
}

export function renderEmptyState(element, isEmpty) {
  element.hidden = !isEmpty;
}
