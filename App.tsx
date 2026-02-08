
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TourCard from './components/TourCard';
import GuidePanel from './components/GuidePanel';
import { ACROPOLIS_STOPS } from './constants';

const App: React.FC = () => {
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        
        // Simple logic to find nearest stop
        let nearestIndex = 0;
        let minDistance = Infinity;
        
        ACROPOLIS_STOPS.forEach((stop, index) => {
          const d = Math.sqrt(
            Math.pow(stop.latitude - position.coords.latitude, 2) + 
            Math.pow(stop.longitude - position.coords.longitude, 2)
          );
          if (d < minDistance) {
            minDistance = d;
            nearestIndex = index;
          }
        });
        
        // Only update if relatively close (roughly within site bounds)
        if (minDistance < 0.005) { 
           setActiveStopIndex(nearestIndex);
        }
      });
    }
  };

  useEffect(() => {
    // Initial check
    requestLocation();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7] selection:bg-amber-200">
      <Header />
      
      <main className="flex-1 overflow-y-auto px-5 pt-8 pb-32 no-scrollbar">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="font-ancient text-3xl font-bold text-stone-900 leading-tight">Your Route</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase">10:00 Arrival</span>
              <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
              <span className="text-xs text-stone-500 font-medium">Athens Time (GMT+2)</span>
            </div>
          </div>
          <button 
            onClick={requestLocation}
            className="w-12 h-12 bg-white rounded-2xl border border-stone-200 flex items-center justify-center text-stone-700 active:bg-stone-50 transition-colors shadow-sm"
            title="Locate me"
          >
            <i className="fa-solid fa-location-crosshairs"></i>
          </button>
        </div>

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

        {/* On-site tips card */}
        <div className="mt-4 p-6 bg-stone-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-ancient text-lg font-bold mb-3">Guide Tips for Today</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-stone-300">
                <i className="fa-solid fa-sun text-amber-500 mt-1"></i>
                <span>High UV index. Stay in the shadow of the Parthenon when waiting.</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-300">
                <i className="fa-solid fa-camera text-blue-400 mt-1"></i>
                <span>The best angle for Athena Nike is from the far right of the stairs.</span>
              </li>
            </ul>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </main>

      <GuidePanel activeStopName={ACROPOLIS_STOPS[activeStopIndex].title} />
      
      {/* Background visual flair for mobile */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] -left-20 w-80 h-80 bg-amber-100/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] -right-20 w-80 h-80 bg-stone-200/30 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default App;
