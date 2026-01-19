import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-neutral-midnight to-neutral-charcoal text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent rounded-full blur-2xl" />
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Left Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="AutiSahara Logo" 
                className="w-12 h-12 object-contain"
              />
              <h3 
                className="text-3xl font-black"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AutiSahara
              </h3>
            </div>
            <p className="text-white/80 mb-6 text-lg leading-relaxed">
              Empowering families across Nepal with accessible neurodevelopmental care
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Middle Column */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-white/70">
              {[
                "About Us",
                "How It Works",
                "For Doctors",
                "For Parents",
                "Blog/Resources",
                "Contact",
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center group">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 group-hover:scale-125 transition-transform" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white">Contact Information</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3 group">
                <Mail className="h-5 w-5 mt-1 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">support@AutiSahara.com.np</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Phone className="h-5 w-5 mt-1 flex-shrink-0 text-accent group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">+977-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-secondary group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">Kathmandu, Nepal</span>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-lg font-semibold mb-4 text-white">Download the App:</p>
              <div className="space-y-3">
                <div className="px-4 py-3 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-2xl text-sm hover:from-primary/30 hover:to-accent/30 transition-all duration-300 cursor-pointer border border-white/20 flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <span className="font-semibold">Google Play Store</span>
                </div>
                <div className="px-4 py-3 bg-white/5 rounded-2xl text-sm text-white/50 cursor-not-allowed border border-white/10 flex items-center gap-3">
                  <span className="text-2xl opacity-50">🍎</span>
                  <span>Coming Soon to iOS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
          <p className="font-medium">© 2024 AutiSahara. All rights reserved. Made with ❤️ for Nepal's families.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300 font-medium">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300 font-medium">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300 font-medium">
              Data Protection
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
