import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      appName: "Verbum Dei AI",
      appSubtitle: "Catholic Spiritual Assistant",

      // Left Sidebar
      exploreTitle: "Explore Faith",
      askCatechism: "Ask about the Catechism",
      exploreBible: "Explore the Bible",
      dailyPrayers: "Daily Prayers",
      moralTeachings: "Moral Teachings",
      studyMode: "Study Mode",
      liturgicalCalendar: "Liturgical Calendar",
      confessionGuide: "Confession Guide",
      spiritualGuide: "Spiritual Guide",

      // Right Sidebar
      dailyCompanion: "Daily Spiritual Companion",
      todaysSaint: "Today's Saint",
      liturgicalToday: "Liturgical Today",
      verseOfDay: "Verse of the Day",
      wordOfDay: "Word of the Day",
      prayerReminder: "Prayer Reminder",
      feastDay: "Feast Day",
      color: "Color",
      season: "Season",
      week: "Week",

      // Chat
      welcomeMessage: "Peace be with you! I am Verbum Dei AI, your Catholic spiritual assistant. How may I help you deepen your faith today?",
      askAnything: "Ask me anything about this topic",
      inputPlaceholder: "Ask about faith, doctrine, prayers, or spiritual guidance...",
      inputPlaceholderCategory: "Ask about {{category}}...",
      disclaimer: "Verbum Dei AI can make mistakes. Always consult with your priest or spiritual director for important matters.",
      you: "You",
      requestError: 'Sorry but we are having problems on our servers now. Try again latter',

      // Suggestions
      catechismSuggestions: [
        "What does the Catechism say about prayer?",
        "Explain the Trinity according to Catholic teaching",
        "What are the seven sacraments?"
      ],
      bibleSuggestions: [
        "Help me understand today's Gospel",
        "What is the significance of the Beatitudes?",
        "Explain the parable of the Good Samaritan"
      ],
      prayerSuggestions: [
        "Teach me the Rosary",
        "What are the traditional Catholic prayers?",
        "Guide me through morning prayers"
      ],
      moralSuggestions: [
        "What does the Church teach about social justice?",
        "Explain Catholic bioethics",
        "What are the works of mercy?"
      ],
      studySuggestions: [
        "Help me prepare for Confirmation",
        "Explain the structure of the Mass",
        "What are the theological virtues?"
      ],
      liturgicalSuggestions: [
        "What is the significance of Advent?",
        "Explain the Easter season",
        "What are the holy days of obligation?"
      ],
      confessionSuggestions: [
        "Guide me through an examination of conscience",
        "What are the steps of a good confession?",
        "Help me understand the Act of Contrition"
      ],

      // Sample data
      saintName: "St. Francis of Assisi",
      saintDescription: "Founder of the Franciscan order, known for his devotion to poverty and nature.",
      saintFeast: "October 4",
      liturgicalColor: "Green",
      liturgicalSeason: "Ordinary Time",
      liturgicalWeek: "27th Week",
      verseText: "Be it done unto me according to your word.",
      verseReference: "Luke 1:38",
      verseContext: "The Annunciation",
      catechismWord: "Grace",
      catechismDefinition: "Grace is favor, the free and undeserved help that God gives us to respond to his call.",
      catechismReference: "CCC 1996",
      prayerReminderText: "Pray without ceasing, give thanks in all circumstances.",
      prayerReminderVerse: "1 Thessalonians 5:17-18",
      bibleQuote: "The Word became flesh and made his dwelling among us.",
      bibleReference: "John 1:14"
    }
  },
  pt: {
    translation: {
      // Header
      appName: "Verbum Dei AI",
      appSubtitle: "Assistente Espiritual Católico",

      // Left Sidebar
      exploreTitle: "Explorar a Fé",
      askCatechism: "Perguntar sobre o Catecismo",
      exploreBible: "Explorar a Bíblia",
      dailyPrayers: "Orações Diárias",
      moralTeachings: "Ensinamentos Morais",
      studyMode: "Modo de Estudo",
      liturgicalCalendar: "Calendário Litúrgico",
      confessionGuide: "Guia de Confissão",
      spiritualGuide: "Guia Espiritual",

      // Right Sidebar
      dailyCompanion: "Companheiro Espiritual Diário",
      todaysSaint: "Santo do Dia",
      liturgicalToday: "Litúrgico Hoje",
      verseOfDay: "Versículo do Dia",
      wordOfDay: "Palavra do Dia",
      prayerReminder: "Lembrete de Oração",
      feastDay: "Dia da Festa",
      color: "Cor",
      season: "Tempo",
      week: "Semana",

      // Chat
      welcomeMessage: "A paz esteja convosco! Eu sou o Verbum Dei AI, seu assistente espiritual católico. Como posso ajudá-lo a aprofundar sua fé hoje?",
      askAnything: "Pergunte-me qualquer coisa sobre este tópico",
      inputPlaceholder: "Pergunte sobre fé, doutrina, orações ou orientação espiritual...",
      inputPlaceholderCategory: "Pergunte sobre {{category}}...",
      disclaimer: "Verbum Dei AI pode cometer erros. Sempre consulte seu padre ou diretor espiritual para assuntos importantes.",
      you: "Você",
      requestError: 'Desculpa, mas estamos com um problema em nosso servidor agora. Tente mais tarde.',

      // Suggestions
      catechismSuggestions: [
        "O que o Catecismo diz sobre a oração?",
        "Explique a Trindade segundo o ensinamento católico",
        "Quais são os sete sacramentos?"
      ],
      bibleSuggestions: [
        "Ajude-me a entender o Evangelho de hoje",
        "Qual é o significado das Bem-aventuranças?",
        "Explique a parábola do Bom Samaritano"
      ],
      prayerSuggestions: [
        "Ensine-me o Rosário",
        "Quais são as orações tradicionais católicas?",
        "Guie-me através das orações matinais"
      ],
      moralSuggestions: [
        "O que a Igreja ensina sobre justiça social?",
        "Explique a bioética católica",
        "Quais são as obras de misericórdia?"
      ],
      studySuggestions: [
        "Ajude-me a me preparar para a Crisma",
        "Explique a estrutura da Missa",
        "Quais são as virtudes teologais?"
      ],
      liturgicalSuggestions: [
        "Qual é o significado do Advento?",
        "Explique o tempo pascal",
        "Quais são os dias santos de preceito?"
      ],
      confessionSuggestions: [
        "Guie-me através de um exame de consciência",
        "Quais são os passos de uma boa confissão?",
        "Ajude-me a entender o Ato de Contrição"
      ],

      // Sample data
      saintName: "São Francisco de Assis",
      saintDescription: "Fundador da ordem franciscana, conhecido por sua devoção à pobreza e à natureza.",
      saintFeast: "4 de outubro",
      liturgicalColor: "Verde",
      liturgicalSeason: "Tempo Comum",
      liturgicalWeek: "27ª Semana",
      verseText: "Faça-se em mim segundo a vossa palavra.",
      verseReference: "Lucas 1:38",
      verseContext: "A Anunciação",
      catechismWord: "Graça",
      catechismDefinition: "A graça é o favor, a ajuda gratuita e imerecida que Deus nos dá para responder ao seu chamado.",
      catechismReference: "CIC 1996",
      prayerReminderText: "Orai sem cessar, dai graças em todas as circunstâncias.",
      prayerReminderVerse: "1 Tessalonicenses 5:17-18",
      bibleQuote: "O Verbo se fez carne e habitou entre nós.",
      bibleReference: "João 1:14"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;