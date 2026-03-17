import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, Twitter, Github, Linkedin, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('idea'); // 'idea' or 'url'

  const handleRoast = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/roast?input=${encodeURIComponent(input)}&mode=${mode}`);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Particles/Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-glow rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-glow rounded-full blur-[120px] opacity-10"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Flame className="text-primary w-8 h-8 fill-primary" />
          <span className="text-2xl font-black font-syne tracking-tighter">RoastMyStartup</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#examples" className="text-text-muted hover:text-white transition-colors">See examples</a>
          <button onClick={() => navigate('/pricing')} className="text-text-muted hover:text-white transition-colors">Pricing</button>
          {user ? (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-border hover:bg-white/10 transition-all">
                <User className="w-4 h-4" />
                <span>{user.displayName?.split(' ')[0]}</span>
              </button>
              <button 
                onClick={logout}
                className="p-2 hover:bg-white/10 rounded-full transition-all text-text-muted hover:text-primary"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="px-5 py-2 border border-border rounded-full hover:bg-white hover:text-black transition-all"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black font-syne leading-[1.1] mb-6"
        >
          Your startup idea<br />
          <span className="text-primary">deserves the truth. 💀</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto mb-12"
        >
          Get brutally honest AI feedback disguised as a comedy roast. Your feelings will not be spared.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleRoast} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative bg-bg-card border border-border rounded-2xl p-2 flex flex-col items-center">
              <div className="w-full flex p-2 gap-2 border-b border-border/50 mb-2">
                <button 
                  type="button"
                  onClick={() => setMode('idea')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === 'idea' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
                >
                  💡 Idea
                </button>
                <button 
                  type="button"
                  onClick={() => setMode('url')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === 'url' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
                >
                  🌐 Website URL
                </button>
              </div>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'idea' ? "Describe your startup in one sentence..." : "https://yourstartup.com"}
                className="w-full bg-transparent border-none focus:ring-0 text-lg p-4 placeholder:text-text-muted/50"
              />
              <button 
                type="submit"
                className="w-full mt-2 bg-primary hover:bg-red-600 text-white font-black py-4 rounded-xl text-xl flex items-center justify-center gap-2 group roast-button"
              >
                Roast Me <Flame className="w-6 h-6 group-hover:animate-bounce" />
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-text-muted">
            Free • No signup needed • 3 roasts per day
          </p>
        </motion.div>
      </section>

      {/* Social Proof Ticker */}
      <div className="w-full bg-bg-card/50 border-y border-border py-4 overflow-hidden relative">
        <div className="flex gap-12 animate-scroll whitespace-nowrap text-text-muted font-medium py-2">
          {[1,2,3,4,5].map((i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2">💀 <span className="text-white">Ahmed's</span> "Uber for chai" idea got destroyed</span>
              <span className="flex items-center gap-2">🔥 <span className="text-white">Sarah's</span> landing page was called a "digital napkin"</span>
              <span className="flex items-center gap-2">⚰️ <span className="text-white">Raj's</span> fintech idea was roasted in 3 languages</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black font-syne text-center mb-16">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Paste your idea or URL', icon: '🎯', desc: 'Give us enough rope to hang you with.' },
            { step: '2', title: 'AI reads it like a brutal VC', icon: '🤖', desc: 'Our RoastBot 3000 analyzes every flaw.' },
            { step: '3', title: 'Get roasted. Share damage.', icon: '💀', desc: 'Tearful founders are our specialty.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-bg-card border border-border p-8 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-[-20px] right-[-20px] text-8xl font-black text-white/5 group-hover:text-primary/10 transition-colors">{item.step}</div>
              <div className="text-4xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold font-syne mb-2">{item.title}</h3>
              <p className="text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example Roast Card */}
      <section id="examples" className="py-24 px-6 bg-gradient-to-b from-bg to-bg-card/30">
        <div className="max-w-4xl mx-auto border border-border rounded-[40px] p-8 md:p-12 glass relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl">🤖</div>
                <div>
                  <h4 className="font-bold text-white">RoastBot 3000</h4>
                  <p className="text-xs text-text-muted">Destroying dreams since 2024</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -top-6 -left-4 text-6xl text-primary opacity-20 font-serif">"</span>
                <p className="text-xl md:text-2xl font-medium leading-relaxed italic z-10 relative">
                  Setting up a "marketplace for artisanal ice cubes" is less of a startup and more of a cryogenic suicide note. 
                  Have you tried just lighting your investors' money on fire? It's faster and smells better.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">💀 SURVIVABILITY: 0.2%</div>
                <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-bold text-orange-500">🔥 INTENSITY: SAVAGE</div>
              </div>
            </div>
            <div className="w-full md:w-64 bg-bg rounded-2xl p-6 border border-border shadow-2xl skew-y-1 hover:skew-y-0 transition-transform">
               <div className="flex items-center justify-between mb-4">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-text-muted uppercase tracking-tighter">RoastMyStartup.com</span>
               </div>
               <div className="h-20 bg-primary/20 rounded-lg mb-4 flex items-center justify-center text-4xl">⚰️</div>
               <div className="space-y-2">
                 <div className="h-2 bg-white/20 rounded-full w-full"></div>
                 <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                 <div className="h-2 bg-primary/40 rounded-full w-1/2"></div>
               </div>
               <button className="w-full mt-6 bg-primary text-[10px] font-black py-2 rounded-lg">TRY IT YOURSELF</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border px-6 text-center">
        <div className="flex justify-center gap-6 mb-8 text-text-muted">
          <Twitter className="w-5 h-5 hover:text-primary cursor-pointer" />
          <Github className="w-5 h-5 hover:text-primary cursor-pointer" />
          <Linkedin className="w-5 h-5 hover:text-primary cursor-pointer" />
        </div>
        <p className="text-text-muted mb-4 font-medium">
          Made by a developer who got roasted first 💀
        </p>
        <div className="flex justify-center gap-8 text-xs text-text-muted/60 uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Twitter</a>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
