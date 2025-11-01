import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui";
import { FaArrowRight, FaPlay, FaUsers, FaCheck } from "react-icons/fa";

const Hero = ({ serviceRef }) => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  
  const examplePhrases = [
    { en: "Hello, how are you?", es: "Hola, ¿cómo estás?", fr: "Bonjour, comment allez-vous?", de: "Hallo, wie geht es dir?" },
    { en: "Welcome to Chatlas", es: "Bienvenido a Chatlas", fr: "Bienvenue à Chatlas", de: "Willkommen bei Chatlas" },
    { en: "Let's start chatting", es: "Empecemos a chatear", fr: "Commençons à discuter", de: "Lass uns anfangen zu chatten" },
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const getSourcePhrase = () => {
    const langKey = sourceLang.toLowerCase().substring(0, 2);
    return examplePhrases[currentPhraseIndex][langKey] || examplePhrases[currentPhraseIndex].en;
  };

  const getTargetTranslation = () => {
    const langKey = targetLang.toLowerCase().substring(0, 2);
    return examplePhrases[currentPhraseIndex][langKey] || examplePhrases[currentPhraseIndex].en;
  };

  useEffect(() => {
    const phrase = getSourcePhrase();
    let charIndex = 0;
    let typingIntervalHandle = null;
    let transIntervalHandle = null;
    let translationTimeoutHandle = null;
    let nextPhraseTimeoutHandle = null;

    setInputText("");
    setTranslatedText("");
    setIsTyping(true);

    typingIntervalHandle = setInterval(() => {
      if (charIndex < phrase.length) {
        setInputText(phrase.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingIntervalHandle);
        setIsTyping(false);
        
        translationTimeoutHandle = setTimeout(() => {
          const targetTranslation = getTargetTranslation();
          let transCharIndex = 0;
          transIntervalHandle = setInterval(() => {
            if (transCharIndex < targetTranslation.length) {
              setTranslatedText(targetTranslation.substring(0, transCharIndex + 1));
              transCharIndex++;
            } else {
              clearInterval(transIntervalHandle);
              nextPhraseTimeoutHandle = setTimeout(() => {
                setCurrentPhraseIndex((prev) => (prev + 1) % examplePhrases.length);
              }, 3000);
            }
          }, 30);
        }, 500);
      }
    }, 50);

    return () => {
      clearInterval(typingIntervalHandle);
      clearInterval(transIntervalHandle);
      clearTimeout(translationTimeoutHandle);
      clearTimeout(nextPhraseTimeoutHandle);
    };
  }, [currentPhraseIndex, sourceLang, targetLang]);

  const scrollToServiceSection = () => {
    if (serviceRef && serviceRef.current) {
      serviceRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-neutral-50 dark:from-slate-900 via-primary-50/30 dark:via-slate-900 to-purple-50/20 dark:to-slate-900 pt-20">
      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 dark:from-primary-950/20 to-transparent"></div>

      <div className="section-container relative z-10 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Headline */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
              Break Language Barriers
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                Connect Globally with AI
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Try it now - Type to translate instantly
            </p>
          </div>

          {/* Inline Translation Demo */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-neutral-200 dark:border-neutral-700 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-all duration-300">
              {/* Source Text */}
              <div className="space-y-3">
                <div className="min-h-[120px] p-4 bg-neutral-50 dark:bg-slate-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <p className="text-lg text-neutral-900 dark:text-neutral-100 font-medium">
                    {inputText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </p>
                </div>
                <select 
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-neutral-100 font-medium focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 outline-none transition-all"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              {/* Translated Text */}
              <div className="space-y-3">
                <div className="min-h-[120px] p-4 bg-primary-50 dark:bg-primary-950/30 rounded-xl border border-primary-200 dark:border-primary-800">
                  <p className="text-lg text-primary-900 dark:text-primary-100 font-medium">
                    {translatedText}
                    {!isTyping && translatedText && translatedText.length < getTargetTranslation().length && <span className="animate-pulse">|</span>}
                  </p>
                </div>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-neutral-100 font-medium focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 outline-none transition-all"
                >
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button
              onClick={() => navigate("/Chat")}
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-primary-500/30 flex items-center gap-2"
            >
              Get Started Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={scrollToServiceSection}
              className="group px-8 py-4 bg-white dark:bg-slate-800 text-neutral-700 dark:text-neutral-200 text-lg font-semibold rounded-xl border-2 border-neutral-300 dark:border-neutral-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-200 hover:scale-105 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-colors">
                <FaPlay className="ml-0.5 text-primary-600 dark:text-primary-400 group-hover:text-white" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
              <FaUsers className="text-primary-600 dark:text-primary-400" />
              <span className="font-medium">Trusted by 10,000+ users worldwide</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                <FaCheck className="text-success-600 dark:text-success-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                <FaCheck className="text-success-600 dark:text-success-400" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
