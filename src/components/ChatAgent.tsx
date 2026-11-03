import React, { useState, useRef, useEffect } from 'react';
import { Scheme } from '../data/schemes';
import { Language, ChatMessage } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import { Send, Volume2, Sparkles, Bot, User, Loader2, RefreshCw } from 'lucide-react';

interface ChatAgentProps {
  schemes: Scheme[];
  selectedScheme?: Scheme;
  userProfile?: any;
  language: Language;
  onSpeakText: (text: string) => void;
}

export const ChatAgent: React.FC<ChatAgentProps> = ({
  schemes,
  selectedScheme,
  userProfile,
  language,
  onSpeakText
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं आपका सरकारी सहायक हूँ। आप किसी भी सरकारी योजना (जैसे PM-किसान, आयुष्मान भारत, विश्वकर्मा, आवास योजना) की पात्रता, दस्तावेज़ या आवेदन प्रक्रिया के बारे में पूछ सकते हैं। आप बोलकर भी सवाल पूछ सकते हैं!'
          : 'Namaste! I am your Sarkari Sahayak (Scheme Journey Agent). Ask me anything about central welfare schemes (PM-Kisan, Ayushman Bharat, PM Vishwakarma, PMAY), eligibility rules, KYC requirements, or application steps. You can also use voice input!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sampleQuestions = language === 'hi'
    ? [
        'मेरी 1.8 एकड़ कृषि भूमि है, PM-किसान योजना के लिए क्या नियम हैं?',
        'पीएम विश्वकर्मा योजना में बढ़ई और शिल्पकारों को क्या लाभ मिलते हैं?',
        'आयुष्मान भारत कार्ड बनवाने हेतु आवश्यक दस्तावेज़ कौन से हैं?',
        'अगर खतौनी में नाम अलग है तो क्या करना होगा?'
      ]
    : [
        'I have 1.8 acres of land, what are the rules for PM-Kisan?',
        'What toolkit grant and loans are given under PM Vishwakarma?',
        'What are the eligibility documents for Ayushman Bharat?',
        'How can I get my bank account seeded with Aadhaar NPCI?'
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          userProfile: userProfile || null,
          targetSchemeId: selectedScheme?.id || 'pm-kisan',
          language
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get response from Sarvam 105B');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No reply received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
            : 'Sorry, there was an issue retrieving the response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript) {
      handleSendMessage(transcript);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Agent Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold">
                {language === 'hi' ? 'सरकारी सहायक (सार्वम 105B)' : 'Sarkari Sahayak (Sarvam-105B)'}
              </h2>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-mono">
                Official RAG
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {language === 'hi'
                ? 'सरकारी योजनाओं की पात्रता, नियम व आवेदन सम्बन्धी सलाह'
                : 'Government welfare guidance, eligibility evaluation & form journey'}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                role: 'assistant',
                content:
                  language === 'hi'
                    ? 'वार्तालाप रीसेट कर दिया गया है। आप किसी भी योजना के बारे में पूछ सकते हैं।'
                    : 'Chat session reset. What welfare scheme would you like to inquire about?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ])
          }
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-blue-950 text-white'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-800" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-950 text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                  <span className="font-mono">{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => onSpeakText(msg.content)}
                      className="text-blue-700 hover:text-blue-950 font-semibold flex items-center gap-1 transition-colors"
                      title="Listen with Bulbul TTS"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'बुलबुल आवाज़ में सुनें' : 'Listen with Bulbul'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xs">
              <Bot className="w-4 h-4 text-amber-800" />
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
              <span>
                {language === 'hi'
                  ? 'सार्वम 105B उत्तर तैयार कर रहा है...'
                  : 'Sarvam-105B reasoning over official schemes...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider pl-1">
          {language === 'hi' ? 'सुझाव:' : 'Examples:'}
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar with Saaras STT Mic */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
        <VoiceRecorder
          onTranscribed={handleVoiceInput}
          languageCode={language === 'hi' ? 'hi-IN' : 'en-IN'}
          compact={true}
        />

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            language === 'hi'
              ? 'अपना सवाल लिखें या माइक से बोलें (उदा. क्या मुझे आवास योजना मिलेगी?)...'
              : 'Ask a question or speak via mic (e.g. Do I qualify for PMAY?)...'
          }
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900 transition-all"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className={`p-2.5 rounded-xl transition-colors flex items-center justify-center shrink-0 ${
            inputText.trim() && !isLoading
              ? 'bg-blue-950 text-white hover:bg-blue-900 shadow-xs'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
