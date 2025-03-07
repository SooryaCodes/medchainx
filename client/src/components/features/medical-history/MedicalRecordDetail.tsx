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
          <div className="space-y-6">
            {/* Header information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{record.type}: {record.description}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Date: {record.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  <span>Doctor: {record.doctor.name} ({record.doctor.specialty})</span>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Hospital Information</h4>
                <p className="text-sm">{record.doctor.hospital}</p>
                <p className="text-sm">Contact: {record.doctor.contact}</p>
                <p className="text-sm mt-2">Follow-up: {record.followUp}</p>
              </div>
            </div>
            
            {/* Notes section */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Clipboard className="h-4 w-4 mr-1" />
                Notes
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm">{record.notes}</p>
              </div>
            </div>
            
            {/* Tabs for different sections */}
            <Tabs defaultValue="prescriptions" className="mt-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="prescriptions" className="flex items-center">
                  <Pill className="h-4 w-4 mr-1" />
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger value="labResults" className="flex items-center">
                  <Microscope className="h-4 w-4 mr-1" />
                  Lab Results
                </TabsTrigger>
                <TabsTrigger value="attachments" className="flex items-center">
                  <FilePlus2 className="h-4 w-4 mr-1" />
                  Attachments
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="prescriptions">
                {record.prescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {record.prescriptions.map((prescription, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                        <h5 className="font-medium">{prescription.name}</h5>
                        <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
                          <div>
                            <span className="text-gray-500">Dosage:</span> {prescription.dosage}
                          </div>
                          <div>
                            <span className="text-gray-500">Frequency:</span> {prescription.frequency}
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span> {prescription.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No prescriptions for this record.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="labResults">
                {record.labResults.length > 0 ? (
                  <div className="space-y-3">
                    {record.labResults.map((lab, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                        <h5 className="font-medium">{lab.name}</h5>
                        <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
                          <div>
                            <span className="text-gray-500">Result:</span> {lab.result}
                          </div>
                          <div>
                            <span className="text-gray-500">Reference Range:</span> {lab.referenceRange}
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span> {lab.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No lab results for this record.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="attachments">
                {record.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {record.attachments.map((attachment, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded mr-3">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{attachment.name}</h5>
                          <p className="text-xs text-gray-500">{attachment.type}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No attachments for this record.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
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