import React from 'react';
import { Check, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  
  const tiers = [
    {
      name: 'FREE',
      price: '$0',
      description: 'Standard humiliation for beginners.',
      features: [
        '3 roasts per day',
        'Basic share card',
        'Standard intensity only',
        'Standard loading speed'
      ],
      cta: 'Start Getting Roasted',
      highlight: false
    },
    {
      name: 'PRO',
      price: '$5',
      period: '/mo',
      description: 'For founders who like the pain.',
      features: [
        'Unlimited roasts',
        'All intensity levels',
        'Full shareable card (no watermark)',
        'Roast history saved',
        'Priority support'
      ],
      cta: 'Go Pro 🔥',
      highlight: true
    },
    {
      name: 'SAVAGE',
      price: '$12',
      period: '/mo',
      description: 'Maximum destruction for experts.',
      features: [
        'Everything in Pro',
        'URL scanning (reads website)',
        'Competitor comparison roast',
        'PDF roast report download',
        'Early access to new features'
      ],
      cta: 'Maximum Destruction ☠️',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-bg relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 w-full p-6 md:px-12 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Flame className="text-primary w-6 h-6 fill-primary" />
          <span className="text-xl font-black font-syne tracking-tighter">RoastMyStartup</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-white/5 border border-border px-4 py-2 rounded-full text-xs font-bold hover:bg-white/10 transition-all"
        >
          Back to Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black font-syne mb-6 tracking-tighter">Premium Roasts</h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">Get exclusive features and unlimited destruction for your startup.</p>
        </div>

        {/* Pricing Content with Blur Overlay */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8 filter blur-lg opacity-40 pointer-events-none select-none">
            {tiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`bg-bg-card border ${tier.highlight ? 'border-primary shadow-2xl shadow-primary/20' : 'border-border'} p-8 rounded-[40px] flex flex-col relative overflow-hidden`}
              >
                <div className="mb-8 font-black opacity-50">{tier.name}</div>
                <div className="text-4xl font-black mb-4">{tier.price}</div>
                <div className="space-y-4 mb-8">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-2 bg-white/10 rounded-full w-full"></div>
                  ))}
                </div>
                <div className="mt-auto h-12 bg-white/5 rounded-2xl w-full"></div>
              </div>
            ))}
          </div>

          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center p-6 bg-bg/20 backdrop-blur-md rounded-[50px] border border-white/5">
             <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-2xl shadow-primary/20 border border-primary/30">
                <Flame className="w-10 h-10 text-primary animate-pulse" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black font-syne mb-4 tracking-tighter">COMING SOON <span className="text-primary">🔒</span></h2>
             <p className="text-lg md:text-xl text-text-muted max-w-md mb-8 font-medium">
               We're still calculating the cost of your electricity bill and psychological therapy for founders. 
             </p>
             <button 
               onClick={() => navigate('/')}
               className="bg-primary hover:bg-red-600 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group"
             >
               GET ROASTED FOR FREE <span className="group-hover:translate-x-1 transition-transform">→</span>
             </button>
          </div>
        </div>

        <div className="mt-20 text-center opacity-30">
            <p className="text-text-muted flex items-center justify-center gap-2">
               Future plans for future failed founders. <Flame className="w-4 h-4 text-primary" />
            </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
