import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, Flame, Trophy, Clock, Target, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoasts = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "roasts"), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const roastData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRoasts(roastData);
      } catch (error) {
        console.error("Error fetching roasts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoasts();
  }, [user]);

  const stats = {
    count: roasts.length,
    avg: roasts.length > 0 ? (roasts.reduce((acc, r) => acc + (r.scores?.survivability || 0), 0) / roasts.length).toFixed(1) : 0,
    intensity: roasts.length > 0 ? roasts[0].intensity : 'None'
  };

  return (
    <div className="min-h-screen bg-bg p-6 md:p-12 lg:p-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-syne mb-2">Welcome, {user?.displayName?.split(' ')[0]} 💀</h1>
            <p className="text-text-muted">Here's a history of your failures.</p>
          </div>
          <button 
            onClick={() => navigate('/roast')}
            className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-red-600 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            GET ROASTED AGAIN <Flame className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <div className="bg-bg-card border border-border p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <Flame className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-2xl font-black font-syne">{stats.count}</div>
                 <div className="text-xs text-text-muted uppercase font-bold tracking-widest">Roasts Received</div>
              </div>
           </div>
           <div className="bg-bg-card border border-border p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                 <Trophy className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-2xl font-black font-syne">{stats.avg}/10</div>
                 <div className="text-xs text-text-muted uppercase font-bold tracking-widest">Average Survival</div>
              </div>
           </div>
           <div className="bg-bg-card border border-border p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                 <Target className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-2xl font-black font-syne uppercase">{stats.intensity}</div>
                 <div className="text-xs text-text-muted uppercase font-bold tracking-widest">Latest Intensity</div>
              </div>
           </div>
        </div>

        <h2 className="text-2xl font-black font-syne mb-8 uppercase tracking-widest flex items-center gap-3">
           Your Roast History <Trash2 className="w-4 h-4 text-text-muted hover:text-primary cursor-pointer" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full py-20 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-text-muted">Analyzing your past failures...</p>
             </div>
          ) : roasts.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-bg-card border border-border rounded-3xl border-dashed">
                <p className="text-text-muted mb-4 text-lg italic">"You haven't been roasted yet. Are you chicken? 🐔"</p>
                <button 
                  onClick={() => navigate('/roast')}
                  className="px-6 py-2 bg-white/5 border border-border rounded-xl font-bold hover:bg-primary transition-all"
                >
                  GET YOUR FIRST ROAST
                </button>
            </div>
          ) : roasts.map((roast) => (
            <div key={roast.id} className="bg-bg-card border border-border rounded-3xl p-6 group hover:border-primary/50 transition-colors">
               <div className="flex justify-between items-start mb-6">
                  <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest 
                    ${roast.intensity === 'savage' || roast.intensity === 'destroy' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {roast.intensity}
                  </div>
                  <div className="text-[10px] text-text-muted font-bold flex items-center gap-1 uppercase">
                    <Clock className="w-3 h-3" /> {roast.createdAt?.toDate().toLocaleDateString() || 'Today'}
                  </div>
               </div>
               <h3 className="text-xl font-black font-syne mb-2 group-hover:text-primary transition-colors truncate">{roast.startup_name || roast.input}</h3>
               <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-primary" style={{ width: `${(roast.scores?.survivability || 0) * 10}%` }}></div>
                  </div>
                  <span className="text-xs font-black text-text-muted">{roast.scores?.survivability}/10</span>
               </div>
               <div className="flex gap-2">
                 <button className="flex-1 bg-white/5 hover:bg-white/10 border border-border py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                   VIEW FULL <ExternalLink className="w-3 h-3" />
                 </button>
                 <button 
                  onClick={() => navigate(`/roast?input=${encodeURIComponent(roast.input)}&mode=${roast.mode}`)}
                  className="bg-primary/10 hover:bg-primary/20 border border-primary/20 p-2 rounded-xl text-primary transition-all"
                >
                   <Flame className="w-4 h-4" />
                 </button>
               </div>
            </div>
          ))}
        </div>

        {/* Upgrade Banner */}
        <div className="mt-24 p-12 bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/30 rounded-[40px] text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-primary-glow blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <h3 className="text-3xl font-black font-syne mb-4 relative z-10">Stop the limits. Go Pro.</h3>
            <p className="text-text-muted mb-8 relative z-10 max-w-lg mx-auto">Get unlimited roasts, saves, and the ability to download full PDF reports to cry over in private.</p>
            <button 
              onClick={() => navigate('/pricing')}
              className="px-12 py-4 bg-primary text-white font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-primary/20 relative z-10"
            >
              UPGRADE NOW 🔥
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
