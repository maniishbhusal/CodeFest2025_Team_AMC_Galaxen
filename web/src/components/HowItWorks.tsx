import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, Target, BarChart, Smartphone, TrendingUp, CheckCircle2, Sparkles, ArrowRight, Download } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: FileText,
    title: "Quick Registration",
    subtitle: "Set up in 5 minutes",
    description:
      "Download the NeuroCare app, enter your child's basic details, and select their specific challenges. We support both English and Nepali languages for your comfort.",
    checkpoints: ["Basic Profile Setup", "Language Selection", "Goal Setting"],
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    gradientFrom: "from-orange-500",
    gradientTo: "to-amber-500",
    image: "/registration.png",
  },
  {
    id: "02",
    icon: Target,
    title: "Questionnaire Assessment",
    subtitle: "Fun & Interactive",
    description:
      "No boring forms! Your child plays guided interactive questions that assess attention, memory, and communication skills. It feels like playtime, not a test.",
    checkpoints: ["20-30 Minute Session", "Child-Friendly Questions", "Auto-Scoring"],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-500",
    image: "/games.png",
  },
  {
    id: "03",
    icon: BarChart,
    title: "Instant Clinical Report",
    subtitle: "For Parents & Doctors",
    description:
      "Get immediate insights. We generate a simple summary for you and a detailed clinical PDF that you can share with doctors for a formal diagnosis.",
    checkpoints: ["Behavioral Analysis", "Symptom Indicators", "Downloadable PDF"],
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-500",
    image: "/progresscheck.png",
  },
  {
    id: "04",
    icon: Smartphone,
    title: "Daily Routine Support",
    subtitle: "Guided by You",
    description:
      "Receive a personalized daily checklist. The app guides *you* (the parent) on how to perform therapy activities with your child without increasing their screen time.",
    checkpoints: ["Morning/Evening Routines", "Visual Guides", "No Child Screen Time"],
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    image: "/task.png",
  },
  {
    id: "05",
    icon: TrendingUp,
    title: "Track & Improve",
    subtitle: "Continuous Progress",
    description:
      "Watch your child's progress in real-time with beautiful visualizations. Get weekly summaries every Sunday with detailed insights. Share achievement certificates and reports with healthcare providers for coordinated care.",
    checkpoints: ["Weekly Progress Summaries", "Achievement Certificates", "Doctor Reports", "Growth Visualizations"],
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
    image: "/tracking.png",
  },
  {
    id: "06",
    icon: Sparkles,
    title: "AI Adaption & Learning",
    subtitle: "Personalized Growth",
    description:
      "Our intelligent AI learns from your child's responses and progress patterns. It automatically adjusts game difficulty, recommends personalized activities, and predicts optimal intervention timing. Each interaction makes NeuroCare smarter and more effective for your child's unique needs.",
    checkpoints: ["Adaptive Difficulty Scaling", "Personalized Recommendations", "Predictive Insights", "Real-time Optimization"],
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-500",
    image: "/aii.png",
  },
];const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-orange-50/20 to-blue-50/20 overflow-hidden relative">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header with Enhanced Animation */}
        <div className="text-center max-w-4xl mx-auto mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={16} className="text-white" />
            </motion.div>
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              Simple 5-Step Process
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-6xl font-bold mb-6 font-serif"
          >
            Your Journey with{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              NeuroCare
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-xl text-slate-600 leading-relaxed font-sans"
          >
            From downloading the app to seeing your child smile at new milestones, 
            we've made the process <span className="font-bold text-orange-600">intuitive</span>, 
            <span className="font-bold text-blue-600"> clinical</span>, and 
            <span className="font-bold text-emerald-600"> stress-free</span>.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 font-sans"
          >
            <Download size={20} />
            Download Now
            <ArrowRight size={20} />
          </motion.button>
        </div>

        {/* Steps with Enhanced Animations */}
        <div className="space-y-32 lg:space-y-40">
          {steps.map((step, index) => (
            <StepCard 
              key={step.id} 
              step={step} 
              index={index}
              isHovered={hoveredStep === index}
              onHover={() => setHoveredStep(index)}
              onLeave={() => setHoveredStep(null)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

const StepCard = ({ step, index, isHovered, onHover, onLeave }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-28 ${isEven ? '' : 'lg:flex-row-reverse'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      
      {/* TEXT CONTENT */}
      <motion.div 
        className="flex-1 w-full"
        initial={{ opacity: 0, x: isEven ? -80 : 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative">
          {/* Animated Step Number */}
          <motion.span 
            className="absolute -top-12 -left-8 text-[140px] font-black bg-gradient-to-br from-slate-100 to-slate-200 bg-clip-text text-transparent -z-10 select-none font-serif"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {step.id}
          </motion.span>

          {/* Icon and Title */}
          <motion.div 
            className="flex items-center gap-5 mb-8"
            whileHover={{ x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} flex items-center justify-center shadow-lg`}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <step.icon size={32} strokeWidth={2} className="text-white" />
            </motion.div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">
                {step.title}
              </h3>
              <span className={`text-sm font-bold uppercase tracking-wider ${step.color} font-sans`}>
                {step.subtitle}
              </span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-slate-700 text-lg leading-relaxed mb-8 font-sans"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {step.description}
          </motion.p>

          {/* Checkpoints */}
          <ul className="space-y-4">
            {step.checkpoints.map((point, i) => (
              <motion.li 
                key={i} 
                className="flex items-center gap-3 text-slate-800 font-medium font-sans"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <CheckCircle2 className={`w-6 h-6 ${step.color}`} />
                </motion.div>
                {point}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* PHONE MOCKUP */}
      <motion.div 
        className="flex-1 w-full flex justify-center"
        initial={{ opacity: 0, x: isEven ? 80 : -80, rotateY: isEven ? 45 : -45 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div 
          className="relative w-[320px] h-[640px] bg-slate-900 rounded-[3.5rem] p-4 shadow-2xl"
          whileHover={{ y: -15, rotateY: 5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-20 flex items-center justify-center">
            <div className="w-16 h-1.5 bg-slate-700 rounded-full"></div>
          </div>
          
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden relative shadow-inner">
            {/* Placeholder Image with Gradient Overlay */}
            <div className={`w-full h-full ${step.bgColor} flex items-center justify-center relative`}>
              <img 
                src={step.image} 
                alt={step.title}
                className="w-full h-full object-cover"
              />
              
              {/* Animated Gradient Overlay */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} opacity-20`}
                animate={{ opacity: isHovered ? 0.3 : 0.1 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Floating Particles */}
          <motion.div 
            className={`absolute -z-10 top-10 -right-12 w-72 h-72 rounded-full opacity-30 blur-3xl bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo}`}
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0.4 : 0.3,
            }}
            transition={{ duration: 0.4 }}
          />
          <motion.div 
            className={`absolute -z-10 bottom-10 -left-12 w-72 h-72 rounded-full opacity-30 blur-3xl bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo}`}
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0.4 : 0.3,
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default HowItWorks;