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
import { SUPPORTED_CURRENCIES, POPULAR_CODES } from "@/lib/data/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
    currency: string;
    onCurrencyChange: (code: string) => void;
}

const CurrencyCombobox = ({ currency, onCurrencyChange }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <button
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-label="Select home currency"
                className={cn(
                    "border w-full px-3 py-2.5 text-left flex justify-between items-center rounded-lg",
                )}
            >
                <span>
                    
                </span>
            </button>
        </PopoverTrigger>
    </Popover>
  )
}

export default CurrencyCombobox