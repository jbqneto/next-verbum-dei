'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Plus, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { ContextType } from '@/model/models';

import Cookies from 'js-cookie';
import { cleanHtmlResponse } from '@/app/common/util';

const COOLDOWN_MS = Number(process.env.NEXT_PUBLIC_COOLDOWN || 120) * 1000;
const MAX_LENGTH = 120;

const CONFESSION_FILES = {
  'en': '/files/confession-en.pdf',
  'pt': '/files/confissao-Pe-Paulo.pdf'
}

interface Message {
  id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'ai';
  threadId?: string;
  context?: ContextType;
}

interface ChatWindowProps {
  selectedContext: ContextType | undefined;
  language: string
}

export default function ChatWindow({ selectedContext, language }: ChatWindowProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const [lastMessage, setLastMessage] = useState<Date | null>(null);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      timestamp: Date.now(),
      text: t('welcomeMessage'),
      sender: 'ai',
    }
  ]);

  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const threadId = Cookies.get('threadId');
    const lastMessage = Cookies.get('lastMessage');

    setThreadId(threadId);

    if (lastMessage) {
      setLastMessage(new Date(lastMessage));
    }

    setMounted(true);

    setTimeout(() => {
      setLoading(false);
    }, 5_000);

  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {

    if (cooldown > 0) {
      setTimeout(() => {
        setCooldown(cooldown - 1000);
      }, 1000);
    }

  }, [cooldown]);

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

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading || cooldown > 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      context: selectedContext,
      timestamp: Date.now(),
      text: inputText,
      sender: 'user'
    };

    setLoading(true);
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    try {

      const res = await fetch("/api/assistant", {
        method: "POST",
        body: JSON.stringify({ threadId, message: inputText, contextType: selectedContext, language }),
      });

      const newThreadId = res.headers.get("X-Thread-Id");

      setLastMessage(new Date());

      if (newThreadId) setThreadId(newThreadId);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      let isDone = false;

      while (!isDone) {
        let { done, value } = await reader.read();

        isDone = done;

        if (value) {

          assistantText += decoder.decode(value);

          console.log("TExt: assista")

        }
      }

      if (assistantText === "") {

        setMessages(prev => [
          ...prev, {
            sender: "ai",
            text: t('requestError'),
            timestamp: now,
            id: now.toString(),
            context: selectedContext,
            threadId
          }]);

        return;
      }

      const now = Date.now();

      const data = JSON.parse(assistantText);

      console.log("Text data: ", data);

      const text = data.message?.content.reduce((prev: string, current: any) => {
        if (current.type !== "text") return prev;

        return prev + " " + cleanHtmlResponse(current.text?.value);
      }, "");

      setMessages(prev => [
        ...prev, {
          sender: "ai",
          text,
          timestamp: now,
          id: now.toString(),
          context: selectedContext,
          threadId
        }]);

    } catch (error) {
      console.error("Error on API", error);
    } finally {
      setLoading(false);
      setCooldown(COOLDOWN_MS);
    }

  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentSuggestions = selectedContext ?
    getCategoryPrompts(selectedContext) :
    t('catechismSuggestions', { returnObjects: true }) as string[];

  return (
    <div className="flex flex-col h-full">
      {/* Category Header */}
      {selectedContext && (
        <div className="bg-primary/5 border-b border-border px-6 py-3 flex-shrink-0">
          <h2 className="text-lg font-semibold text-primary">{selectedContext}</h2>
          <p className="text-sm text-muted-foreground">{t('askAnything')}</p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, i) => (
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
              <div dangerouslySetInnerHTML={{ __html: message.text }} className="text-sm leading-relaxed" />
              <div ref={i === messages.length - 1 ? scrollRef : undefined} className="flex justify-between items-center mt-3 pt-2 border-t border-border/20">
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

      {/* TODO: Maybe add latter > Suggested Questions 
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

      */}

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
        {
          cooldown > 0 ? (
            <div className="text-center text-sm text-gray-500">
              ⏳ Aguarde {Math.ceil(cooldown / 1000)} segundos para enviar nova pergunta.
            </div>
          ) : (

            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <div className="text-xs text-right text-muted-foreground">
                  {inputText.length} / {MAX_LENGTH}
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={MAX_LENGTH}
                  disabled={loading || cooldown > 0}
                  placeholder={selectedContext ?
                    t('inputPlaceholderCategory', { category: selectedContext.toLowerCase() }) :
                    t('inputPlaceholder')
                  }
                  className="min-h-[60px] pr-20 resize-none sacred-shadow"
                  rows={1}
                />

                <div className="absolute right-2 bottom-2 flex gap-1">
                  {/** TODO: Maybe add this latter
                  <Button variant="ghost" size="sm" className="p-2">
                    <Mic className="h-4 w-4" />
                  </Button>
                   */}
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="p-2"
                    disabled={loading || !inputText.trim()}
                  >
                    {loading ? (
                      <LoaderCircle className='animate-spin' />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        <p className="text-xs text-muted-foreground text-center mt-3">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  );
}