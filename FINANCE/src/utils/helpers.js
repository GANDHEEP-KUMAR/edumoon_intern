// Utility to format numbers as Indian Rupees
export function formatRupees(amount) {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
}
