import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/features/i18n/languageStore";
import { cn } from "@/lib/utils";

interface LanguageDropdownProps {
  variant?: "light" | "default" | "minimal";
  className?: string;
}

export function LanguageDropdown({ variant = "default", className }: LanguageDropdownProps) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          translate="no"
          className={cn(
            "notranslate flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            variant === "light"
              ? "bg-white/15 text-white hover:bg-white/25"
              : "border border-border bg-card text-foreground hover:bg-accent/10 hover:text-accent",
            className,
          )}
          aria-label="Select Language"
        >
          <Globe className="size-3.5" />
          <span className="notranslate" translate="no">
            {language === "or" ? "ଓଡ଼ିଆ" : "English"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="notranslate w-36 z-50" translate="no">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className="notranslate flex items-center justify-between text-xs cursor-pointer"
        >
          <span className="notranslate" translate="no">English</span>
          {language === "en" && <Check className="size-3.5 text-accent" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("or")}
          className="notranslate flex items-center justify-between text-xs cursor-pointer font-medium"
        >
          <span className="notranslate" translate="no">ଓଡ଼ିଆ (Odia)</span>
          {language === "or" && <Check className="size-3.5 text-accent" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
