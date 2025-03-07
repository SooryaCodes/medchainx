import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplet, 
  Scale, 
  BarChart3, 
  PieChart,
  Wind,
  Ruler,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { HealthMetrics } from "@/types/medical";
import { useState } from "react";

interface HealthMetricsGridProps {
  metrics: HealthMetrics;
}

export function HealthMetricsGrid({ metrics }: HealthMetricsGridProps) {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Heart Rate"
          value={`${metrics.heartRate.current} BPM`}
          icon={<Heart className="h-5 w-5 text-red-500" />}
          description={`Range: ${metrics.heartRate.min}-${metrics.heartRate.max} BPM`}
          trend={metrics.heartRate.trend}
          className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
        />
        <DashboardCard
          title="Blood Pressure"
          value={metrics.bloodPressure.current}
          icon={<Activity className="h-5 w-5 text-blue-500" />}
          description={`Range: ${metrics.bloodPressure.min}-${metrics.bloodPressure.max} mmHg`}
          trend={metrics.bloodPressure.trend}
          className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
        />
        <DashboardCard
          title="Temperature"
          value={`${metrics.temperature.current}°F`}
          icon={<Thermometer className="h-5 w-5 text-orange-500" />}
          description={`Range: ${metrics.temperature.min}-${metrics.temperature.max}°F`}
          trend={metrics.temperature.trend}
          className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
        />
        <DashboardCard
          title="Oxygen Level"
          value={`${metrics.oxygenLevel.current}%`}
          icon={<Droplet className="h-5 w-5 text-cyan-500" />}
          description={`Range: ${metrics.oxygenLevel.min}-${metrics.oxygenLevel.max}%`}
          trend={metrics.oxygenLevel.trend}
          className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
        />
      
        {showAll && (
          <>
            <DashboardCard
              title="Weight"
              value={`${metrics.weight.current} lbs`}
              icon={<Scale className="h-5 w-5 text-emerald-500" />}
              description={`Target: ${metrics.weight.target} lbs`}
              trend={metrics.weight.trend}
              className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
            />
            <DashboardCard
              title="Blood Sugar"
              value={`${metrics.bloodSugar.current} mg/dL`}
              icon={<BarChart3 className="h-5 w-5 text-purple-500" />}
              description={`Range: ${metrics.bloodSugar.min}-${metrics.bloodSugar.max} mg/dL`}
              trend={metrics.bloodSugar.trend}
              className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
            />
            <DashboardCard
              title="Cholesterol"
              value={`${metrics.cholesterol.current} mg/dL`}
              icon={<PieChart className="h-5 w-5 text-yellow-500" />}
              description={`Range: ${metrics.cholesterol.min}-${metrics.cholesterol.max} mg/dL`}
              trend={metrics.cholesterol.trend}
              className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
            />
            <DashboardCard
              title="BMI"
              value={metrics.bmi.current.toFixed(1)}
              icon={<Ruler className="h-5 w-5 text-indigo-500" />}
              description={`Range: ${metrics.bmi.min}-${metrics.bmi.max}`}
              trend={metrics.bmi.trend}
              className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
            />
          
            <DashboardCard
              title="Respiratory Rate"
              value={`${metrics.respiratoryRate.current} breaths/min`}
              icon={<Wind className="h-5 w-5 text-teal-500" />}
              description={`Range: ${metrics.respiratoryRate.min}-${metrics.respiratoryRate.max} breaths/min`}
              trend={metrics.respiratoryRate.trend}
              className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
            />
          </>
        )}
      </div>
      
      <button 
        onClick={() => setShowAll(!showAll)}
        className="w-full py-2 px-4 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-md flex items-center justify-center hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
      >
        {showAll ? (
          <>
            <span>Show Less</span>
            <ChevronUp className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            <span>View All Metrics</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
} 