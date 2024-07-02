import React from 'react';
import { IconProps } from '@/utils/types';
import { Button } from '../ui/button';

const pricingPlans = [
  {
    name: 'Basic',
    price: '$9.99',
    frequency: 'per month',
    features: [
      { feature: 'Business Plan Generator', available: true },
      { feature: 'Copywriting Tool', available: true },
      { feature: 'Logo and Branding Generator', available: false },
    ],
  },
  {
    name: 'Pro',
    price: '$19.99',
    frequency: 'per month',
    features: [
      { feature: 'Business Plan Generator', available: true },
      { feature: 'Copywriting Tool', available: true },
      { feature: 'Logo and Branding Generator', available: true },
    ],
  },
  {
    name: 'Enterprise',
    price: '$49.99',
    frequency: 'per month',
    features: [
      { feature: 'Business Plan Generator', available: true },
      { feature: 'Copywriting Tool', available: true },
      { feature: 'Logo and Branding Generator', available: true },
      { feature: 'Priority Support', available: true },
    ],
  },
];

const PricingPlan: React.FC = () => {
  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">Pricing Plans</h2>
            <p className="text-lg text-muted-foreground">Choose the plan that fits your needs and budget.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="bg-background rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold text-foreground mb-4">{plan.price}</p>
                <p className="text-muted-foreground mb-4">{plan.frequency}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.available ? (
                        <CheckIcon className="w-5 h-5 text-primary mr-2" />
                      ) : (
                        <XIcon className="w-5 h-5 text-muted-foreground mr-2" />
                      )}
                      {feature.feature}
                    </li>
                  ))}
                </ul>
                <Button variant="default" size="lg">
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">Start Your Business Journey Today</h2>
            <p className="text-lg text-primary-foreground mb-8">
              Streamline your business planning and branding with Canva Startup Planner.
            </p>
            <Button variant="default" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPlan;

const CheckIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

