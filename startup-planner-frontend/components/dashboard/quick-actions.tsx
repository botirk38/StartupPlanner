import React from 'react';
import { Business, IconProps } from '@/utils/types';
import FileTextIcon from '../icons/file-text-icon';
import { MegaphoneIcon, PaintbrushIcon, BarChartIcon } from 'lucide-react';

interface QuickActionProps {
  business: Business | null;
  isLoading?: boolean;
}

type IconComponent = React.ComponentType<IconProps>;

interface Action {
  icon: IconComponent;
  title: string;
  onClick: () => void;
}

export function QuickActions({ business, isLoading = false }: QuickActionProps) {
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

  const handleAction = (action: () => void) => {
    try {
      action();
    } catch (error) {
      console.error(`Error performing action: ${error}`);
      // You could also show an error message to the user here
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Loading quick actions...</div>;
  }

  if (!business) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Please select a business to see quick actions.</div>;
  }

  return (
    <div className="bg-background dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {actions.map(({ icon: Icon, title, onClick }) => (
          <button
            key={title}
            className="bg-card dark:bg-gray-700 text-card-foreground dark:text-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-accent dark:hover:bg-gray-600 hover:text-accent-foreground dark:hover:text-white transition-colors"
            onClick={() => handleAction(onClick)}
            aria-label={title}
            role="button"
            tabIndex={0}
          >
            <Icon className="h-8 w-8 mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">{title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

