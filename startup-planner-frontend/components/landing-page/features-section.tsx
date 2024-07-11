import React from 'react';
import FileTextIcon from '../icons/file-text-icon';
import PencilIcon from '../icons/pencil-icon';
import ImageIcon from '../icons/image-icon';

interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FileTextIcon,
    title: 'Business Plan Generator',
    description: 'Generate a comprehensive business plan with just a few clicks.',
  },
  {
    icon: PencilIcon,
    title: 'Copywriting Tool',
    description: 'Create compelling copy for your website, marketing materials, and more.',
  },
  {
    icon: ImageIcon,
    title: 'Logo and Branding Generator',
    description: 'Generate professional logos and branding assets for your business.',
  },
];

const FeatureCard: React.FC<Feature> = ({ icon: Icon, title, description }) => (
  <div className="bg-background rounded-lg shadow-md p-6">
    <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 mx-auto">
      <Icon className="w-8 h-8 text-primary-foreground" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => (
  <section className="py-16 lg:py-24" id="features">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">Powerful Features</h2>
        <p className="text-lg text-muted-foreground">
          Canva Startup Planner offers a suite of AI-driven tools to help you succeed.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;

