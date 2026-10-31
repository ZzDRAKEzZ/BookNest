
interface HeaderProps {
  wishlistCount?: number;
}

export default function Header({
  wishlistCount = 0,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1>BookNest</h1>
        <p>Найди следующую любимую книгу</p>
        <span>
          В списке желаемого: {wishlistCount}
        </span>
      </div>
    </header>
  );
}
