export type CurrencyType = {
    code: string;
    name: string;
    symbol: string;
    region: string;
};

export const SUPPORTED_CURRENCIES: CurrencyType[] = [
    { code: "USD", name: "US Dollar", symbol: "$", region: "Americas" },
    { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
    { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: "Asia Pacific" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia Pacific" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$", region: "Americas" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", region: "Asia Pacific" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", region: "Asia Pacific" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "Asia Pacific" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", region: "Asia Pacific" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", region: "Asia Pacific" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱", region: "Asia Pacific" },
    { code: "THB", name: "Thai Baht", symbol: "฿", region: "Asia Pacific" },
    { code: "KRW", name: "South Korean Won", symbol: "₩", region: "Asia Pacific" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", region: "Oceania" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr", region: "Europe" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", region: "Europe" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "Americas" },
    { code: "MXN", name: "Mexican Peso", symbol: "$", region: "Americas" },
    { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", region: "Middle East" },
    { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", region: "Asia Pacific" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨", region: "Asia Pacific" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", region: "Asia Pacific" },
];

export const POPULAR_CODES = ["USD", "EUR", "GBP", "SGD", "JPY", "AUD", "CAD", "INR"];

export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
