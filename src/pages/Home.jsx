import React, { useRef } from "react";
import Footer from "../components/Footer";
import Feature from "../components/home/Feature";
// import Hero from "../components/home/Hero"; // Comment out or remove this line
import AutoHeroDemo from "../components/home/AutoHeroDemo"; // Add this import
import Mission from "../components/home/Mission";
import Service from "../components/home/Service";
import NavBar from "../components/NavBar";
import Contact from "../components/home/Contact";

const Home = () => {
  const serviceRef = useRef(null);

  return (
    <div className="bg-neutral-50 dark:bg-slate-900">
      <NavBar />
      <AutoHeroDemo /> {/* Replace Hero with AutoHeroDemo */}
      <Mission />
      <Service ref={serviceRef} />
      <Feature />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
