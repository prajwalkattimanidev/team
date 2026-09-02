export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  is_new_patient?: boolean;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  image: string;
  bio: string;
  availableDays?: string[];
  availableHours?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  duration: string;
  price: string;
  category: 'Preventive' | 'Cosmetic' | 'Restorative' | 'Orthodontics' | 'Pediatric' | 'Specialized' | 'Emergency';
  iconName: string;
  image?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes?: string;
  is_new_patient: boolean;
  status: AppointmentStatus;
  appointment_reference: string;
  created_at: string;
}

export interface PopulatedAppointment extends Appointment {
  patient?: Patient;
  doctor?: Doctor;
  service?: Service;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  procedure: string;
  date: string;
  image?: string;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  address: string;
  city: string;
  hoursWeekday: string;
  hoursWeekend: string;
}

export interface AdminStats {
  todayAppointments: number;
  upcomingAppointments: number;
  pendingRequests: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalAppointments: number;
}

export interface BookingFormData {
  // Patient Details
  fullName: string;
  phone: string;
  email: string;
  age: number | string;
  isNewPatient: boolean;
  // Appointment Details
  serviceId: string;
  doctorId: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  additionalMessage?: string;
}

export interface ClinicData {
  clinic: ClinicInfo;
  services: Service[];
  doctors: Doctor[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
}
