import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmbeddedStudioProps {
  title: string;
  description: string;
  src: string | null;
  setupHint: string;
  fallbackHref?: string;
}

export function EmbeddedStudio({
  title,
  description,
  src,
  setupHint,
  fallbackHref = "https://github.com/bennymalonee/ReplyGuy-clone/tree/main/media-studio",
}: EmbeddedStudioProps) {
  if (!src) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          <Alert>
            <Info className="size-4" />
            <AlertTitle>Studio URL not configured</AlertTitle>
            <AlertDescription>{setupHint}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="gap-3">
          <Link
            href={fallbackHref}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View media-studio <ExternalLink className="ml-2 size-4" />
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Alert>
        <Info className="size-4" />
        <AlertTitle>Embedded media studio</AlertTitle>
        <AlertDescription>
          The studio is loaded inside ReplyGuy. If the embed has issues, open it in a new tab.
        </AlertDescription>
      </Alert>

      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Link
            href={src}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Open in new tab <ExternalLink className="ml-2 size-4" />
          </Link>
        </div>
        <iframe
          title={title}
          src={src}
          className="h-[calc(100vh-16rem)] min-h-[900px] w-full bg-background"
        />
      </div>
    </div>
  );
}
