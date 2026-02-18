export function capitalizeFirstLetter(string) {
  if (!string) return string; // Handle empty or null strings safely
  return string.charAt(0).toUpperCase() + string.slice(1);
}
