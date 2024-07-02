import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

const HeaderSection: React.FC = () => (
  <section className="relative bg-primary-foreground py-20 lg:py-32">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-4">
            Startup Planner
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground mb-8">
            The AI-driven tool for entrepreneurs and small business owners.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" size="lg">
              Signup
            </Button>
            <Button variant="outline" size="lg" className="text-primary-background">
              Learn More
            </Button>
          </div>
        </div>
        <div>
          <Image
            src="/hero-img.webp"
            width={600}
            height={400}
            alt="Startup Planner App Hero Image"
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeaderSection;

