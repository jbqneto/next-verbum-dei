'use client';

import { 
  Search, 
  BookOpen, 
  Heart, 
  Brain, 
  GraduationCap, 
  Calendar, 
  Cross,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LeftSidebarProps {
  onClose: () => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

export default function LeftSidebar({ onClose, onCategorySelect, selectedCategory }: LeftSidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    { icon: Search, label: t('askCatechism'), color: 'text-blue-600' },
    { icon: BookOpen, label: t('exploreBible'), color: 'text-green-600' },
    { icon: Heart, label: t('dailyPrayers'), color: 'text-red-600' },
    { icon: Brain, label: t('moralTeachings'), color: 'text-purple-600' },
    { icon: GraduationCap, label: t('studyMode'), color: 'text-orange-600' },
    { icon: Calendar, label: t('liturgicalCalendar'), color: 'text-indigo-600' },
    { icon: Cross, label: t('confessionGuide'), color: 'text-amber-600' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Close Button */}
      <div className="flex-shrink-0 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('exploreTitle')}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-6">
        <nav>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedCategory === item.label;
              
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start p-3 h-auto text-left hover:bg-accent/50 transition-all duration-200",
                    isActive && "bg-accent/20 border-l-4 border-primary"
                  )}
                  onClick={() => onCategorySelect(item.label)}
                >
                  <Icon className={cn("h-5 w-5 mr-3 flex-shrink-0", item.color)} />
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Advertisement Banner - Above Footer */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30 p-3 sacred-shadow">
          <div className="text-center">
            <img 
              src="https://images.pexels.com/photos/8468473/pexels-photo-8468473.jpeg?auto=compress&cs=tinysrgb&w=250&h=60&fit=crop" 
              alt="Catholic Apps Advertisement"
              className="w-full h-12 object-cover rounded-md mb-2"
            />
            <p className="text-xs text-muted-foreground">Catholic Prayer Apps</p>
            <p className="text-xs font-medium text-primary">Pray Anywhere, Anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}