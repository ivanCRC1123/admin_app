import type { ReactNode } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple"
  | "orange"
  | "cyan"
  | "default";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  error: "bg-red-500/20 text-red-400",
  info: "bg-blue-500/20 text-blue-400",
  purple: "bg-purple-500/20 text-purple-400",
  orange: "bg-orange-500/20 text-orange-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  default: "bg-zinc-700 text-gray-300",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  pill?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = "default",
  pill = false,
  className = "",
}: BadgeProps) => {
  return (
    <span
      className={`inline-block ${pill ? "rounded-full" : "rounded-lg"} px-2 py-1 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
