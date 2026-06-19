import { headers } from "next/headers";
import countryToCurrency, { Countries } from "country-to-currency";
import { CurrencyCode, SUPPORTED_CODES_SET } from "../utils/currency-util/currency";

function readCountry(h: Headers): string|null {
    const direct = h.get("x-vercel-ip-country")
                ?? h.get("cf-ipcountry")
                ?? h.get("cloudfront-viewer-country");
    if(direct) return direct.toUpperCase();

    const nf = h.get("x-nf-geo");
    if(nf) {
        try {
            const decoded = typeof atob !== "undefined"
                    ? atob(nf)
                    : Buffer.from(nf, "base64").toString("utf-8");
            const parsed = JSON.parse(decoded);
            return parsed?.country?.code?.toUpperCase() ?? null;
        } catch {
            return null;
        }
    }
    return null;
}

function isSupportedCode(code: string): code is CurrencyCode {
    return SUPPORTED_CODES_SET.has(code as CurrencyCode);
}

export async function guessCurrency(): Promise<CurrencyCode|null> {
    const countryCode = readCountry(await headers());
    if(!countryCode) return null;

    const currency = countryToCurrency[countryCode as Countries];
    return currency && isSupportedCode(currency) ? currency : null;
}