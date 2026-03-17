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
    <div className="min-h-screen bg-bg py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black font-syne mb-6">Choose your level of pain</h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">All plans include our jaded AI comedian who has seen too many failed pitch decks.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`bg-bg-card border ${tier.highlight ? 'border-primary ring-1 ring-primary shadow-2xl shadow-primary/20' : 'border-border'} p-8 rounded-[40px] flex flex-col relative overflow-hidden group`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                  POPULAR
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em] mb-4">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-syne">{tier.price}</span>
                  {tier.period && <span className="text-text-muted font-bold">{tier.period}</span>}
                </div>
                <p className="mt-4 text-text-muted text-sm">{tier.description}</p>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {tier.features.map((feature, fidx) => (
                  <div key={fidx} className="flex gap-3">
                    <Check className={`w-5 h-5 ${tier.highlight ? 'text-primary' : 'text-success'} shrink-0`} />
                    <span className="text-sm text-text-muted font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${tier.highlight ? 'bg-primary text-white hover:bg-red-600 shadow-xl shadow-primary/20' : 'bg-white/5 border border-border text-white hover:bg-white/10'}`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <p className="text-text-muted flex items-center justify-center gap-2">
               Questions? Don't ask us. We'll just roast your question. <Flame className="w-4 h-4 text-primary" />
            </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
