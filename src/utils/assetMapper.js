import * as assets from '../assets';

function extractKey(path) {
  if (!path || typeof path !== 'string') return path;
  // Data URIs and absolute URLs are used as-is
  if (path.startsWith("data:") || /^https?:\/\//.test(path)) return path;
  // Extract the base filename and strip the Vite build hash suffix.
  // e.g. "/assets/ipractica-CERt3c2-.png" -> "ipractica"
  const base = path.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
  const key = base.split("-")[0];
  return key || path;
}

export function getAsset(key) {
  if (!key) return key;
  if (typeof key !== "string") return key; // already an imported asset object
  if (key.startsWith("data:") || /^https?:\/\//.test(key)) return key;
  if (assets[key]) return assets[key];
  const extracted = extractKey(key);
  return extracted && assets[extracted] ? assets[extracted] : key;
}
