'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import ChatWindow from '@/components/ChatWindow';
import RightSidebar from '@/components/RightSidebar';
import { ContextType } from '@/model/models';
import { useTranslation } from 'react-i18next';

import Cookies from 'js-cookie';

export default function Home() {
  const { i18n } = useTranslation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedContext, setSelectedContext] = useState<ContextType | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    Cookies.set("language", lng, { expires: 365 });
  };

  const handleLanguageSelect = (language: string) => {
    changeLanguage(language);
  }

  const handleCategorySelect = (context: ContextType | undefined) => {
    if (selectedContext === context) {
      context = undefined;
    }

    setSelectedContext(context);
    setLeftSidebarOpen(false); // Close sidebar on mobile after selection
  };


  useEffect(() => {
    const userLang: string | undefined = navigator.language || (navigator as any).userLanguage;
    let language = Cookies.get('language');

    if (!language && userLang) {
      language = userLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    }

    if (language) {
      changeLanguage(language);
    }

  }, []);

  if (!selectedLanguage) return <></>

  return (
    <div className={`h-screen min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLanguageSelect={handleLanguageSelect}
        darkMode={darkMode}
      />

      {/* Mobile Top Banner - Only visible on mobile */}
      <div className="lg:hidden bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-b border-rose-200/50 dark:border-rose-800/30 p-2 flex-shrink-0">
        <div className="flex items-center justify-center gap-2">
          <img
            src="https://images.pexels.com/photos/8468474/pexels-photo-8468474.jpeg?auto=compress&cs=tinysrgb&w=60&h=30&fit=crop"
            alt="Mobile Catholic Ad"
            className="w-12 h-6 object-cover rounded"
          />
          <p className="text-xs font-medium text-primary">Catholic Resources</p>
          <img
            src="https://images.pexels.com/photos/8468475/pexels-photo-8468475.jpeg?auto=compress&cs=tinysrgb&w=60&h=30&fit=crop"
            alt="Mobile Prayer Ad"
            className="w-12 h-6 object-cover rounded"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className={`
            fixed lg:relative z-30 w-80 bg-card border-r border-border parchment-texture
            transform transition-transform duration-300 ease-in-out
            ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            inset-y-0 lg:h-full
        `}>
          <LeftSidebar
            onClose={() => setLeftSidebarOpen(false)}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedContext}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow language={selectedLanguage} selectedContext={selectedContext} />
        </div>

        {/* Right Sidebar */}
        <div className={`
          fixed lg:relative z-30 w-80 bg-card border-l border-border parchment-texture
          transform transition-transform duration-300 ease-in-out right-0
          ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0 hidden lg:block
          inset-y-0 lg:h-full
        `}>
          <RightSidebar />
        </div>
      </div>

      {/* Mobile overlay */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
}