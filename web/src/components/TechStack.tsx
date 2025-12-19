import { motion } from "framer-motion";
import { 
  LayoutTemplate, 
  Smartphone, 
  Server, 
  BrainCircuit, 
  Database 
} from "lucide-react";

const techStack = [
  {
    category: "Frontend (Web)",
    icon: LayoutTemplate,
    tools: ["React.js", "Tailwind CSS", "Framer Motion", "Vite"],
  },
  {
    category: "Mobile App",
    icon: Smartphone,
    tools: ["React Native", "Expo", "NativeWind", "iOS & Android"],
  },
  {
    category: "Backend API",
    icon: Server,
    tools: ["Django", "Django Rest Framework", "JWT Auth"],
  },
  {
    category: "AI & Database",
    icon: Database,
    tools: ["PostgreSQL", "Python (AI Models)", "TensorFlow", "Redis"],
  }
];

const TechStack = () => {
  return (
    <section className="py-20 bg-orange-50/30 font-sans border-t border-orange-100">
      <div className="container mx-auto px-6">
        
        {/* Minimal Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Built with Modern Tech
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Scalable, secure, and fast architecture.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <stack.icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
                  {stack.category}
                </h3>
              </div>

              {/* Tools List (Tags) */}
              <div className="flex flex-wrap gap-2">
                {stack.tools.map((tool, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechStack;