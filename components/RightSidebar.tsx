'use client';

import { Calendar, Star, BookOpen, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export default function RightSidebar() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Star className="h-5 w-5 text-primary" />
        {t('dailyCompanion')}
      </h2>

      {/* Today's Saint */}
      <Card className="sacred-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-full">
              <Star className="h-4 w-4 text-primary" />
            </div>
            {t('todaysSaint')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-primary mb-2">{t('saintName')}</h3>
          <p className="text-sm text-muted-foreground mb-3">{t('saintDescription')}</p>
          <Badge variant="secondary" className="text-xs">
            {t('feastDay')}: {t('saintFeast')}
          </Badge>
        </CardContent>
      </Card>

      {/* Liturgical Information */}
      <Card className="sacred-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            {t('liturgicalToday')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('color')}:</span>
              <Badge 
                className="text-xs bg-green-100 text-green-800"
              >
                {t('liturgicalColor')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('season')}:</span>
              <span className="text-sm font-medium">{t('liturgicalSeason')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('week')}:</span>
              <span className="text-sm font-medium">{t('liturgicalWeek')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advertisement Banner 1 - Between Liturgical and Verse */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30 p-4 sacred-shadow">
        <div className="text-center">
          <img 
            src="https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=300&h=100&fit=crop" 
            alt="Catholic Books Advertisement"
            className="w-full h-20 object-cover rounded-md mb-2"
          />
          <p className="text-xs text-muted-foreground">Catholic Books & Resources</p>
          <p className="text-xs font-medium text-primary">Deepen Your Faith</p>
        </div>
      </div>

      {/* Verse of the Day */}
      <Card className="sacred-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-full">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            {t('verseOfDay')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="text-sm italic text-foreground mb-3 leading-relaxed">
            "{t('verseText')}"
          </blockquote>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="font-medium">{t('verseReference')}</span>
            <span>{t('verseContext')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Word from Catechism */}
      <Card className="sacred-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-full">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            {t('wordOfDay')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-primary mb-2">{t('catechismWord')}</h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {t('catechismDefinition')}
          </p>
          <Badge variant="outline" className="text-xs">
            {t('catechismReference')}
          </Badge>
        </CardContent>
      </Card>

      {/* Advertisement Banner 2 - Before Prayer Reminder */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30 p-4 sacred-shadow">
        <div className="text-center">
          <img 
            src="https://images.pexels.com/photos/8468471/pexels-photo-8468471.jpeg?auto=compress&cs=tinysrgb&w=300&h=80&fit=crop" 
            alt="Pilgrimage Tours Advertisement"
            className="w-full h-16 object-cover rounded-md mb-2"
          />
          <p className="text-xs text-muted-foreground">Holy Land Pilgrimages</p>
          <p className="text-xs font-medium text-primary">Walk in His Footsteps</p>
        </div>
      </div>

      {/* Prayer Reminder */}
      <Card className="sacred-shadow bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm font-medium text-primary mb-2">{t('prayerReminder')}</p>
            <p className="text-xs text-muted-foreground italic">
              "{t('prayerReminderText')}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t('prayerReminderVerse')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}