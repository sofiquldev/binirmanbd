/**
 * Generate QR code image URL
 * @param {string} data - The data to encode in the QR code
 * @param {number} size - Size of the QR code (default: 300)
 * @returns {string} QR code image URL
 */
export function generateQrCodeUrl(data, size = 300) {
  if (!data) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Get donation URL for a candidate
 * @param {string} candidateSlug - Candidate slug or ID
 * @returns {string} Donation URL
 */
export function getDonationUrl(candidateSlug) {
  if (!candidateSlug) return '';
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  return `${baseUrl}/donate/${candidateSlug}`;
}

