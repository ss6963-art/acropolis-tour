
import React, { useState, useRef, useEffect } from 'react';
import { getGuideInsights } from '../services/geminiService';
import { GroundingChunk } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  links?: GroundingChunk[];
}

interface GuidePanelProps {
  activeStopName: string;
  activeStopLocation: { latitude: number; longitude: number };
}

const GuidePanel: React.FC<GuidePanelProps> = ({ activeStopName, activeStopLocation }) => {
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

    const contextPrompt = `I am at the ${activeStopName}. ${text}`;
    const result = await getGuideInsights(contextPrompt, activeStopLocation);

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
        isOpen ? 'h-[85vh]' : 'h-[110px]'
      }`}
    >
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="h-full glass rounded-t-[40px] border-t border-stone-200/50 shadow-2xl flex flex-col overflow-hidden">
        <div 
          className="w-full flex justify-center py-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-12 h-1.5 bg-stone-300 rounded-full"></div>
        </div>

        {isOpen ? (
          <>
            <div className="px-6 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-ancient font-bold text-stone-800 text-lg">Acropolis Guide</h3>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                  At: {activeStopName}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-12 opacity-50">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-feather-pointed text-amber-600 text-xl"></i>
                  </div>
                  <p className="text-sm font-medium italic">"Tell me a hidden detail about this spot..."</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-3xl text-[15px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-amber-600 text-white rounded-br-none shadow-md shadow-amber-200' 
                      : 'bg-stone-100 text-stone-800 rounded-bl-none border border-stone-200'
                  }`}>
                    {msg.text}
                    {msg.links && msg.links.some(l => l.maps) && (
                      <div className="mt-4 space-y-2">
                        {msg.links.map((link, lIdx) => link.maps && (
                          <a 
                            key={lIdx} 
                            href={link.maps.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-amber-700 font-bold text-xs bg-white/80 p-3 rounded-2xl border border-amber-100"
                          >
                            <i className="fa-solid fa-map-location-dot text-amber-600"></i>
                            <span className="truncate">{link.maps.title || "View on Maps"}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 p-4 text-amber-600 animate-pulse items-center">
                  <i className="fa-solid fa-hourglass-half"></i>
                  <span className="text-xs font-bold uppercase tracking-widest">Consulting scrolls...</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="px-6" onClick={() => setIsOpen(true)}>
             <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-1">AI Archaeologist</h4>
             <p className="text-[13px] text-stone-500 font-medium truncate">Ask anything about the {activeStopName}...</p>
          </div>
        )}

        <div className="p-4 bg-white/60 pt-2 pb-[env(safe-area-inset-bottom,24px)]">
          <div className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              onFocus={() => !isOpen && setIsOpen(true)}
              placeholder="Message your guide..."
              className="w-full pl-6 pr-14 py-4.5 bg-white rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all border border-stone-200 shadow-inner"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-stone-900 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-transform shadow-xl"
            >
              <i className="fa-solid fa-arrow-up text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePanel;
