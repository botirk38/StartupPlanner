import React from 'react';
import Link from 'next/link';
import MountainIcon from '../icons/mountain-icon';

interface FooterLink {
  href: string;
  label: string;
}

const footerLinks: FooterLink[] = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Contact Us" },
];

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <Link href="/" className="flex items-center mb-4" aria-label="Startup Planner Home">
              <MountainIcon className="w-8 h-8 text-primary mr-2" />
              <span className="text-xl font-semibold text-foreground">Startup Planner</span>
            </Link>
            <p className="text-muted-foreground text-center sm:text-left">
              &copy; {currentYear} Startup Planner Inc. All rights reserved.
            </p>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center sm:justify-end gap-4">
              {footerLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

