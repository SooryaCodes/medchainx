import { useState } from "react";
import { Search, Filter, FileText, ChevronRight, Calendar, User, Tag, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    interpretation?: string;
  }>;
  attachments: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  followUp: string;
  status: string;
  tags: string[];
}

interface MedicalHistoryListProps {
  records: MedicalRecord[];
  onSelectRecord: (record: MedicalRecord) => void;
}

export function MedicalHistoryList({ records, onSelectRecord }: MedicalHistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.tags && record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
    const matchesFilter = filterType === "all" || record.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });
  
  // Sort records by date (newest first)
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const recordTypes = ["all", ...Array.from(new Set(records.map(r => r.type.toLowerCase())))];
  
  // Function to get appropriate color based on record type
  const getRecordTypeColor = (type: string, tags: string[]) => {
    const lowerType = type.toLowerCase();
    const lowerTags = tags.map(t => t.toLowerCase());
    
    if (lowerType.includes('diabetes') || lowerTags.includes('diabetes')) {
      return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
    }
    if (lowerType.includes('cardio') || lowerType.includes('heart') || lowerTags.includes('hypertension') || lowerTags.includes('cardiology')) {
      return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    }
    if (lowerType.includes('vaccination') || lowerTags.includes('vaccination') || lowerTags.includes('preventive')) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    }
    if (lowerType.includes('lab') || lowerType.includes('test') || lowerTags.includes('lab')) {
      return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
    }
    
    return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
  };
  
  // Function to get dot color based on record type
  const getDotColor = (type: string, tags: string[]) => {
    const lowerType = type.toLowerCase();
    const lowerTags = tags.map(t => t.toLowerCase());
    
    if (lowerType.includes('diabetes') || lowerTags.includes('diabetes')) {
      return 'bg-orange-500 dark:bg-orange-400';
    }
    if (lowerType.includes('cardio') || lowerType.includes('heart') || lowerTags.includes('hypertension') || lowerTags.includes('cardiology')) {
      return 'bg-red-500 dark:bg-red-400';
    }
    if (lowerType.includes('vaccination') || lowerTags.includes('vaccination') || lowerTags.includes('preventive')) {
      return 'bg-green-500 dark:bg-green-400';
    }
    if (lowerType.includes('lab') || lowerType.includes('test') || lowerTags.includes('lab')) {
      return 'bg-purple-500 dark:bg-purple-400';
    }
    
    return 'bg-blue-500 dark:bg-blue-400';
  };
  
  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Medical History
        </CardTitle>
        <CardDescription>
          Complete record of your medical history
        </CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-2 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by description, doctor, type or tags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {recordTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="space-y-6">
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record, index) => (
                <div key={record.id} className="relative pl-10">
                  {/* Timeline dot with appropriate color based on record type */}
                  <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full ${getRecordTypeColor(record.type, record.tags)} flex items-center justify-center border`}>
                    <div className={`w-3 h-3 rounded-full ${getDotColor(record.type, record.tags)}`}></div>
                  </div>
                  
                  <div 
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onSelectRecord(record)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h4 className="font-semibold text-lg">{record.description}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {record.date}
                        </span>
                        {record.status && (
                          <Badge variant={record.status === 'final' ? 'default' : 'outline'}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span className="font-medium">{record.doctor.name}</span>
                        <span className="mx-1">•</span>
                        <span>{record.doctor.specialty}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>Follow-up: {record.followUp}</span>
                      </p>
                    </div>
                    
                    {record.tags && record.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {record.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-primary">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {/* Quick stats */}
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      {record.prescriptions.length > 0 && (
                        <div className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex items-center">
                          <span className="font-medium mr-1">{record.prescriptions.length}</span> Prescriptions
                        </div>
                      )}
                      {record.labResults.length > 0 && (
                        <div className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 flex items-center">
                          <span className="font-medium mr-1">{record.labResults.length}</span> Lab Results
                        </div>
                      )}
                      {record.attachments.length > 0 && (
                        <div className="text-xs px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 flex items-center">
                          <span className="font-medium mr-1">{record.attachments.length}</span> Attachments
                        </div>
                      )}
                      {record.labResults.some(lab => lab.interpretation?.toLowerCase() === 'high' || lab.interpretation?.toLowerCase() === 'elevated') && (
                        <div className="text-xs px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> Abnormal Results
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No medical records found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {sortedRecords.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
            Export Medical History
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 