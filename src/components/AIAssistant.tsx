import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2, Mic, MicOff } from 'lucide-react';
import { useLivePrices } from '../context/LivePriceContext';
import { useAuth } from '../hooks/useAuth';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your Market AI. To start analyzing stocks and trends, please sign in.", sender: 'ai', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { prices } = useLivePrices();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();

    // 1. Price Check
    const stockMatch = Object.keys(prices).find(symbol => lowerQuery.includes(symbol.toLowerCase()));
    if (stockMatch) {
      const data = prices[stockMatch];
      const trend = data.change >= 0 ? 'bullish' : 'bearish';
      const emoji = data.change >= 0 ? '🚀' : '📉';

      if (lowerQuery.includes('analyze') || lowerQuery.includes('analysis')) {
        return `${stockMatch} is currently trading at ₹${data.price.toFixed(2)}.\n\nTechnical Analysis: \n• Trend: ${trend.toUpperCase()} \n• RSI: ${Math.floor(Math.random() * 40 + 30)} (Neutral) \n• Support: ₹${(data.price * 0.95).toFixed(2)} \n• Resistance: ₹${(data.price * 1.05).toFixed(2)} \n\nRecommendation: ${data.change > 0 ? 'Hold for targets.' : 'Wait for reversal.'}`;
      }

      return `${stockMatch} is trading at ₹${data.price.toFixed(2)} (${data.change > 0 ? '+' : ''}${data.changePercent}%). ${emoji}`;
    }

    // 2. Market Overview
    if (lowerQuery.includes('market') || lowerQuery.includes('nifty')) {
      const nifty = prices['NIFTY 50'];
      if (!nifty) return "Market data is loading...";
      return `The market is ${nifty.change >= 0 ? 'Green' : 'Red'} today. NIFTY 50 is at ${nifty.price.toFixed(2)}. Sentiment is ${nifty.change >= 0 ? 'Positive' : 'Cautious'}.`;
    }

    // 3. General Help
    return "I can help with real-time prices and analysis. Try asking 'Price of RELIANCE' or 'Analyze TATASTEEL'.";
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.name.includes('Google') || voice.name.includes('Female'));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 1.1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const responseText = generateResponse(userMsg.text);
      const aiMsg: Message = { id: Date.now() + 1, text: responseText, sender: 'ai', timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      speakResponse(responseText);
    }, 1000);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    setIsListening(true);
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(undefined, transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white animate-pulse" />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
          }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Trade Assistant AI</h3>
            <p className="text-blue-100 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-200' : 'bg-blue-100'
                }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-blue-600" />}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={(e) => handleSend(e)} className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl transition ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              title="Voice Command"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={!user ? "Please sign in to chat..." : (isListening ? "Listening..." : "Ask about a stock...")}
              className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              disabled={!user || isListening}
            />
            <button
              type="submit"
              disabled={!user || !input.trim() || isTyping}
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form >
      </div >
    </>
  );
}
