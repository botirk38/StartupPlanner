import React from 'react';
import { Business, IconProps } from '@/utils/types'; // Assuming you have a types file
import FileTextIcon from '../icons/file-text-icon';
import { MegaphoneIcon } from 'lucide-react';
import { PaintbrushIcon } from 'lucide-react';
import { BarChartIcon } from 'lucide-react';

interface QuickActionProps {
  business: Business | null;
}

interface Action {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
}

export function QuickActions({ business }: QuickActionProps) {
  const actions: Action[] = [
    {
      icon: FileTextIcon,
      title: "Generate Business Plan",
      onClick: () => console.log("Generate Business Plan"),
    },
    {
      icon: PaintbrushIcon,
      title: "Create Logo",
      onClick: () => console.log("Create Logo"),
    },
    {
      icon: BarChartIcon,
      title: "Competitor Research",
      onClick: () => console.log("Competitor Research"),
    },
    {
      icon: MegaphoneIcon,
      title: "Marketing Content",
      onClick: () => console.log("Marketing Content"),
    },
  ];

  if (!business) {
    return <div className="text-center text-gray-500">Please select a business to see quick actions.</div>;
  }

  return (
    <div className="bg-background rounded-lg shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {actions.map(({ icon: Icon, title, onClick }) => (
          <button
            key={title}
            className="bg-card text-card-foreground rounded-lg p-4 flex flex-col items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={onClick}
            aria-label={title}
          >
            <Icon className="h-8 w-8 mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">{title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

