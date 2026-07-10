import * as React from "react";

import { cn } from "@/lib/utils";

interface PrimaryCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function PrimaryCta({ className, ...props }: PrimaryCtaProps) {
  return <button className={cn("studio-cta", className)} {...props} />;
}
