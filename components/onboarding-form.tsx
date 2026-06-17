"use client";
import {
  PieChart,
  BarChart3,
  Bell,
  RefreshCw,
  Users,
  Clock,
  Check,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Label from "./Label";
import { DEFAULT_CURRENCY, DEFAULT_TIMEZONE } from "@/lib/data/constants";
import { guessTimezone, guessCurrencyFromBrowser } from "@/lib/utils/currency-util/browser-locale";
import { useEffect, useState } from "react";
import CurrencyCombobox from "./currency-combobox";

const FEATURES = [
  { icon: BarChart3, label: "Monthly spending reports" },
  { icon: Bell, label: "Budget limit alerts" },
  { icon: RefreshCw, label: "Recurring transactions" },
  { icon: Users, label: "Split expenses" },
];

type Status = "done" | "saving" | "idle";

type Props = {
  initialCurrency: string | null;
};

const OnboardingForm = ({ initialCurrency }: Props) => {
  const [currency, setCurrency] = useState<string>(initialCurrency ?? DEFAULT_CURRENCY);
  const [timezone, setTimezone] = useState<string>(DEFAULT_TIMEZONE);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setTimezone(guessTimezone());
    if(!initialCurrency) setCurrency(guessCurrencyFromBrowser());
  }, [initialCurrency]);

  return (
    <div className="flex justify-center items-center w-full min-h-dvh bg-muted/40 p-4">
      <div className="flex min-h-130 max-w-3xl w-full rounded-xl border overflow-hidden shadow-sm">
        <aside className="hidden md:flex flex-col justify-between items-start w-62 p-6 bg-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="inline-flex w-7.5 h-7.5 bg-indigo-600 justify-center items-center rounded-md text-white">
                <PieChart className="w-4 h-4" />
              </span>
              <span className="text-white font-bold text-left">VaultIQ</span>
            </div>
            <div>
              <p className="text-[17px] text-slate-100 font-medium leading-snug text-left mb-2">
                Track every penny, plan every goal.
              </p>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Your personal finance dashboard. Quick setup, powerful insights.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li className="flex items-center gap-2.5" key={label}>
                <Icon className="h-3.75 w-3.75 text-slate-500" />
                <span className="text-xs text-slate-400 text-left">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1 bg-muted p-7">
          {status === "idle" && (
            <div>
              <div className="flex gap-1.5 mb-5">
                <span className="h-0.75 flex-1 rounded-full bg-indigo-600" />
                <span className="h-0.75 flex-1 rounded-full bg-border" />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium tracking-wider text-left mb-1.5 uppercase">
                Step 1 of 2
              </p>
              <h1 className="text-lg text-foreground font-medium text-left tracking-tight mb-1">
                Set your home currency
              </h1>
              <p className="text-xs text-muted-foreground text-left font-semibold mb-5">
                Used across all your accounts, budgets, and reports.
              </p>
              <div className="w-full mb-3.5">
                <Label text={"Currency"} />
                <CurrencyCombobox
                  currency={currency}
                  onCurrencyChange={setCurrency}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
