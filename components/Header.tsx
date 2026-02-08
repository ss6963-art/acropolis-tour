
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-stone-200/50 pt-[env(safe-area-inset-top)] px-5 pb-4">
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 p-2 rounded-xl shadow-md shadow-amber-200">
            <i className="fa-solid fa-columns-paned text-white text-lg"></i>
          </div>
          <div>
            <h1 className="font-ancient text-lg font-bold text-stone-900 tracking-tight leading-none">Acropolis</h1>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1">Live Navigator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 rounded-full pl-2 pr-3 py-1 flex items-center gap-1.5 border border-stone-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-stone-600 uppercase">Feb 16</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
