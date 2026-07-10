import "../../styles/studio-theme.css";
import { StudioNav } from "@/components/studio/StudioNav";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="studio-theme font-[family-name:var(--font-display)] min-h-screen">
      <StudioNav />
      <main>{children}</main>
    </div>
  );
}
