import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';
import { IPatient, IDoctor, IHospital, IMedicalReport } from '../models';

// Google Cloud Healthcare API configuration
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const GOOGLE_CLOUD_DATASET = process.env.GOOGLE_CLOUD_DATASET;
const GOOGLE_CLOUD_FHIR_STORE = process.env.GOOGLE_CLOUD_FHIR_STORE;

// Configure Google Auth Client
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
});

// Configure axios instance for FHIR server
const getFhirAxios = async () => {
  const token = await auth.getAccessToken();
  const baseURL = `https://healthcare.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT}/locations/${GOOGLE_CLOUD_LOCATION}/datasets/${GOOGLE_CLOUD_DATASET}/fhirStores/${GOOGLE_CLOUD_FHIR_STORE}/fhir`;
  
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/fhir+json',
      'Authorization': `Bearer ${token}`
    }
  });
};

/**
 * FHIR Service class to handle all FHIR-related operations
 */
export class FHIRService {
  /**
   * Create a FHIR Patient resource
   */
  static createPatient = async (patientData: any): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const patientId = patientData.id || uuidv4();
      
      const fhirPatient = {
        resourceType: "Patient",
        id: patientId,
        meta: {
          profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"]
        },
        identifier: [
          {
            system: "urn:oid:2.16.840.1.113883.2.4.6.3",
            value: patientId
          }
        ],
        active: true,
        name: [
          {
            use: "official",
            family: patientData.name.family,
            given: patientData.name.given
          }
        ],
        gender: patientData.gender,
        birthDate: new Date(patientData.birthDate).toISOString().split('T')[0],
        telecom: [
          patientData.contact?.phone ? {
            system: "phone",
            value: patientData.contact.phone,
            use: "home"
          } : null,
          patientData.contact?.email ? {
            system: "email",
            value: patientData.contact.email
          } : null
        ].filter(Boolean),
        address: patientData.address ? [
          {
            use: "home",
            line: [patientData.address.street],
            city: patientData.address.city,
            state: patientData.address.state,
            postalCode: patientData.address.postalCode,
            country: patientData.address.country
          }
        ] : [],
        contact: patientData.emergencyContact ? [
          {
            relationship: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                    code: "C",
                    display: "Emergency Contact"
                  }
                ]
              }
            ],
            name: {
              text: patientData.emergencyContact.name
            },
            telecom: [
              {
                system: "phone",
                value: patientData.emergencyContact.phone
              }
            ]
          }
        ] : [],
        communication: patientData.preferredLanguage ? [
          {
            language: {
              coding: [
                {
                  system: "urn:ietf:bcp:47",
                  code: patientData.preferredLanguage
                }
              ]
            },
            preferred: true
          }
        ] : [],
        extension: [
          {
            url: "http://hl7.org/fhir/StructureDefinition/patient-nationality",
            extension: patientData.nationality ? [
              {
                url: "code",
                valueCodeableConcept: {
                  coding: [
                    {
                      system: "urn:iso:std:iso:3166",
                      code: patientData.nationality
                    }
                  ]
                }
              }
            ] : []
          }
        ]
      };

      // Send to FHIR server
      const response = await fhirAxios.post('/Patient', fhirPatient);
      return response.data;
    } catch (error) {
      console.error('Error creating FHIR Patient:', error);
      throw error;
    }
  };

  /**
   * Update a FHIR Patient resource
   */
  static updatePatient = async (patientId: string, patientData: any): Promise<any> => {
    try {
      // First, get the current FHIR Patient
      const fhirAxios = await getFhirAxios();
      const currentPatient = await this.getPatient(patientId);
      
      // Update the patient data
      const updatedPatient = {
        ...currentPatient,
        name: [
          {
            use: "official",
            family: patientData.name.family,
            given: patientData.name.given
          }
        ],
        gender: patientData.gender,
        birthDate: new Date(patientData.birthDate).toISOString().split('T')[0],
        telecom: [
          patientData.contact?.phone ? {
            system: "phone",
            value: patientData.contact.phone,
            use: "home"
          } : null,
          patientData.contact?.email ? {
            system: "email",
            value: patientData.contact.email
          } : null
        ].filter(Boolean),
        address: patientData.address ? [
          {
            use: "home",
            line: [patientData.address.street],
            city: patientData.address.city,
            state: patientData.address.state,
            postalCode: patientData.address.postalCode,
            country: patientData.address.country
          }
        ] : [],
        contact: patientData.emergencyContact ? [
          {
            relationship: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                    code: "C",
                    display: "Emergency Contact"
                  }
                ]
              }
            ],
            name: {
              text: patientData.emergencyContact.name
            },
            telecom: [
              {
                system: "phone",
                value: patientData.emergencyContact.phone
              }
            ]
          }
        ] : []
      };

      // Send to FHIR server
      const response = await fhirAxios.put(`/Patient/${patientId}`, updatedPatient);
      return response.data;
    } catch (error) {
      console.error('Error updating FHIR Patient:', error);
      throw error;
    }
  };

  /**
   * Get a FHIR Patient resource
   */
  static getPatient = async (patientId: string): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const response = await fhirAxios.get(`/Patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting FHIR Patient:', error);
      throw error;
    }
  };

  /**
   * Delete a FHIR Patient resource
   */
  static deletePatient = async (patientId: string): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const response = await fhirAxios.delete(`/Patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting FHIR Patient:', error);
      throw error;
    }
  };

  /**
   * Create a FHIR Practitioner resource (Doctor)
   */
  static createPractitioner = async (doctorData: any): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const practitionerId = doctorData.id || uuidv4();
      
      const fhirPractitioner = {
        resourceType: "Practitioner",
        id: practitionerId,
        meta: {
          profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner"]
        },
        identifier: [
          {
            system: "http://hl7.org/fhir/sid/us-npi",
            value: practitionerId
          }
        ],
        active: true,
        name: [
          {
            use: "official",
            family: doctorData.name.family,
            given: doctorData.name.given
          }
        ],
        telecom: [
          doctorData.contact?.phone ? {
            system: "phone",
            value: doctorData.contact.phone,
            use: "work"
          } : null,
          doctorData.contact?.email ? {
            system: "email",
            value: doctorData.contact.email
          } : null
        ].filter(Boolean),
        qualification: doctorData.qualifications ? 
          doctorData.qualifications.map((qual: any) => ({
            code: {
              text: qual.degree
            },
            issuer: {
              display: qual.institution
            },
            period: {
              start: `${qual.year}-01-01`
            }
          })) : []
      };

      // Send to FHIR server
      const response = await fhirAxios.post('/Practitioner', fhirPractitioner);
      return response.data;
    } catch (error) {
      console.error('Error creating FHIR Practitioner:', error);
      throw error;
    }
  };

  /**
   * Create a FHIR Organization resource (Hospital)
   */
  static createOrganization = async (hospitalData: any): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const organizationId = hospitalData.id || uuidv4();
      
      const fhirOrganization = {
        resourceType: "Organization",
        id: organizationId,
        meta: {
          profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization"]
        },
        identifier: [
          {
            system: "http://hl7.org/fhir/sid/us-npi",
            value: organizationId
          }
        ],
        active: true,
        type: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/organization-type",
                code: "prov",
                display: "Healthcare Provider"
              }
            ]
          }
        ],
        name: hospitalData.name,
        telecom: [
          hospitalData.contact?.phone ? {
            system: "phone",
            value: hospitalData.contact.phone,
            use: "work"
          } : null,
          hospitalData.contact?.email ? {
            system: "email",
            value: hospitalData.contact.email
          } : null,
          hospitalData.contact?.website ? {
            system: "url",
            value: hospitalData.contact.website
          } : null
        ].filter(Boolean),
        address: hospitalData.address ? [
          {
            use: "work",
            type: "both",
            line: [hospitalData.address.street],
            city: hospitalData.address.city,
            state: hospitalData.address.state,
            postalCode: hospitalData.address.postalCode,
            country: hospitalData.address.country
          }
        ] : []
      };

      // Send to FHIR server
      const response = await fhirAxios.post('/Organization', fhirOrganization);
      return response.data;
    } catch (error) {
      console.error('Error creating FHIR Organization:', error);
      throw error;
    }
  };

  /**
   * Create a FHIR Encounter resource
   */
  static createEncounter = async (encounterData: any): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const encounterId = uuidv4();
      
      const fhirEncounter = {
        resourceType: "Encounter",
        id: encounterId,
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "AMB",
          display: "ambulatory"
        },
        subject: {
          reference: `Patient/${encounterData.patientId}`
        },
        participant: [
          {
            individual: {
              reference: `Practitioner/${encounterData.doctorId}`
            }
          }
        ],
        period: {
          start: new Date(encounterData.date).toISOString(),
          end: new Date(encounterData.date).toISOString()
        },
        serviceProvider: {
          reference: `Organization/${encounterData.hospitalId}`
        }
      };

      // Send to FHIR server
      const response = await fhirAxios.post('/Encounter', fhirEncounter);
      return response.data;
    } catch (error) {
      console.error('Error creating FHIR Encounter:', error);
      throw error;
    }
  };

  /**
   * Create a FHIR DiagnosticReport resource
   */
  static createDiagnosticReport = async (reportData: any, encounterId: string): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const reportId = uuidv4();
      
      const fhirDiagnosticReport = {
        resourceType: "DiagnosticReport",
        id: reportId,
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                code: "GE",
                display: "General Examination"
              }
            ]
          }
        ],
        code: {
          text: "Medical Examination"
        },
        subject: {
          reference: `Patient/${reportData.patientId}`
        },
        encounter: {
          reference: `Encounter/${encounterId}`
        },
        effectiveDateTime: new Date(reportData.date).toISOString(),
        issued: new Date().toISOString(),
        performer: [
          {
            reference: `Practitioner/${reportData.doctorId}`
          }
        ],
        conclusion: reportData.diagnosis
      };

      // Send to FHIR server
      const response = await fhirAxios.post('/DiagnosticReport', fhirDiagnosticReport);
      return response.data;
    } catch (error) {
      console.error('Error creating FHIR DiagnosticReport:', error);
      throw error;
    }
  };

  /**
   * Create a FHIR MedicationRequest resource
   */
  static createMedicationRequest = async (prescriptionData: any, encounterId: string): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const medicationRequests: any[] = [];
      
      for (const prescription of prescriptionData.prescriptions) {
        const medicationRequestId = uuidv4();
        
        const fhirMedicationRequest = {
          resourceType: "MedicationRequest",
          id: medicationRequestId,
          status: "active",
          intent: "order",
          medicationCodeableConcept: {
            text: prescription.medicine
          },
          subject: {
            reference: `Patient/${prescriptionData.patientId}`
          },
          encounter: {
            reference: `Encounter/${encounterId}`
          },
          requester: {
            reference: `Practitioner/${prescriptionData.doctorId}`
          },
          dosageInstruction: [
            {
              text: `${prescription.dosage} for ${prescription.duration}`
            }
          ]
        };

        // Send to FHIR server
        const response = await fhirAxios.post('/MedicationRequest', fhirMedicationRequest);
        medicationRequests.push(response.data);
      }
      
      return medicationRequests;
    } catch (error) {
      console.error('Error creating FHIR MedicationRequest:', error);
      throw error;
    }
  };

  /**
   * Create a complete medical report with all related FHIR resources
   */
  static createMedicalReport = async (reportData: IMedicalReport): Promise<any> => {
    try {
      // 1. Create Encounter
      const encounter = await this.createEncounter({
        patientId: reportData.patientId.toString(),
        doctorId: reportData.doctorId.toString(),
        hospitalId: (await this.getDoctorHospital(reportData.doctorId.toString())),
        date: reportData.date
      });

      // 2. Create DiagnosticReport
      const diagnosticReport = await this.createDiagnosticReport(reportData, encounter.id);

      // 3. Create MedicationRequests if prescriptions exist
      let medicationRequests = [];
      if (reportData.prescriptions && reportData.prescriptions.length > 0) {
        medicationRequests = await this.createMedicationRequest(reportData, encounter.id);
      }

      return {
        encounter,
        diagnosticReport,
        medicationRequests
      };
    } catch (error) {
      console.error('Error creating complete medical report:', error);
      throw error;
    }
  };

  /**
   * Helper method to get a doctor's hospital
   */
  private static getDoctorHospital = async (doctorId: string): Promise<string> => {
    // This would typically query your MongoDB to get the doctor's hospitalId
    // For now, we'll just return a placeholder
    return "hospital-placeholder";
  };

  /**
   * Search for FHIR resources
   */
  static searchResources = async (resourceType: string, params: any): Promise<any> => {
    try {
      const fhirAxios = await getFhirAxios();
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value as string);
      });
      
      const response = await fhirAxios.get(`/${resourceType}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching FHIR ${resourceType}:`, error);
      throw error;
    }
  };
} 