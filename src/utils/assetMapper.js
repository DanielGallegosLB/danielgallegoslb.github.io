import * as assets from '../assets';

function extractKey(path) {
  if (!path || typeof path !== 'string') return path;
  // Extract filename without extension from paths like "/src/assets/web.png" or "/src/assets/tech/html.png"
  const match = path.match(/\/(\w+)\.[a-z]+$/);
  if (match) return match[1];
  return path;
}

export function getAsset(key) {
  if (key && assets[key]) return assets[key];
  const extracted = extractKey(key);
  return extracted && assets[extracted] ? assets[extracted] : key;
}
