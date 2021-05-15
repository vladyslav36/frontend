export function getCurrencySymbol(currencyValue) {
  switch (currencyValue) {
    case 'UAH': return '₴'; break;
    case 'EUR': return '€'; break;
    case 'USD': return '$'; break;
    default: return 'UAH';
  }
}

export function getPriceForShow({ currencyShop, currencyRate, currencyValue, price }) {
  const showPrice =
    ((currencyRate[currencyValue] * price) / currencyRate[currencyShop]).toFixed(2)
  return showPrice
}