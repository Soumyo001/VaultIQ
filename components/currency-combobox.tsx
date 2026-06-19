'use client'
import { 
    Popover,
    PopoverTrigger,
    PopoverContent
} from "./ui/popover";
import { 
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator
} from "./ui/command";
import { ChevronDown, Check } from "lucide-react";
import { SUPPORTED_CURRENCIES, POPULAR_CODES, CurrencyType, CurrencyCode } from "@/lib/utils/currency-util/currency";
import { getCurrencyByCode } from "@/lib/utils/currency-util/browser-locale";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
    currencyCode: CurrencyCode;
    onCurrencyCodeChange: (code: CurrencyCode) => void;
}

const CurrencyCombobox = ({ currencyCode, onCurrencyCodeChange }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const selected: CurrencyType = getCurrencyByCode(currencyCode);
  const searching: boolean = query.trim().length > 0;
  
  const filtered = useMemo(() => {
    if(searching) {
        return SUPPORTED_CURRENCIES.filter((currency) => {
            const needle = query.trim().toLowerCase();
            if(!needle) return true;
            return currency.name.toLowerCase().includes(needle)
                || currency.code.toLowerCase().includes(needle)
                || currency.region.toLowerCase().includes(needle);
        });
    } else {
        return SUPPORTED_CURRENCIES.filter((currency) => {
            return !POPULAR_CODES.includes(currency.code);
        });
    }
  }, [SUPPORTED_CURRENCIES, POPULAR_CODES, query]);

  const select = (code: CurrencyCode) => {
    onCurrencyCodeChange(code);
    setOpen(false);
    setQuery("");
  }
    
  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <button
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-label="Select home currency"
                className={cn(
                    "border w-full px-3 py-2.5 flex justify-between items-center rounded-lg",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                )}
            >
                <span className="inline-flex gap-3 items-center">
                    <span className="w-9.5 h-9.5 flex items-center justify-center rounded-md bg-indigo-50 text-xs text-indigo-800 text-center font-semibold tracking-wide">
                        {selected.code}
                    </span>
                    <span>
                        <p className="text-left text-[13px] text-foreground font-medium">{selected.name}</p>
                        <p className="text-left text-[11px] text-muted-foreground">{selected.region}</p>
                    </span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground text-base">
                        {selected.symbol}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            open && "rotate-180"
                        )}
                    />
                </span>
            </button>
        </PopoverTrigger>
        <PopoverContent
            align="start"
            sideOffset={6}
            className="w-(--radix-popover-trigger-width) rounded-lg overflow-hidden p-0"
        >
            <Command className="bg-muted" shouldFilter={false}>
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Select currency or country..."
                />
                <CommandList className="max-h-65">
                    <CommandGroup>
                        {!searching && <div className="px-2.5 pb-2 pt-2.5">
                            <p className="uppercase text-[11px] font-medium tracking-wider pb-1.5">
                                Popular
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {POPULAR_CODES.map(code => (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() => select(code)}
                                        className={cn(
                                            "border border-input px-3 py-2 rounded-md cursor-pointer text-xs text-primary font-medium transition-all duration-200 hover:bg-muted-foreground/10 active:scale-90 active:bg-muted-foreground/40",
                                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                                        )}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>}
                    </CommandGroup>
                    <CommandSeparator/>
                    <CommandGroup heading={searching?undefined: "ALL CURRENCIES"}>
                        {filtered.length === 0 && <p className="p-4 text-center text-xs text-muted-foreground font-medium">
                            No results found.
                        </p>}
                        {filtered.map(currency => (
                            <CommandItem
                                key={currency.code}
                                value={`${currency.code} ${currency.name}`}
                                onSelect={() => select(currency.code)}
                                className={cn(
                                  "gap-2 max-sm:gap-0 border rounded-md cursor-pointer",
                                  "transition-transform duration-200",
                                  "hover:bg-muted-foreground/10 active:scale-[0.98] active:bg-muted-foreground/20",
                                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                                )}
                            >
                                <span className="inline-flex gap-5 max-sm:gap-2 flex-1">
                                    <span className="text-primary font-bold text-[14px]">
                                        {currency.code}
                                    </span>
                                    <span className="text-muted-foreground text-[13px]">
                                        {currency.name}
                                    </span>
                                </span>
                                <span className="inline-flex gap-3">
                                    <span className="text-muted-foreground text-[13px]">
                                        {currency.symbol}
                                    </span>
                                    {currency.code === currencyCode &&
                                    <Check className="h-4 w-4 text-indigo-600"/>}
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
  )
}

export default CurrencyCombobox