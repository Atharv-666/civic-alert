import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, FileText, Minimize2, MessageSquare } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function CivicAiChatbot({ onOpenReportWithData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaskar! 🙏 I am **CivicAI Assistant** for Salokhenagar, Kolhapur.\n\nDescribe any issue in your area (pothole, water leak, garbage, streetlight), and I can auto-fill the report form for you!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input.trim();
    const userMsg = {
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call backend AI chat endpoint
      const res = await axiosInstance.post('/ai/chat', { message: userMsgText });
      const botReply = res.data?.reply || 'I am ready to help you log this issue. Click below to open the auto-filled report!';

      // Check if message describes an issue to offer instant auto-fill action
      const isIssueReport = /pothole|water|leak|garbage|trash|light|drain|overflow|road|pipe|clean|broken/i.test(userMsgText);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          offerAutoFill: isIssueReport,
          suggestedText: userMsgText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('AI Chat API failed, using client bot fallback:', err.message);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you for sharing. I've analyzed your input regarding **"${userMsgText}"**. You can click below to automatically auto-fill and submit your report to Salokhenagar Municipal Officers!`,
          offerAutoFill: true,
          suggestedText: userMsgText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutoFillForm = async (text) => {
    try {
      const res = await axiosInstance.post('/ai/auto-fill', { prompt: text });
      if (res.data?.success && res.data?.data) {
        onOpenReportWithData(res.data.data);
      } else {
        onOpenReportWithData({ title: text, description: text, landmark: 'Salokhenagar, Kolhapur', category: 'Other' });
      }
    } catch {
      onOpenReportWithData({ title: text, description: text, landmark: 'Salokhenagar, Kolhapur', category: 'Other' });
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/20"
        >
          <Bot className="w-7 h-7 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
          </span>
          <div className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-700 pointer-events-none">
            Chat with CivicAI ✨
          </div>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="bg-slate-950 text-white rounded-3xl shadow-2xl border border-indigo-500/30 w-80 sm:w-96 flex flex-col h-[520px] overflow-hidden animate-scaleIn">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-indigo-500/30">
            <div className="flex items-center space-x-3">
              <div className="relative p-2 bg-indigo-600/40 rounded-xl border border-indigo-400/40 text-indigo-200">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <span>CivicAI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
                </h3>
                <p className="text-[10px] text-indigo-200/70">Salokhenagar Ward • Gemini AI Engine</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Offer Auto-Fill Action Button */}
                  {msg.offerAutoFill && (
                    <button
                      type="button"
                      onClick={() => triggerAutoFillForm(msg.suggestedText)}
                      className="mt-2.5 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] flex items-center justify-center space-x-1.5 shadow-md transition transform active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>⚡ Auto-Fill Report Form Now</span>
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs bg-slate-800/60 px-3 py-2 rounded-xl w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>CivicAI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/60 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInput('Report pothole on main road')}
              className="bg-slate-900 hover:bg-slate-800 text-indigo-300 px-2 py-1 rounded-lg shrink-0 border border-indigo-500/20"
            >
              🕳️ Pothole
            </button>
            <button
              onClick={() => setInput('Water pipe leak near water tank')}
              className="bg-slate-900 hover:bg-slate-800 text-indigo-300 px-2 py-1 rounded-lg shrink-0 border border-indigo-500/20"
            >
              🚰 Water Leak
            </button>
            <button
              onClick={() => setInput('Streetlights not working')}
              className="bg-slate-900 hover:bg-slate-800 text-indigo-300 px-2 py-1 rounded-lg shrink-0 border border-indigo-500/20"
            >
              💡 Streetlight
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI or describe a civic problem..."
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
