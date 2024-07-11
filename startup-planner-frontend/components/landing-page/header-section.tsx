import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

interface HeaderContent {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
  heroImage: {
    src: string;
    alt: string;
  };
}

const headerContent: HeaderContent = {
  title: "Startup Planner",
  subtitle: "The AI-driven tool for entrepreneurs and small business owners.",
  primaryCTA: {
    text: "Sign up",
    href: "/signup",
  },
  secondaryCTA: {
    text: "Learn More",
    href: "#about",
  },
  heroImage: {
    src: "/hero-img.webp",
    alt: "Startup Planner App Hero Image",
  },
};

const HeaderSection: React.FC = () => {
  const { title, subtitle, primaryCTA, secondaryCTA, heroImage } = headerContent;

  return (
    <section className="relative bg-primary-foreground py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-4">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground mb-8">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg" asChild>
                <Link href={primaryCTA.href}>{primaryCTA.text}</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-primary-background" asChild>
                <Link href={secondaryCTA.href}>{secondaryCTA.text}</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <Image
              src={heroImage.src}
              width={600}
              height={400}
              alt={heroImage.alt}
              className="mx-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeaderSection;

