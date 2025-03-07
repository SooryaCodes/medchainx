import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AiHealthInsightsProps {
  patientName: string;
}

export function AiHealthInsights({ patientName }: AiHealthInsightsProps) {
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock AI health summaries
  const aiHealthSummaries = {
    overall: `Based on your recent health data, you're maintaining good overall health with stable vital signs. Your heart rate, blood pressure, and oxygen levels are within normal ranges. Continue with your current medication regimen and regular exercise, ${patientName}.`,
    trends: "Your weight has been gradually decreasing, which aligns with your target. Blood pressure has shown slight improvement over the past month. Cholesterol levels have stabilized after starting Atorvastatin.",
    recommendations: "Consider increasing water intake to improve hydration levels. Your sleep patterns show some irregularity - establishing a consistent sleep schedule may help. Continue monitoring blood sugar levels, especially after meals.",
    risks: "Your risk assessment indicates moderate cardiovascular risk. Focus on maintaining your exercise routine and low-sodium diet. Your respiratory health is excellent with no concerning patterns detected."
  };
  
  const handleGenerateInsights = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowAiSummary(true);
    }, 1500);
  };
  
  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Brain className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          AI Health Insights
        </CardTitle>
        <CardDescription>
          Personalized analysis of your health data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <Sparkles className="h-6 w-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Analyzing your health data...</p>
          </div>
        ) : showAiSummary ? (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Overall Health</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aiHealthSummaries.overall}</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Recent Trends</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aiHealthSummaries.trends}</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Recommendations</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aiHealthSummaries.recommendations}</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Risk Analysis</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aiHealthSummaries.risks}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-6">
            <Button 
              onClick={handleGenerateInsights}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Health Insights
            </Button>
          </div>
        )}
      </CardContent>
      {showAiSummary && (
        <CardFooter className="pt-0 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAiSummary(false)}>
            Hide Insights
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Export Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 