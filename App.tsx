
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TourCard from './components/TourCard';
import GuidePanel from './components/GuidePanel';
import { ACROPOLIS_STOPS } from './constants';

const App: React.FC = () => {
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  const requestLocation = () => {
    if (isTestMode) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          let nearestIndex = activeStopIndex;
          let minDistance = Infinity;
          
          ACROPOLIS_STOPS.forEach((stop, index) => {
            const d = Math.sqrt(
              Math.pow(stop.latitude - latitude, 2) + 
              Math.pow(stop.longitude - longitude, 2)
            );
            if (d < minDistance) {
              minDistance = d;
              nearestIndex = index;
            }
          });
          
          // Auto-select if very close (site radius)
          if (minDistance < 0.005) { 
             setActiveStopIndex(nearestIndex);
          }
        },
        (error) => console.warn(error),
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(requestLocation, 10000);
    requestLocation();
    return () => clearInterval(interval);
  }, [isTestMode]);

  const currentStop = ACROPOLIS_STOPS[activeStopIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7]">
      <Header 
        isTestMode={isTestMode} 
        onToggleTest={() => setIsTestMode(!isTestMode)} 
      />
      
      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-44 no-scrollbar">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="font-ancient text-3xl font-bold text-stone-900 tracking-tight leading-none">Tour Path</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm border border-amber-200/50">
                10:00 Slot
              </span>
              <span className="text-[11px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <i className="fa-solid fa-calendar-day"></i>
                Feb 16
              </span>
            </div>
          </div>
          <button 
            onClick={requestLocation}
            disabled={isTestMode}
            className={`w-14 h-14 rounded-[22px] border flex items-center justify-center transition-all shadow-xl ${
              isTestMode 
                ? 'bg-stone-50 text-stone-200 border-stone-100' 
                : 'bg-white text-stone-700 border-stone-100 active:scale-95'
            }`}
          >
            <i className={`fa-solid ${isTestMode ? 'fa-location-dot opacity-40' : 'fa-location-crosshairs'}`}></i>
          </button>
        </div>

        {isTestMode && (
          <div className="mb-8 p-5 bg-amber-600/5 border border-amber-600/20 rounded-[30px] flex gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-amber-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200">
              <i className="fa-solid fa-flask"></i>
            </div>
            <p className="text-[13px] text-amber-900 font-medium leading-tight">
              <strong>Simulating Trip:</strong> Tap any site below to "stand" there virtually for the AI Guide.
            </p>
          </div>
        )}

        <div className="relative">
          {ACROPOLIS_STOPS.map((stop, index) => (
            <TourCard 
              key={stop.id}
              stop={stop}
              isActive={activeStopIndex === index}
              onClick={() => setActiveStopIndex(index)}
            />
          ))}
        </div>

        <div className="mt-6 p-7 bg-stone-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-ancient text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-sparkles text-amber-500"></i>
              Winter Morning Tips
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-4 text-[13px] text-stone-300 leading-relaxed font-medium">
                <div className="w-6 flex-shrink-0 flex justify-center"><i className="fa-solid fa-cloud-sun text-amber-400"></i></div>
                <span>Expect a cool breeze at the summit (Propylaea). Keep your jacket zipped.</span>
              </li>
              <li className="flex gap-4 text-[13px] text-stone-300 leading-relaxed font-medium">
                <div className="w-6 flex-shrink-0 flex justify-center"><i className="fa-solid fa-image text-blue-400"></i></div>
                <span>The sun hits the Caryatids perfectly at 11:20 AM. Have your phone ready.</span>
              </li>
            </ul>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px]"></div>
        </div>
      </main>

      <GuidePanel 
        activeStopName={currentStop.title} 
        activeStopLocation={{ latitude: currentStop.latitude, longitude: currentStop.longitude }}
      />
    </div>
  );
};

export default App;
