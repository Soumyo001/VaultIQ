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
export const DEFAULT_TIMEZONE = "UTC";

export const SUPPORTED_CODES = new Set<string>(SUPPORTED_CURRENCIES.map(c => c.code));
export const CODE_CURRENCY = new Map<string, CurrencyType>(SUPPORTED_CURRENCIES.map(c => [c.code, c]));
export const FALLBACK_CODE_CURRENCY = CODE_CURRENCY.get(DEFAULT_CURRENCY) ?? SUPPORTED_CURRENCIES[0];

export const TZ_CURRENCY: Record<string, string> = {
  "America/New_York": "USD",
  "America/Chicago": "USD",
  "America/Denver": "USD",
  "America/Phoenix": "USD",
  "America/Los_Angeles": "USD",
  "America/Anchorage": "USD",
  "Pacific/Honolulu": "USD",
  "Europe/London": "GBP",
  "Europe/Berlin": "EUR",
  "Europe/Paris": "EUR",
  "Europe/Madrid": "EUR",
  "Europe/Rome": "EUR",
  "Europe/Amsterdam": "EUR",
  "Europe/Dublin": "EUR",
  "Europe/Lisbon": "EUR",
  "Europe/Vienna": "EUR",
  "Europe/Brussels": "EUR",
  "Europe/Helsinki": "EUR",
  "Europe/Athens": "EUR",
  "Europe/Zurich": "CHF",
  "Europe/Stockholm": "SEK",
  "Asia/Singapore": "SGD",
  "Asia/Tokyo": "JPY",
  "Asia/Kolkata": "INR",
  "Asia/Calcutta": "INR",
  "Asia/Hong_Kong": "HKD",
  "Asia/Shanghai": "CNY",
  "Asia/Urumqi": "CNY",
  "Asia/Kuala_Lumpur": "MYR",
  "Asia/Kuching": "MYR",
  "Asia/Jakarta": "IDR",
  "Asia/Makassar": "IDR",
  "Asia/Pontianak": "IDR",
  "Asia/Jayapura": "IDR",
  "Asia/Manila": "PHP",
  "Asia/Bangkok": "THB",
  "Asia/Seoul": "KRW",
  "Asia/Taipei": "TWD",
  "Asia/Karachi": "PKR",
  "Asia/Dhaka": "BDT",
  "Asia/Dubai": "AED",
  "Australia/Sydney": "AUD",
  "Australia/Melbourne": "AUD",
  "Australia/Brisbane": "AUD",
  "Australia/Perth": "AUD",
  "Australia/Adelaide": "AUD",
  "Pacific/Auckland": "NZD",
  "America/Toronto": "CAD",
  "America/Vancouver": "CAD",
  "America/Edmonton": "CAD",
  "America/Winnipeg": "CAD",
  "America/Halifax": "CAD",
  "America/Sao_Paulo": "BRL",
  "America/Mexico_City": "MXN",
  "Africa/Johannesburg": "ZAR",
};