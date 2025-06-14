'use client';

import { useState, useEffect } from 'react';
import { Send, Mic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  threadId?: string;
  category?: string;
}

interface ChatWindowProps {
  selectedCategory: string | null;
}

export default function ChatWindow({ selectedCategory }: ChatWindowProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('welcomeMessage'),
      sender: 'ai',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCategoryPrompts = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '');
    switch (categoryKey) {
      case t('askCatechism').toLowerCase().replace(/\s+/g, ''):
        return t('catechismSuggestions', { returnObjects: true }) as string[];
      case t('exploreBible').toLowerCase().replace(/\s+/g, ''):
        return t('bibleSuggestions', { returnObjects: true }) as string[];
      case t('dailyPrayers').toLowerCase().replace(/\s+/g, ''):
        return t('prayerSuggestions', { returnObjects: true }) as string[];
      case t('moralTeachings').toLowerCase().replace(/\s+/g, ''):
        return t('moralSuggestions', { returnObjects: true }) as string[];
      case t('studyMode').toLowerCase().replace(/\s+/g, ''):
        return t('studySuggestions', { returnObjects: true }) as string[];
      case t('liturgicalCalendar').toLowerCase().replace(/\s+/g, ''):
        return t('liturgicalSuggestions', { returnObjects: true }) as string[];
      case t('confessionGuide').toLowerCase().replace(/\s+/g, ''):
        return t('confessionSuggestions', { returnObjects: true }) as string[];
      default:
        return t('catechismSuggestions', { returnObjects: true }) as string[];
    }
  };

  const getCategoryResponse = (category: string) => {
    if (category === t('askCatechism')) {
      return 'I\'m here to help you explore the rich teachings of the Catechism of the Catholic Church. What specific doctrine or teaching would you like to understand better?';
    } else if (category === t('exploreBible')) {
      return 'Let\'s dive into Sacred Scripture together. I can help you understand biblical passages, their context, and their meaning in Catholic tradition. What would you like to explore?';
    } else if (category === t('dailyPrayers')) {
      return 'Prayer is the heart of our relationship with God. I can guide you through traditional Catholic prayers, teach you new ones, or help you develop a deeper prayer life. How can I assist your prayer journey?';
    } else if (category === t('moralTeachings')) {
      return 'Catholic moral theology provides guidance for living a virtuous life. I can help you understand Church teachings on ethics, social justice, and moral decision-making. What moral question can I help you with?';
    } else if (category === t('studyMode')) {
      return 'I\'m ready to help you deepen your understanding of the Catholic faith through structured learning. Whether you\'re preparing for sacraments or simply want to learn more, I\'m here to guide you. What would you like to study?';
    } else if (category === t('liturgicalCalendar')) {
      return 'The liturgical year guides us through the mysteries of Christ\'s life. I can explain the seasons, feasts, and their spiritual significance. What aspect of the liturgical calendar interests you?';
    } else if (category === t('confessionGuide')) {
      return 'The Sacrament of Reconciliation is a beautiful gift of God\'s mercy. I can help you prepare for confession, understand the process, and grow in your spiritual life. How can I assist you?';
    }
    return 'As your Catholic spiritual assistant, I\'m here to help you explore the rich teachings of our faith. How would you like me to assist you further?';
  };

  useEffect(() => {
    if (selectedCategory) {
      const categoryMessage: Message = {
        id: Date.now().toString(),
        text: getCategoryResponse(selectedCategory),
        sender: 'ai',
        timestamp: Date.now(),
        category: selectedCategory
      };
      setMessages(prev => [...prev, categoryMessage]);
    }
  }, [selectedCategory, t]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI response based on category context
    setTimeout(() => {
      let responseText = `Thank you for your question about "${inputText}". `;
      
      if (selectedCategory) {
        if (selectedCategory === t('askCatechism')) {
          responseText += 'According to the Catechism of the Catholic Church, this teaching helps us understand our faith more deeply. Let me guide you through the relevant passages and their meaning for our spiritual life.';
        } else if (selectedCategory === t('exploreBible')) {
          responseText += 'This biblical passage reveals God\'s love and plan for us. Let me help you understand its context, meaning, and how it applies to your life as a Catholic.';
        } else if (selectedCategory === t('dailyPrayers')) {
          responseText += 'Prayer is our conversation with God. Let me guide you through this prayer and help you understand its significance in our Catholic tradition.';
        } else if (selectedCategory === t('moralTeachings')) {
          responseText += 'The Church\'s moral teaching provides clear guidance rooted in Scripture and Tradition. Let me explain the principles that can help you make decisions aligned with Catholic values.';
        } else if (selectedCategory === t('studyMode')) {
          responseText += 'This is an important aspect of Catholic doctrine. Let me break this down systematically to help you understand and remember these teachings.';
        } else if (selectedCategory === t('liturgicalCalendar')) {
          responseText += 'The liturgical calendar helps us live in rhythm with Christ\'s life and the Church\'s celebrations. Let me explain the significance of this season or feast.';
        } else if (selectedCategory === t('confessionGuide')) {
          responseText += 'The Sacrament of Reconciliation is a beautiful encounter with God\'s mercy. Let me guide you through this aspect of confession and help you prepare your heart.';
        } else {
          responseText += 'As your Catholic spiritual assistant, I\'m here to help you explore the rich teachings of our faith. How would you like me to assist you further?';
        }
      } else {
        responseText += 'As your Catholic spiritual assistant, I\'m here to help you explore the rich teachings of our faith. How would you like me to assist you further?';
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentSuggestions = selectedCategory ? 
    getCategoryPrompts(selectedCategory) : 
    t('catechismSuggestions', { returnObjects: true }) as string[];

  return (
    <div className="flex flex-col h-full">
      {/* Category Header */}
      {selectedCategory && (
        <div className="bg-primary/5 border-b border-border px-6 py-3 flex-shrink-0">
          <h2 className="text-lg font-semibold text-primary">{selectedCategory}</h2>
          <p className="text-sm text-muted-foreground">{t('askAnything')}</p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-3xl rounded-2xl p-4 sacred-shadow
                ${message.sender === 'user' 
                  ? 'bg-primary/10 text-foreground' 
                  : 'message-bubble text-foreground'
                }
              `}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/20">
                <span className="text-xs text-muted-foreground">
                  {message.sender === 'ai' ? t('appName') : t('you')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {mounted ? new Date(message.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-4 border-t border-border/20 flex-shrink-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {currentSuggestions.slice(0, 3).map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3"
              onClick={() => setInputText(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Advertisement Banner - Above Input Area */}
      <div className="px-6 pb-2 flex-shrink-0">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/30 p-3 sacred-shadow">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://images.pexels.com/photos/8468469/pexels-photo-8468469.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop" 
              alt="Catholic Education Advertisement"
              className="w-20 h-12 object-cover rounded-md"
            />
            <div className="flex-1 text-center">
              <p className="text-xs font-medium text-primary">Catholic Online Courses</p>
              <p className="text-xs text-muted-foreground">Theology • Scripture • Spirituality</p>
            </div>
            <img 
              src="https://images.pexels.com/photos/8468472/pexels-photo-8468472.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop" 
              alt="Spiritual Retreats Advertisement"
              className="w-20 h-12 object-cover rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-card/50 flex-shrink-0">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <Button variant="outline" size="sm" className="p-2 flex-shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedCategory ? 
                t('inputPlaceholderCategory', { category: selectedCategory.toLowerCase() }) : 
                t('inputPlaceholder')
              }
              className="min-h-[60px] pr-20 resize-none sacred-shadow"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Button variant="ghost" size="sm" className="p-2">
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSendMessage}
                size="sm" 
                className="p-2"
                disabled={!inputText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-3">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  );
}