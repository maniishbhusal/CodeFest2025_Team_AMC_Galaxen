import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "/pricing/usertarget.png",
    alt: "User Target Analysis",
    title: "Target Market Reach"
  },
  {
    id: 2,
    src: "/pricing/revenue.png",
    alt: "Revenue Projections",
    title: "Financial Growth Potential"
  },
  {
    id: 3,
    src: "/pricing/paybackperiod.png",
    alt: "Payback Period Analysis",
    title: "Investment Return Timeline"
  }
];

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-slate-50 via-orange-50/20 to-blue-50/20 relative overflow-hidden" ref={ref}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
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
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
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
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </motion.div>
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              Business Insights
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-6xl font-bold mb-6 font-serif"
          >
            Market Analysis &{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Growth Potential
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-xl text-slate-600 leading-relaxed font-sans max-w-3xl mx-auto"
          >
            Comprehensive business insights showcasing market opportunity and financial projections for AutiSahara
          </motion.p>
        </motion.div>

        {/* Enhanced Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 hover:shadow-2xl transition-shadow duration-500">
            <h3 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-slate-900 font-serif">
              Business Analytics Dashboard
            </h3>
            
            {/* Modern Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="cursor-pointer group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
                  onClick={() => openModal(index)}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-bold text-lg mb-1">{image.title}</h4>
                    <p className="text-sm opacity-90">{image.alt}</p>
                  </div>
                  
                  {/* Click indicator */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center text-slate-600 mt-8 text-lg font-sans"
            >
              💡 Click any chart to explore detailed insights
            </motion.p>
          </div>
        </motion.div>

        {/* Modal Gallery */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh]">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              
              {/* Navigation arrows */}
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Image counter */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
              
              {/* Main image */}
              <div className="flex items-center justify-center h-full">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Image title */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-center">
                <p className="font-semibold">{galleryImages[currentImageIndex].title}</p>
                <p className="text-sm opacity-80">{galleryImages[currentImageIndex].alt}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;