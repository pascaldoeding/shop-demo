export function getPriceRange(prices) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return `${getFormattedPrice(min)} - ${getFormattedPrice(max)}`;
}

export function getFormattedPrice(price) {
  if (typeof price !== 'number') {
    price = parseInt(price);
  }
  price = (price / 100).toFixed(2);
  return price.toString().replace('.', ',');
}
