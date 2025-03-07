import { useState } from "react";
import { 
  Heart, 
  Activity, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Thermometer, 
  Droplet, 
  Scale,
  Wind,
  Ruler
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartData } from "@/types/medical";

// Import Recharts components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HealthChartsProps {
  chartData: ChartData;
}

export function HealthCharts({ chartData }: HealthChartsProps) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["heartRate", "bloodPressure", "bloodSugar", "cholesterol"]);

  const toggleChart = (chartName: string) => {
    if (selectedCharts.includes(chartName)) {
      setSelectedCharts(selectedCharts.filter(name => name !== chartName));
    } else {
      setSelectedCharts([...selectedCharts, chartName]);
    }
  };

  // Prepare data for charts
  const heartRateData = chartData.heartRate.map((value, index) => ({
    day: `Day ${index + 1}`,
    value
  }));

  const bloodPressureData = chartData.bloodPressure.systolic.map((value, index) => ({
    day: `Day ${index + 1}`,
    systolic: value,
    diastolic: chartData.bloodPressure.diastolic[index]
  }));

  const bloodSugarData = chartData.bloodSugar.fasting.map((value, index) => ({
    day: `Day ${index + 1}`,
    fasting: value,
    afterMeal: chartData.bloodSugar.afterMeal[index]
  }));

  const cholesterolData = [
    { name: 'HDL', value: chartData.cholesterol.hdl[0] },
    { name: 'LDL', value: chartData.cholesterol.ldl[0] },
    { name: 'Other', value: chartData.cholesterol.total[0] - (chartData.cholesterol.hdl[0] + chartData.cholesterol.ldl[0]) }
  ];

  const oxygenLevelData = chartData.oxygenLevel.map((value) => ({
    name: 'Oxygen',
    value
  }));

  const temperatureData = chartData.temperature.map((value, index) => ({
    day: `Day ${index + 1}`,
    value
  }));

  const respiratoryRateData = chartData.respiratoryRate.map((value, index) => ({
    subject: `Day ${index + 1}`,
    value,
    fullMark: 25
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Health Trends</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedCharts.includes("heartRate") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleChart("heartRate")}
          className="flex items-center gap-1"
        >
          <Heart className="h-4 w-4" />
          Heart Rate
        </Button>
        <Button 
          variant={selectedCharts.includes("bloodPressure") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleChart("bloodPressure")}
          className="flex items-center gap-1"
        >
          <Activity className="h-4 w-4" />
          Blood Pressure
        </Button>
        <Button 
          variant={selectedCharts.includes("bloodSugar") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleChart("bloodSugar")}
          className="flex items-center gap-1"
        >
          <BarChart3 className="h-4 w-4" />
          Blood Sugar
        </Button>
        <Button 
          variant={selectedCharts.includes("cholesterol") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleChart("cholesterol")}
          className="flex items-center gap-1"
        >
          <PieChartIcon className="h-4 w-4" />
          Cholesterol
        </Button>
        <Button 
          variant={selectedCharts.includes("oxygenLevel") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleChart("oxygenLevel")}
          className="flex items-center gap-1"
        >
          <Droplet className="h-4 w-4" />
          Oxygen
        </Button>
        <Button 
          variant={selectedCharts.includes("temperature") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleChart("temperature")}
          className="flex items-center gap-1"
        >
          <Thermometer className="h-4 w-4" />
          Temperature
        </Button>
        <Button 
          variant={selectedCharts.includes("respiratoryRate") ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleChart("respiratoryRate")}
          className="flex items-center gap-1"
        >
          <Wind className="h-4 w-4" />
          Respiratory
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedCharts.includes("heartRate") && (
          <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Heart Rate Trends
              </CardTitle>
              <CardDescription>Last 7 days (BPM)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 4 }}
                      activeDot={{ r: 6, fill: '#ef4444' }}
                      name="BPM"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <span>
                Average: {Math.round(chartData.heartRate.slice(0, 7).reduce((a, b) => a + b, 0) / 7)} BPM
              </span>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {selectedCharts.includes("bloodPressure") && (
          <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Blood Pressure Trends
              </CardTitle>
              <CardDescription>Last 7 days (mmHg)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="systolic" 
                      stackId="1"
                      stroke="#ef4444" 
                      fill="#fca5a5" 
                      name="Systolic"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="diastolic" 
                      stackId="2"
                      stroke="#3b82f6" 
                      fill="#93c5fd" 
                      name="Diastolic"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full mr-1"></div>
                  <span>Systolic</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mr-1"></div>
                  <span>Diastolic</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {selectedCharts.includes("bloodSugar") && (
          <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                Blood Sugar Trends
              </CardTitle>
              <CardDescription>Last 7 days (mg/dL)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bloodSugarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Bar 
                      dataKey="fasting" 
                      fill="#a855f7" 
                      name="Fasting"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="afterMeal" 
                      fill="#8b5cf6" 
                      name="After Meal"
                      radius={[4, 4, 0, 0]}
                    />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full mr-1"></div>
                  <span>Fasting</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-violet-400 rounded-full mr-1"></div>
                  <span>Post-meal</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {selectedCharts.includes("cholesterol") && (
          <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Cholesterol Breakdown
              </CardTitle>
              <CardDescription>Current values (mg/dL)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cholesterolData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {cholesterolData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value: number) => [`${value} mg/dL`, '']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#0088FE] rounded-full mr-1"></div>
                  <span>HDL</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#00C49F] rounded-full mr-1"></div>
                  <span>LDL</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#FFBB28] rounded-full mr-1"></div>
                  <span>Other</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {selectedCharts.includes("oxygenLevel") && (
          <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Droplet className="h-5 w-5 mr-2 text-cyan-500" />
                Oxygen Level
              </CardTitle>
              <CardDescription>Current value (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="80%" 
                    barSize={20} 
                    data={oxygenLevelData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill="#06b6d4"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Oxygen Level']}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-cyan-500"
                    >
                      {chartData.oxygenLevel[0]}%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <span>
                Average: {Math.round(chartData.oxygenLevel.reduce((a, b) => a + b, 0) / chartData.oxygenLevel.length)}%
              </span>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {selectedCharts.includes("temperature") && (
          <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                Temperature Trends
              </CardTitle>
              <CardDescription>Last 7 days (°F)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} domain={[97, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value: number) => [`${value}°F`, 'Temperature']}
                    />
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fdba74" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={{ fill: '#f97316', r: 4 }}
                      activeDot={{ r: 6, fill: '#f97316' }}
                      name="Temperature"
                      fill="url(#temperatureGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <span>
                Average: {(chartData.temperature.reduce((a, b) => a + b, 0) / chartData.temperature.length).toFixed(1)}°F
              </span>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {selectedCharts.includes("respiratoryRate") && (
          <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Wind className="h-5 w-5 mr-2 text-teal-500" />
                Respiratory Rate Patterns
              </CardTitle>
              <CardDescription>Last 7 days (breaths/min)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={respiratoryRateData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={12} />
                    <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#9ca3af" fontSize={12} />
                    <Radar
                      name="Respiratory Rate"
                      dataKey="value"
                      stroke="#14b8a6"
                      fill="#5eead4"
                      fillOpacity={0.6}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value: number) => [`${value} breaths/min`, 'Respiratory Rate']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <span>
                Average: {Math.round(chartData.respiratoryRate.reduce((a, b) => a + b, 0) / chartData.respiratoryRate.length)} breaths/min
              </span>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
} 