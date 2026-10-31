import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="app">
      <h1>404 — Страница не найдена</h1>
      <p>Такой страницы не существует.</p>
      <Link to="/books">Вернуться в каталог</Link>
    </main>
  );
}