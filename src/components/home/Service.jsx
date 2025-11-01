import React, { forwardRef } from "react";
import { earth, serviceOne, translateIcon } from "../../assets";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaComments, FaLanguage, FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";

const Service = forwardRef((props, ref) => {
  const navigate = useNavigate();

  const services = [
    {
      id: "translate",
      icon: <FaLanguage className="text-3xl text-primary-600" />,
      title: "Instantly Connect Across Languages",
      description: "Supports over 140 languages for effortless chatting",
      buttonText: "Supported Languages",
      image: serviceOne,
      link: "https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support",
      external: true,
      featured: true,
    },
    {
      id: "communicate",
      icon: <FaComments className="text-3xl text-accent-600" />,
      title: "Real-Time Translations",
      description: "Chat without language barriers, anytime, anywhere",
      buttonText: "Start Chatting",
      iconImage: translateIcon,
      link: "/Chat",
      external: false,
    },
    {
      id: "engage",
      icon: <FaGlobe className="text-3xl text-success" />,
      title: "Multiple Language Support",
      description: "Choose your preferred language and start chatting",
      buttonText: "Language Preference",
      iconImage: earth,
      link: "https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support",
      external: true,
    },
  ];

  const handleNavigation = (service) => {
    if (service.external) {
      window.open(service.link, '_blank');
    } else {
      navigate(service.link);
    }
  };

  return (
    <div ref={ref} id="services" className="relative py-32 bg-gradient-to-b from-neutral-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center space-x-2 px-5 py-2 glass rounded-full border border-accent-200">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-500 to-primary-500">Our Services</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 leading-[1.1]">
            Everything you need to
            <br />
            <span className="text-gradient">communicate globally</span>
          </h2>
          
          <div className="flex justify-center">
            <div className="h-1 w-32 bg-gradient-to-r from-accent-500 via-primary-500 to-aurora-500 rounded-full"></div>
          </div>
        </div>

        {/* Staggered Timeline Services */}
        <div className="relative space-y-12">
          {/* Vertical connector line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-aurora-500 transform md:-translate-x-px hidden md:block"></div>

          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative ${
                index === 0 ? 'md:mr-auto md:pr-12 md:w-1/2' : 
                index === 1 ? 'md:ml-auto md:pl-12 md:w-1/2' : 
                'md:mr-auto md:pr-12 md:w-1/2'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute hidden md:block top-8 ${
                index === 1 ? '-left-3' : '-right-3'
              } w-6 h-6 rounded-full bg-gradient-to-br ${
                index === 0 ? 'from-primary-500 to-primary-600 shadow-glow' :
                index === 1 ? 'from-accent-500 to-accent-600 shadow-glow-accent' :
                'from-aurora-500 to-aurora-600 shadow-glow-aurora'
              } border-4 border-white z-10`}></div>

              {/* Service Card */}
              <div className="group relative">
                {service.featured ? (
                  <div className="relative bg-white rounded-3xl border-2 border-primary-500/30 hover:border-primary-500/60 overflow-hidden shadow-soft hover:shadow-depth transition-all duration-500 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-8 md:p-10 space-y-6 relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-glow">
                            <FaLanguage className="text-white text-3xl" />
                          </div>
                          <span className="text-xs font-bold text-primary-500 px-4 py-2 glass rounded-full border border-primary-500/30">Featured</span>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-3xl font-display font-bold text-neutral-900">
                            {service.title}
                          </h3>
                          <p className="text-lg text-neutral-600 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleNavigation(service)}
                          className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300 hover:scale-105"
                        >
                          <span>{service.buttonText}</span>
                          <FaExternalLinkAlt className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      <div className="flex-1 relative h-64 md:h-auto min-h-[300px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent"></div>
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`relative bg-white rounded-3xl p-8 border-2 ${
                    index === 1 ? 'border-accent-500/30 hover:border-accent-500/60' : 
                    'border-aurora-500/30 hover:border-aurora-500/60'
                  } overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 hover:scale-105`}>
                    <div className={`absolute inset-0 ${
                      index === 1 ? 'bg-gradient-to-br from-accent-500/5 to-transparent' : 
                      'bg-gradient-to-br from-aurora-500/5 to-transparent'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className={`p-4 bg-gradient-to-br ${
                          index === 1 ? 'from-accent-500 to-accent-600 shadow-glow-accent' : 
                          'from-aurora-500 to-aurora-600 shadow-glow-aurora'
                        } rounded-2xl text-white`}>
                          {index === 1 ? <FaComments className="text-3xl" /> : <FaGlobe className="text-3xl" />}
                        </div>
                        <img
                          src={service.iconImage}
                          alt=""
                          className="h-16 w-auto opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-display font-bold text-neutral-900">
                          {service.title}
                        </h3>
                        <p className="text-neutral-600 leading-relaxed text-lg">
                          {service.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleNavigation(service)}
                        className={`group/btn inline-flex items-center gap-3 px-6 py-3 ${
                          index === 1 ? 'bg-gradient-to-r from-accent-600 to-accent-700 hover:shadow-glow-accent' : 
                          'bg-gradient-to-r from-aurora-600 to-aurora-700 hover:shadow-glow-aurora'
                        } text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105`}
                      >
                        <span>{service.buttonText}</span>
                        {service.external ? (
                          <FaExternalLinkAlt className="group-hover/btn:translate-x-1 transition-transform" />
                        ) : (
                          <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Service.displayName = 'Service';

export default Service;
