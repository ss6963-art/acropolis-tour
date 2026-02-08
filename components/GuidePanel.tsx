
import React, { useState, useRef, useEffect } from 'react';
import { getGuideInsights } from '../services/geminiService';
import { GroundingChunk } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  links?: GroundingChunk[];
}

const GuidePanel: React.FC<{ activeStopName: string }> = ({ activeStopName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;
    
    setIsOpen(true);
    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const contextPrompt = `I am currently standing at the ${activeStopName}. ${text}`;
    const result = await getGuideInsights(contextPrompt);

    setMessages(prev => [...prev, {
      role: 'assistant',
      text: result.text,
      links: result.groundingChunks
    }]);
    setIsTyping(false);
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
        isOpen ? 'h-[80vh]' : 'h-[110px]'
      }`}
    >
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="h-full glass rounded-t-[40px] border-t border-stone-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
        {/* Drag Handle */}
        <div 
          className="w-full flex justify-center py-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-10 h-1 bg-stone-300 rounded-full"></div>
        </div>

        {/* Content Area */}
        {isOpen ? (
          <>
            <div className="px-5 pb-2 flex items-center justify-between">
              <h3 className="font-ancient font-bold text-stone-800">Guide Chat</h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
                <i className="fa-solid fa-circle-xmark text-xl"></i>
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-2 space-y-4 no-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-wand-magic-sparkles text-amber-600"></i>
                  </div>
                  <p className="text-sm text-stone-500 italic">"What are the best angles for a photo here?"</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-amber-600 text-white rounded-br-none' 
                      : 'bg-stone-100 text-stone-800 rounded-bl-none border border-stone-200'
                  }`}>
                    {msg.text}
                    {msg.links && msg.links.map((link, lIdx) => link.maps && (
                      <a 
                        key={lIdx} 
                        href={link.maps.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-2 text-blue-600 text-xs bg-white p-2 rounded-xl border border-stone-200"
                      >
                        <i className="fa-solid fa-location-arrow"></i>
                        <span className="truncate">{link.maps.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-xs text-stone-400 animate-pulse">Guide is thinking...</div>}
            </div>
          </>
        ) : (
          <div className="px-5">
             <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">Ask your Guide</h4>
             <p className="text-xs text-stone-400 truncate mb-3">"Tell me more about the statues..."</p>
          </div>
        )}

        {/* Input area fixed at bottom of sheet */}
        <div className="p-4 bg-white/50 pt-2 pb-[env(safe-area-inset-bottom,20px)]">
          <div className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              onFocus={() => !isOpen && setIsOpen(true)}
              placeholder="Message the Guide..."
              className="w-full pl-5 pr-12 py-4 bg-stone-100/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all border border-stone-200"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-md"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePanel;
