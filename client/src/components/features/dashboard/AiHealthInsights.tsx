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
    overall: `Based on your recent health data, you have a HIGH RISK health profile that requires attention, ${patientName}. Your Type 2 Diabetes (HbA1c: 7.8%) and Hypertension (BP: 135/88 mmHg) are not well-controlled, indicating significant risk for cardiovascular complications.`,
    trends: "Your HbA1c levels have remained above target range (7.8% vs target <7.0%). Blood pressure readings show consistent elevation above recommended levels. These trends require immediate attention to prevent long-term complications.",
    recommendations: "Increase frequency of blood glucose monitoring and consider medication adjustments. Implement lifestyle modifications including a low-sugar, low-sodium diet. Engage in at least 150 minutes of moderate exercise weekly and practice stress management techniques.",
    risks: "Your risk assessment indicates HIGH cardiovascular risk due to poorly controlled diabetes and hypertension. Schedule annual eye examinations, regular kidney function tests, and lipid profile screenings to monitor for complications."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Overall Health</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aiHealthSummaries.overall}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 12 5.25 5 2.625-5H8c0-3.75 3-7.5 7.5-7.5 2.25 0 4.125.75 5.25 2.25"/><path d="M20 12c-3 6-8.25 7.5-12.75 7.5-2.25 0-4.125-.75-5.25-2.25"/></svg>
                </div>
                <h4 className="font-medium text-green-700 dark:text-green-300">Recent Trends</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aiHealthSummaries.trends}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </div>
                <h4 className="font-medium text-purple-700 dark:text-purple-300">Recommendations</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aiHealthSummaries.recommendations}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <h4 className="font-medium text-amber-700 dark:text-amber-300">Risk Analysis</h4>
              </div>
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