import React from 'react';
import Link from 'next/link';
import MountainIcon from '../icons/mountain-icon';

const FooterSection: React.FC = () => (
  <footer className="bg-background py-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-between">
        <div>
          <Link href="#" className="flex items-center mb-4" prefetch={false}>
            <MountainIcon className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-semibold text-foreground">Startup Planner</span>
          </Link>
          <p className="text-muted-foreground">&copy; 2024 Startup Planner Inc.</p>
        </div>
        <nav>
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </footer>
);

export default FooterSection;

