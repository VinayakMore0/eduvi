import React from "react";
import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import CTASection from "../sections/CTASection";
import FeaturedCoursesSection from "../sections/FeaturedCoursesSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedCoursesSection />
      <CTASection />
    </>
  );
};

export default HomePage;
