import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  RefreshCw,
  Bot,
  Compass,
  FileText,
  Building2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, Track } from '../types';
import { AIScholarshipEngine } from '../services/aiEngine';
import { useLanguage } from '../i18n/LanguageContext';

interface AIAssistantChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  onSelectTrackForApplication?: (trackId: string) => void;
  onNavigateToService?: (serviceKey: string) => void;
}

export const AIAssistantChatbot: React.FC<AIAssistantChatbotProps> = ({
  isOpen,
  onClose,
  tracks,
  onSelectTrackForApplication,
  onNavigateToService
}) => {
  const { isRtl } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 5 Explicit Suggested Questions mandated by user
  const primarySuggestedQuestions = isRtl ? [
    'ما المسار المناسب لي؟',
    'ما شروط مسار الرواد؟',
    'كيف أقدم على الابتعاث؟',
    'ما الجامعات المتاحة؟',
    'ما المستندات المطلوبة؟'
  ] : [
    'Which track is right for me?',
    'What are the requirements for Pioneers track?',
    'How do I apply for scholarship?',
    'What universities are available?',
    'What documents are required?'
  ];

  // Initialize Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: isRtl 
            ? `مرحباً بك في **المساعد الذكي للابتعاث** 🇸🇦!
أنا مستشارك الذكي المباشر لبرنامج الابتعاث. كيف يمكنني مساعدتك اليوم؟

يمكنك سؤالي عن:
- 🎯 **اختيار المسار المناسب** لمؤهلك وطموحك
- 📜 **شروط ومعايير القبول** في كل مسار (الرواد، إمداد، البحث والتطوير، التميز، الصحي، واعد)
- 🏛️ **البحث عن الجامعات** العالمية المعتمدة وتصنيفاتها
- 📝 **خطوات التقديم الإلكتروني** عبر بوابة الابتعاث الموحدة (kasp.moe.gov.sa)
- 📁 **المستندات المطلوبة** ومتطلبات اختبارات اللغة (IELTS / TOEFL)
- ⚡ **توجيهك للخدمة المناسبة** وإصدار الضمان المالي الرقمي`
            : `Welcome to the **AI Admission Assistant** 🇸🇦!
I am your dedicated real-time scholarship advisor. How may I assist you today?

You can ask me to:
- 🎯 **Help you choose the right track** for your qualifications & goals
- 📜 **Explain eligibility criteria & tracks** (Pioneers, Supply, R&D, Excellence, Health, Waed)
- 🏛️ **Explore accredited global universities** & rankings
- 📝 **Guide application steps** via the official Ministry scholarship portal (kasp.moe.gov.sa)
- 📁 **Review required documentation** & language tests (IELTS / TOEFL)
- ⚡ **Direct you to the right electronic service** or digital financial guarantee`,
          timestamp: new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: primarySuggestedQuestions
        }
      ]);
    }
  }, [isRtl, messages.length]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const responseText = await AIScholarshipEngine.generateAssistantResponse(query);
      
      setTimeout(() => {
        // Generate contextual suggested actions based on query
        let nextSuggested = primarySuggestedQuestions.slice(0, 3);
        const lower = query.toLowerCase();

        if (lower.includes('مسار') || lower.includes('مناسب') || lower.includes('رواد') || lower.includes('إمداد')) {
          nextSuggested = isRtl ? [
            'ما الجامعات المتاحة؟',
            'ما المستندات المطلوبة؟',
            'كيف أقدم على الابتعاث؟'
          ] : [
            'What universities are available?',
            'What documents are required?',
            'How do I apply for scholarship?'
          ];
        } else if (lower.includes('جامع') || lower.includes('جامعات') || lower.includes('university')) {
          nextSuggested = isRtl ? [
            'ما شروط مسار الرواد؟',
            'ما المستندات المطلوبة؟',
            'كيف أقدم على الابتعاث؟'
          ] : [
            'What are the requirements for Pioneers track?',
            'What documents are required?',
            'How do I apply for scholarship?'
          ];
        }

        const botMsg: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          sender: 'assistant',
          text: responseText,
          timestamp: new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: nextSuggested
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 600);
    } catch {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}-welcome`,
        sender: 'assistant',
        text: isRtl 
          ? `أهلاً بك مجدداً في **المساعد الذكي للابتعاث** 🇸🇦!
اختر أحد الأسئلة المقترحة أو اكتب استفسارك مباشرة:`
          : `Welcome back to the **AI Admission Assistant** 🇸🇦!
