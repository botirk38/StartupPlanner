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
      setTheme(localStorage.getItem('theme') as Theme || 'light');
      setLanguage(localStorage.getItem('language') as Language || 'en');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleThemeChange = (value: Theme) => setTheme(value);
  const handleLanguageChange = (value: Language) => setLanguage(value);

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

