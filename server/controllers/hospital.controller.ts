import { Request, Response } from 'express';
import { HospitalModel } from '../models';


export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const hospitals = await HospitalModel.find({}).select('name location contact');
    
    return res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching hospitals'
    });
  }
}; 