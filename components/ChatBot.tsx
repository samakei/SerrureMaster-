import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, User } from '../types';
import { LOGO_URL } from '../constants';

interface ChatBotProps {
  user?: User | null;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ user, isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use external control if provided, otherwise internal state
  const isChatOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // Determine user status
  const isCustomer = !!(user && user.purchasedProductIds.length > 0);

  // Initial Message Logic - Updated to strict Script
  const initialMessageText = isCustomer
    ? "Bonjour, vous êtes en contact avec l’assistance SerrureMaster.\n\nJe suis là pour vous orienter dans l'utilisation de vos guides.\nPour rappel, je ne peux pas fournir d'instructions techniques détaillées ici.\n\nComment puis-je vous aider ?"
    : 'Bonjour, vous êtes en contact avec l’assistance SerrureMaster.\n\nNous proposons un accompagnement pédagogique à distance pour certaines situations de serrurerie compatibles.\n\nJe vais vous poser quelques questions pour vérifier votre situation.\n\nLa porte est-elle simplement claquée ou fermée à clé ?';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: initialMessageText,
      timestamp: Date.now(),
    },
  ]);

  // Reset messages if user logs in/out while chat is open
  useEffect(() => {
    setMessages([
      {
        role: 'model',
        text: initialMessageText,
        timestamp: Date.now(),
      },
    ]);
  }, [isCustomer]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini service
    const history = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const responseText = await sendMessageToGemini(history, userMsg.text, isCustomer);

    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isChatOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-green-500/40 transition-all duration-300 z-50 flex items-center justify-center animate-bounce-subtle group"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
          <span className="ml-2 font-semibold text-xs sm:text-sm hidden sm:inline">Support</span>
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200 animate-slideUp origin-bottom-right">
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center">
              <div className="bg-white/10 p-1.5 rounded-full mr-3 border border-white/20 backdrop-blur-sm">
                <img
                  src={LOGO_URL}
                  alt="Bot"
                  className="h-6 w-6 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  Support <span className="hidden sm:inline">SerrureMaster</span>
                </h3>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  <p className="text-xs text-slate-300">En ligne</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition text-slate-300 hover:text-white"
              aria-label="Fermer le chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent bg-opacity-30">
            {/* WhatsApp-like Background Pattern hint */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage:
                  'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundSize: '400px',
              }}
            ></div>

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                } relative z-10`}
              >
                {msg.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 mr-2 mt-auto flex items-center justify-center border border-slate-300">
                    <Bot className="w-3 h-3 text-slate-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#dcf8c6] text-slate-900 rounded-br-sm border border-green-200'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] text-right mt-1 ${
                      msg.role === 'user' ? 'text-green-800/60' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start relative z-10">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 mr-2 mt-auto flex items-center justify-center">
                  <Bot className="w-3 h-3 text-slate-600" />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-sm flex items-center space-x-1.5 shadow-sm">
                  <div
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[#f0f2f5] border-t border-slate-200">
            <div className="flex items-center bg-white rounded-full px-1 py-1 border border-transparent focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-100 transition-all shadow-sm">
              <label htmlFor="chatbot-input" className="sr-only">
                Écrivez votre message
              </label>
              <input
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Écrivez un message..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-500 px-4 py-2"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label="Envoyer le message"
                className={`p-2 rounded-full transition-all duration-200 ${
                  input.trim()
                    ? 'bg-green-600 text-white shadow-md hover:scale-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
