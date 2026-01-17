"use client";
import { useLanguage } from "@/app/context/languageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
          focus-visible:outline-none
          focus-visible:ring-0
          focus-visible:ring-offset-0
          focus-visible:ring-offset-background
          focus-visible:ring-offset-0
            flex items-center gap-1.5 sm:gap-2
            px-2 sm:px-3
            rounded-md
            text-lg sm:text-sm font-medium
            text-neutral-600 hover:text-foreground
            hover:bg-muted
            transition
          "
        >
          <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          {/* Hide full language label on very small screens */}
          <span className="hidden sm:inline">
            {locale === "en" ? "English" : "Português"}
          </span>
        
          <span className="sm:hidden text-xs uppercase">
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
