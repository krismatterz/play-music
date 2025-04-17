/**
 * Format a duration in milliseconds to MM:SS format
 * @param durationMs Duration in milliseconds
 * @returns Formatted duration string (MM:SS)
 */
export function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
