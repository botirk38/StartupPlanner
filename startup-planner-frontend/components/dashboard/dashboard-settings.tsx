import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import SettingsIcon from "../icons/settings-icon";
import { DialogClose } from "@radix-ui/react-dialog";

type Theme = 'light' | 'dark';
type Language = 'en' | 'es' | 'fr';

function DashboardSettings({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme) || 'light' : 'light');
  const [language, setLanguage] = useState<Language>(typeof window !== 'undefined' ? (localStorage.getItem('language') as Language) || 'en' : 'en');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  function toggleSettings() {
    setSettingsOpen(!settingsOpen);
  }

  function handleThemeChange(value: Theme) {
    setTheme(value);
  }

  function handleLanguageChange(value: Language) {
    setLanguage(value);
  }

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center p-2 justify-start hover:bg-accent hover:text-accent-foreground rounded-lg dark:text-gray-100 dark:hover:bg-gray-700">
        <SettingsIcon className="h-5 w-5" />
        {sidebarOpen && <span className="ml-2 dark:text-gray-100 ">Settings</span>}
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800">

        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Settings</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">Customize your dashboard settings</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="theme" className="text-right text-gray-900 dark:text-gray-100">
              Theme
            </Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger aria-label={`Theme: ${theme}`} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <SelectValue>{theme.charAt(0).toUpperCase() + theme.slice(1)}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <SelectItem value="light" aria-label="Light">Light</SelectItem>
                <SelectItem value="dark" aria-label="Dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="language" className="text-right text-gray-900 dark:text-gray-100">
              Language
            </Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger aria-label={`Language: ${language}`} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <SelectValue>{language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'French'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <SelectItem value="en" aria-label="English">English</SelectItem>
                <SelectItem value="es" aria-label="Spanish">Spanish</SelectItem>
                <SelectItem value="fr" aria-label="French">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={toggleSettings} className="bg-accent text-white dark:bg-blue-700">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DashboardSettings;

