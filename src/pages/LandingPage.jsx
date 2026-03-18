import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, Twitter, Github, Linkedin, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const LandingPage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('idea'); // 'idea' or 'url'
  const [recentRoasts, setRecentRoasts] = useState([]);

  useEffect(() => {
    const fetchRecentRoasts = async () => {
      try {
        const q = query(
          collection(db, "roasts"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const roasts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentRoasts(roasts);
      } catch (error) {
        console.error("Error fetching recent roasts:", error);
      }
    };
    fetchRecentRoasts();
  }, []);

  const defaultRoasts = [
    { id: 'd1', startup_name: "Uber for chai", intensity: "destroyed", emoji: "💀", user_name: "Ahmed's" },
    { id: 'd2', startup_name: "digital napkin", intensity: "roasted", emoji: "🔥", user_name: "Sarah's" },
    { id: 'd3', startup_name: "fintech idea", intensity: "roasted in 3 languages", emoji: "⚰️", user_name: "Raj's" },
    { id: 'd4', startup_name: "AI for cats", intensity: "shredded", emoji: "💀", user_name: "Maximillian's" },
    { id: 'd5', startup_name: "SaaS for socks", intensity: "burned", emoji: "🔥", user_name: "Eleanor's" },
    { id: 'd6', startup_name: "Crypto for kids", intensity: "eviscerated", emoji: "⚰️", user_name: "Bartholomew's" },

    { id: 'd7', startup_name: "LinkedIn for dogs", intensity: "annihilated", emoji: "💀", user_name: "Lucas's" },
    { id: 'd8', startup_name: "AI dating coach", intensity: "toasted", emoji: "🔥", user_name: "Priya's" },
    { id: 'd9', startup_name: "Uber for barbers", intensity: "vaporized", emoji: "⚰️", user_name: "Arjun's" },
    { id: 'd10', startup_name: "NFT for memes", intensity: "incinerated", emoji: "🔥", user_name: "Daniel's" },
    { id: 'd11', startup_name: "SaaS for gym bros", intensity: "destroyed", emoji: "💀", user_name: "Kevin's" },
    { id: 'd12', startup_name: "AI horoscope reader", intensity: "absolutely roasted", emoji: "🔥", user_name: "Nina's" },

    { id: 'd13', startup_name: "Uber for laundry", intensity: "shredded", emoji: "⚰️", user_name: "Omar's" },
    { id: 'd14', startup_name: "TikTok for pets", intensity: "burned alive", emoji: "🔥", user_name: "Sophia's" },
    { id: 'd15', startup_name: "AI roommate finder", intensity: "obliterated", emoji: "💀", user_name: "Liam's" },
    { id: 'd16', startup_name: "Crypto for gamers", intensity: "nuked", emoji: "⚰️", user_name: "Zara's" },
    { id: 'd17', startup_name: "SaaS for coffee shops", intensity: "grilled", emoji: "🔥", user_name: "Noah's" },
    { id: 'd18', startup_name: "AI for productivity", intensity: "evaporated", emoji: "💀", user_name: "Ava's" },

    { id: 'd19', startup_name: "Uber for tutors", intensity: "demolished", emoji: "🔥", user_name: "Ibrahim's" },
    { id: 'd20', startup_name: "VR meditation app", intensity: "roasted hard", emoji: "⚰️", user_name: "Emily's" },
    { id: 'd21', startup_name: "AI for memes", intensity: "torched", emoji: "🔥", user_name: "Nathan's" },
    { id: 'd22', startup_name: "LinkedIn for gamers", intensity: "slaughtered", emoji: "💀", user_name: "Isabella's" },
    { id: 'd23', startup_name: "Uber for chefs", intensity: "fried", emoji: "🔥", user_name: "Carlos's" },
    { id: 'd24', startup_name: "AI workout planner", intensity: "crushed", emoji: "⚰️", user_name: "Maya's" },

    { id: 'd25', startup_name: "Crypto pizza club", intensity: "obliterated", emoji: "💀", user_name: "Victor's" },
    { id: 'd26', startup_name: "SaaS for dentists", intensity: "incinerated", emoji: "🔥", user_name: "Grace's" },
    { id: 'd27', startup_name: "AI sleep tracker", intensity: "destroyed", emoji: "⚰️", user_name: "Oliver's" },
    { id: 'd28', startup_name: "Uber for mechanics", intensity: "barbecued", emoji: "🔥", user_name: "Fatima's" },
    { id: 'd29', startup_name: "NFT for selfies", intensity: "wrecked", emoji: "💀", user_name: "Leo's" },
    { id: 'd30', startup_name: "AI travel buddy", intensity: "toasted badly", emoji: "⚰️", user_name: "Hannah's" },

    { id: 'd31', startup_name: "LinkedIn for students", intensity: "demolished", emoji: "🔥", user_name: "Yusuf's" },
    { id: 'd32', startup_name: "Uber for photographers", intensity: "obliterated", emoji: "💀", user_name: "Aiden's" },
    { id: 'd33', startup_name: "AI recipe generator", intensity: "grilled", emoji: "🔥", user_name: "Chloe's" },
    { id: 'd34', startup_name: "Crypto savings app", intensity: "nuked", emoji: "⚰️", user_name: "Adrian's" },
    { id: 'd35', startup_name: "SaaS for salons", intensity: "shredded", emoji: "💀", user_name: "Layla's" },
    { id: 'd36', startup_name: "AI study assistant", intensity: "burned", emoji: "🔥", user_name: "Marcus's" },

    { id: 'd37', startup_name: "Uber for movers", intensity: "obliterated", emoji: "⚰️", user_name: "Nora's" },
    { id: 'd38', startup_name: "NFT music platform", intensity: "torched", emoji: "🔥", user_name: "Sebastian's" },
    { id: 'd39', startup_name: "AI for job hunting", intensity: "destroyed", emoji: "💀", user_name: "Aisha's" },
    { id: 'd40', startup_name: "Crypto for students", intensity: "roasted hard", emoji: "⚰️", user_name: "Ethan's" },
    { id: 'd41', startup_name: "SaaS for landlords", intensity: "incinerated", emoji: "🔥", user_name: "Amelia's" },
    { id: 'd42', startup_name: "AI podcast editor", intensity: "crushed", emoji: "💀", user_name: "Logan's" },

    { id: 'd43', startup_name: "Uber for gardeners", intensity: "barbecued", emoji: "🔥", user_name: "Sofia's" },
    { id: 'd44', startup_name: "NFT art marketplace", intensity: "slaughtered", emoji: "⚰️", user_name: "Ravi's" },
    { id: 'd45', startup_name: "AI fashion stylist", intensity: "obliterated", emoji: "💀", user_name: "Mila's" },
    { id: 'd46', startup_name: "Crypto budgeting app", intensity: "demolished", emoji: "🔥", user_name: "Aaron's" },
    { id: 'd47', startup_name: "SaaS for tutors", intensity: "burned alive", emoji: "⚰️", user_name: "Neha's" },
    { id: 'd48', startup_name: "AI email writer", intensity: "annihilated", emoji: "💀", user_name: "Jacob's" },

    { id: 'd49', startup_name: "Uber for painters", intensity: "fried", emoji: "🔥", user_name: "Sanjay's" },
    { id: 'd50', startup_name: "AI meme generator", intensity: "absolutely destroyed", emoji: "⚰️", user_name: "Olivia's" }
  ];

  // Combine recent roasts with default roasts to ensure the marquee is always full
  // This prevents the marquee from being too fast/slow and looking broken based on data count
  const displayRoasts = recentRoasts.length > 0 
    ? [...recentRoasts, ...defaultRoasts].slice(0, 50) 
    : defaultRoasts;

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
        <div className="flex gap-12 animate-scroll whitespace-nowrap text-text-muted font-medium py-2 w-max">
          {[...displayRoasts, ...displayRoasts, ...displayRoasts, ...displayRoasts].map((roast, i) => (
            <span key={`${roast.id}-${i}`} className="flex items-center gap-2">
              {roast.emoji || (roast.scores?.survivability < 3 ? '💀' : '🔥')}
              <span className="text-white">{roast.user_name || "A founder's"}</span>
              "{roast.startup_name || roast.input || "startup"}" {roast.intensity?.includes('roasted') ? roast.intensity : (roast.intensity === 'savage' || roast.intensity === 'destroy' ? 'was destroyed' : 'was roasted')}
            </span>
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

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 600s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
