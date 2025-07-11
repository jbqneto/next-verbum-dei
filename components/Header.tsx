'use client';

import { Cross, Menu, Sun, Moon, Calendar, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';

interface HeaderProps {
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onToggleDarkMode: () => void;
  onLanguageSelect: (lng: string) => void;
  darkMode: boolean;
}

export default function Header({
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onLanguageSelect,
  onToggleDarkMode,
  darkMode
}: HeaderProps) {
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    onLanguageSelect(lng);
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 sacred-shadow flex-shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLeftSidebar}
          className="lg:hidden p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Cross className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t('appName')}</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">{t('appSubtitle')}</p>
          </div>
        </div>

        {/* Bible Quote - Moved from Left Sidebar */}
        <div className="hidden lg:block ml-8 pl-8 border-l border-border">
          <p className="text-xs text-muted-foreground italic">
            "{t('bibleQuote')}"
          </p>
          <p className="text-xs text-muted-foreground font-medium">{t('bibleReference')}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeLanguage('en')}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('pt')}>
              Português
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        { /** TODO: Not working - FIx it latter

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleRightSidebar}
          className="lg:hidden p-2"
        >
          <Calendar className="h-5 w-5" />
        </Button>
         */}
      </div>
    </header>
  );
}