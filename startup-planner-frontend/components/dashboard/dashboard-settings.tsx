"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import SettingsIcon from "../icons/settings-icon";
import { DialogClose } from "@radix-ui/react-dialog";
import SettingItem from "./setting-item";

type Theme = 'light' | 'dark';
type Language = 'en' | 'es' | 'fr';

const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French'
};

function DashboardSettings({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const savedLanguage = localStorage.getItem('language') as Language;

      if (savedTheme) setTheme(savedTheme);
      if (savedLanguage) setLanguage(savedLanguage);

      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const handleThemeChange = (value: Theme) => {
    setTheme((prevTheme) => {
      const newTheme = value;
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  }

  const handleLanguageChange = (value: Language) => {
    setLanguage((prevLanguage) => {
      const newLanguage = value;
      localStorage.setItem('language', newLanguage);
      return newLanguage;
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center text-gray-500 px-2.5 gap-4 justify-start hover:bg-accent hover:text-accent-foreground rounded-lg dark:text-gray-100 dark:hover:bg-gray-700">
        <SettingsIcon className="h-5 w-5" />
        {sidebarOpen && <span className="dark:text-gray-100">Settings</span>}
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Settings</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Customize your dashboard settings
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SettingItem
            label="Theme"
            value={theme}
            onValueChange={handleThemeChange}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
          <SettingItem
            label="Language"
            value={language}
            onValueChange={handleLanguageChange}
            options={Object.entries(LANGUAGES).map(([value, label]) => ({ value, label }))}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-accent text-white dark:bg-blue-700">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DashboardSettings;

