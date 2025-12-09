import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCcw, Settings, Clock, Timer, Watch } from 'lucide-react';

/**
 * CHRONONEON - Modern Time Utility
 * Stack: React + Tailwind CSS
 */

// --- Components ---

const Button = ({ onClick, icon: Icon, label, variant = 'primary', color }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95";
  
  // Dynamic styles based on the neon color selected
  const primaryStyle = {
    backgroundColor: color,
    color: '#000',
    boxShadow: `0 0 20px ${color}40` // Neon glow effect
  };
  
  const secondaryStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  return (
    <button 
      onClick={onClick} 
      className={baseStyle}
      style={variant === 'primary' ? primaryStyle : secondaryStyle}
    >
      {Icon && <Icon size={20} />}
      {label}
    </button>
  );
};

// --- Main App ---

export default function ChronoNeon() {
  const [activeTab, setActiveTab] = useState('clock'); // clock | stopwatch | timer
  const [themeColor, setThemeColor] = useState('#00f2ff'); // Default Neon Cyan
  const [showSettings, setShowSettings] = useState(false);

  // --- Clock Logic ---
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Stopwatch Logic ---
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  
  useEffect(() => {
    let interval;
    if (swRunning) {
      interval = setInterval(() => setSwTime(prev => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  const formatStopwatch = (ms) => {
    const min = Math.floor((ms / 60000) % 60);
    const sec = Math.floor((ms / 1000) % 60);
    const cent = Math.floor((ms / 10) % 100);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
  };

  // --- Timer Logic ---
  const [timerInput, setTimerInput] = useState(300); // 5 minutes default
  const [timerLeft, setTimerLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning && timerLeft > 0) {
      interval = setInterval(() => setTimerLeft(prev => prev - 1), 1000);
    } else if (timerLeft === 0) {
      setTimerRunning(false);
      // Optional: Add Audio alert here
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerLeft]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Visuals ---
  const neonTextShadow = { textShadow: `0 0 20px ${themeColor}80` };
  const neonBorder = { borderColor: themeColor, boxShadow: `0 0 15px ${themeColor}20` };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-[128px] opacity-20 transition-colors duration-700" style={{ backgroundColor: themeColor }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full blur-[128px] opacity-20 transition-colors duration-700" style={{ backgroundColor: themeColor }}></div>

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header / Tabs */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex space-x-2 bg-black/20 p-1 rounded-full">
            {['clock', 'stopwatch', 'timer'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 rounded-full transition-all duration-300 ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                style={activeTab === tab ? { color: themeColor } : {}}
              >
                {tab === 'clock' && <Clock size={20} />}
                {tab === 'stopwatch' && <Watch size={20} />}
                {tab === 'timer' && <Timer size={20} />}
              </button>
            ))}
          </div>
          
          <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* Customization Panel (Slide down) */}
        <div className={`overflow-hidden transition-all duration-300 ${showSettings ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 bg-black/30 flex justify-center gap-4">
             {['#00f2ff', '#ff0055', '#39ff14', '#ffd700', '#bd00ff'].map(color => (
               <button
                key={color}
                onClick={() => setThemeColor(color)}
                className="w-8 h-8 rounded-full border-2 border-transparent hover:scale-110 transition-transform"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
               />
             ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10 flex flex-col items-center justify-center min-h-[300px]">
          
          {/* CLOCK VIEW */}
          {activeTab === 'clock' && (
            <div className="text-center animate-fade-in">
              <div className="text-7xl font-mono font-bold tracking-tighter mb-2 transition-colors duration-500" style={{ ...neonTextShadow, color: 'white' }}>
                {time.toLocaleTimeString([], { hour12: false })}
              </div>
              <div className="text-xl text-gray-400 font-light tracking-widest uppercase">
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}

          {/* STOPWATCH VIEW */}
          {activeTab === 'stopwatch' && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              {/* Progress Ring Visual */}
              <div className="relative mb-8">
                <div className="text-6xl font-mono font-bold z-10 relative" style={neonTextShadow}>
                  {formatStopwatch(swTime)}
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <Button 
                  onClick={() => setSwRunning(!swRunning)} 
                  label={swRunning ? "Pause" : "Start"} 
                  icon={swRunning ? Pause : Play}
                  variant="primary"
                  color={themeColor}
                />
                <Button 
                  onClick={() => { setSwRunning(false); setSwTime(0); }} 
                  label="Reset" 
                  icon={RefreshCcw}
                  variant="secondary"
                  color={themeColor}
                />
              </div>
            </div>
          )}

          {/* TIMER VIEW */}
          {activeTab === 'timer' && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              {/* Timer Dial SVG */}
              <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                <svg className="absolute w-full h-full transform -rotate-90">
                   <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                   <circle 
                      cx="128" cy="128" r="120" 
                      stroke={themeColor} 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 120} 
                      strokeDashoffset={(2 * Math.PI * 120) * (1 - timerLeft / timerInput)}
                      className="transition-all duration-1000 ease-linear"
                      style={{ filter: `drop-shadow(0 0 6px ${themeColor})` }}
                   />
                </svg>
                <div className="text-6xl font-mono font-bold" style={neonTextShadow}>
                  {formatTimer(timerLeft)}
                </div>
              </div>

              <div className="flex gap-4">
                {!timerRunning && (
                   <div className="absolute top-[60%] opacity-0 hover:opacity-100 transition-opacity flex gap-2">
                      <button onClick={() => {setTimerInput(300); setTimerLeft(300)}} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">5m</button>
                      <button onClick={() => {setTimerInput(1500); setTimerLeft(1500)}} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">25m</button>
                   </div>
                )}
                
                <Button 
                  onClick={() => setTimerRunning(!timerRunning)} 
                  label={timerRunning ? "Pause" : "Start"} 
                  icon={timerRunning ? Pause : Play}
                  variant="primary"
                  color={themeColor}
                />
                <Button 
                  onClick={() => { setTimerRunning(false); setTimerLeft(timerInput); }} 
                  label="Reset" 
                  icon={RefreshCcw}
                  variant="secondary"
                  color={themeColor}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer attribution */}
      <div className="absolute bottom-4 text-gray-600 text-xs tracking-widest uppercase">
        Designed for Innovation
      </div>
    </div>
  );
}
