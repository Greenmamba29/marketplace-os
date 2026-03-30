import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Project } from '@types/index';

export interface ProjectCardProps {
  project: Project;
  stats?: {
    materials_count: number;
    materials_sourced: number;
    budget_used: number;
    total_budget: number;
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, stats }) => {
  const getStatusBadge = (status: Project['status']) => {
    const variants: Record<string, Badge['props']['variant']> = {
      planning: 'default',
      procurement: 'primary',
      construction: 'success',
      completed: 'info',
      on_hold: 'warning',
    };
    return (
      <Badge variant={variants[status] || 'default'} size="sm" className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getLEEDBadge = (target?: Project['leed_target']) => {
    if (!target) return null;
    const variants: Record<string, Badge['props']['variant']> = {
      certified: 'leed-certified',
      silver: 'leed-silver',
      gold: 'leed-gold',
      platinum: 'leed-platinum',
    };
    return (
      <Badge variant={variants[target]} size="sm" className="capitalize">
        LEED {target}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const progressPercent = stats
    ? Math.round((stats.materials_sourced / stats.materials_count) * 100)
    : 0;

  return (
    <Card hover className="h-full flex flex-col">
      <CardContent className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(project.status)}
            {getLEEDBadge(project.leed_target)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-concrete-100 mb-1">
          <Link to={`/projects/${project.id}`} className="hover:text-orange-500 transition-colors">
            {project.name}
          </Link>
        </h3>
        <p className="text-sm text-concrete-500 mb-4">{project.project_number}</p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-concrete-500" />
            <span className="text-concrete-300">
              {project.address.city}, {project.address.state}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-concrete-500" />
            <span className="text-concrete-300">
              {formatDate(project.start_date)} - {formatDate(project.completion_date)}
            </span>
          </div>
          {project.contract_value && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-concrete-500" />
              <span className="text-concrete-300">
                {formatCurrency(project.contract_value)} contract value
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="space-y-3">
            {/* Materials Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1 text-concrete-400">
                  <Package className="w-4 h-4" />
                  Materials Sourced
                </span>
                <span className="text-concrete-300">
                  {stats.materials_sourced} / {stats.materials_count}
                </span>
              </div>
              <div className="h-2 bg-concrete-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Budget */}
            {stats.total_budget > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-concrete-400">
                  <TrendingUp className="w-4 h-4" />
                  Budget Used
                </span>
                <span className="text-concrete-300">
                  {formatCurrency(stats.budget_used)} / {formatCurrency(stats.total_budget)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 py-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          asChild
        >
          <Link to={`/projects/${project.id}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
