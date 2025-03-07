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
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Sparkles
} from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { HealthMetrics } from "@/types/medical";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface HealthMetricsGridProps {
  metrics: HealthMetrics;
}

export function HealthMetricsGrid({ metrics }: HealthMetricsGridProps) {
  const [showAll, setShowAll] = useState(false);

  const getCardStyle = (title: string) => {
    const styles: Record<string, string> = {
      "Heart Rate": "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-200 dark:border-red-800/30",
      "Blood Pressure": "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30",
      "Temperature": "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200 dark:border-orange-800/30",
      "Oxygen Level": "bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 border-cyan-200 dark:border-cyan-800/30",
      "Weight": "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800/30",
      "Blood Sugar": "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30",
      "Cholesterol": "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800/30",
      "BMI": "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800/30",
      "Respiratory Rate": "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 border-teal-200 dark:border-teal-800/30"
    };
    
    return styles[title] || "";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="ml-2 h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="ml-2 h-4 w-4 text-red-500" />;
    return null;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const renderMetricCard = (metricKey: keyof HealthMetrics, title: string, icon: React.ReactNode, index: number) => {
    const metric = metrics[metricKey];
    const hasRange = 'min' in metric && 'max' in metric;
    const hasTarget = 'target' in metric;
    
    return (
      <motion.div
        custom={index}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="relative"
      >
        <div className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border p-4 ${getCardStyle(title)}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 mr-3">
                {icon}
              </div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
            </div>
            {metric.trend && (
              <div className="flex items-center text-sm font-medium">
                {getTrendIcon(metric.trend)}
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              {'current' in metric ? (
                typeof metric.current === 'number' ? 
                  title === "BMI" ? metric.current.toFixed(1) : `${metric.current}` 
                  : metric.current
              ) : ''}
              {metric.trend === "up" && <Sparkles className="ml-2 h-4 w-4 text-yellow-500" />}
            </div>
            
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {hasRange && `Range: ${metric.min}-${metric.max}`}
              {hasTarget && `Target: ${metric.target}`}
              {title === "Heart Rate" && " BPM"}
              {title === "Blood Pressure" && " mmHg"}
              {title === "Temperature" && "°F"}
              {title === "Oxygen Level" && "%"}
              {title === "Weight" && " lbs"}
              {title === "Blood Sugar" && " mg/dL"}
              {title === "Cholesterol" && " mg/dL"}
              {title === "Respiratory Rate" && " breaths/min"}
            </div>
          </div>
          
          {metric.trend && (
            <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${
              metric.trend === "up" ? "bg-green-500" : 
              metric.trend === "down" ? "bg-red-500" : "bg-gray-400"
            }`} />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard("heartRate", "Heart Rate", <Heart className="h-5 w-5 text-red-500" />, 0)}
        {renderMetricCard("bloodPressure", "Blood Pressure", <Activity className="h-5 w-5 text-blue-500" />, 1)}
        {renderMetricCard("temperature", "Temperature", <Thermometer className="h-5 w-5 text-orange-500" />, 2)}
        {renderMetricCard("oxygenLevel", "Oxygen Level", <Droplet className="h-5 w-5 text-cyan-500" />, 3)}
      
        <AnimatePresence>
          {showAll && (
            <>
              {renderMetricCard("weight", "Weight", <Scale className="h-5 w-5 text-emerald-500" />, 4)}
              {renderMetricCard("bloodSugar", "Blood Sugar", <BarChart3 className="h-5 w-5 text-purple-500" />, 5)}
              {renderMetricCard("cholesterol", "Cholesterol", <PieChart className="h-5 w-5 text-yellow-500" />, 6)}
              {renderMetricCard("bmi", "BMI", <Ruler className="h-5 w-5 text-indigo-500" />, 7)}
              {renderMetricCard("respiratoryRate", "Respiratory Rate", <Wind className="h-5 w-5 text-teal-500" />, 8)}
            </>
          )}
        </AnimatePresence>
      </div>
      
      <motion.button 
        onClick={() => setShowAll(!showAll)}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showAll ? (
          <>
            <span className="font-medium">Show Less</span>
            <ChevronUp className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            <span className="font-medium">View All Health Metrics</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </motion.button>
    </div>
  );
} 