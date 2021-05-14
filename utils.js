export function getCurrencySymbol(currencyValue) {
  switch (currencyValue) {
    case 'UAH': return '₴'; break;
    case 'EUR': return '€'; break;
    case 'USD': return '$'; break;
    default: return 'UAH';
  }
}