import { ButtonHTMLAttributes } from "react";

export function PillButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`dashboard-pill-btn ${className}`} {...props}>
      {children}
    </button>
  );
}
