import React from 'react';
import { Globe, Brain, Zap, Video } from 'lucide-react';

export default function AutiSaharaVision() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-orange-50 via-white to-amber-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              Future Vision
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              AutiSahara
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Transforming neurodevelopmental care across South Asia
          </p>
        </div>

        {/* Vision Cards - Single Row */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">
                South Asia Expansion
              </h3>
              <p className="text-slate-600 text-base">
                Nepal to India, Bangladesh, Pakistan and beyond
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">
                Multiple Conditions
              </h3>
              <p className="text-slate-600 text-base">
                Autism, ADHD, and neurodevelopmental disorders
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">
                AI Integration
              </h3>
              <p className="text-slate-600 text-base">
                Early detection and personalized care plans
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">
                Telemedicine
              </h3>
              <p className="text-slate-600 text-base">
                Remote consultations anytime, anywhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}