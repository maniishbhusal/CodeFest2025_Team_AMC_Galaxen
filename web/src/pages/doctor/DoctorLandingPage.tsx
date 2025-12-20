import React from "react";
import { Heart, Users, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorLandingPage() {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/doctor/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Autisahara
            </span>
          </div>
          <button
            onClick={handleJoinClick}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Join Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-orange-50 rounded-full">
          <span className="text-orange-600 font-semibold text-sm">
            For Healthcare Professionals
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
          Empower Parents,
          <br />
          Transform Lives
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our platform to guide parents of autistic children with
          personalized tasks and therapeutic activities that make a real
          difference.
        </p>
        <button
          onClick={handleJoinClick}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
        >
          Get Started Today
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Why Join Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Why Join Our Platform?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Direct Impact
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Provide personalized guidance directly to parents, extending your
              care beyond clinic visits and making a lasting impact on
              children's development.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Task Management
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Create and assign therapeutic tasks, monitor progress, and adjust
              interventions based on real-time feedback from parents.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Better Outcomes
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Consistent home-based activities lead to improved developmental
              outcomes and stronger parent-child relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Assign customized therapeutic tasks",
              "Track parent and child progress",
              "Provide video demonstrations",
              "Monitor task completion in real-time",
              "Adjust interventions based on feedback",
              "Build comprehensive development plans",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join hundreds of healthcare professionals who are already transforming
          the lives of autistic children and their families.
        </p>
        <button
          onClick={handleJoinClick}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
        >
          Join Our Platform
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>
            © 2024 AutismCare Platform. Empowering families, one task at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
