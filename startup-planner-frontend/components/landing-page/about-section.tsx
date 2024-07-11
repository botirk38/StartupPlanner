import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

interface AboutContent {
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  ctaText: string;
}

const aboutContent: AboutContent = {
  title: "About Canva Startup Planner",
  paragraphs: [
    "Canva Startup Planner is an AI-driven platform designed to help entrepreneurs and small business owners streamline their business planning and branding processes. Our suite of powerful tools, including the Business Plan Generator, Copywriting Tool, and Logo and Branding Generator, leverages the latest advancements in artificial intelligence to provide you with professional-grade results in a fraction of the time and cost.",
    "Our mission is to empower entrepreneurs and small business owners with the tools and resources they need to turn their dreams into reality. With Canva Startup Planner, you can focus on what matters most – growing your business – while we take care of the rest."
  ],
  imageSrc: "/about-image.webp",
  imageAlt: "About Canva Startup Planner",
  ctaText: "Sign up"
};

const AboutSection: React.FC = () => {
  const { title, paragraphs, imageSrc, imageAlt, ctaText } = aboutContent;

  return (
    <section id="about" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <Image
              src={imageSrc}
              width={600}
              height={400}
              alt={imageAlt}
              className="mx-auto rounded-lg shadow-md"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">{title}</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground mb-6">
                {paragraph}
              </p>
            ))}
            <Button variant="default" size="lg">
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

