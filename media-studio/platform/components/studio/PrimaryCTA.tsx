import { ButtonHTMLAttributes } from "react";

export function PrimaryCTA({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`studio-cta ${className}`} {...props}>
      {children}
    </button>
  );
}
