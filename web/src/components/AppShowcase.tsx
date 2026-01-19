import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const screenshots = [
  { label: "Welcome Screen", color: "from-primary to-accent" },
  { label: "Child Profile", color: "from-accent to-soft-teal" },
  { label: "Assessment", color: "from-warm-coral to-sunrise" },
  { label: "Interactive Game", color: "from-gentle-purple to-lavender" },
  { label: "Dashboard", color: "from-primary to-gentle-purple" },
  { label: "Daily Routines", color: "from-leaf to-soft-teal" },
  { label: "Task Details", color: "from-sunrise to-peach" },
  { label: "Progress Chart", color: "from-calm-blue to-primary" },
  { label: "Weekly Summary", color: "from-accent to-leaf" },
  { label: "Achievements", color: "from-warm-coral to-gentle-purple" },
];

const AppShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section
      className="py-20 md:py-32 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden"
      ref={ref}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              y: [Math.random() * 100, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 text-white"
        >
          <h2 className="section-title mb-4 text-white">See AutiSahara in Action</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            A glimpse into the platform that's transforming autism care
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
            size="icon"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>
          <Button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
            size="icon"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </Button>

          {/* Screenshot Carousel */}
          <div className="overflow-hidden py-12">
            <motion.div
              className="flex gap-8"
              animate={{ x: -currentIndex * 336 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {screenshots.map((screenshot, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="glass-card rounded-3xl p-4 w-80">
                    {/* Phone Mockup */}
                    <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-10" />
                      
                      {/* Screen */}
                      <div
                        className={`aspect-[9/19.5] bg-gradient-to-br ${screenshot.color} flex items-center justify-center text-white text-4xl font-black`}
                      >
                        {screenshot.label.split(" ")[0][0]}
                      </div>
                    </div>
                    
                    <p className="text-center mt-4 text-white text-sm font-medium">
                      {screenshot.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
