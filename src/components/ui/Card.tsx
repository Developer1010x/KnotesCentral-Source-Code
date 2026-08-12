import type { ReactNode } from "react";

export function Card({
  interactive = false,
  className = "",
  children,
}: {
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${interactive ? "card-interactive" : "card"} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

/** The listing grid. Two columns is the readable maximum for these tiles. */
export function CardGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
