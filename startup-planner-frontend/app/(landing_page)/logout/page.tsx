"use client"

import React from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { IconProps } from '@/utils/types';

export default function LogoutPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md text-center"
      >
        <LogOutIcon className="mx-auto h-12 w-12 text-primary dark:text-primary-400" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground dark:text-white sm:text-4xl">
          You&apos;ve been logged out
        </h1>
        <p className="mt-4 text-muted-foreground dark:text-gray-300">
          Thank you for using our application. Click the button below to return to the login page.
        </p>
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/login"
            className="inline-flex items-center rounded-md bg-primary dark:bg-primary-600 px-4 py-2 text-sm font-medium text-primary-foreground dark:text-white shadow-sm transition-colors hover:bg-primary/90 dark:hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function LogOutIcon(props: IconProps) {
  return (
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

