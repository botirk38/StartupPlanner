import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import QuoteIcon from '../icons/quote-icon';

const TestimonialsSection: React.FC = () => (
  <section className="bg-background py-16 lg:py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">What Our Users Say</h2>
        <p className="text-lg text-muted-foreground">
          Hear from entrepreneurs who have used Canva Startup Planner.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-muted rounded-lg shadow-md p-6">
          <div className="mb-4">
            <QuoteIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-foreground mb-4">
            "Canva Startup Planner has been a game-changer for my business. The Business Plan Generator helped me
            create a professional and comprehensive plan in no time."
          </p>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-foreground">Jane Doe</h4>
              <p className="text-muted-foreground">Founder, Acme Inc.</p>
            </div>
          </div>
        </div>
        <div className="bg-muted rounded-lg shadow-md p-6">
          <div className="mb-4">
            <QuoteIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-foreground mb-4">
            "The Copywriting Tool has been a lifesaver for my marketing efforts. It helps me create compelling copy
            that resonates with my target audience."
          </p>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-foreground">John Smith</h4>
              <p className="text-muted-foreground">Co-founder, Startup Co.</p>
            </div>
          </div>
        </div>
        <div className="bg-muted rounded-lg shadow-md p-6">
          <div className="mb-4">
            <QuoteIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-foreground mb-4">
            "The Logo and Branding Generator has been a game-changer for my business. It helped me create a
            professional and memorable brand identity."
          </p>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-foreground">Sarah Lee</h4>
              <p className="text-muted-foreground">Founder, Startup Boutique</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;

