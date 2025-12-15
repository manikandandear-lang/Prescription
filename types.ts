export interface Medication {
  name: string;
  genericName?: string; // For searching images (e.g. Paracetamol)
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  type: string; // e.g., tablet, syrup, injection
}

export interface Doctor {
  name: string;
  specialty: string;
  licenseNumber: string;
  hospital: string;
  contact: string;
}

export interface Patient {
  name: string;
  age: string;
  gender: string;
  weight: string;
}

export interface PrescriptionData {
  doctor: Doctor;
  patient: Patient;
  date: string;
  medications: Medication[];
  diagnosis: string;
  generalAdvice: string;
  followUpDate: string;
  isPrescription: boolean; // Flag to check if the image is actually a prescription
}