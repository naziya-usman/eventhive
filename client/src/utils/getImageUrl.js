/**
 * Constructs a full image URL from a path provided by the API
 * Handles cleaning up 'public/' prefix and backslashes for cross-platform compatibility
 * Also handles base64 data URIs correctly.
 * @param {string} path - The image path or data URI from the API
 * @returns {string} - The full URL or data URI to the image
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  
  // 1. If it's already a full URL or a data URI, return it as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  
  // Base URL for the backend
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') 
    : (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');
  
  // 2. Convert all backslashes to forward slashes (Windows fix)
  let cleanPath = path.replace(/\\/g, '/');
  
  // 3. Remove 'public/' or 'public' from the start of the path
  cleanPath = cleanPath.replace(/^public\//, '').replace(/^public/, '');
  
  // 4. Ensure the path starts with exactly one forward slash
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  // 5. Encode the URI to handle special characters (like spaces or parentheses)
  const encodedPath = normalizedPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  
  // Fix double slash if present at the beginning
  const finalPath = encodedPath.startsWith('//') ? encodedPath.substring(1) : encodedPath;

  const fullUrl = `${baseUrl}${finalPath}`;
  
  
  return fullUrl;
};
