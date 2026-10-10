import { CurrencyCode } from "./currency";

export function getMinorUnitDigits(code: CurrencyCode): number {
    return new Intl.NumberFormat("en", {style: "currency", currency: code})
                .resolvedOptions().maximumFractionDigits ?? 2;
}

export function toMinor(amount: number, code: CurrencyCode): number {
    const fractionDigits = getMinorUnitDigits(code);
    const factor = Math.pow(10, fractionDigits);
    return Math.round(amount * factor);
}

export function fromMinor(minorAmount: number, code: CurrencyCode): number {
    const fractionDigits = getMinorUnitDigits(code);
    const factor = Math.pow(10, fractionDigits);
    const result = (minorAmount / factor).toFixed(fractionDigits);
    return Number.parseFloat(result);
}

export function formatMinor(minorAmount: number, code: CurrencyCode, locale: string = "en"): string {
    const fractionDigits = getMinorUnitDigits(code);
    const factor = Math.pow(10, fractionDigits);
    const majorAmount = minorAmount / factor;
    return new Intl.NumberFormat(locale, {
            style: "currency", 
            currency: code, 
            currencyDisplay: "narrowSymbol"
        }).format(majorAmount);
}