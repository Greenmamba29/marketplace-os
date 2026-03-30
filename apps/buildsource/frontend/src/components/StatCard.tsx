import React from 'react';
import { Card, CardContent } from './ui/Card';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ElementType;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-orange-500',
  className,
}) => {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-concrete-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-concrete-100">{value}</p>
            {subtitle && <p className="mt-1 text-sm text-concrete-500">{subtitle}</p>}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-sm text-concrete-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn('p-3 bg-concrete-800 rounded-lg', iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
