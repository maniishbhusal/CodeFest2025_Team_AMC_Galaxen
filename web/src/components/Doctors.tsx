import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Quote, Stethoscope, Activity, Brain, MapPin, Linkedin, CheckCircle2 } from "lucide-react";

const doctors = [
  {
    name: "Dr. Anjana Sharma",
    credentials: "MD Pediatrics, Autism Specialist",
    institution: "Kanti Children's Hospital",
    role: "Lead Clinical Advisor",
    quote: "AutiSahara fills a critical gap in early intervention and autism care delivery in Nepal.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    color: "blue",
    icon: Stethoscope,
  },
  {
    name: "Dr. Bijay Thapa",
    credentials: "Clinical Psychologist, PhD",
    institution: "Autism Spectrum Nepal",
    role: "Therapy Framework",
    quote: "This platform empowers parents with evidence-based cognitive strategies at home.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    color: "purple",
    icon: Brain,
  },
  {
    name: "Dr. Sarita Karki",
    credentials: "Occupational Therapist",
    institution: "Nepal Children's Hospital",
    role: "Routine Consultant",
    quote: "Daily routines are key to progress. AutiSahara makes consistency easy for families.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop",
    color: "teal",
    icon: Activity,
  },
  {
    name: "Dr. Rajan Paudel",
    credentials: "Developmental Pediatrician",
    institution: "Patan Hospital",
    role: "Medical Board",
    quote: "Technology is transforming how we deliver continuous care to remote families.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
    color: "indigo",
    icon: Stethoscope,
  },
];

const DoctorCard = ({ doctor, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -12 }}
      className="group relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
    >
      {/* Top Banner Background */}
      <div className={`h-24 w-full bg-gradient-to-r ${
        doctor.color === 'blue' ? 'from-blue-500 to-cyan-400' :
        doctor.color === 'purple' ? 'from-purple-500 to-pink-400' :
        doctor.color === 'teal' ? 'from-teal-500 to-emerald-400' :
        'from-indigo-500 to-violet-400'
      }`} />

      <div className="px-6 pb-8 relative">
        
        {/* Image Container */}
        <div className="relative -mt-12 mb-4 flex justify-between items-end">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
               <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
            </div>
          </div>
          
          {/* Floating Icon based on specialty */}
          <div className={`p-3 rounded-xl bg-${doctor.color}-50 text-${doctor.color}-600 mb-1`}>
            <doctor.icon className="w-6 h-6" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <Badge variant="secondary" className="mb-2 bg-slate-100 text-slate-600 hover:bg-slate-200">
            {doctor.role}
          </Badge>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-sm font-medium text-blue-600 mb-1">
            {doctor.credentials}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="w-3 h-3" />
            {doctor.institution}
          </div>
        </div>

        {/* Quote Section */}
        <div className="relative bg-slate-50 rounded-xl p-4 border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
          <Quote className="absolute top-3 left-3 w-4 h-4 text-slate-300 rotate-180" />
          <p className="text-sm text-slate-600 italic leading-relaxed pl-4">
            "{doctor.quote}"
          </p>
        </div>

        {/* Hover Social Action */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white/40 text-white">
                <Linkedin className="w-5 h-5" />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const Doctors = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" ref={ref}>
      
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
             <Activity className="w-4 h-4" /> Medical Advisory Board
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Trusted by Nepal's Leading Specialists
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto">
            Our curriculum is developed in strict collaboration with pediatricians, psychologists, and therapists from Nepal's top hospitals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} doctor={doctor} index={index} />
          ))}
        </div>

        {/* Bottom Trust Indicator */}
        <motion.div 
             initial={{ opacity: 0 }}
             animate={isInView ? { opacity: 1 } : {}}
             transition={{ delay: 0.8 }}
             className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 text-slate-400 text-sm"
        >
            <span className="uppercase tracking-widest font-semibold">Partner Hospitals</span>
            <div className="flex gap-8 grayscale opacity-60">
                <span className="font-bold text-lg">KANTI CHILDREN'S</span>
                <span className="font-bold text-lg">PATAN HOSPITAL</span>
                <span className="font-bold text-lg">TEACHING HOSPITAL</span>
            </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Doctors;