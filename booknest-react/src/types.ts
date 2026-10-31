
export type LoadStatus = "idle" | "loading" | "success" | "empty" | "error";

export type SortOption = "title" | "year" | "rating";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  ratings_average?: number;
  subject?: string[];
  cover_i?: number;
  availability?: {
    available?: boolean;
  };
  available?: boolean;
}

export interface BooksResponse {
  docs: Book[];
  numFound: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface Filters {
  query: string;
  genre: string;
  sortBy: SortOption;
  availableOnly: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
}
