
import { books } from "./data/books.js";
import { getBooks } from "./lib/books.js";
import {
  renderBooks,
  renderWishlist,
  renderCount,
  renderEmptyState,
} from "./ui/render.js";

const STORAGE_KEY = "booknest-state";

function loadSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!saved || typeof saved !== "object") {
      return {};
    }

    return saved;
  } catch {
    return {};
  }
}

const savedState = loadSavedState();

const state = {
  query: typeof savedState.query === "string" ? savedState.query : "",
  genre: typeof savedState.genre === "string" ? savedState.genre : "",
  sortBy: ["title", "year", "rating"].includes(savedState.sortBy)
    ? savedState.sortBy
    : "title",
  availableOnly: savedState.availableOnly === true,
  wishlist: Array.isArray(savedState.wishlist)
    ? savedState.wishlist.filter(
        (id) => Number.isInteger(id) && books.some((book) => book.id === id)
      )
    : [],
};

const form = document.querySelector("#filters-form");
const searchInput = document.querySelector("#search");
const genreSelect = document.querySelector("#genre");
const sortSelect = document.querySelector("#sort");
const availableCheckbox = document.querySelector("#available");
const booksContainer = document.querySelector("#books-list");
const countElement = document.querySelector("#results-count");
const emptyElement = document.querySelector("#empty-state");
const wishlistContainer = document.querySelector("#wishlist-list");
const wishlistCount = document.querySelector("#wishlist-count");
const wishlistEmpty = document.querySelector("#wishlist-empty");

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Приложение продолжает работать, даже если сохранение недоступно.
  }
}

function render() {
  searchInput.value = state.query;
  genreSelect.value = state.genre;
  sortSelect.value = state.sortBy;
  availableCheckbox.checked = state.availableOnly;

  const visibleBooks = getBooks(books, state);

  renderBooks(booksContainer, visibleBooks, state.wishlist);
  renderCount(countElement, visibleBooks.length, books.length);
  renderEmptyState(emptyElement, visibleBooks.length === 0);
  renderWishlist(wishlistContainer, books, state.wishlist);

  wishlistCount.textContent = String(state.wishlist.length);
  wishlistEmpty.hidden = state.wishlist.length > 0;
}

form.addEventListener("input", (event) => {
  if (event.target.matches("[name='query']")) {
    state.query = event.target.value;
  }

  if (event.target.matches("[name='genre']")) {
    state.genre = event.target.value;
  }

  if (event.target.matches("[name='sortBy']")) {
    state.sortBy = event.target.value;
  }

  if (event.target.matches("[name='availableOnly']")) {
    state.availableOnly = event.target.checked;
  }

  saveState();
  render();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

form.addEventListener("reset", () => {
  state.query = "";
  state.genre = "";
  state.sortBy = "title";
  state.availableOnly = false;

  saveState();
  requestAnimationFrame(render);
});

booksContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='wishlist']");

  if (!button) {
    return;
  }

  const card = button.closest("[data-book-id]");

  if (!card) {
    return;
  }

  const id = Number(card.dataset.bookId);

  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter((savedId) => savedId !== id);
  } else {
    state.wishlist = [...state.wishlist, id];
  }

  saveState();
  render();
});

wishlistContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='remove-wishlist']");

  if (!button) {
    return;
  }

  const item = button.closest("[data-book-id]");

  if (!item) {
    return;
  }

  const id = Number(item.dataset.bookId);
  state.wishlist = state.wishlist.filter((savedId) => savedId !== id);

  saveState();
  render();
});

render();
