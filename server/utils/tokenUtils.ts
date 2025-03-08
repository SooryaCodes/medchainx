import jwt from 'jsonwebtoken';

interface TokenPayload {
  patientId: string;
  createdAt: Date;
  expiresIn: number; // Duration in seconds
}

/**
 * Generate a short-lived token for patient access
 * @param patientId - The ID of the patient
 * @param expiresIn - Token expiration duration in seconds
 * @returns The generated token
 */
export const generatePatientToken = (patientId: string, expiresIn: number): string => {
  const payload: TokenPayload = {
    patientId,
    createdAt: new Date(),
    expiresIn
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: expiresIn }
  );
};

/**
 * Decode a patient token to extract the payload
 * @param token - The token to decode
 * @returns The decoded token payload or null if invalid
 */
export const decodePatientToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as TokenPayload;
    
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Verify if a token is valid and not expired
 * @param token - The token to verify
 * @returns Boolean indicating if the token is valid
 */
export const verifyPatientToken = (token: string): boolean => {
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return true;
  } catch (error) {
    return false;
  }
}; 