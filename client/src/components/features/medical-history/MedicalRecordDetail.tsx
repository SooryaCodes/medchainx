import { ChevronLeft, FileText, User, Calendar, Clipboard, FilePlus2, Download, Share2, Sparkles, Pill, Microscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Import the MedicalRecord interface
interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  doctor: {
    name: string;
    specialty: string;
    hospital: string;
    contact: string;
  };
  notes: string;
  prescriptions: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  labResults: Array<{
    name: string;
    result: string;
    referenceRange: string;
    date: string;
  }>;
  attachments: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  followUp: string;
}

interface MedicalRecordDetailProps {
  record: MedicalRecord;
  onClose: () => void;
}

export function MedicalRecordDetail({ record, onClose }: MedicalRecordDetailProps) {
  const [showAiSummary, setShowAiSummary] = useState(false);
  
  // Mock AI summary for the medical record
  const aiSummary = {
    diagnosis: "Based on the symptoms and examination, this appears to be a routine check-up with normal findings. All vital signs are within normal ranges.",
    treatment: "No specific treatment was prescribed beyond the recommended vitamin D supplement, which is appropriate given the findings.",
    followUp: "The recommended 6-month follow-up is standard protocol for routine check-ups and appropriate for this case."
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose} className="flex items-center text-primary">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Medical History
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Medical Record Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Medical record details content */}
        </CardContent>
      </Card>
      
      {/* AI Summary section */}
      {showAiSummary && (
        <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{aiSummary.diagnosis}</p>
            <p>{aiSummary.treatment}</p>
            <p>{aiSummary.followUp}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 