
import React from 'react';
import { TourStop } from '../types';

interface TourCardProps {
  stop: TourStop;
  isActive: boolean;
  onClick: () => void;
}

const TourCard: React.FC<TourCardProps> = ({ stop, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative pl-10 pb-10 cursor-pointer transition-all duration-500 ${
        isActive ? 'scale-[1.02]' : 'scale-100 opacity-60'
      }`}
    >
      {/* Timeline Line */}
      <div className={`absolute left-[13px] top-0 bottom-0 w-[2px] ${
        isActive ? 'bg-amber-600' : 'bg-stone-200'
      } transition-colors duration-500`}></div>
      
      {/* Timeline Node */}
      <div className={`absolute left-0 top-1 w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all duration-500 z-10 ${
        isActive ? 'bg-amber-600 border-amber-100 scale-110 shadow-lg shadow-amber-200' : 'bg-white border-stone-200'
      }`}>
        {isActive ? (
          <i className="fa-solid fa-check text-[10px] text-white"></i>
        ) : (
          <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
        )}
      </div>

      <div className={`p-5 rounded-[24px] transition-all duration-500 ${
        isActive 
          ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-amber-100' 
          : 'bg-transparent border border-transparent'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            isActive ? 'text-amber-600' : 'text-stone-400'
          }`}>
            {stop.time}
          </span>
          {isActive && (
            <div className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
              Current Stop
            </div>
          )}
        </div>
        <h3 className={`font-ancient text-xl font-bold leading-tight ${
          isActive ? 'text-stone-900' : 'text-stone-600'
        }`}>{stop.title}</h3>
        
        {isActive && (
          <div className="mt-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-700">
            <p className="text-sm text-stone-500 leading-relaxed font-medium">
              {stop.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourCard;
