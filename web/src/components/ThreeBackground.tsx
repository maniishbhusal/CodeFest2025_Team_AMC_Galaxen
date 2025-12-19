import { motion } from 'framer-motion';

// Pure CSS-based background animations
export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* CSS Particle Animation */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Professional floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -25, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/8 rounded-full blur-3xl"
        animate={{
          x: [0, -35, 0],
          y: [0, 35, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-60 h-60 bg-secondary/6 rounded-full blur-3xl"
        animate={{
          x: [0, 25, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
