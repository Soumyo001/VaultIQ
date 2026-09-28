import { CurrencyCode } from "../utils/currency-util/currency";

export type AlertKind = "warning" | "exceeded";

export type AlertEmailInput = {
    kind:         AlertKind;
    categoryName: string | null;
    spent:        number;
    limit:        number;
    currency:     CurrencyCode;
    month:        number;
    year:         number;
};

const escapeHtml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const formatMoney = (amount: number, currency: CurrencyCode) =>
    new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);

const formatPeriod = (month: number, year: number) =>
    new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" })
        .format(new Date(Date.UTC(year, month - 1, 1)));

const percentUsed = ({ spent, limit }: Pick<AlertEmailInput, "spent" | "limit">) =>
    limit > 0 ? Math.round((spent / limit) * 100) : 0;

export function buildEmailSubject(input: AlertEmailInput): string {
    const pct = percentUsed(input);
    return input.kind === "exceeded"
        ? `Budget exceeded: you've used ${pct}% of your limit`
        : `Heads up: you've used ${pct}% of your budget`;
}

export function buildEmailText(input: AlertEmailInput): string {
    const { kind, categoryName, spent, limit, currency, month, year } = input;
    const remaining = limit - spent;
    return [
        `${categoryName ?? "Overall budget"} (${formatPeriod(month, year)})`,
        `Spent ${formatMoney(spent, currency)} of ${formatMoney(limit, currency)} (${percentUsed(input)}%).`,
        kind === "exceeded"
            ? `You are ${formatMoney(Math.abs(remaining), currency)} over your limit.`
            : `You have ${formatMoney(remaining, currency)} left this month.`,
        `View your budgets: ${process.env.NEXT_PUBLIC_APP_URL}/budgets`,
    ].join("\n\n");
}

export function buildEmailHtml(input: AlertEmailInput): string {
    const { kind, categoryName, spent, limit, currency, month, year } = input;

    const pct        = percentUsed(input);
    const barWidth   = Math.min(pct, 100);
    const isExceeded = kind === "exceeded";
    const accent     = isExceeded ? "#dc2626" : "#d97706";
    const remaining  = limit - spent;

    const label    = escapeHtml(categoryName ?? "Overall budget");
    const headline = isExceeded ? "You've exceeded your budget" : "You're close to your budget limit";
    const detail   = isExceeded
        ? `You are <strong>${formatMoney(Math.abs(remaining), currency)}</strong> over your limit.`
        : `You have <strong>${formatMoney(remaining, currency)}</strong> left for the rest of the month.`;

    return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0"
               style="max-width:480px;background:#ffffff;border-radius:12px;padding:28px;">
          <tr><td>
            <p style="margin:0 0 4px;font-size:12px;color:#71717a;">${escapeHtml(formatPeriod(month, year))}</p>
            <h1 style="margin:0 0 4px;font-size:20px;color:${accent};">${headline}</h1>
            <p style="margin:0 0 20px;font-size:14px;color:#3f3f46;">${label}</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="background:#e4e4e7;border-radius:6px;">
              <tr><td style="width:${barWidth}%;background:${accent};height:10px;border-radius:6px;font-size:0;line-height:0;">&nbsp;</td>
                  <td style="font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <p style="margin:12px 0 4px;font-size:14px;color:#18181b;">
              ${formatMoney(spent, currency)} of ${formatMoney(limit, currency)} (${pct}%)
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#3f3f46;">${detail}</p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/budgets"
               style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;
                      font-size:14px;padding:10px 18px;border-radius:8px;">
              View budgets
            </a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}