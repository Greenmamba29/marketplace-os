import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TabsProps {
  children: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({ children, defaultTab, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || '');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<TabListProps> = ({ children, className }) => {
  return (
    <div className={cn('flex border-b border-concrete-800', className)} role="tablist">
      {children}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ value, children, disabled, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-3 text-sm font-medium transition-colors relative',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
        isActive
          ? 'text-orange-500'
          : 'text-concrete-400 hover:text-concrete-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
      )}
    </button>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const { activeTab } = context;
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div role="tabpanel" className={cn('py-4', className)}>
      {children}
    </div>
  );
};
