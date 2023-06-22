export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG').format(amount);
}
