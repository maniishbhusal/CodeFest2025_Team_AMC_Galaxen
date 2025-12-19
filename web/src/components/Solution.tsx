import React, { useRef } from 'react';
import { Smartphone, Users, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

const Solution = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Therapy plans adapted for small screens, making expert guidance accessible anywhere, anytime.",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "group-hover:border-orange-200",
      shadow: "group-hover:shadow-orange-500/10"
    },
    {
      icon: Users,
      title: "Parent-Led Therapy",
      description: "We don't just treat the child; we train the parent. You become the primary catalyst for change.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "group-hover:border-amber-200",
      shadow: "group-hover:shadow-amber-500/10"
    },
    {
      icon: TrendingUp,
      title: "Smart Progress Tracking",
      description: "Visual data shows exactly how your child is improving, motivating you to keep going.",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "group-hover:border-red-200",
      shadow: "group-hover:shadow-red-500/10"
    },
  ];

  return (
    <section 
      className="py-24 relative overflow-hidden bg-white font-sans"
    >
      {/* Elegant Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-50/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-50/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        {/* Technical Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#ea580c 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
            <CheckCircle2 size={14} />
            Our Solution
          </span>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight font-serif">
            Bridging the gap with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-red-500">
              Intelligent Care
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We bring professional therapy support directly to your smartphone, making daily intervention 
            <span className="font-semibold text-slate-900 mx-1">accessible</span> 
            and 
            <span className="font-semibold text-slate-900 mx-1">affordable</span> 
            for every Nepali family.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${item.border} ${item.shadow}`}
            >
              {/* Icon Box */}
              <div className={`w-14 h-14 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={28} strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors font-serif">
                {item.title}
              </h3>
              
              <p className="text-slate-500 leading-relaxed text-sm mb-6">
                {item.description}
              </p>

              {/* Subtle Learn More Link */}
              <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-900 transition-colors cursor-pointer">
                Learn more <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-slate-500 mb-6 font-medium">Ready to start your journey?</p>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Get Started Today
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;