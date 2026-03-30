import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Award,
  TrendingUp,
  MapPin,
  Recycle,
  FileText,
  Download,
  ChevronRight,
  Building2,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Layout } from '@components/Layout';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Tabs, TabList, Tab, TabPanel } from '@components/ui/Tabs';
import { Select } from '@components/ui/Select';
import { useProjects } from '@hooks/useProjects';
import { useLEEDTracking, useLEEDCredits, useMRCalculation, useRecycledContentSummary, useRegionalMaterialsSummary, useGenerateLEEDDocumentation } from '@hooks/useLEED';
import { LEEDProgress } from '@components/LEEDProgress';

const leedLevels = [
  { value: 'certified', label: 'LEED Certified (40-49 points)', color: 'leed-certified', minPoints: 40 },
  { value: 'silver', label: 'LEED Silver (50-59 points)', color: 'leed-silver', minPoints: 50 },
  { value: 'gold', label: 'LEED Gold (60-79 points)', color: 'leed-gold', minPoints: 60 },
  { value: 'platinum', label: 'LEED Platinum (80+ points)', color: 'leed-platinum', minPoints: 80 },
];

const mrCreditDescriptions: Record<string, string> = {
  'MRc1': 'Building Life-Cycle Impact Reduction',
  'MRc2': 'Building Product Disclosure - EPDs',
  'MRc3': 'Building Product Disclosure - Sourcing',
  'MRc4': 'Building Product Disclosure - Ingredients',
  'MRc5': 'Construction and Demolition Waste Management',
};

