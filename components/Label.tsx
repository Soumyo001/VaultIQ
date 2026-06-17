import { WandSparkles } from "lucide-react"

type Props = {
    text: string;
}

export default function Label({ text }: { text: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
      {text}
      <span className="flex items-center gap-1 rounded bg-emerald-900 px-1.5 py-0.5 text-[11px] text-emerald-400">
        <WandSparkles className="h-2.5 w-2.5" />
        auto-detected
      </span>
    </div>
  );
}
