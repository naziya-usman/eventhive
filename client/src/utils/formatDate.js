/**
 * Formats an ISO date string using Intl.DateTimeFormat
 * @param {string} isoString - The ISO date string to format
 * @param {'long' | 'short'} style - The formatting style
 * @returns {string} - The formatted date string
 */
export const formatDate = (isoString, style) => {
  if (!isoString) return '';
  const date = new Date(isoString);

  if (style === 'long') {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date).replace(',', ' at');
  }

  // Default to short style
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
