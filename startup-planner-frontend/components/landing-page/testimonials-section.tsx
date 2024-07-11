import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import QuoteIcon from '../icons/quote-icon';

interface Testimonial {
  quote: string;
  author: {
    name: string;
    role: string;
    avatarSrc: string;
    avatarFallback: string;
  };
}

const testimonials: Testimonial[] = [
  {
    quote: "Canva Startup Planner has been a game-changer for my business. The Business Plan Generator helped me create a professional and comprehensive plan in no time.",
    author: {
      name: "Jane Doe",
      role: "Founder, Acme Inc.",
      avatarSrc: "/placeholder-user.jpg",
      avatarFallback: "JD",
    },
  },
  {
    quote: "The Copywriting Tool has been a lifesaver for my marketing efforts. It helps me create compelling copy that resonates with my target audience.",
    author: {
      name: "John Smith",
      role: "Co-founder, Startup Co.",
      avatarSrc: "/placeholder-user.jpg",
      avatarFallback: "JS",
    },
  },
  {
    quote: "The Logo and Branding Generator has been a game-changer for my business. It helped me create a professional and memorable brand identity.",
    author: {
      name: "Sarah Lee",
      role: "Founder, Startup Boutique",
      avatarSrc: "/placeholder-user.jpg",
      avatarFallback: "SL",
    },
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-muted rounded-lg shadow-md p-6">
    <div className="mb-4">
      <QuoteIcon className="w-8 h-8 text-primary" />
    </div>
    <p className="text-foreground mb-4">&ldquo;{testimonial.quote}&ldquo;</p>
    <div className="flex items-center">
      <Avatar>
        <AvatarImage src={testimonial.author.avatarSrc} alt={testimonial.author.name} />
        <AvatarFallback>{testimonial.author.avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h4 className="text-lg font-semibold text-foreground">{testimonial.author.name}</h4>
        <p className="text-muted-foreground">{testimonial.author.role}</p>
      </div>
    </div>
  </div>
);

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
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;

