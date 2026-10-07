"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  /** Light icon on dark fields; dark icon on light fields. */
  iconTone?: "light" | "dark";
};

export function PasswordInput({
  className,
  iconTone = "light",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((visible) => !visible)}
        className={cn(
          "focus-ring absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-1 transition-colors",
          iconTone === "light"
            ? "text-ivory hover:text-ivory/80"
            : "text-obsidian hover:text-obsidian/80",
        )}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
