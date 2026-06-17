import { headers } from "next/headers";
import countryToCurrency, { Countries } from "country-to-currency";
import { SUPPORTED_CODES } from "../data/constants";

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

export async function guessCurrency() {
    const countryCode = readCountry(await headers());
    if(!countryCode) return null;

    const currency = countryToCurrency[countryCode as Countries];
    return currency && SUPPORTED_CODES.has(currency) ? currency : null;
}