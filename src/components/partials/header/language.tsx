"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useThemeStore } from "@/store";

const languages = [
  {
    name: "en",
    label: "English",
  },
  {
    name: "vi",
    label: "Tiếng Việt",
  },
  {
    name: "bn",
    label: "বাংলা",
  },
  {
    name: "ar",
    label: "العربية",
  },
];

const Language = () => {
  type Language = {
    name: string;
    label: string;
  };

  const router = useRouter();
  const pathname = usePathname();
  const { setRtl } = useThemeStore();
  const found = pathname
    ? languages.find((lang) => pathname.includes(lang.name))
    : null;
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    found ?? languages[0]
  );

  const handleSelected = (lang: string) => {
    const selected = languages.find((l) => l.name === lang);
    if (selected) {
      setSelectedLanguage(selected);
    }
    setRtl(lang === "ar");
    if (pathname) {
      router.push(`/${lang}/${pathname.split("/")[2]}`);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" className="bg-transparent hover:bg-transparent">
          <Globe className="w-5 h-5 me-1.5 text-default-600" />
          <span className="text-sm text-default-600 capitalize">
            {selectedLanguage ? selectedLanguage.name : "En"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2">
        {languages.map((item, index) => (
          <DropdownMenuItem
            key={`flag-${index}`}
            className={cn(
              "py-1.5 px-2 cursor-pointer dark:hover:bg-background mb-[2px] last:mb-0",
              {
                "bg-primary-100 ":
                  selectedLanguage && selectedLanguage.name === item.name,
              }
            )}
            onClick={() => handleSelected(item.name)}
          >
            <span className="text-sm text-default-600 capitalize">
              {item.label}
            </span>
            {selectedLanguage && selectedLanguage.name === item.name && (
              <Check className="w-4 h-4 flex-none ltr:ml-auto rtl:mr-auto text-default-700" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Language;
