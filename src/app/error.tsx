"use client"; // Error components must be Client Components
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="space-y-4">
      <Alert color="destructive" variant="soft">
        <Info className="h-5 w-5" />
        <AlertDescription>Something went wrong! {JSON.stringify(error)}</AlertDescription>
      </Alert>
    </div>
  );
}
