import { NavLink, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/books" className="site-logo">
          BookNest
        </NavLink>

        <nav className="site-nav" aria-label="Основная навигация">
          <NavLink
            to="/books"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            Каталог
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Избранное
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Войти
          </NavLink>
        </nav>
      </header>

      <div className="page-content">
        <Outlet />
      </div>

      <footer className="site-footer">
        BookNest — каталог книг
      </footer>
    </div>
  );
}