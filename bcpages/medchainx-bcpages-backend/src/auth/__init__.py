from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Patient, Doctor
from .schemas import PatientCreate, DoctorCreate, Token
from .utils import create_access_token, verify_password

router = APIRouter()

@router.post("/register-patient", response_model=Token)
def register_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = db.query(Patient).filter(Patient.email == patient.email).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_patient = Patient(**patient.dict())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    access_token = create_access_token(data={"sub": new_patient.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-patient", response_model=Token)
def login_patient(email: str, password: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.email == email).first()
    if not patient or not verify_password(password, patient.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": patient.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register-doctor", response_model=Token)
def register_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    db_doctor = db.query(Doctor).filter(Doctor.email == doctor.email).first()
    if db_doctor:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_doctor = Doctor(**doctor.dict())
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    access_token = create_access_token(data={"sub": new_doctor.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-doctor", response_model=Token)
def login_doctor(email: str, password: str, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == email).first()
    if not doctor or not verify_password(password, doctor.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": doctor.email})
    return {"access_token": access_token, "token_type": "bearer"}