Pick a suggested question below or type your inquiry directly:`,
        timestamp: new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: primarySuggestedQuestions
      }
    ]);
  };

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 pointer-events-auto ${
        isExpanded 
          ? 'inset-3 sm:inset-8' 
          : `${isRtl ? 'bottom-4 left-4 sm:bottom-6 sm:left-6' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'} w-[94vw] sm:w-[440px] h-[620px] max-h-[85vh]`
      }`} 
      dir={isRtl ? 'rtl' : 'ltr'}
      id="ai-admission-assistant-modal"
    >
      <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-300/90 flex flex-col overflow-hidden ring-1 ring-slate-900/10">
        
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#005A36] to-slate-900 p-4 text-white flex items-center justify-between shadow-md relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 text-emerald-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-950 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                  {isRtl ? 'المساعد الذكي للابتعاث' : 'AI Admission Assistant'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-[10px] text-emerald-200 font-mono font-bold">
                  v2.5 AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90">
                {isRtl ? 'إرشاد المسارات • الجامعات • الشروط والتقديم' : 'Tracks, Universities & Application Guidance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-300">
            <button
              onClick={handleResetChat}
              title={isRtl ? 'بدء محادثة جديدة' : 'Reset conversation'}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? (isRtl ? 'تصغير' : 'Minimize') : (isRtl ? 'تكبير' : 'Expand')}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title={isRtl ? 'إغلاق' : 'Close'}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Service Action Shortcuts Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
          <button
            onClick={() => handleSendMessage(isRtl ? 'ما المسار المناسب لي؟' : 'Which track is right for me?')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#005A36] border border-slate-200 font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
          >
            <Compass className="w-3 h-3 text-emerald-600" />
            <span>{isRtl ? 'اختيار المسار' : 'Match Track'}</span>
          </button>
          <button
            onClick={() => handleSendMessage(isRtl ? 'ما الجامعات المتاحة؟' : 'What universities are available?')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#005A36] border border-slate-200 font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
          >
            <Building2 className="w-3 h-3 text-blue-600" />
            <span>{isRtl ? 'دليل الجامعات' : 'Universities'}</span>
          </button>
          <button
            onClick={() => handleSendMessage(isRtl ? 'ما المستندات المطلوبة؟' : 'What documents are required?')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#005A36] border border-slate-200 font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
          >
            <FileText className="w-3 h-3 text-amber-600" />
            <span>{isRtl ? 'المستندات' : 'Documents'}</span>
          </button>
          <button
            onClick={() => handleSendMessage(isRtl ? 'كيف أقدم على الابتعاث؟' : 'How do I apply for scholarship?')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#005A36] border border-slate-200 font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="w-3 h-3 text-[#005A36]" />
            <span>{isRtl ? 'خطوات التقديم' : 'How to Apply'}</span>
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAF9] text-xs leading-relaxed">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' 
                  ? (isRtl ? 'items-start' : 'items-end')
                  : (isRtl ? 'items-end' : 'items-start')
              }`}
            >
              <div className={`p-3.5 sm:p-4 rounded-2xl max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tl-xs shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-tr-xs'
              }`}>
                <div className="whitespace-pre-line text-xs sm:text-[13px] font-sans">
                  {msg.text}
                </div>
                <span className="block text-[10px] mt-2 text-slate-400 font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {/* Suggested Action Chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className={`flex flex-wrap gap-1.5 mt-2.5 max-w-[95%] ${isRtl ? 'justify-end' : 'justify-start'}`}>
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action)}
                      className="px-3 py-1.5 rounded-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-bold text-[11px] transition shadow-2xs hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-3 bg-white rounded-2xl w-fit border border-slate-200 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#005A36]" />
              <span>{isRtl ? 'المساعد الذكي يقوم بالتحقق وصياغة الإجابة المعتمدة...' : 'AI Advisor is checking scholarship regulations...'}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Questions Permanent Drawer when input is empty */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-white border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              {isRtl ? 'الأسئلة الأكثر شيوعاً:' : 'Suggested Questions:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {primarySuggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#005A36] border border-slate-200 transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar & Mandatory Disclaimer */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder={isRtl ? 'اكتب استفسارك (مثال: شروط الرواد، الجامعات المتاحة، المستندات)...' : 'Ask about tracks, requirements, universities, documents...'}
              className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#005A36] focus:ring-1 focus:ring-[#005A36] bg-slate-50/50"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 sm:px-4 rounded-xl bg-[#005A36] hover:bg-[#004328] active:bg-[#022c22] disabled:opacity-40 text-white font-bold transition shadow-md shadow-emerald-950/20 flex items-center justify-center gap-1 cursor-pointer shrink-0"
              title={isRtl ? 'إرسال' : 'Send'}
            >
              <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-400 font-medium">
            {isRtl 
              ? 'تنويه: النتيجة إرشادية ولا تمثل قرارًا رسميًا بالاستحقاق أو القبول.' 
              : 'Notice: Results are advisory and do not constitute an official admission or eligibility decision.'}
          </p>
        </div>

      </div>
    </div>
  );
};
