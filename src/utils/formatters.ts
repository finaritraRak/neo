/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param symbol - Whether to include the currency symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, symbol = true): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: symbol ? 'currency' : 'decimal',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param format - Format to use ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};