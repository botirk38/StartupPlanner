import React from 'react';
import HeaderSection from './landing-page/header-section';
import FeaturesSection from './landing-page/features-section';
import PricingPlan from './landing-page/pricing-plan';
import TestimonialsSection from './landing-page/testimonials-section'
import FooterSection from './landing-page/footer-section';
import AboutSection from './landing-page/about-section';
import Navbar from './landing-page/navbar';

const LandingPage: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <HeaderSection />
    <FeaturesSection />
    <AboutSection />
    <FooterSection />
  </div>
);

export default LandingPage;

