import React, { useEffect, useState, useRef } from "react";

/* ------------------------- 
   RotatingWord (hero headline) 
   ------------------------- */
const RotatingWord = ({ words = ["Welcome", "Bienvenue", "Hola", "Namaste", "こんにちは", "مرحباً"], interval = 1500 }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <span className="inline-block relative" aria-hidden>
      <span
        key={idx}
        className="block text-4xl md:text-5xl font-extrabold tracking-tight leading-tight transition-transform duration-700 ease-in-out transform-gpu animate-appear"
        style={{ WebkitTextStroke: "0.5px rgba(0,0,0,0.05)" }}
      >
        {words[idx]}
      </span>
      <style>{`
        @keyframes appear {
          0% { opacity: 0; transform: translateY(10px) scale(.98); }
          30% { opacity: 1; transform: translateY(0) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-appear { animation: appear .7s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .animate-appear { animation: none !important; }
        }
      `}</style>
    </span>
  );
};

/* ------------------------- 
   AutoPhraseCloud
   - cycles automatically through phrases
   - shows translation card
   - attempts audio playback using SpeechSynthesis (may be blocked by browser autoplay policies)
   ------------------------- */
const defaultPhrases = [
  { id: 1, text: "Hello, how are you?", lang: "EN", translation: "Bonjour, comment ça va?", tLang: "FR" },
  { id: 2, text: "Where is the train station?", lang: "EN", translation: "¿Dónde está la estación de tren?", tLang: "ES" },
  { id: 3, text: "Thank you very much", lang: "EN", translation: "どうもありがとうございます", tLang: "JA" },
  { id: 4, text: "Good morning", lang: "EN", translation: "सुप्रभात", tLang: "HI" },
  { id: 5, text: "Can you help me?", lang: "EN", translation: "هل يمكنك مساعدتي؟", tLang: "AR" },
  { id: 6, text: "I love this city", lang: "EN", translation: "J'adore cette ville", tLang: "FR" },
];

const AutoPhraseCloud = ({ phrases = defaultPhrases, autoInterval = 2400, playAudio = true }) => {
  const [index, setIndex] = useState(0);
  const [isAudioAllowed, setIsAudioAllowed] = useState(true);
  const busyRef = useRef(false); // prevents overlapping play calls

  useEffect(() => {
    // Cycle phrases automatically
    const id = setInterval(() => setIndex((p) => (p + 1) % phrases.length), autoInterval);
    return () => clearInterval(id);
  }, [phrases.length, autoInterval]);

  useEffect(() => {
    // Attempt to play audio when index changes (if requested)
    if (!playAudio) return;
    const p = phrases[index];
    if (!p) return;
    if (!("speechSynthesis" in window)) {
      setIsAudioAllowed(false);
      return;
    }

    // Don't spam multiple calls if previous still running
    if (busyRef.current) return;

    try {
      busyRef.current = true;
      // Create utterance for translated text
      const utter = new SpeechSynthesisUtterance(p.translation || p.text);
      // Try set language: use tLang if available, else fallback to 'en'
      const langHint = (p.tLang || p.lang || "en").toLowerCase();
      // Basic mapping for some common two-letter codes -> BCP47s (best effort)
      const mapping = {
        en: "en-US", fr: "fr-FR", es: "es-ES", ja: "ja-JP", hi: "hi-IN", ar: "ar-SA",
      };
      utter.lang = mapping[langHint] || langHint;

      // Slight rate & pitch adjustments to sound natural
      utter.rate = 0.95;
      utter.pitch = 1.0;

      // Try to pick a matching voice if available (best-effort)
      const trySetVoice = () => {
        const voices = speechSynthesis.getVoices();
        if (voices && voices.length) {
          const v = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith((utter.lang || "").slice(0,2)));
          if (v) utter.voice = v;
        }
      };

      // Some browsers populate voices asynchronously
      trySetVoice();
      if (!utter.voice) {
        // wait shortly and re-attempt
        setTimeout(trySetVoice, 120);
      }

      // attempt to speak; browsers may block autoplay audio until first gesture.
      speechSynthesis.cancel(); // stop any previous
      speechSynthesis.speak(utter);

      // set flag to false after small delay
      setTimeout(() => (busyRef.current = false), 600);
    } catch (err) {
      busyRef.current = false;
      setIsAudioAllowed(false);
    }
  }, [index, phrases, playAudio]);

  // Current phrase to display
  const currentPhrase = phrases[index];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Translation Card */}
      <div 
        className="relative bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all duration-500 transform-gpu"
        style={{
          borderLeft: "3px solid #FFD93D",
          borderRight: "3px solid #00D4FF",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 217, 61, 0.2), 0 0 8px rgba(0, 212, 255, 0.2)"
        }}
      >
        <div className="flex flex-col space-y-4 animate-fadeSlide">
          {/* Source phrase */}
          <div className="flex items-start">
            <div className="bg-gray-800 text-xs font-bold px-2 py-1 rounded mr-2 text-cyan-300">
              {currentPhrase.lang}
            </div>
            <p className="text-white text-lg font-medium">{currentPhrase.text}</p>
          </div>
          
          {/* Translation with arrow indicator */}
          <div className="pl-6 relative">
            <div className="absolute left-0 top-2 h-6 w-4 text-yellow-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-500 text-xs font-bold px-2 py-1 rounded mr-2 text-gray-900">
                {currentPhrase.tLang}
              </div>
              <p className="text-yellow-300 text-lg font-medium" dir={currentPhrase.tLang === "AR" ? "rtl" : "ltr"}>
                {currentPhrase.translation}
              </p>
            </div>
          </div>
        </div>

        {/* Audio status indicator (subtle) */}
        {playAudio && (
          <div className="absolute bottom-2 right-2 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-1 ${isAudioAllowed ? 'bg-cyan-400' : 'bg-gray-500'}`}></div>
            <span className="text-xs text-gray-400">audio</span>
          </div>
        )}
      </div>

      {/* Demo CTA */}
      <div className="mt-4 text-center">
        <button 
          className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium transition-colors"
          onClick={() => setIndex((index + 1) % phrases.length)}
        >
          <span>Watch Demo</span>
          <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </button>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeSlide { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

/* ------------------------- 
   Main Hero Component
   ------------------------- */
const AutoHeroDemo = () => {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white py-16 md:py-24">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
      
      {/* Accent color blobs (positioned absolutely) */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Hero headline with rotating welcome word */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            <RotatingWord /> to Translation
          </h1>
          
          {/* Main tagline */}
          <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-cyan-400 bg-clip-text text-transparent">
            Break Language Barriers — Connect Globally with AI
          </h2>
          
          {/* Brief description */}
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Instant, accurate translations powered by advanced AI. Experience communication without boundaries.
          </p>
          
          {/* Auto-demo phrase cloud */}
          <AutoPhraseCloud />
          
          {/* Main CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#get-started" 
              className="px-8 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </a>
            <a 
              href="#learn-more" 
              className="px-8 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg transition-colors border border-cyan-400/30 hover:border-cyan-400/60"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoHeroDemo;