import * as assets from '../assets';

/**
 * Returns the imported asset for a given key.
 * If the key is not found, returns the key itself (e.g., an external URL).
 */
export function getAsset(key) {
  return assets[key] ?? key;
}
