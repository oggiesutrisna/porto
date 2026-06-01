export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  languages: Language[];
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  license: string | null;
  topics: string[];
  isArchived: boolean;
  isFork: boolean;
  updatedAt: string;
  createdAt: string;
  pushedAt: string;
  defaultBranch: string;
  readme: string | null;
}

export interface Language {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  url: string;
  followers: number;
  following: number;
  repositories: GitHubRepo[];
}

export type SortOption = "stars" | "updated" | "name";
export type SortDirection = "desc" | "asc";

export interface FilterOptions {
  search: string;
  topics: string[];
  language: string | null;
  sort: SortOption;
  direction: SortDirection;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Vue: "#41b883",
  React: "#61dafb",
  Blade: "#f7523f",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Lua: "#000080",
  R: "#198CE7",
  Jupyter: "#DA5B0B",
  TeX: "#3D6117",
};

export function getLanguageColor(language: string | null): string {
  if (!language) return "#6b7280";
  return LANGUAGE_COLORS[language] || "#6b7280";
}
