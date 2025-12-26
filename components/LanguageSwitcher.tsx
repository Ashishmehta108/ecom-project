"use client";
import { useLanguage } from "@/app/context/languageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe2 } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
            flex items-center gap-1.5 sm:gap-2
            px-2 sm:px-3
            rounded-md
            text-xs sm:text-sm font-medium
            text-muted-foreground hover:text-foreground
            hover:bg-muted
            transition
          "
        >
          <Globe2 className="w-4 h-4 sm:w-4 sm:h-4" />
          {/* Hide full language label on very small screens */}
          <span className="hidden sm:inline">
            {locale === "en" ? "English" : "Português"}
          </span>
          {/* Show short label on mobile */}
          <span className="sm:hidden uppercase">
            {locale === "en" ? "EN" : "PT"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-28 sm:w-32
          mt-2 shadow-lg rounded-md
        "
      >
        <DropdownMenuItem
          className="text-xs sm:text-sm"
          onClick={() => setLocale("en")}
        >
          English
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-xs sm:text-sm"
          onClick={() => setLocale("pt")}
        >
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
