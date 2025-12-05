export const formatPrice = (price: string | number) => {
  if (price === null || price === undefined || price === '') return 'N/A';

  // Remove any existing currency symbols and commas
  const numericValue =
    typeof price === 'string'
      ? price.replace(/[₦,NGN\s]/g, '')
      : price.toString();

  const priceNum = parseFloat(numericValue);

  if (isNaN(priceNum)) return price;

  return `₦${priceNum.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
