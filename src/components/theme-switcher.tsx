"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun, MonitorCog } from "lucide-react";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-8">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={theme === "light"}
          className={theme === "light" ? "bg-accent" : ""}
          onClick={() => setTheme("light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={theme === "dark"}
          className={theme === "dark" ? "bg-accent" : ""}
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={theme === "system"}
          className={theme === "system" ? "bg-accent" : ""}
          onClick={() => setTheme("system")}
        >
          <MonitorCog className="h-[1.2rem] w-[1.2rem]" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
