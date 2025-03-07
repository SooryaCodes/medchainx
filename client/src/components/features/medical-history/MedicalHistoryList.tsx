import { useState } from "react";
import { Search, Filter, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      record.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterType === "all" || record.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });
  
  const recordTypes = ["all", ...Array.from(new Set(records.map(r => r.type.toLowerCase())))];
  
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
            placeholder="Search medical records..." 
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
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <div key={index} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  
                  <div 
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onSelectRecord(record)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h4 className="font-semibold text-lg">{record.type}: {record.description}</h4>
                      <span className="text-sm text-gray-500">{record.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span className="font-medium">Provider:</span> {record.doctor.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </p>
                      <Button variant="ghost" size="sm" className="text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
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
      
      {filteredRecords.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
            Export Medical History
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 