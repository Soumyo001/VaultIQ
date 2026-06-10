import { headers } from "next/headers";
import countryToCurrency, { Countries, Currencies } from "country-to-currency";
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from "../data/constants";

const SUPPORTED = new Set<string>(SUPPORTED_CURRENCIES.map(c => c.code));

function readCountry(h: Headers): string|undefined {
    const direct = h.get("x-vercel-ip-country")
                ?? h.get("cf-ipcountry")
                ?? h.get("cloudfront-viewer-country");
    if(direct) return direct.toUpperCase();

    const nf = h.get("x-nf-geo");
    if(nf) {
        try {
            const decoded = typeof atob !== undefined
                                ? atob(nf)
                                : Buffer.from(nf, "base64").toString("utf-8");
            const parsed = JSON.parse(decoded);
            return parsed?.country?.code?.toUpperCase();
        } catch {
            return undefined;
        }
    }
    return undefined;
}

export async function guessCurrency() {
    const countryCode = readCountry(await headers());
    if(!countryCode) return DEFAULT_CURRENCY;

    const currency = countryToCurrency[countryCode as Countries];

    return currency && SUPPORTED.has(currency) ? currency:DEFAULT_CURRENCY;
}