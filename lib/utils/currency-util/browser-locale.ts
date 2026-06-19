import { 
    DEFAULT_CURRENCY, 
    DEFAULT_TIMEZONE, 
    TZ_CURRENCY,
    SUPPORTED_CODES_SET,
    CODE_CURRENCY,
    FALLBACK_CODE_CURRENCY,
    CurrencyType,
    CurrencyCode
} from "@/lib/utils/currency-util/currency";

export function guessTimezone(): string {
    if(typeof window === "undefined") return DEFAULT_TIMEZONE;
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return DEFAULT_TIMEZONE;
    }
}

export function guessCurrencyCodeFromBrowser(): CurrencyCode {
    if(typeof window === "undefined") return DEFAULT_CURRENCY;
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const currencyCodeByZone = tz && TZ_CURRENCY[tz] ? TZ_CURRENCY[tz] : undefined;
        if(currencyCodeByZone && SUPPORTED_CODES_SET.has(currencyCodeByZone)) return currencyCodeByZone; 
        return DEFAULT_CURRENCY;
    } catch {
        return DEFAULT_CURRENCY;
    }
}

export function getCurrencyByCode(code: CurrencyCode|null): CurrencyType {
    if(!code) return FALLBACK_CODE_CURRENCY;
    return CODE_CURRENCY.get(code) ?? FALLBACK_CODE_CURRENCY;
}