export const LEEDTracker: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects } = useProjects();
  const { data: leedTracking, isLoading: trackingLoading } = useLEEDTracking(selectedProject);
  const { data: mrCalculation, isLoading: mrLoading } = useMRCalculation(selectedProject);
  const { data: recycledSummary, isLoading: recycledLoading } = useRecycledContentSummary(selectedProject);
  const { data: regionalSummary, isLoading: regionalLoading } = useRegionalMaterialsSummary(selectedProject);
  const { data: leedCredits } = useLEEDCredits();
  const generateDocs = useGenerateLEEDDocumentation();

  const projectOptions = [
    { value: '', label: 'Select a project' },
    ...(projects?.items.map((p) => ({ value: p.id, label: `${p.name} (${p.project_number})` })) || []),
  ];

  const handleGenerateDocs = () => {
    if (selectedProject) {
      generateDocs.mutate({ projectId: selectedProject });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-concrete-100 mb-2">LEED Tracker</h1>
            <p className="text-concrete-400">Track Materials & Resources credits and generate documentation</p>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              options={projectOptions}
              className="w-64"
            />
            <Button
              variant="primary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleGenerateDocs}
              disabled={!selectedProject || generateDocs.isPending}
              isLoading={generateDocs.isPending}
            >
              Export Docs
            </Button>
          </div>
        </div>

        {!selectedProject ? (
          <Card className="text-center py-16">
            <CardContent>
              <Leaf className="w-16 h-16 text-concrete-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-concrete-300 mb-2">Select a Project</h2>
              <p className="text-concrete-500 mb-4">Choose a project to view its LEED tracking information</p>
            </CardContent>
          </Card>
        ) : trackingLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-concrete-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : leedTracking ? (
          <>
            {/* LEED Progress Card */}
            <LEEDProgress tracking={leedTracking} className="mb-6" />

            {/* Tabs */}
            <Tabs defaultTab="mr-credits">
              <TabList>
                <Tab value="mr-credits">MR Credits</Tab>
                <Tab value="recycled">Recycled Content</Tab>
                <Tab value="regional">Regional Materials</Tab>
                <Tab value="documentation">Documentation</Tab>
              </TabList>

              {/* MR Credits Tab */}
              <TabPanel value="mr-credits">
                <div className="grid lg:grid-cols-2 gap-6">
                  {mrCalculation && Object.entries(mrCalculation).filter(([key]) => key !== 'total_mr_points').map(([key, data]: [string, any]) => {
                    const creditId = key.replace('mr_credit_', 'MRc');
                    return (
                      <Card key={key}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{creditId}</CardTitle>
                              <CardDescription>{mrCreditDescriptions[creditId]}</CardDescription>
                            </div>
                            <Badge
                              variant={data.requirements_met ? 'success' : 'default'}
                              size="md"
                            >
                              {data.points} pts
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-concrete-400">Progress</span>
                                <span className="text-concrete-300">
                                  {Math.round((data.points / (data.points + 2)) * 100)}%
                                </span>
                              </div>
                              <div className="h-2 bg-concrete-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    data.requirements_met ? 'bg-green-500' : 'bg-orange-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (data.points / (data.points + 2)) * 100)}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {data.requirements_met ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                              )}
                              <span className={`text-sm ${data.requirements_met ? 'text-green-400' : 'text-yellow-400'}`}>
                                {data.requirements_met ? 'Requirements met' : 'Requirements not yet met'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabPanel>

              {/* Recycled Content Tab */}
              <TabPanel value="recycled">
                {recycledSummary && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Recycle className="w-5 h-5 text-green-500" />
                          Recycled Content Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="p-4 bg-concrete-800/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-concrete-100">
                              {recycledSummary.recycled_content_percentage}%
                            </p>
                            <p className="text-sm text-concrete-400">Recycled Content</p>
                          </div>
                          <div className="p-4 bg-concrete-800/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-concrete-100">
                              ${recycledSummary.recycled_content_value.toLocaleString()}
                            </p>
                            <p className="text-sm text-concrete-400">Recycled Value</p>
                          </div>
                          <div className="p-4 bg-concrete-800/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-concrete-100">
                              ${recycledSummary.post_consumer_value.toLocaleString()}
                            </p>
                            <p className="text-sm text-concrete-400">Post-Consumer</p>
                          </div>
                          <div className="p-4 bg-concrete-800/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-concrete-100">
                              ${recycledSummary.pre_consumer_value.toLocaleString()}
                            </p>
                            <p className="text-sm text-concrete-400">Pre-Consumer</p>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-concrete-300 mb-3">Materials Breakdown</h4>
                        <div className="space-y-2">
                          {recycledSummary.materials_breakdown.map((material, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-concrete-800/30 rounded-lg"
                            >
                              <span className="text-concrete-300">{material.material_name}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-concrete-500">
                                  {material.recycled_percentage}% recycled
                                </span>
                                <span className="text-sm font-medium text-green-400">
                                  ${material.recycled_value.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>MR Credit 4</CardTitle>
                        <CardDescription>Recycled Content Requirements</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-400 font-medium mb-1">On Track</p>
                            <p className="text-sm text-green-400/80">
                              Your project exceeds the 20% recycled content threshold for 1 point.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-concrete-400">1 point</span>
                              <span className="text-concrete-300">≥ 15% recycled</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-concrete-400">2 points</span>
                              <span className="text-concrete-300">≥ 30% recycled</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabPanel>

              {/* Regional Materials Tab */}
              <TabPanel value="regional">
                {regionalSummary && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          Regional Materials Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-concrete-800/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-concrete-100">
                              {regionalSummary.regional_materials_percentage}%
                            </p>
                            <p className="text-sm text-concrete-400">Regional Content</p>
                          </div>
                          <div className="p-4 bg-concrete-800/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-concrete-100">
                              ${regionalSummary.regional_materials_value.toLocaleString()}
                            </p>
                            <p className="text-sm text-concrete-400">Regional Value</p>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-concrete-300 mb-3">Materials Breakdown</h4>
                        <div className="space-y-2">
                          {regionalSummary.materials_breakdown.map((material, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-concrete-800/30 rounded-lg"
                            >
                              <div>
                                <span className="text-concrete-300">{material.material_name}</span>
                                <p className="text-xs text-concrete-500">
                                  {material.extraction_location} → {material.manufacturer_location}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-concrete-500">
                                  {material.distance_miles} mi
                                </span>
                                {material.is_regional ? (
                                  <Badge variant="success" size="sm">Regional</Badge>
                                ) : (
                                  <Badge variant="default" size="sm">Non-Regional</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Regional Definition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-400 text-sm">
                              Materials are considered regional if extracted, harvested, or recovered within 
                              <span className="font-medium"> 100 miles </span>
                              of the project site.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-concrete-400">1 point</span>
                              <span className="text-concrete-300">≥ 20% regional</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-concrete-400">2 points</span>
                              <span className="text-concrete-300">≥ 40% regional</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabPanel>

              {/* Documentation Tab */}
              <TabPanel value="documentation">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-500" />
                      LEED Documentation
                    </CardTitle>
                    <CardDescription>
                      Generate and download documentation for LEED submission
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leedCredits?.map((credit) => (
                        <div
                          key={credit.credit_id}
                          className="flex items-center justify-between p-4 bg-concrete-800/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-concrete-200">{credit.credit_id}</p>
                            <p className="text-sm text-concrete-400">{credit.credit_name}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="default" size="sm">
                              {credit.points_available} pts available
                            </Badge>
                            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                              Export
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabPanel>
            </Tabs>
          </>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Info className="w-16 h-16 text-concrete-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-concrete-300 mb-2">No LEED Data</h2>
              <p className="text-concrete-500 mb-4">This project doesn't have LEED tracking enabled yet.</p>
              <Button variant="primary" asChild>
                <Link to={`/projects/${selectedProject}`}>Enable LEED Tracking</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
