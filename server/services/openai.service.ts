import axios from 'axios';
import { IPatient, IMedicalReport } from '../models';
import dotenv from 'dotenv';

dotenv.config();

export class OpenAIService {
  private apiKey: string;
  private apiUrl: string = 'https://api.anthropic.com/v1/messages';

  constructor() {
    // Get API key from environment variables
    this.apiKey = process.env.OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key is not set. Health risk analysis will not work.');
    }
  }

  // Prepare patient data for AI analysis by removing sensitive information
  private preparePatientDataForAnalysis(patient: IPatient): any {
    // Extract only medical data, removing personal identifiable information
    const medicalData = {
      gender: patient.gender,
      birthDate: patient.birthDate,
      bloodType: patient.bloodType,
      
      // Include all medical reports but sanitize them
      medicalReports: patient.medicalReports.map(report => ({
        type: report.type,
        date: report.date,
        content: report.content,
        
        // Include specific medical data based on report type
        prescription: report.prescription,
        labReport: report.labReport,
        imaging: report.imaging,
        
        // Include status and tags
        status: report.status,
        tags: report.tags
      }))
    };
    
    return medicalData;
  }

  // Generate health risk analysis based on patient data
  async generateHealthRiskAnalysis(patient: IPatient): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      // Prepare sanitized patient data
      const sanitizedData = this.preparePatientDataForAnalysis(patient);
      
      // Create prompt for OpenAI
      const prompt = `
        Analyze the following patient medical data and generate a comprehensive health risk assessment.
        Focus on identifying potential health risks based on medical history, lab results, and prescriptions.
        Do not include any personal identifiable information in your analysis.
        
        Patient Data:
        ${JSON.stringify(sanitizedData, null, 2)}
        
        Please provide your analysis in the following JSON format:
        {
          "overallRiskLevel": "low|medium|high",
          "summary": "Brief summary of the patient's health status",
          "potentialRisks": [
            {
              "riskName": "Name of the risk",
              "riskLevel": "low|medium|high",
              "description": "Description of the risk",
              "recommendations": ["Recommendation 1", "Recommendation 2"]
            }
          ],
          "recommendedScreenings": ["Screening 1", "Screening 2"],
          "lifestyleRecommendations": ["Recommendation 1", "Recommendation 2"]
        }
      `;

      // Call OpenAI API
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      // Parse and return the response
      const result = response.data.content[0].text;
      return JSON.parse(result);
    } catch (error) {
      console.error('Error generating health risk analysis:', error);
      throw new Error('Failed to generate health risk analysis');
    }
  }
}

export default new OpenAIService(); 