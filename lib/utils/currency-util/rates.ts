import { SUPPORTED_CODES, SUPPORTED_CODES_SET, CurrencyCode } from "@/lib/utils/currency-util/currency";

type FrankfurterRow = { 
    date: string; 
    base: string; 
    quote: string; 
    rate: number;
}
export type RateTable = Record<CurrencyCode, number>;

export function parseRates(payload: unknown): RateTable {
    if (!Array.isArray(payload)) throw new Error("Unexpected rates response shape");

    const table: Partial<RateTable> = { USD: 1 };
    for (const row of payload as FrankfurterRow[]) {
        if (row.base !== "USD" || !SUPPORTED_CODES_SET.has(row.quote as CurrencyCode)) continue;
        if (!Number.isFinite(row.rate) || row.rate <= 0) {
            throw new Error(`Invalid rate for ${row.quote}`);
        }
        table[row.quote as CurrencyCode] = row.rate;
    }

    const missing = SUPPORTED_CODES.filter((code) => table[code] === undefined);
    if (missing.length > 0) throw new Error(`Rates missing for: ${missing.join(", ")}`);
    return table as RateTable;
}