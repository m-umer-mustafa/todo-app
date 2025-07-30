import React from "react";
import { Search, X, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  theme: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  search,
  onSearchChange,
  isSearchOpen,
  setIsSearchOpen,
  theme,
  toggleTheme,
}) => {
  return (
    <header
      className="
        flex items-center justify-between
        px-6 py-4 mx-6 my-4
        rounded-3xl border border-border shadow-md sticky top-0 z-20
        bg-white/20 dark:bg-black/20
        backdrop-blur-md
        bg-clip-padding
        "
    >
      {/* Left: Logo and Title */}
      <div className="flex items-center space-x-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-xl font-semibold text-foreground select-none">
          Todo App
        </h1>
        <span className="text-muted-foreground text-4xl font-thin">|</span>

        <span className="text-sm mt-1 text-muted-foreground font-serif tracking-wide">
          by Muhammad Omer Mustafa
        </span>
      </div>

      {/* Center: Search bar and buttons */}
      <div className="flex items-center flex-1 justify-end ml-4 gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              pl-9 pr-10 py-2 rounded-full
              bg-white/30 dark:bg-black/30
              backdrop-blur-sm
              border border-border
              focus:ring-2 focus:ring-primary focus:outline-none
            "
            autoComplete="off"
          />
          {isSearchOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Theme toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="
            rounded-full
            bg-white/30 dark:bg-black/30
            backdrop-blur-sm
            border border-border
          "
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};
