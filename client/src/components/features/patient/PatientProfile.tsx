import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Droplet, 
  AlertTriangle, 
  FileText,
  X
} from "lucide-react";

interface PatientProfileProps {
  patient: any;
  onClose: () => void;
}

export function PatientProfile({ patient, onClose }: PatientProfileProps) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Close profile"
      >
        <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </button>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full"></div>
      <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Patient Profile
          </CardTitle>
          <div className="mt-2 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              Active Patient
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column - Personal details with photo */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md">
                {patient?.name?.given?.[0]?.charAt(0) || 'J'}{patient?.name?.family?.charAt(0) || 'D'}
              </div>
              <h3 className="text-xl font-semibold">{patient?.name?.given?.join(' ') || 'N/A'} {patient?.name?.family || ''}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Patient ID: {patient?.id || 'N/A'}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 text-sm uppercase tracking-wider mb-3">Key Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">DOB:</span>
                    <span className="text-sm ml-2">{patient?.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Gender:</span>
                    <span className="text-sm ml-2">{patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Blood Type:</span>
                    <span className="text-sm ml-2 font-mono">{patient?.bloodType || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-3">Insurance Details</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Insurance ID</p>
                    <p className="font-mono text-sm">{patient?.healthInsuranceId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">National ID</p>
                    <p className="font-mono text-sm">{patient?.nationalId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Insurance Provider</p>
                    <p className="text-sm">{patient?.insuranceProvider || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Contact and medical details */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{patient?.contact?.email || 'N/A'}</p>
                      {patient?.contact?.email && (
                        <button className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{patient?.contact?.phone || 'N/A'}</p>
                      {patient?.contact?.phone && (
                        <button className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Home Address</p>
                    <p className="text-sm">{patient?.address ? `${patient.address.street || ''} ${patient.address.city || ''} ${patient.address.state || ''} ${patient.address.postalCode || ''}` : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Emergency Contact */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Emergency Contact</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contact Name</p>
                    <p className="text-sm font-medium">{patient?.emergencyContact?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Relationship</p>
                    <p className="text-sm">{patient?.emergencyContact?.relationship ? patient.emergencyContact.relationship.charAt(0).toUpperCase() + patient.emergencyContact.relationship.slice(1) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{patient?.emergencyContact?.phone || 'N/A'}</p>
                      {patient?.emergencyContact?.phone && (
                        <button className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Medical Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Medical Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-3">Allergies & Conditions</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Known Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {patient?.allergies && patient.allergies.length > 0 ? (
                            patient.allergies.map((allergy: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                {allergy}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">No known allergies</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chronic Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {patient?.conditions && patient.conditions.length > 0 ? (
                            patient.conditions.map((condition: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                {condition}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">No chronic conditions</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-3">Primary Care</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Primary Physician</p>
                        <p className="text-sm font-medium">{patient?.primaryPhysician?.name || 'N/A'}</p>
                        {patient?.primaryPhysician?.contact && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{patient.primaryPhysician.contact}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Check-up</p>
                        <p className="text-sm">{patient?.lastCheckup ? new Date(patient.lastCheckup).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-3">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Height</p>
                      <p className="text-sm font-medium">{patient?.height || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Weight</p>
                      <p className="text-sm font-medium">{patient?.weight || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">BMI</p>
                      <p className="text-sm font-medium">{patient?.bmi || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between">
        <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Summary
        </Button>
      </CardFooter>
    </Card>
  );
} 