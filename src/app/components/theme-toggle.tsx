"use client";

import { Moon, Sun } from "lucide-react";
import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.body.classList.toggle("dark-mode", savedTheme === "dark");
    } else {
      document.body.classList.add("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
    document.body.classList.toggle("light-mode", isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex max-w-fit items-center justify-center bg-transparent p-2 sm:right-4 sm:top-4"
    >
      {isDarkMode ? (
        <Sun className="text-yellow-300" />
      ) : (
        <Moon className="text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
