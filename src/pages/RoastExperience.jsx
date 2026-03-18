import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Flame, Share2, Download, RefreshCw, ChevronLeft, AlertCircle, Quote, Twitter as TwitterIcon, Linkedin as LinkedinIcon, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const RoastExperience = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState(searchParams.get('input') ? 'loading' : 'input'); // 'input', 'loading', 'result', 'error'
  const [errorType, setErrorType] = useState(null); // 'limit', 'general'
  const [result, setResult] = useState(null);
  const [intensity, setIntensity] = useState(2); // 0: Gentle, 1: Medium, 2: Savage, 3: Destroy
  const [input, setInput] = useState(searchParams.get('input') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || 'idea');
  
  const intensities = [
    { label: '😇 Gentle', color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: '😈 Medium', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: '💀 Savage', color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: '☠️ Destroy Me', color: 'text-primary', bg: 'bg-primary/10' }
  ];

  const loadingMessages = [
    "Consulting our panel of failed VCs...",
    "Reading between the lines of your delusion...",
    "Calculating your runway to zero...",
    "Asking ChatGPT what it thinks (it laughed)...",
    "Preparing your reality check..."
  ];

  const [loadingText, setLoadingText] = useState(loadingMessages[0]);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('roast-card');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#111',
        scale: 2,
        logging: false,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `roast-${result?.startup_name || 'startup'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleShareX = () => {
    const text = `I asked an AI to roast my startup and it said "${result?.one_liner}" 💀\n\nGet yours destroyed: https://roastmystartup.com`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchRoast = async () => {
      if (input && state === 'loading') {
        // Clear the URL search params so the link is clean (no more ?input=...)
        if (searchParams.get('input')) {
          navigate('/roast', { replace: true });
        }

        try {
          const intensitiesArr = ['gentle', 'medium', 'savage', 'destroy'];
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          console.log(`[DEBUG] Attempting fetch to: ${apiUrl}/api/roast`);
          console.log(`[DEBUG] Payload:`, { input, mode, intensity: intensitiesArr[intensity] });

          const response = await fetch(`${apiUrl}/api/roast`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              input, 
              mode, 
              intensity: intensitiesArr[intensity] 
            }),
          });

          console.log(`[DEBUG] Response status: ${response.status}`);

          if (!response.ok) {
            const errorData = await response.json();
            console.error(`[DEBUG] API Error Response:`, errorData);
            const error = new Error(errorData.error || 'Roast failed');
            if (response.status === 429) error.code = 'functions/resource-exhausted';
            throw error;
          }

          const data = await response.json();
          console.log(`[DEBUG] Roast received successfully:`, data);
          setResult(data);
          setState('result');
        } catch (error) {
          console.error("[DEBUG] Roast Fetch Exception:", error);
          if (error.code === 'functions/resource-exhausted' || error.message.includes('limit')) {
            setErrorType('limit');
          } else {
            setErrorType('general');
          }
          setState('error');
        }
      }
    };

    let interval;
    if (state === 'loading') {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[i]);
      }, 1500);
    }

    fetchRoast();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [input, state, mode, intensity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setState('loading');
    }
  };

  return (
    <div className="min-h-screen bg-bg relative">
      {/* Header */}
      <div className="p-6 md:px-12 flex justify-between items-center absolute top-0 w-full z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Flame className="text-primary w-6 h-6 fill-primary" />
          <span className="text-xl font-black font-syne tracking-tighter">RoastMyStartup</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <AnimatePresence mode="wait">
        {state === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-xl bg-bg-card border border-border p-8 rounded-3xl relative overflow-hidden">
               <div className="flex justify-center gap-4 mb-8">
                <button 
                  onClick={() => setMode('idea')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'idea' ? 'bg-primary text-white' : 'bg-white/5 text-text-muted'}`}
                >
                  💡 Startup Idea
                </button>
                <button 
                  onClick={() => setMode('url')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'url' ? 'bg-primary text-white' : 'bg-white/5 text-text-muted'}`}
                >
                  🌐 Website URL
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {mode === 'idea' ? (
                   <div className="relative mb-8">
                     <textarea 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       maxLength={500}
                       placeholder="Describe your startup idea..."
                       className="w-full h-40 bg-bg border border-border rounded-2xl p-6 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-lg"
                     />
                     <div className="absolute bottom-4 right-4 text-xs text-text-muted">
                        {input.length}/500
                     </div>
                   </div>
                ) : (
                  <div className="mb-8">
                    <input 
                      type="url"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="https://yourstartup.com"
                      className="w-full bg-bg border border-border rounded-2xl p-6 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg"
                    />
                    <p className="mt-2 text-xs text-text-muted px-2">We'll scan your landing page and destroy its copy.</p>
                  </div>
                )}

                <div className="mb-10">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Intensity Level</span>
                     <span className={`text-sm font-black ${intensities[intensity].color}`}>{intensities[intensity].label}</span>
                   </div>
                   <input 
                     type="range"
                     min="0"
                     max="3"
                     step="1"
                     value={intensity}
                     onChange={(e) => setIntensity(parseInt(e.target.value))}
                     className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                     style={{
                       background: `linear-gradient(to right, var(--primary) ${(intensity / 3) * 100}%, rgba(255, 255, 255, 0.1) ${(intensity / 3) * 100}%)`
                     }}
                   />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-red-600 text-white font-black py-5 rounded-2xl text-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
                >
                  ROAST ME <Flame className="w-6 h-6" />
                </button>
                <p className="text-center mt-6 text-text-muted text-sm">3 free roasts remaining today</p>
              </form>
            </div>
          </motion.div>
        )}

        {state === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-12">
               <div className="w-24 h-24 bg-primary/20 rounded-full blur-2xl absolute inset-0 animate-pulse"></div>
               <Flame className="w-24 h-24 text-primary relative z-10 flame" fill="currentColor" />
            </div>
            <motion.h2 
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-black font-syne max-w-md"
            >
              {loadingText}
            </motion.h2>
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-20 px-6 max-w-7xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column: The Roast */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-primary text-[10px] font-black uppercase rounded tracking-widest text-white">ROASTED 💀</div>
                  <h1 className="text-2xl font-black font-syne truncate max-w-[200px]">{result?.startup_name || input.replace(/^https?:\/\//, '').split('/')[0]}</h1>
                  <span className={`px-3 py-1 ${intensities[intensity].bg} ${intensities[intensity].color} text-[10px] font-black uppercase rounded tracking-widest`}>
                    {intensities[intensity].label.split(' ')[1]}
                  </span>
                </div>

                <div className="bg-bg-card border border-border p-8 rounded-[40px] relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl shadow-xl shadow-primary/20 border-2 border-white/10">🤖</div>
                     <div>
                       <h3 className="font-black font-syne text-xl">RoastBot 3000</h3>
                       <p className="text-xs text-text-muted">Directly from the silicon basement</p>
                     </div>
                   </div>
                   
                   <div className="prose prose-invert max-w-none text-lg leading-relaxed space-y-4 whitespace-pre-wrap">
                      {result?.roast || "Generating roast..."}
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                  <h3 className="text-xl font-black font-syne mb-6 flex items-center gap-2">
                    Behind the jokes <span className="text-primary">👇</span>
                  </h3>
                  <ul className="space-y-4">
                    {(result?.reality_check || []).map((item, id) => (
                      <li key={id} className="flex gap-4">
                        <span className="text-success mt-1">✓</span>
                        <span className="text-text-muted text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Originality', score: result?.scores?.originality || 0, color: 'text-orange-400' },
                    { label: 'Market Fit', score: result?.scores?.market_fit || 0, color: 'text-red-500' },
                    { label: 'Risk', score: result?.scores?.execution_risk || 0, color: 'text-red-500' },
                    { label: 'Survival', score: result?.scores?.survivability || 0, color: 'text-red-600' }
                  ].map((s, i) => (
                    <div key={i} className="bg-bg-card border border-border p-4 rounded-2xl text-center">
                       <div className={`text-3xl font-black font-syne mb-1 ${s.color}`}>{s.score}/10</div>
                       <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Share Card */}
              <div className="lg:sticky lg:top-32 space-y-8">
                 <div id="roast-card" className="bg-[#111] border border-border rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="h-1 w-full bg-primary"></div>
                    <div className="p-8 pb-12">
                       <div className="flex items-center justify-between mb-12">
                          <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-primary fill-primary" />
                            <span className="text-sm font-black font-syne tracking-tighter">RoastMyStartup.com</span>
                          </div>
                          <span className="text-[10px] font-bold text-text-muted uppercase px-2 py-0.5 border border-border rounded">2024 EDITION</span>
                       </div>

                       <Quote className="w-12 h-12 text-primary/10 absolute top-20 right-8 rotate-180" />
                       
                       <p className="text-2xl font-bold font-syne leading-tight mb-8 relative z-10 pr-12">
                          "{result?.one_liner || "Stop now."}"
                       </p>

                       <div className="flex items-center gap-3 mb-8">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm">🤖</div>
                          <span className="text-sm font-bold opacity-80">— @RoastBot3000</span>
                       </div>

                       <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                          <div>
                             <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">UNFORTUNATE startup</h4>
                             <p className="font-bold text-sm truncate max-w-[150px]">{result?.startup_name || input.replace(/^https?:\/\//, '').split('/')[0]}</p>
                          </div>
                          <div className="text-right">
                             <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">SURVIVABILITY</h4>
                             <p className="font-black text-primary text-xl tracking-tighter">{result?.scores?.survivability * 10 || 0}%</p>
                          </div>
                       </div>
                    </div>
                    <div className="absolute bottom-4 right-4 text-[8px] text-white/5 font-black tracking-[0.2em]">ROASTBOT_3000_V1.0</div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-center text-sm font-black text-text-muted uppercase tracking-widest">Share the damage</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         onClick={handleShareX}
                         className="bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all text-sm"
                       >
                          <TwitterIcon className="w-4 h-4" /> X / TWITTER
                       </button>
                       <button className="bg-[#0077b5] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">
                          <LinkedinIcon className="w-4 h-4" /> LINKEDIN
                       </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         onClick={handleDownload}
                         className="border border-border bg-white/5 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm"
                       >
                          <Download className="w-4 h-4" /> DOWNLOAD (.PNG)
                       </button>
                       <button 
                         onClick={handleCopyLink}
                         className="border border-border bg-white/5 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm"
                       >
                          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />} {copied ? 'COPIED!' : 'COPY LINK'}
                       </button>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={() => setState('input')}
                      className="flex-1 bg-primary/10 border border-primary/20 text-primary font-black py-4 rounded-xl hover:bg-primary/20"
                    >
                      ROAST AGAIN 🔥
                    </button>
                    <button className="flex-1 bg-white/5 border border-border text-white font-black py-4 rounded-xl hover:bg-white/10">
                      SAVE ROAST
                    </button>
                 </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-sm"
          >
            <div className="w-full max-w-md bg-bg-card border border-border p-8 rounded-3xl text-center shadow-2xl">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                 <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-syne mb-4">
                {errorType === 'limit' ? "Limit Reached! 💀" : "System Meltdown ☠️"}
              </h3>
              <p className="text-text-muted mb-8 text-lg">
                {errorType === 'limit' 
                  ? "You've reached your limit of 3 roasts for today. Even we have to pay the electric bill. Upgrade for unlimited destruction!"
                  : "Even our AI couldn't make sense of this idea. That might be your real problem. 💀"}
              </p>
              <div className="flex flex-col gap-3">
                {errorType === 'limit' ? (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="w-full bg-primary py-4 rounded-xl font-black text-white hover:bg-red-600 transition-all shadow-lg shadow-primary/20"
                  >
                    UPGRADE NOW 🔥
                  </button>
                ) : (
                  <button 
                    onClick={() => setState('input')}
                    className="w-full bg-primary py-4 rounded-xl font-black text-white hover:bg-red-600 transition-all shadow-lg shadow-primary/20"
                  >
                    TRY AGAIN
                  </button>
                )}
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-white/5 border border-border py-4 rounded-xl font-bold text-text-muted hover:text-white transition-all"
                >
                  RETURN TO LANDING
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoastExperience;
