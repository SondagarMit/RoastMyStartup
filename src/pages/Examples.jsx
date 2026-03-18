import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ChevronLeft, Share2, Quote, Zap, Skull, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const Examples = () => {
  const navigate = useNavigate();

  const examples = [
    {
      startup_name: "Uber for Chai",
      one_liner: "Because walking 5 minutes to a stall was too much physical effort for your target market of lazy engineers.",
      category: "SaaS",
      intensity: "Savage",
      survivability: "15%",
      emoji: "☕"
    },
    {
      startup_name: "AI-Powered Napkin",
      one_liner: "You managed to combine the world's most overhyped tech with the world's most disposable product. Peak tech bubble.",
      category: "Hardware",
      intensity: "Destroy",
      survivability: "2%",
      emoji: "🧻"
    },
    {
      startup_name: "LinkedIn for Dogs",
      one_liner: "Finally, a platform where my golden retriever can network with other 'highly motivated' influencers who are also just looking for treats.",
      category: "Social",
      intensity: "Savage",
      survivability: "8%",
      emoji: "🐕"
    },
    {
      startup_name: "Crypto for Toddlers",
      one_liner: "Teaching kids about financial loss before they even learn to walk. You're not a founder, you're a supervillain origin story.",
      category: "Web3",
      intensity: "Destroy",
      survivability: "0.5%",
      emoji: "👶"
    },
    {
      startup_name: "VR Meditation for Cats",
      one_liner: "If you want to witness a cat having a digital existential crisis, this is it. Investors must be really bored.",
      category: "VR/AR",
      intensity: "Medium",
      survivability: "12%",
      emoji: "🐱"
    },
    {
      startup_name: "Tinder for Co-founders",
      one_liner: "Swipe right on a complete stranger to share equity and legal liability. What could possibly go wrong besides everything?",
      category: "B2B",
      intensity: "Savage",
      survivability: "20%",
      emoji: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20 px-6">
      <div className="p-6 md:px-12 flex justify-between items-center absolute top-0 w-full z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Flame className="text-primary w-6 h-6 fill-primary" />
          <span className="text-xl font-black font-syne tracking-tighter">RoastMyStartup</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Roast
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black font-syne mb-6 tracking-tighter uppercase">Hall of Shame</h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">Feast your eyes on the dreams we've already crushed. Your idea could be next.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((ex, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card border border-border rounded-[40px] p-8 relative overflow-hidden group hover:border-primary/30 transition-all hover:scale-[1.02]"
            >
              <div className="h-1 w-full bg-primary absolute top-0 left-0"></div>
              <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors">
                  {ex.emoji}
                </div>
                <div className={`px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] font-black uppercase rounded tracking-widest text-primary`}>
                  {ex.intensity}
                </div>
              </div>

              <h3 className="text-2xl font-black font-syne mb-4">{ex.startup_name}</h3>
              <p className="text-lg text-text-muted leading-relaxed italic mb-8">
                "{ex.one_liner}"
              </p>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                   <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Category</h4>
                   <p className="font-bold text-xs">{ex.category}</p>
                </div>
                <div className="text-right">
                   <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Survivability</h4>
                   <p className="font-black text-primary text-lg tracking-tighter">{ex.survivability}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={() => navigate('/roast')}
            className="bg-primary hover:bg-red-600 text-white font-black px-12 py-5 rounded-3xl text-2xl transition-all shadow-xl shadow-primary/20 animate-pulse"
          >
            ROAST MY IDEA TOO 💀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Examples;
