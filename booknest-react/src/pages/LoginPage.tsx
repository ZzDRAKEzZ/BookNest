import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <main className="app">
      <h1>Вход в BookNest</h1>
      <p>Авторизация будет реализована в лабораторной работе № 9.</p>
      <Link to="/books">Вернуться в каталог</Link>
    </main>
  );
}