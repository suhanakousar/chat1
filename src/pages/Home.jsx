import React, { useRef } from "react";
import Footer from "../components/Footer";
import Feature from "../components/home/Feature";
import Hero from "../components/home/Hero";
import Mission from "../components/home/Mission";
import Service from "../components/home/Service";
import NavBar from "../components/NavBar";
import Contact from "../components/home/Contact";
import ActivityDashboard from "../components/home/ActivityDashboard";

const Home = () => {
  const serviceRef = useRef(null);

  return (
    <div className="bg-neutral-50 dark:bg-slate-900 transition-colors">
      <NavBar />
      <Hero serviceRef={serviceRef} />
      <ActivityDashboard />
      <Mission />
      <Service ref={serviceRef} />
      <Feature />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
