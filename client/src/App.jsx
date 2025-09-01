import React from "react";
import { RecoilRoot } from "recoil";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import StandardsSection from "./components/StandardsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

const App = () => {
  return (
    <RecoilRoot>
      <div className="min-h-screen bg-white">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <StandardsSection />
        <CTASection />
        <Footer />
      </div>
    </RecoilRoot>
  );
};

export default App;
