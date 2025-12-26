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
          className="gap-2 px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <Globe2 className="w-4 h-4" />
          {locale === "en" ? "English" : "Português"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32 shadow-lg">
        <DropdownMenuItem onClick={() => setLocale("en")}>
          English
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setLocale("pt")}>
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
