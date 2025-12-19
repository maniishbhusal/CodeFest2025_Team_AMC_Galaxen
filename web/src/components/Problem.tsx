import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, DollarSign, Calendar, ArrowRight } from "lucide-react";

const problems = [
  {
    icon: MapPin,
    color: "text-rose-500",
    bgIcon: "bg-rose-50",
    borderColor: "group-hover:border-rose-200",
    glowColor: "group-hover:shadow-rose-500/5",
    title: "Limited Access",
    description:
      "Only Kathmandu has specialized child neurologists. Families travel days for a single consultation.",
    stat: "80% of families live outside Kathmandu",
  },
  {
    icon: DollarSign,
    color: "text-amber-500",
    bgIcon: "bg-amber-50",
    borderColor: "group-hover:border-amber-200",
    glowColor: "group-hover:shadow-amber-500/5",
    title: "High Financial Barrier",
    description:
      "Daily therapy costs ~Rs. 3,000 per session. This is unsustainable for most families long-term.",
    stat: "Monthly cost exceeds Rs. 60,000+",
  },
  {
    icon: Calendar,
    color: "text-violet-500",
    bgIcon: "bg-violet-50",
    borderColor: "group-hover:border-violet-200",
    glowColor: "group-hover:shadow-violet-500/5",
    title: "Inconsistent Care",
    description:
      "Without daily guidance, progress stalls. Children miss critical developmental windows due to gaps in care.",
    stat: "Need 20+ hours structured support",
  },
];

const Problem = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section 
      className="py-24 bg-slate-50 relative overflow-hidden font-sans" 
      ref={ref}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background: Subtle Dot Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]" 
        style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '32px 32px'
        }} 
      />
      
      {/* Soft Ambient Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200/50 border border-slate-300/50 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
            The Reality
          </span>
          <h2 
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Barriers to <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">Essential Care</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Understanding the systemic challenges preventing thousands of children in Nepal from receiving the neurodevelopmental support they deserve.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className={`group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 ${problem.borderColor} ${problem.glowColor}`}
            >
              {/* Icon Header */}
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${problem.bgIcon} ${problem.color} ring-1 ring-inset ring-black/5`}>
                  <problem.icon size={28} strokeWidth={1.5} />
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                   <ArrowRight size={20} />
                </span>
              </div>

              {/* Content */}
              <h3 
                className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {problem.title}
              </h3>
              
              <p className="text-slate-500 leading-relaxed mb-8 text-sm">
                {problem.description}
              </p>

              {/* Stat Footer */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${problem.color.replace('text-', 'bg-')}`} />
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    {problem.stat}
                  </span>
                </div>
              </div>
              
              {/* Spacer for absolute footer */}
              <div className="h-8" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;