import React from "react";
import { mission } from "../../assets";
import { FaGlobeAmericas, FaUsers, FaHeadset } from "react-icons/fa";

const Mission = () => {
  return (
    <div className="relative py-32 overflow-hidden bg-neutral-950">
      {/* Background Image with advanced overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${mission})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/95 via-neutral-950/85 to-neutral-900/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-white animate-slide-right">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-dark rounded-full border border-primary-500/30">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">Our Mission</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-[1.1]">
                A World Without
                <br />
                <span className="text-gradient">Language Barriers</span>
              </h2>
              
              <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
            </div>

            <p className="text-xl text-neutral-300 leading-relaxed max-w-2xl">
              By combining cutting-edge AI with secure, seamless access, we bring people together—breaking down 
              linguistic divides and building a more <span className="text-primary-400 font-semibold">connected world</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center space-x-3 glass-dark px-6 py-3 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <div>
                  <div className="text-sm text-neutral-400">Powered by</div>
                  <div className="text-white font-semibold">Azure AI</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 glass-dark px-6 py-3 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-aurora-500 to-aurora-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <div>
                  <div className="text-sm text-neutral-400">Response time</div>
                  <div className="text-white font-semibold">&lt; 100ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-1 gap-6 animate-slide-left">
            <div className="group relative glass-dark p-8 rounded-3xl border border-primary-500/20 hover:border-primary-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                  <FaGlobeAmericas className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-display font-bold text-gradient-cyan mb-2">140+</div>
                  <div className="text-neutral-300 font-medium">Supported Languages</div>
                  <div className="text-sm text-neutral-500 mt-1">Covering 95% of the world's population</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            </div>

            <div className="group relative glass-dark p-8 rounded-3xl border border-accent-500/20 hover:border-accent-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow-accent flex-shrink-0">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-accent-600 mb-2">10K+</div>
                  <div className="text-neutral-300 font-medium">Happy Users</div>
                  <div className="text-sm text-neutral-500 mt-1">And growing every day</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            </div>

            <div className="group relative glass-dark p-8 rounded-3xl border border-aurora-500/20 hover:border-aurora-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-aurora-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-aurora-500 to-aurora-600 rounded-2xl flex items-center justify-center shadow-glow-aurora flex-shrink-0">
                  <FaHeadset className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-display font-bold text-gradient-aurora mb-2">24/7</div>
                  <div className="text-neutral-300 font-medium">Support</div>
                  <div className="text-sm text-neutral-500 mt-1">Always here to help you</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
