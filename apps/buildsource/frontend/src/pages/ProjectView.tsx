import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Plus,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Leaf,
  MoreVertical,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Layout } from '@components/Layout';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Tabs, TabList, Tab, TabPanel } from '@components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components/ui/Table';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@components/ui/Modal';
import { useProject, useProjectMaterials, useProjectStats, useProjectTimeline } from '@hooks/useProjects';
import { useLEEDTracking } from '@hooks/useLEED';
import { LEEDProgress } from '@components/LEEDProgress';

export const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(id || '');
  const { data: materials, isLoading: materialsLoading } = useProjectMaterials(id || '');
  const { data: stats, isLoading: statsLoading } = useProjectStats(id || '');
  const { data: timeline, isLoading: timelineLoading } = useProjectTimeline(id || '');
  const { data: leedTracking, isLoading: leedLoading } = useLEEDTracking(id || '');

  if (projectLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-concrete-800 rounded w-1/3" />
            <div className="h-4 bg-concrete-800 rounded w-1/4" />
            <div className="grid md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-concrete-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <AlertCircle className="w-16 h-16 text-concrete-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-concrete-300 mb-2">Project Not Found</h2>
          <p className="text-concrete-500 mb-4">The project you're looking for doesn't exist or you don't have access.</p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusBadge = (status: typeof project.status) => {
    const variants: Record<string, Badge['props']['variant']> = {
      planning: 'default',
      procurement: 'primary',
      construction: 'success',
      completed: 'info',
      on_hold: 'warning',
    };
    return (
      <Badge variant={variants[status] || 'default'} size="md" className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getMaterialStatusBadge = (status: string) => {
    const variants: Record<string, Badge['props']['variant']> = {
      needed: 'default',
      rfq_sent: 'info',
      quoted: 'warning',
      ordered: 'primary',
      delivered: 'success',
    };
    return (
      <Badge variant={variants[status] || 'default'} size="sm" className="capitalize">
        {status.replace('_', ' ')}
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
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm text-concrete-400 hover:text-concrete-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-concrete-100">{project.name}</h1>
                {getStatusBadge(project.status)}
                {project.leed_target && (
                  <Badge variant={`leed-${project.leed_target}` as Badge['props']['variant']} size="md" className="capitalize">
                    LEED {project.leed_target}
                  </Badge>
                )}
              </div>
              <p className="text-concrete-500 font-mono">{project.project_number}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
                Edit
              </Button>
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddMaterial(true)}>
                Add Material
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-concrete-400">Materials</p>
                    <p className="text-2xl font-bold text-concrete-100">
                      {stats.materials_sourced} / {stats.total_materials}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-concrete-400">Budget Used</p>
                    <p className="text-2xl font-bold text-concrete-100">
                      {formatCurrency(stats.spent_to_date)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-concrete-400">LEED Points</p>
                    <p className="text-2xl font-bold text-concrete-100">
                      {stats.leed_points_contribution}
                    </p>
                  </div>
                  <Leaf className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-concrete-400">Recycled Content</p>
                    <p className="text-2xl font-bold text-concrete-100">
                      {stats.recycled_content_avg}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultTab="overview">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="materials">Materials</Tab>
            <Tab value="schedule">Schedule</Tab>
            <Tab value="leed">LEED Tracking</Tab>
          </TabList>

          {/* Overview Tab */}
          <TabPanel value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-concrete-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-concrete-400">Location</p>
                        <p className="text-concrete-200">
                          {project.address.street}
                          <br />
                          {project.address.city}, {project.address.state} {project.address.zip}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-concrete-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-concrete-400">Timeline</p>
                        <p className="text-concrete-200">
                          {formatDate(project.start_date)} - {formatDate(project.completion_date)}
                        </p>
                      </div>
                    </div>
                    {project.contract_value && (
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-concrete-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-concrete-400">Contract Value</p>
                          <p className="text-concrete-200">
                            {formatCurrency(project.contract_value)}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="pt-4 border-t border-concrete-800">
                      <p className="text-sm text-concrete-400 mb-2">Owner</p>
                      <p className="text-concrete-200">{project.owner_name}</p>
                    </div>
                    {project.gc_name && (
                      <div>
                        <p className="text-sm text-concrete-400 mb-2">General Contractor</p>
                        <p className="text-concrete-200">{project.gc_name}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Procurement Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {!materialsLoading && materials && (
                    <div className="space-y-4">
                      {['needed', 'rfq_sent', 'quoted', 'ordered', 'delivered'].map((status) => {
                        const count = materials.filter((m) => m.status === status).length;
                        const total = materials.length;
                        const percent = total > 0 ? (count / total) * 100 : 0;
                        return (
                          <div key={status}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="capitalize text-concrete-300">{status.replace('_', ' ')}</span>
                              <span className="text-concrete-400">
                                {count} ({Math.round(percent)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-concrete-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  status === 'delivered'
                                    ? 'bg-green-500'
                                    : status === 'ordered'
                                    ? 'bg-orange-500'
                                    : 'bg-concrete-600'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabPanel>

          {/* Materials Tab */}
          <TabPanel value="materials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Materials</CardTitle>
                <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddMaterial(true)}>
                  Add Material
                </Button>
              </CardHeader>
              <CardContent>
                {!materialsLoading && materials && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Required Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>LEED</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-concrete-200">
                                {material.material?.name || 'Unknown Material'}
                              </p>
                              <p className="text-sm text-concrete-500">
                                {material.material?.material_type.replace('_', ' ')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {material.quantity_required} {material.material?.unit_of_measure}
                          </TableCell>
                          <TableCell>{formatDate(material.delivery_date_required)}</TableCell>
                          <TableCell>{getMaterialStatusBadge(material.status)}</TableCell>
                          <TableCell>
                            {material.leed_contribution ? (
                              <Badge variant="leed-certified" size="sm">
                                +{material.leed_contribution} pts
                              </Badge>
                            ) : (
                              <span className="text-concrete-500">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          {/* Schedule Tab */}
          <TabPanel value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {!timelineLoading && timeline?.deliveries && (
                  <div className="space-y-4">
                    {timeline.deliveries.length === 0 ? (
                      <p className="text-concrete-500 text-center py-8">No scheduled deliveries</p>
                    ) : (
                      timeline.deliveries.map((delivery, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 bg-concrete-800/50 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-concrete-800 rounded-lg flex items-center justify-center">
                            <Truck className="w-6 h-6 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-concrete-200">{delivery.material_name}</p>
                            <p className="text-sm text-concrete-500">
                              {delivery.quantity} units • {delivery.supplier_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-concrete-200">{formatDate(delivery.date)}</p>
                            <Badge
                              variant={delivery.status === 'delivered' ? 'success' : 'primary'}
                              size="sm"
                              className="capitalize"
                            >
                              {delivery.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          {/* LEED Tab */}
          <TabPanel value="leed">
            {!leedLoading && leedTracking && <LEEDProgress tracking={leedTracking} />}
          </TabPanel>
        </Tabs>

        {/* Add Material Modal */}
        <Modal isOpen={showAddMaterial} onClose={() => setShowAddMaterial(false)} size="lg">
          <ModalHeader onClose={() => setShowAddMaterial(false)}>
            <ModalTitle>Add Material to Project</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-concrete-400">Material selection form would go here...</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowAddMaterial(false)}>
              Cancel
            </Button>
            <Button variant="primary">Add Material</Button>
          </ModalFooter>
        </Modal>
      </div>
    </Layout>
  );
};
