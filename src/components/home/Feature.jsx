import React from "react";
import { folder, micro, summarize } from "../../assets";
import { FaMicrophone, FaFileAlt, FaRobot, FaArrowRight } from "react-icons/fa";

const Feature = () => {
  const features = [
    {
      id: "speech",
      icon: <FaMicrophone className="text-3xl" />,
      title: "Voice-to-Text & Text-to-Speech",
      description:
        "Transform conversations with Azure AI's powerful speech capabilities. Convert text to natural-sounding speech and vice versa for seamless, engaging communication.",
      image: micro,
      badge: "AI Powered",
      color: "primary",
    },
    {
      id: "files",
      icon: <FaFileAlt className="text-3xl" />,
      title: "Easy File Sharing",
      description:
        "Share documents, images, and media directly in your chat rooms. File sharing is seamless, secure, and efficient for all your collaborative needs.",
      image: folder,
      badge: "Secure",
      color: "accent",
    },
    {
      id: "summarize",
      icon: <FaRobot className="text-3xl" />,
      title: "AI Chat Summarization",
      description:
        "Powered by Azure OpenAI, quickly summarize conversations within any date range. Stay updated without reading every message.",
      image: summarize,
      badge: "Coming Soon",
      color: "aurora",
    },
  ];

  const colorMap = {
    primary: {
      bg: "from-primary-500 to-primary-600",
      border: "border-primary-500/30",
      shadow: "shadow-glow",
      text: "text-primary-400",
      glow: "bg-primary-500/10"
    },
    accent: {
      bg: "from-accent-500 to-accent-600",
      border: "border-accent-500/30",
      shadow: "shadow-glow-accent",
      text: "text-accent-400",
      glow: "bg-accent-500/10"
    },
    aurora: {
      bg: "from-aurora-500 to-aurora-600",
      border: "border-aurora-500/30",
      shadow: "shadow-glow-aurora",
      text: "text-aurora-400",
      glow: "bg-aurora-500/10"
    },
  };

  return (
    <div className="relative py-32 bg-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center space-x-2 px-5 py-2 glass rounded-full border border-primary-200">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gradient-cyan">Powerful Features</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 leading-[1.1]">
            Everything you need for
            <br />
            <span className="text-gradient">seamless communication</span>
          </h2>
          
          <div className="flex justify-center">
            <div className="h-1 w-32 bg-gradient-to-r from-primary-500 via-accent-500 to-aurora-500 rounded-full"></div>
          </div>
          
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            AI-powered features designed to break down language barriers and enhance collaboration
          </p>
        </div>

        {/* Features Grid - Staggered Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group relative ${index === 1 ? 'lg:mt-12' : ''}`}
            >
              {/* Card */}
              <div className={`relative bg-white rounded-3xl p-8 border-2 ${colorMap[feature.color].border} 
                            hover:border-${feature.color}-500/60 transition-all duration-500 overflow-hidden
                            hover:scale-105 hover:shadow-depth`}>
                
                {/* Glow effect */}
                <div className={`absolute inset-0 ${colorMap[feature.color].glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Animated corner accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${colorMap[feature.color].glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`p-4 bg-gradient-to-br ${colorMap[feature.color].bg} rounded-2xl ${colorMap[feature.color].shadow} text-white`}>
                      {feature.icon}
                    </div>
                    <span className={`text-xs font-bold ${colorMap[feature.color].text} px-4 py-2 glass rounded-full border ${colorMap[feature.color].border}`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Feature Image */}
                  <div className="relative h-48 flex items-center justify-center">
                    <div className={`absolute inset-0 ${colorMap[feature.color].glow} rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="relative h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-display font-bold text-neutral-900 group-hover:${feature.color}-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover arrow indicator */}
                  <div className={`flex items-center ${colorMap[feature.color].text} font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                    <span className="text-sm">Learn more</span>
                    <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center space-y-4 glass-frosted p-8 rounded-3xl border border-neutral-200">
            <p className="text-lg text-neutral-700 font-medium">
              Want to explore all capabilities?
            </p>
            <a
              href="#services"
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              View All Features
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
