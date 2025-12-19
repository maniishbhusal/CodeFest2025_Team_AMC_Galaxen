import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'For Parents', href: '#for-parents' },
  { name: 'For Doctors', href: '#for-doctors' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* --- Logo --- */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex-shrink-0">
              {/* Ensure your logo fits the warm theme, or use a placeholder */}
              <img src="/logo.png" alt="AutiSahara Logo" className="w-10 h-10 object-contain"/>
            </div>
            <span className="text-2xl font-black hidden sm:block text-slate-900 tracking-tight">
              AutiSahara
            </span>
          </motion.div>

          {/* --- Desktop Navigation --- */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-slate-600 hover:text-orange-600 font-medium transition-colors duration-300 relative group text-sm tracking-wide"
              >
                {item.name}
                {/* Underline Effect (Solid Orange) */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* --- Desktop CTA Buttons --- */}
          <div className="hidden md:flex items-center gap-4">
            {/* Outline Button (Soft Orange Border) */}
            <Button
              variant="outline"
              className="border-2 border-orange-100 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-all duration-300 rounded-full px-6"
            >
              Sign In
            </Button>
            
            {/* Solid Button (No Gradient, Solid Warm Orange) */}
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 shadow-md shadow-orange-500/20 transition-all duration-300"
            >
              Get Started
            </Button>
          </div>

          {/* --- Mobile Menu Button --- */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* --- Mobile Menu Dropdown --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-orange-100 overflow-hidden shadow-xl rounded-b-2xl"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                {/* Mobile Buttons */}
                <div className="pt-4 flex flex-col gap-3 border-t border-orange-100/50 mt-2">
                  <Button
                    variant="outline"
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl h-12"
                  >
                    Sign In
                  </Button>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 shadow-md shadow-orange-500/20">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;