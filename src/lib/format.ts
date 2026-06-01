/**
 * Format a ISO-8601 date string to relative format (e.g., '3d ago', '2mo ago').
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "unknown";

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return "unknown";
  }
}

/**
 * Escapes HTML characters safely, works in both Node (SSR) and Browser runtimes.
 */
export function escapeHtml(text: string): string {
  if (typeof document === "undefined") {
    // Node / SSR Fallback
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
