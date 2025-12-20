import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Doctors from "@/components/Doctors";
import HowItWorks from "@/components/HowItWorks";
import AppShowcase from "@/components/AppShowcase";
import TechStack from "@/components/TechStack";
import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
import Personalities from "@/components/Personalities";
import FutureVision from "@/components/FutureVision";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      {/* <Problem /> */}
      <Solution />
      {/* <Doctors /> */}
      <HowItWorks />
      {/* <AppShowcase /> */}
      {/*      
      <Pricing />
      
      <FutureVision />
       <TechStack />
     
      <Personalities />
       <Team /> */}
      <Footer />
    </main>
  );
};

export default Index;
