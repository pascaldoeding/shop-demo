// Erhält ein Array mit Preisen und gibt eine Preisspanne als String zurück
export function getPriceRange(prices) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return `${getFormattedPrice(min)} - ${getFormattedPrice(max)}`;
}

// Formatiert einen Preis und gibt ihn als String zurück
export function getFormattedPrice(price) {
  if (typeof price !== 'number') {
    price = parseInt(price);
  }
  price = (price / 100).toFixed(2);
  return price.toString().replace('.', ',');
}
