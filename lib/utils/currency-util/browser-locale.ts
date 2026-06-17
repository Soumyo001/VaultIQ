import { 
    DEFAULT_CURRENCY, 
    DEFAULT_TIMEZONE, 
    TZ_CURRENCY,
    SUPPORTED_CODES,
    CurrencyType,
    CODE_CURRENCY,
    FALLBACK_CODE_CURRENCY
} from "@/lib/data/constants";

export function guessTimezone(): string {
    if(typeof window === "undefined") return DEFAULT_TIMEZONE;
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return DEFAULT_TIMEZONE;
    }
}

export function guessCurrencyFromBrowser(): string {
    if(typeof window === "undefined") return DEFAULT_CURRENCY;
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const currencyByZone = tz && TZ_CURRENCY[tz] ? TZ_CURRENCY[tz] : undefined;
        if(currencyByZone && SUPPORTED_CODES.has(currencyByZone)) return currencyByZone; 
        return DEFAULT_CURRENCY;
    } catch {
        return DEFAULT_CURRENCY;
    }
}

export function getCurrencyByCode(code: string|null): CurrencyType {
    if(!code) return FALLBACK_CODE_CURRENCY;
    return CODE_CURRENCY.get(code) ?? FALLBACK_CODE_CURRENCY;
}