"use client"

import React from 'react';
import MountainIcon from '../icons/mountain-icon';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter, usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bg-primary-foreground py-4">
      <div className="container mx-auto lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center" prefetch={false}>
            <MountainIcon className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-semibold text-primary">Canva Startup Planner</span>
          </Link>
        </div>
        {pathname === '/' && (
          <div className="hidden md:flex">
            <ul className="flex space-x-4">
              <li>
                <Link href="#features" className="text-primary-background hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-primary-background hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>
        )}
        <div className="space-x-2">
          <Button variant="default" size="sm" onClick={() => router.push("/login")}>
            Sign In
          </Button>
          <Button variant="default" size="sm" onClick={() => router.push("/contact")}>
            Contact
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

