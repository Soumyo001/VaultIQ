"use client";
import {
  PieChart,
  BarChart3,
  Bell,
  RefreshCw,
  Users,
  Clock,
  Check,
  ArrowRight,
  Loader
} from "lucide-react";
import Label from "./Label";
import { DEFAULT_CURRENCY, CurrencyCode } from "@/lib/utils/currency-util/currency";
import { guessTimezone, guessCurrencyCodeFromBrowser } from "@/lib/utils/currency-util/browser-locale";
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import CurrencyCombobox from "./currency-combobox";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const FEATURES = [
  { icon: BarChart3, label: "Monthly spending reports" },
  { icon: Bell, label: "Budget limit alerts" },
  { icon: RefreshCw, label: "Recurring transactions" },
  { icon: Users, label: "Split expenses" },
];

type Status = "done" | "saving" | "idle";

type Props = {
  initialCurrencyCode: CurrencyCode | null;
};

const OnboardingForm = ({ initialCurrencyCode }: Props) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(initialCurrencyCode ?? DEFAULT_CURRENCY);
  const [timezone, setTimezone] = useState<string>("");
  const [error, setError] = useState<string|null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setTimezone(guessTimezone());
    if(!initialCurrencyCode) setCurrencyCode(guessCurrencyCodeFromBrowser());
    else setCurrencyCode(initialCurrencyCode);
  }, [initialCurrencyCode]);

  const handleSubmit = async() => {
    try {
      setStatus("saving");
      const res = await fetch('/api/user', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          currency: currencyCode,
          timezone: timezone || guessTimezone()
        })
      });
      const body = await res.json();
      if(!res.ok) {
        const errorMsg = body.errors
                          ? Object.values(body.errors).flat().join(", ")
                          : body.message;
        throw new Error(errorMsg);
      }

      await user?.reload();
      await getToken({ skipCache: true });
      setStatus("done");
      const role = body?.user?.role ?? "user";
      router.push(role === "admin" ? "/admin/home":"/home");
    } catch (err: any) {
      setStatus("idle");
      setError(err.message);
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-dvh bg-muted/40 p-4">
      <div className="flex min-h-146.25 max-w-3xl w-full rounded-xl border overflow-hidden shadow-sm">
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
          {status === "done" ?(
            <div className="min-h-75 w-full flex flex-col justify-center items-center gap-3">
              <span className="flex justify-center items-center w-15 h-15 rounded-full bg-emerald-900">
                <Check className="w-6 h-6 text-emerald-400"/>
              </span>
              <p className="text-[17px] font-medium text-foreground">
                You're all set!
              </p>
              <p className="flex gap-2 items-center text-xs text-muted-foreground">
                <Loader className="w-3.5 h-3.5 animate-spin"/>
                Taking you to your dashboard...
              </p>
            </div>
          ):(
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
                  currencyCode={currencyCode}
                  onCurrencyCodeChange={setCurrencyCode}
                />
              </div>
              <div className="w-full mb-5">
                <Label text={"Timezone"}/>
                <div className=" flex w-full items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-background/40">
                  <Clock className="h-4 w-4 text-muted-foreground"/>
                  <div className="flex-1">
                    <p className="text-[11px] text-muted-foreground">Your local timezone</p>
                    <p className="text-[14px] text-primary">{timezone || "Detecting..."}</p>
                  </div>
                  {timezone && <Check className="h-4 w-4 text-emerald-600"/>}
                </div>
              </div>
              {error && <p className="text-sm text-left text-destructive mb-3" role="alert">
                {error}
              </p>}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "saving"}
                className={cn(
                  "border border-input w-full py-1.5 mb-2.5 rounded-md cursor-pointer",
                  "flex items-center justify-center gap-1.5",
                  "text-primary font-medium text-[14px]",
                  "transition-all duration-200",
                  "hover:bg-background/15 active:bg-muted-foreground/20 active:scale-98",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                )}
              >
                {status === "saving" ? (
                  <span className="inline-flex text-muted-foreground gap-1 items-center">
                    <Loader className="w-4 h-4 animate-spin"/>
                    Saving...
                  </span>
                ):(
                  <>
                    Continue to setup
                    <ArrowRight className="h-4 w-4"/>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-muted-foreground">
                You can change these anytime in settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
