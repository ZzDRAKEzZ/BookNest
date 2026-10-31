
import type { Filters, SortOption } from "../types";
import Button from "./Button";

interface FiltersPanelProps {
  filters: Filters;
  genres: string[];
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
}

export default function FiltersPanel({
  filters,
  genres,
  onFiltersChange,
  onReset,
}: FiltersPanelProps) {
  function updateFilter<K extends keyof Filters>(
    key: K,
    value: Filters[K],
  ) {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <section className="filters-panel" aria-label="Поиск и фильтры">
      <label>
        Поиск по названию или автору
        <input
          type="search"
          value={filters.query}
          onChange={(event) => updateFilter("query", event.target.value)}
          placeholder="Например, Мастер и Маргарита"
        />
      </label>

      <label>
        Жанр
        <select
          value={filters.genre}
          onChange={(event) => updateFilter("genre", event.target.value)}
        >
          <option value="">Все жанры</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Сортировка
        <select
          value={filters.sortBy}
          onChange={(event) =>
            updateFilter("sortBy", event.target.value as SortOption)
          }
        >
          <option value="title">По названию</option>
          <option value="year">По году</option>
          <option value="rating">По рейтингу</option>
        </select>
      </label>

      <label>
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={(event) =>
            updateFilter("availableOnly", event.target.checked)
          }
        />
        Только доступные
      </label>

      <Button onClick={onReset}>Сбросить фильтры</Button>
    </section>
  );
}
