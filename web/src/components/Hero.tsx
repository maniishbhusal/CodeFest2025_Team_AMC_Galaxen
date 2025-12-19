import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Star, ShieldCheck, Activity } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const carouselImages = [
  "/autism1.jpg",
  "/autism2.jpg",
  "/autism3.jpg",
  "/autism4.jpg"
];

const Hero = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // Changes every 3 seconds

    return () => clearInterval(timer);
  }, []);
  
  
  // Parallax effect logic
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={ref}
      className="relative min-h-[95vh] flex items-center overflow-hidden bg-slate-50 font-sans"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* --- PROFESSIONAL BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        
        {/* Soft Background Orbs (Strictly Orange, no pink/rose blends) */}
        <motion.div 
          style={{ y: yBackground }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-100 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: yBackground }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* --- LEFT COLUMN: CONTENT --- */}
          <motion.div 
            style={{ opacity: opacityContent }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                #1 Rated Autism Care App in Nepal
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-slate-900 tracking-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Therapy that fits <br />
                {/* Changed from Gradient Text to Solid Orange Text */}
                <span className="text-orange-600">
                  your child's world
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
               Where every Nepali parent can give their autistic child the daily therapy they need - with expert guidance right on their phone
              </p>
            </div>

            {/* CTA Area */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all duration-300 group"
                onClick={() => navigate("/register")}
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:bg-orange-50 hover:text-orange-700 text-slate-700 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                How it works
              </Button>
            </div>

            {/* Social Proof / Stats */}
            {/* <div className="pt-8 flex items-center gap-8 border-t border-slate-200/60">
              <div className="flex -space-x-4">
                {[1,2,3,4].map((i) => (
                  <img 
                    key={i} 
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    alt="User" 
                    className="w-12 h-12 rounded-full border-4 border-white shadow-sm grayscale hover:grayscale-0 transition-all" 
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  500+
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-orange-400">
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-slate-500 mt-1">Trusted by Nepali Parents</p>
              </div>
            </div> */}
          </motion.div>

          {/* --- RIGHT COLUMN: CAROUSEL & UI --- */}
          <div className="relative hidden lg:block h-[600px]">
             {/* Abstract Background Shape behind images (Solid Orange Tint, No Gradient) */}
             <motion.div 
               animate={{ 
                 rotate: [0, 2, 0] 
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-10 right-10 w-[90%] h-[90%] bg-orange-100/50 rounded-[3rem] -z-10"
             />

             {/* MAIN CAROUSEL CONTAINER */}
             <div className="absolute top-0 right-0 w-[85%] h-[85%] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white z-10 bg-slate-200">
               <AnimatePresence mode="wait">
                 <motion.img
                    key={currentImageIndex}
                    src={carouselImages[currentImageIndex]}
                    alt="Autism support"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                 />
               </AnimatePresence>
               
               {/* Elegant Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent pointer-events-none" />
               
               {/* Text Overlay inside Image */}
               <div className="absolute bottom-6 left-8 text-white z-20">
                  <p className="text-sm font-medium opacity-90 mb-1 bg-white/20 backdrop-blur-md inline-block px-3 py-1 rounded-full">
                    Daily Progress
                  </p>
                  <p className="text-xl font-bold font-poppins drop-shadow-md mt-2">
                    Empowering Every Child
                  </p>
               </div>
             </div>

             {/* Floating Card 1: Professional Credibility */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.6 }}
               className="absolute bottom-12 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-4 max-w-[260px]"
             >
                {/* Changed background to solid orange tint */}
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Certified Experts</p>
                  <p className="text-xs text-slate-500">Verified Therapists</p>
                </div>
             </motion.div>

             {/* Floating Card 2: Interactive Element */}
             <motion.div
               initial={{ opacity: 0, y: -50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
               className="absolute top-12 -left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 z-30"
             >
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-bold text-slate-600 uppercase">Live Support</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                      <img src="https://i.pravatar.cc/100?img=32" alt="Doctor" />
                   </div>
                   <div>
                      <p className="text-xs text-slate-500">Dr. Sharma is online</p>
                      <p className="text-sm font-bold text-slate-800">Chat now</p>
                   </div>
                </div>
             </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;