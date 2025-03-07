import { useState } from "react";
import { 
  Heart, 
  Activity, 
  BarChart3, 
  PieChart, 
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

interface HealthChartsProps {
  chartData: ChartData;
}

export function HealthCharts({ chartData }: HealthChartsProps) {
  const [chartTimeframe, setChartTimeframe] = useState("daily");
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["heartRate", "bloodPressure", "bloodSugar", "cholesterol"]);

  const toggleChart = (chartName: string) => {
    if (selectedCharts.includes(chartName)) {
      setSelectedCharts(selectedCharts.filter(name => name !== chartName));
    } else {
      setSelectedCharts([...selectedCharts, chartName]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Health Trends</h3>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-sm text-gray-500 dark:text-gray-400">Timeframe:</span>
          <Select value={chartTimeframe} onValueChange={setChartTimeframe}>
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          <PieChart className="h-4 w-4" />
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
              <div className="h-[250px] flex items-end justify-between gap-2">
                {chartData.heartRate[chartTimeframe as keyof typeof chartData.heartRate].slice(0, 7).map((value, index) => (
                  <div key={index} className="relative h-full flex flex-col justify-end items-center group">
                    <div 
                      className="w-10 bg-gradient-to-t from-red-500 to-red-400 rounded-t-md group-hover:from-red-600 group-hover:to-red-500 transition-all"
                      style={{ height: `${(value / 100) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {value} BPM
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <span>
                Average: {Math.round(chartData.heartRate[chartTimeframe as keyof typeof chartData.heartRate].slice(0, 7).reduce((a, b) => a + b, 0) / 7)} BPM
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
              <div className="h-[250px] flex items-end justify-between gap-2">
                {chartData.bloodPressure.systolic.map((value, index) => (
                  <div key={index} className="relative h-full flex flex-col justify-end items-center group">
                    <div className="flex flex-col gap-0.5">
                      <div 
                        className="w-10 bg-gradient-to-t from-red-500 to-red-400 rounded-t-md group-hover:from-red-600 group-hover:to-red-500 transition-all"
                        style={{ height: `${(value / 200) * 100}%` }}
                      ></div>
                      <div 
                        className="w-10 bg-gradient-to-t from-blue-500 to-blue-400 rounded-b-md group-hover:from-blue-600 group-hover:to-blue-500 transition-all"
                        style={{ height: `${(chartData.bloodPressure.diastolic[index] / 200) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {value}/{chartData.bloodPressure.diastolic[index]} mmHg
                    </div>
                  </div>
                ))}
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
              <div className="h-[250px] flex items-end justify-between gap-2">
                {chartData.bloodSugar.fasting.map((value, index) => (
                  <div key={index} className="relative h-full flex flex-col justify-end items-center group">
                    <div className="flex flex-col gap-0.5">
                      <div 
                        className="w-10 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-md group-hover:from-purple-600 group-hover:to-purple-500 transition-all"
                        style={{ height: `${(value / 150) * 100}%` }}
                      ></div>
                      <div 
                        className="w-10 bg-gradient-to-t from-violet-500 to-violet-400 rounded-b-md group-hover:from-violet-600 group-hover:to-violet-500 transition-all"
                        style={{ height: `${(chartData.bloodSugar.postMeal[index] / 150) * 50}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Fasting: {value} mg/dL<br />
                      Post-meal: {chartData.bloodSugar.postMeal[index]} mg/dL
                    </div>
                  </div>
                ))}
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
                <PieChart className="h-5 w-5 mr-2 text-yellow-500" />
                Cholesterol Trends
              </CardTitle>
              <CardDescription>Last 7 days (mg/dL)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-end justify-between gap-2">
                {chartData.cholesterol.total.map((value, index) => (
                  <div key={index} className="relative h-full flex flex-col justify-end items-center group">
                    <div className="flex flex-col gap-0.5">
                      <div 
                        className="w-10 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-md group-hover:from-yellow-600 group-hover:to-yellow-500 transition-all"
                        style={{ height: `${(value / 250) * 100}%` }}
                      ></div>
                      <div className="flex w-10">
                        <div 
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-bl-md group-hover:from-green-600 group-hover:to-green-500 transition-all"
                          style={{ height: `${(chartData.cholesterol.hdl[index] / 100) * 100}%` }}
                        ></div>
                        <div 
                          className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-br-md group-hover:from-red-600 group-hover:to-red-500 transition-all"
                          style={{ height: `${(chartData.cholesterol.ldl[index] / 200) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Total: {value} mg/dL<br />
                      HDL: {chartData.cholesterol.hdl[index]} mg/dL<br />
                      LDL: {chartData.cholesterol.ldl[index]} mg/dL
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full mr-1"></div>
                  <span>Total</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full mr-1"></div>
                  <span>HDL</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full mr-1"></div>
                  <span>LDL</span>
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
                Oxygen Level Trends
              </CardTitle>
              <CardDescription>Last 7 days (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-end justify-between gap-2">
                {chartData.oxygenLevel.map((value, index) => (
                  <div key={index} className="relative h-full flex flex-col justify-end items-center group">
                    <div 
                      className="w-10 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-md group-hover:from-cyan-600 group-hover:to-cyan-500 transition-all"
                      style={{ height: `${((value - 90) / 10) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {value}%
                    </div>
                  </div>
                ))}
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
              <div className="h-[250px] flex items-end justify-between gap-2">
                {chartData.temperature.map((value, index) => (
                  <div key={index} className="relative h-full flex flex-col justify-end items-center group">
                    <div 
                      className="w-10 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-md group-hover:from-orange-600 group-hover:to-orange-500 transition-all"
                      style={{ height: `${((value - 97) / 3) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {value}°F
                    </div>
                  </div>
                ))}
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
                Respiratory Rate Trends
              </CardTitle>
              <CardDescription>Last 7 days (breaths/min)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-end justify-between gap-2">
                {chartData.respiratoryRate.map((value, index) => (
                  <div key={index} className="relative h-full flex flex-col justify-end items-center group">
                    <div 
                      className="w-10 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-md group-hover:from-teal-600 group-hover:to-teal-500 transition-all"
                      style={{ height: `${(value / 25) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {value} breaths/min
                    </div>
                  </div>
                ))}
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