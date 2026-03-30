import React from 'react';
import { Leaf, Award, TrendingUp, MapPin, Recycle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Badge } from './ui/Badge';
import { LEEDTracking } from '@types/index';

export interface LEEDProgressProps {
  tracking: LEEDTracking;
  className?: string;
}

export const LEEDProgress: React.FC<LEEDProgressProps> = ({ tracking, className }) => {
  const progressPercent = Math.min(
    100,
    Math.round((tracking.current_points / tracking.total_points_needed) * 100)
  );

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      certified: 'text-leed-certified',
      silver: 'text-leed-silver',
      gold: 'text-leed-gold',
      platinum: 'text-leed-platinum',
    };
    return colors[level] || 'text-concrete-400';
  };

  const getLevelBg = (level: string) => {
    const colors: Record<string, string> = {
      certified: 'bg-leed-certified/20',
      silver: 'bg-leed-silver/20',
      gold: 'bg-leed-gold/20',
      platinum: 'bg-leed-platinum/20',
    };
    return colors[level] || 'bg-concrete-800';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              LEED Progress
            </CardTitle>
            <CardDescription>
              Target: <span className={`capitalize font-medium ${getLevelColor(tracking.target_level)}`}>
                {tracking.target_level}
              </span>
            </CardDescription>
          </div>
          <Badge 
            variant={`leed-${tracking.target_level}` as Badge['props']['variant']} 
            size="md"
            className="capitalize"
          >
            <Award className="w-4 h-4 mr-1" />
            {tracking.current_points} / {tracking.total_points_needed} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-concrete-400">Progress to {tracking.target_level}</span>
            <span className="text-concrete-300">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-concrete-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getLevelBg(tracking.target_level)}`}
              style={{ width: `${progressPercent}%` }}
            >
              <div className={`h-full w-full opacity-50 ${getLevelBg(tracking.target_level).replace('/20', '')}`} />
            </div>
          </div>
        </div>

        {/* MR Credits Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-concrete-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-concrete-400 mb-1">
              <Recycle className="w-4 h-4" />
              Recycled Content
            </div>
            <p className="text-lg font-semibold text-concrete-100">
              ${tracking.recycled_content_value.toLocaleString()}
            </p>
          </div>
          <div className="bg-concrete-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-concrete-400 mb-1">
              <MapPin className="w-4 h-4" />
              Regional Materials
            </div>
            <p className="text-lg font-semibold text-concrete-100">
              ${tracking.regional_materials_value.toLocaleString()}
            </p>
          </div>
        </div>

        {/* MR Credits Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-concrete-300 mb-2">
            Materials & Resources Credits
          </h4>
          {tracking.mr_credits.map((credit) => (
            <div
              key={credit.credit_id}
              className="flex items-center justify-between py-2 border-b border-concrete-800 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    credit.requirements_met ? 'bg-green-500' : 'bg-concrete-600'
                  }`}
                />
                <span className="text-sm text-concrete-300">{credit.credit_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-concrete-500">
                  {credit.points_earned} / {credit.points_available} pts
                </span>
                <Badge
                  variant={credit.requirements_met ? 'success' : 'default'}
                  size="sm"
                >
                  {credit.documentation_status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
