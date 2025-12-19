import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Github, Twitter, Mail, Code2, Palette, Terminal, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

// ------------------------------------------------------------------
// 1. Data: The "Neuro" Tech Team
// ------------------------------------------------------------------
const team = [
  
{
    name: "Prakash Budha Magar",
    role: "Project Management & Team Lead",
    icon: Terminal,
    bio: "Building the behavioral prediction models that power our core engine.",
    image: "teams/prakash.jpg",
    socials: { linkedin: "#", github: "#" },
    color: "emerald",
  },

    {
    name: "Manish Bhusal",
    role: "Fullstack Developer",
    icon: Rocket,
    bio: "CS Student passionate about bridging the gap between healthcare and technology.",
    image: "teams/manish.png",
    socials: { linkedin: "#", github: "#", twitter: "#" },
    color: "blue",
  },
  {
    name: "Aakanksha Pathak",
    role: "Product Designer & Researcher",
    icon: Palette,
    bio: "Crafting accessible, sensory-friendly user interfaces for neurodiverse minds.",
    image: "teams/aakanksha.jpg",
    socials: { linkedin: "#", dribbble: "#" },
    color: "purple",
  },
  
  {
    name: "Nirjala Shrestha",
    role: "Backend and AI Developer",
    icon: Code2,
    bio: "Ensuring a smooth, bug-free experience across all Android and iOS devices.",
    image: "teams/nirjala.jpg",
    socials: { linkedin: "#", github: "#" },
    color: "indigo",
  },
];

// ------------------------------------------------------------------
// 2. Component: Team Card
// ------------------------------------------------------------------
const TeamCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
        
        {/* Image Section with Overlay */}
        <div className="relative h-64 w-full overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10`} />
          
          <img
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Social Icons on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20">
            <SocialButton icon={Linkedin} />
            <SocialButton icon={Github} />
            <SocialButton icon={Mail} />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 text-center relative">
            {/* Floating Role Icon */}
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 p-3 rounded-xl bg-white shadow-lg border border-slate-100`}>
                <member.icon className={`w-6 h-6 text-${member.color}-600`} />
            </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              {member.name}
            </h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-${member.color}-50 text-${member.color}-600 mb-4`}>
              {member.role}
            </span>
            <p className="text-sm text-slate-500 leading-relaxed">
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper for Social Buttons
const SocialButton = ({ icon: Icon }) => (
  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-200 hover:scale-110">
    <Icon className="w-5 h-5" />
  </button>
);

// ------------------------------------------------------------------
// 3. Main Team Section
// ------------------------------------------------------------------
const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" ref={ref}>
      
      {/* Abstract Tech Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
         <div className="absolute top-20 right-0 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-bold tracking-wider text-xs uppercase mb-3 block">
            Who We Are
          </span>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Building the Future of Care
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            A diverse team of students, engineers, and designers united by a single mission: making autism care accessible to every Nepali family.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {team.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>

        {/* Join the Team CTA */}
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center"
        >
            <p className="text-slate-500 mb-4">Want to make an impact?</p>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-medium rounded-full px-8">
                Join our Mission →
            </Button>
        </motion.div>

      </div>
    </section>
  );
};

export default Team;