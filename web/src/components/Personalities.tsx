import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Quote } from "lucide-react";

// Real Data with Stable Image Links (Wikimedia/Public Domain)
const personalities = [
  {
    name: "Albert Einstein",
    title: "Theoretical Physicist",
    tag: "Science",
    achievement: "Developed the theory of relativity. Known for intense focus and social difficulties.",
    quote: "The person who follows the crowd will usually go no further than the crowd.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/800px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg",
  },
  {
    name: "Nikola Tesla",
    title: "Inventor & Electrical Pioneer",
    achievement: "Father of alternating current and wireless technology.",
    quote: "The mind is sharper and keener in seclusion.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tesla_circa_1890.jpeg/800px-Tesla_circa_1890.jpeg",
  },
  {
    name: "Isaac Newton",
    title: "Mathematician & Physicist",
    achievement: "Laws of motion and gravity — foundation of modern science.",
    quote: "To myself I am only a child playing on the beach...",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/800px-GodfreyKneller-IsaacNewton-1689.jpg",
  },
  {
    name: "Temple Grandin",
    title: "Scientist & Activist",
    tag: "Advocacy",
    achievement: "Revolutionized livestock handling systems. One of the first to document the autistic experience.",
    quote: "I am different, not less.",
    image: "https://m.media-amazon.com/images/M/MV5BMjQwOTQ4NDk5OF5BMl5BanBnXkFtZTcwNzM0Mjk3Mw@@._V1_FMjpg_UX1000_.jpg",
  },
  {
    name: "Elon Musk",
    title: "Tech Entrepreneur",
    tag: "Technology",
    achievement: "CEO of Tesla & SpaceX. Revealed his Asperger's diagnosis on SNL.",
    quote: "I see things differently, and that's my strength.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/800px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
  },
  {
    name: "Greta Thunberg",
    title: "Climate Activist",
    tag: "Activism",
    achievement: "Calls her autism her 'superpower' in her laser-focused fight for the climate.",
    quote: "Being different is a gift. It makes you see things from outside the box.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Greta_Thunberg_urges_MEPs_to_show_climate_leadership_%2849616114098%29_%28cropped%29.jpg/800px-Greta_Thunberg_urges_MEPs_to_show_climate_leadership_%2849616114098%29_%28cropped%29.jpg",
  },
  {
    name: "Anthony Hopkins",
    title: "Academy Award Actor",
    tag: "Arts",
    achievement: "Diagnosed late in life. He credits his condition for his ability to deconstruct roles.",
    quote: "I don't learn lines. I learn the architecture of the thinking.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Anthony_Hopkins_TIFF_2010.jpg/800px-Anthony_Hopkins_TIFF_2010.jpg",
  },
  {
    name: "Satoshi Tajiri",
    title: "Creator of Pokémon",
    tag: "Gaming",
    achievement: "His childhood fixation on bug collecting evolved into the world's biggest media franchise.",
    quote: "My passion became my life's work.",
    image: "https://upload.wikimedia.org/wikipedia/en/5/50/Satoshi_Tajiri.jpg",
  },
];

// Personality Card Component
const PersonalityCard = ({ person }: { person: typeof personalities[0] }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="flex-shrink-0 w-[340px] backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-xl shadow-orange-900/5 border border-white group cursor-default"
    >
      {/* Image Section */}
      <div className="h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        
        {/* Image: Grayscale by default, Color on hover */}
        <img 
          src={person.image} 
          alt={person.name}
          className="w-full h-full object-cover filter grayscale contrast-110 transition-all duration-500 group-hover:filter-none group-hover:scale-110"
        />
        
        {/* Floating Tag */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-orange-600 shadow-sm uppercase tracking-wider">
            {person.tag || 'Notable'}
          </span>
        </div>

        <div className="absolute bottom-4 left-6 z-20">
          <h3 className="text-2xl font-bold text-white mb-0.5">{person.name}</h3>
          <p className="text-orange-200 text-sm font-medium">{person.title}</p>
        </div>
      </div>

      {/* Text Content */}
      <div className="p-6 relative">
        <Quote className="absolute top-4 right-6 text-orange-100 w-10 h-10 rotate-180 fill-orange-50" />
        
        <p className="text-slate-600 text-sm leading-relaxed mb-4 relative z-10">
          {person.achievement}
        </p>
        
        <div className="pt-4 border-t border-orange-100">
          <p className="text-orange-800 italic font-medium text-sm">
            "{person.quote}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const Personalities = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Duplicate for infinite scroll loop
  const duplicatedPersonalities = [...personalities, ...personalities, ...personalities];

  return (
    <section
      className="py-24 bg-blue-50 relative overflow-hidden"
      ref={ref}
    >
      {/* Warm Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-semibold text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Inspiration</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Different Thinking Changes the World
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Autism isn't a barrier to success. Throughout history, neurodivergent minds have shaped science, art, and technology in ways no one else could.
          </p>
        </motion.div>

        {/* Infinite Carousel */}
        <div className="relative -mx-4 md:-mx-20 overflow-hidden py-8">
          {/* Gradient Masks to fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#FFF5EB] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#FFF5EB] to-transparent z-20 pointer-events-none" />

          <motion.div
            className="flex gap-8 pl-8"
            animate={{
              x: ["0%", "-33.33%"], 
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {duplicatedPersonalities.map((person, index) => (
              <PersonalityCard key={index} person={person} />
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-2xl font-semibold text-slate-800 mb-8">
            Help your child find their unique superpower.
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 text-lg px-10 py-7 rounded-full shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
          >
            Start Their Journey Today
          </Button>
        </motion.div>

      </div>
    </section>
  );
};

export default Personalities;
