'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function DbUnavailable() {
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-lg font-semibold">Temporarily unavailable</h2>
      <p className="text-sm text-muted-foreground">
        We can't reach your data right now. Your session is still active — try again in a moment.
      </p>
      <Button variant="outline" onClick={() => router.refresh()} className="rounded-md">
        Retry
      </Button>
    </div>
  );
}