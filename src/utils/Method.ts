export const formatPrice = (price: string | number, currency: 'NGN' | 'USD' = 'NGN') => {
  if (price === null || price === undefined || price === '') return 'N/A';

  // Remove any existing currency symbols and commas
  const numericValue =
    typeof price === 'string'
      ? price.replace(/[₦$,NGN\s]/g, '')
      : price.toString();

  const priceNum = parseFloat(numericValue);

  if (isNaN(priceNum)) return price;

  const currencySymbol = currency === 'USD' ? '$' : '₦';
  
  return `${currencySymbol}${priceNum.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
export const formatTitleCase = (text: string) => {
  if (!text) return "";

const cleaned = text.replace(/(\d+)-(\w+)/g, "$1 $2");
  return cleaned
    .split(/[\s-]+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};
