

export enum Role {
  Patient = 'Patient',
  Doctor = 'Doctor',
  Management = 'Management',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  username: string;
  password?: string; // Made optional on client-side user object
}

export interface Doctor extends User {
  role: Role.Doctor;
  specialization: string;
  contact: string;
  patients: string[]; // Array of patient IDs
}

export interface Patient extends User {
  role: Role.Patient;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  caseType: 'Cardiology' | 'Orthopedics' | 'General' | 'Neurology';
  assignedDoctorId: string;
}

export type LoggedInUser = Patient | Doctor | User;

export type RegistrationData = Pick<Patient, 'name' | 'username' | 'age' | 'gender' | 'caseType'> & { password: string };

export interface VitalSign {
  name: 'Heart Rate' | 'Temperature' | 'Blood Pressure' | 'SpO2';
  value: number;
  unit: string;
  thresholds: { min: number; max: number };
}

export interface VitalHistoryPoint {
  time: string;
  value: number;
}

export interface Alert {
  id: string;
  patientName: string;
  patientId: string;
  vital: VitalSign['name'];
  value: number;
  timestamp: Date;
  message: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface DoctorPatientMessage {
  id: string;
  senderId: string; // patientId or doctorId
  receiverId: string; // patientId or doctorId
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface AnalyticsData {
    totalPatients: { month: string; count: number }[];
    genderDistribution: { name: string; value: number }[];
    caseTypeDistribution: { name: string; value: number }[];
    alertStatistics: { day: string; count: number }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string;
  status: 'booked' | 'completed' | 'cancelled';
}