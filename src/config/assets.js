/**
 * Helper to resolve static asset URLs correctly across local development,
 * ngrok tunnels, root domains, and subpath deployments (e.g. GitHub Pages).
 *
 * @param {string} path - Absolute or relative path to asset (e.g., '/images/destinations/...')
 * @returns {string} Fully resolved path
 */
export const getAssetUrl = (path) => {
  if (!path || typeof path !== 'string') return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${cleanPath}`;
};

export default getAssetUrl;
