import React, { useState, useEffect } from "react";
import { hero } from "../../assets";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui";
import { FaArrowRight, FaPlay, FaGlobe, FaComments, FaLanguage, FaCheck } from "react-icons/fa";

const Hero = ({ serviceRef }) => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState(0);
  
  const languages = ["Hello", "Hola", "Bonjour", "こんにちは", "你好", "مرحبا", "Привет", "Olá"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLang((prev) => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToServiceSection = () => {
    if (serviceRef && serviceRef.current) {
      serviceRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 gradient-mesh"></div>

      <div className="section-container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">10,000+ users chatting worldwide</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight">
                Say{" "}
                <span className="text-gradient">
                  {languages[currentLang]}
                </span>
                <br />
                in any language
              </h1>
              <p className="text-xl text-neutral-600 max-w-xl leading-relaxed">
                Break language barriers instantly with AI-powered real-time translation. 
                Connect with anyone, anywhere across{" "}
                <span className="text-primary-600 font-semibold">140+ languages</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/Chat")}
                variant="gradient"
                size="lg"
                icon={<FaArrowRight />}
              >
                Get Started Free
              </Button>

              <button
                onClick={scrollToServiceSection}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 
                         bg-white text-neutral-700 text-lg font-semibold rounded-xl
                         border border-neutral-200 hover:border-neutral-300
                         hover:bg-neutral-50 transition-all duration-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <FaPlay className="ml-1 text-neutral-600" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                <div className="text-3xl font-bold text-primary-600">140+</div>
                <div className="text-sm text-neutral-600 mt-1">Languages</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                <div className="text-3xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-neutral-600 mt-1">Active Users</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                <div className="text-3xl font-bold text-primary-600">99.9%</div>
                <div className="text-sm text-neutral-600 mt-1">Uptime</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <FaCheck className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <FaCheck className="text-green-500" />
                <span>Free forever</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl"></div>
              <img
                src={hero}
                alt="Chatlas Chat Interface"
                className="relative rounded-2xl shadow-2xl border border-neutral-200/50"
              />
            </div>

            {/* Floating feature cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-neutral-200 max-w-[200px]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FaLanguage className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">Real-time</div>
                  <div className="text-xs text-neutral-600">Translation</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-neutral-200 max-w-[200px]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FaGlobe className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">140+ Languages</div>
                  <div className="text-xs text-neutral-600">Supported</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
