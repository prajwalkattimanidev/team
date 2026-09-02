import fs from 'fs';
import path from 'path';
import { Appointment, AppointmentStatus, Doctor, Patient, PopulatedAppointment, Service, Testimonial, FaqItem, ClinicInfo, AdminStats, BookingFormData } from '../src/types';

interface DatabaseSchema {
  clinic: ClinicInfo;
  doctors: Doctor[];
  services: Service[];
  patients: Patient[];
  appointments: Appointment[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  contactMessages: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
  }>;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

const INITIAL_CLINIC: ClinicInfo = {
  name: 'SmileCare Dental Clinic',
  tagline: 'Your Smile Deserves the Best Care',
  phone: '+1 (800) 555-7645',
  emergencyPhone: '+1 (800) 555-9110',
  email: 'care@smilecaredental.com',
  address: '452 Wellness Boulevard, Suite 200',
  city: 'Metro City, NY 10016',
  hoursWeekday: 'Monday – Saturday: 9:00 AM – 8:00 PM',
  hoursWeekend: 'Sunday: 10:00 AM – 2:00 PM',
};

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sharma',
    qualification: 'BDS, MDS (Cosmetic Dentistry)',
    specialization: 'Cosmetic & Restorative Dentist',
    experience: '10+ Years Experience',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
    bio: 'Specializing in smile makeovers, porcelain veneers, and gentle restorative treatments. Passionate about minimally invasive dentistry and patient comfort.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableHours: '9:00 AM - 5:00 PM'
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    qualification: 'DDS, MS (Orthodontics)',
    specialization: 'Orthodontics & Dentofacial Specialist',
    experience: '12+ Years Experience',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    bio: 'Board-certified orthodontist offering modern aligner therapy (Invisalign) and self-ligating braces for teens and adults to craft harmonious bites.',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableHours: '10:00 AM - 6:00 PM'
  },
  {
    id: 'doc-3',
    name: 'Dr. Sarah Chen',
    qualification: 'DDS, FACP (Prosthodontics)',
    specialization: 'Prosthodontics & Implant Surgeon',
    experience: '9+ Years Experience',
    image: 'https://images.unsplash.com/photo-1594824813589-9486c4f74d9e?auto=format&fit=crop&w=800&q=80',
    bio: 'Expert in permanent dental implants, full-arch restorations, and complex crown reconstructions with advanced 3D digital planning.',
    availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    availableHours: '9:00 AM - 4:30 PM'
  },
  {
    id: 'doc-4',
    name: 'Dr. Elena Rostova',
    qualification: 'BDS, Cert. Pediatric Dentistry',
    specialization: 'Pediatric Dental Specialist',
    experience: '8+ Years Experience',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    bio: 'Dedicated to gentle and fear-free dental visits for infants, children, and teenagers, building positive oral health habits that last a lifetime.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    availableHours: '9:00 AM - 2:00 PM'
  }
];

const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    name: 'General Dentistry',
    description: 'Comprehensive dental exams, tooth fillings, sealants, and preventative wellness consultations.',
    fullDescription: 'Our general dentistry services form the bedrock of your long-term oral health. We perform detailed assessments using intraoral high-def imaging and digital low-radiation X-rays to catch minor issues before they become painful or costly.',
    duration: '45 mins',
    price: '$90 - $180',
    category: 'Preventive',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-2',
    name: 'Teeth Cleaning',
    description: 'Ultrasonic scaling, stain removal, and fluoride enamel strengthening for a fresher, brighter feel.',
    fullDescription: 'Professional ultrasonic prophylaxis clears stubborn tartar (calculus) and plaque from along the gumline that daily brushing misses. Finished with polishing and remineralizing fluoride glaze.',
    duration: '45 mins',
    price: '$120 - $160',
    category: 'Preventive',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-3',
    name: 'Dental Checkup',
    description: 'Routine oral wellness screening, gum health analysis, bite check, and oral cancer evaluation.',
    fullDescription: 'A thorough preventive checkup evaluates tooth density, periodontal pocket depths, restorative integrity, and soft tissue health with zero discomfort.',
    duration: '30 mins',
    price: '$75 - $110',
    category: 'Preventive',
    iconName: 'Search',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-4',
    name: 'Teeth Whitening',
    description: 'In-office advanced LED laser whitening delivering up to 6–8 shades lighter in just one single visit.',
    fullDescription: 'Safely lift deep years of coffee, tea, and aging stains with clinical-grade carbamide formulations powered by cool LED activation that preserves sensitive enamel.',
    duration: '60 mins',
    price: '$250 - $390',
    category: 'Cosmetic',
    iconName: 'Sun',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-5',
    name: 'Root Canal Treatment',
    description: 'Gentle, modern endodontic therapy designed to eliminate infection and relieve toothaches permanently.',
    fullDescription: 'With contemporary rotary endodontics and local numbing anesthetics, root canals are as routine and gentle as a simple filling, preserving your natural tooth structure.',
    duration: '75 mins',
    price: '$450 - $750',
    category: 'Restorative',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-6',
    name: 'Dental Implants',
    description: 'Titanium root replacement topped with custom porcelain crowns for permanent, natural-feeling teeth.',
    fullDescription: 'Restore missing teeth permanently. Implants fuse with your jawbone to prevent bone shrinkage, maintaining youthful facial structure and 100% chewing force.',
    duration: '90 mins',
    price: '$1,200 - $2,500',
    category: 'Restorative',
    iconName: 'Layers',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-7',
    name: 'Braces & Orthodontics',
    description: 'Clear aligners and modern ceramic braces to straighten teeth, fix bite alignment, and enhance speech.',
    fullDescription: 'Whether correcting crowded teeth, spacing, overbites or crossbites, we customize your alignment trajectory using 3D digital smile simulation before you start.',
    duration: '45 mins consultation',
    price: '$2,200 - $4,800',
    category: 'Orthodontics',
    iconName: 'Smile',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-8',
    name: 'Pediatric Dentistry',
    description: 'Fun, fear-free children dental care, fluoride protection, cavity defense, and early habits coaching.',
    fullDescription: 'Our gentle approach creates warm childhood memories. Dr. Elena explains every instrument with playful terms, ensuring your child looks forward to their visits.',
    duration: '40 mins',
    price: '$80 - $140',
    category: 'Pediatric',
    iconName: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-9',
    name: 'Cosmetic Dentistry',
    description: 'Custom porcelain veneers, composite bonding, gum contouring, and aesthetic smile transformations.',
    fullDescription: 'Tailored cosmetic designs harmonized with your unique facial balance. We fix chipped edges, gaps, asymmetrical gum lines, and severe intrinsic discoloration.',
    duration: '60 mins',
    price: '$350 - $900',
    category: 'Cosmetic',
    iconName: 'Award',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-10',
    name: 'Tooth Extraction',
    description: 'Quick and pain-free wisdom tooth removal and simple non-restorable tooth extractions.',
    fullDescription: 'Comfort-first extraction utilizing profound local anesthesia and sedation options if requested. We emphasize bone preservation techniques for future implant readiness.',
    duration: '45 mins',
    price: '$150 - $350',
    category: 'Specialized',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-11',
    name: 'Crowns & Bridges',
    description: 'Durable, lifelike Zirconia and E-max porcelain caps to restore fractured teeth or fill gaps seamlessly.',
    fullDescription: 'Precision 3D CAD/CAM milled crowns designed for exact contact points and shade-matched to your natural teeth for unbreakable biting resilience.',
    duration: '60 mins',
    price: '$650 - $1,100',
    category: 'Restorative',
    iconName: 'CheckCircle2',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-12',
    name: 'Emergency Dental Care',
    description: 'Same-day urgent relief for acute toothaches, knocked-out teeth, broken restorations, or facial swelling.',
    fullDescription: 'Dental emergencies need rapid intervention. We keep daily reserved slots to get you out of pain immediately, stop bleeding, and secure vulnerable teeth.',
    duration: '30 - 60 mins',
    price: '$120 - $250',
    category: 'Emergency',
    iconName: 'Flame',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Michael Reynolds',
    rating: 5,
    comment: 'Dr. Sharma and the entire team were extremely professional and caring. The clinic is clean, modern, and the treatment experience was excellent. My whitening and bonding gave me back confidence.',
    procedure: 'Teeth Whitening & Bonding',
    date: '2 weeks ago',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verified: true
  },
  {
    id: 'test-2',
    name: 'Amanda Brooks',
    rating: 5,
    comment: 'I used to dread going to the dentist until I visited SmileCare. Dr. Marcus Vance explained my Invisalign plan in 3D, and the entire appointment booking on their site was completely hassle-free!',
    procedure: 'Invisalign Orthodontics',
    date: '1 month ago',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    verified: true
  },
  {
    id: 'test-3',
    name: 'David Chen',
    rating: 5,
    comment: 'Needed an emergency root canal when a crown broke over the weekend. They took me in the same afternoon and eliminated all my pain in one visit. Genuinely hygienic and caring doctors.',
    procedure: 'Emergency Root Canal',
    date: '3 weeks ago',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verified: true
  },
  {
    id: 'test-4',
    name: 'Jessica Taylor',
    rating: 5,
    comment: 'Dr. Elena was wonderful with my 6-year old daughter. No tears, just smiles, stickers, and a gentle checkup. Best pediatric dental experience we have ever had!',
    procedure: 'Pediatric Dental Checkup',
    date: 'Just recently',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    verified: true
  },
  {
    id: 'test-5',
    name: 'Robert Sullivan',
    rating: 5,
    comment: 'Dr. Sarah Chen did two dental implants for me. The digital 3D planning was fascinating and the healing was fast with minimal swelling. Cleanest clinic I have seen in New York.',
    procedure: 'Dental Implants',
    date: '2 months ago',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    verified: true
  }
];

const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Booking & Visits',
    question: 'How do I book an appointment?',
    answer: 'Booking is quick and simple! Click the "Book Appointment" button on this website, choose your required service and preferred dentist, pick a convenient date and time, enter your contact details, and submit. You will instantly receive a unique reference code, and our clinic team will confirm with you.'
  },
  {
    id: 'faq-2',
    category: 'Emergencies',
    question: 'Do you accept emergency dental cases?',
    answer: 'Yes! We prioritize same-day emergency dental appointments for acute tooth pain, broken teeth, knocked-out teeth, lost fillings, and swollen gums. Call our emergency helpline directly or select "Emergency Dental Care" in the booking portal.'
  },
  {
    id: 'faq-3',
    category: 'General Care',
    question: 'How often should I visit the dentist?',
    answer: 'The American Dental Association recommends a routine dental checkup and professional cleaning every 6 months. Patients with higher risk factors (such as gum disease, orthodontic appliances, or diabetes) may benefit from checkups every 3 to 4 months.'
  },
  {
    id: 'faq-4',
    category: 'Pediatric Care',
    question: 'Do you provide children’s dental care?',
    answer: 'Absolutely. Dr. Elena Rostova specializes in pediatric dentistry, providing compassionate, gentle checkups, sealants, fluoride treatments, and preventative guidance in a child-friendly, relaxing clinic environment.'
  },
  {
    id: 'faq-5',
    category: 'Treatments',
    question: 'How long does a dental cleaning take?',
    answer: 'A standard professional prophylaxis cleaning typically takes between 40 to 50 minutes. If a deeper periodontal scaling or comprehensive initial exam with digital X-rays is required, it may take about 60 minutes.'
  },
  {
    id: 'faq-6',
    category: 'Cosmetics',
    question: 'Do you offer teeth whitening?',
    answer: 'Yes, we offer both in-office LED laser whitening (which can brighten teeth up to 8 shades in a single 60-minute session) and custom-fitted take-home whitening trays with medical-grade peroxide gel.'
  },
  {
    id: 'faq-7',
    category: 'Payment & Insurance',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, Amex), debit cards, cash, contactless payments (Apple Pay, Google Pay), and flexible 0% interest dental financing plans (CareCredit). We also accept and file claims with all major PPO dental insurance providers.'
  }
];

// Helper to get formatted dates relative to today
function getRelativeDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Emily Watson',
    phone: '+1 (555) 234-8901',
    email: 'emily.watson@example.com',
    age: 29,
    is_new_patient: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'pat-2',
    name: 'Carlos Mendez',
    phone: '+1 (555) 345-6712',
    email: 'carlos.mendez@example.com',
    age: 42,
    is_new_patient: false,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'pat-3',
    name: 'Olivia Jenkins',
    phone: '+1 (555) 456-7823',
    email: 'olivia.j@example.com',
    age: 35,
    is_new_patient: false,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'pat-4',
    name: 'Liam Peterson',
    phone: '+1 (555) 678-9034',
    email: 'liam.peterson@example.com',
    age: 8,
    is_new_patient: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'pat-5',
    name: 'Sophia Martinez',
    phone: '+1 (555) 789-0145',
    email: 'sophia.m@example.com',
    age: 51,
    is_new_patient: false,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    patient_id: 'pat-1',
    doctor_id: 'doc-1',
    service_id: 'serv-4',
    appointment_date: getRelativeDateString(0), // Today
    appointment_time: '10:30 AM',
    reason: 'Wants teeth whitening consultation and in-office treatment before wedding.',
    notes: 'Patient sensitive to cold liquids. Prepared desensitizing gel.',
    is_new_patient: true,
    status: 'Confirmed',
    appointment_reference: 'SC-8491-WHIT',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'app-2',
    patient_id: 'pat-2',
    doctor_id: 'doc-3',
    service_id: 'serv-6',
    appointment_date: getRelativeDateString(0), // Today
    appointment_time: '02:00 PM',
    reason: 'Follow-up on lower right molar implant healing and screw check.',
    notes: '3D scan shows optimal osseointegration. Final crown impression ready.',
    is_new_patient: false,
    status: 'Pending',
    appointment_reference: 'SC-3920-IMPL',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'app-3',
    patient_id: 'pat-3',
    doctor_id: 'doc-2',
    service_id: 'serv-7',
    appointment_date: getRelativeDateString(1), // Tomorrow
    appointment_time: '11:00 AM',
    reason: 'Routine aligner tray fitting and progress check (Tray #14).',
    notes: 'Upper premolar tracking nicely. Next 4 trays ready for delivery.',
    is_new_patient: false,
    status: 'Confirmed',
    appointment_reference: 'SC-7104-ORTH',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'app-4',
    patient_id: 'pat-4',
    doctor_id: 'doc-4',
    service_id: 'serv-8',
    appointment_date: getRelativeDateString(2), // In 2 days
    appointment_time: '09:30 AM',
    reason: 'First time pediatric dental cleaning and fluoride checkup.',
    notes: 'Parent mentioned child is slightly timid with new doctors.',
    is_new_patient: true,
    status: 'Pending',
    appointment_reference: 'SC-5521-PED',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'app-5',
    patient_id: 'pat-5',
    doctor_id: 'doc-1',
    service_id: 'serv-5',
    appointment_date: getRelativeDateString(-2), // 2 days ago
    appointment_time: '03:30 PM',
    reason: 'Toothache in upper left bicuspid.',
    notes: 'Root canal therapy completed successfully. Prescribed post-care rinse.',
    is_new_patient: false,
    status: 'Completed',
    appointment_reference: 'SC-9102-ENDO',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'app-6',
    patient_id: 'pat-1',
    doctor_id: 'doc-2',
    service_id: 'serv-2',
    appointment_date: getRelativeDateString(-5),
    appointment_time: '01:15 PM',
    reason: 'General teeth cleaning.',
    notes: 'Patient requested reschedule due to work flight.',
    is_new_patient: true,
    status: 'Rescheduled',
    appointment_reference: 'SC-2094-CLEAN',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Error reading database file, resetting to initial seed:', e);
    }

    const defaultData: DatabaseSchema = {
      clinic: INITIAL_CLINIC,
      doctors: INITIAL_DOCTORS,
      services: INITIAL_SERVICES,
      patients: INITIAL_PATIENTS,
      appointments: INITIAL_APPOINTMENTS,
      testimonials: INITIAL_TESTIMONIALS,
      faqs: INITIAL_FAQS,
      contactMessages: []
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error persisting database:', e);
    }
  }

  public getClinic(): ClinicInfo {
    return this.data.clinic;
  }

  public getDoctors(): Doctor[] {
    return this.data.doctors;
  }

  public getServices(): Service[] {
    return this.data.services;
  }

  public getTestimonials(): Testimonial[] {
    return this.data.testimonials;
  }

  public getFaqs(): FaqItem[] {
    return this.data.faqs;
  }

  // Sanitized appointment lookup for patients by reference code + phone or email match
  public lookupAppointment(ref: string, verificationInput?: string): PopulatedAppointment | null {
    const cleanRef = ref.trim().toUpperCase();
    const app = this.data.appointments.find(a => a.appointment_reference.toUpperCase() === cleanRef);
    if (!app) return null;

    const patient = this.data.patients.find(p => p.id === app.patient_id);
    if (!patient) return null;

    if (verificationInput) {
      const v = verificationInput.trim().toLowerCase();
      const phoneDigits = patient.phone.replace(/\D/g, '');
      const inputDigits = v.replace(/\D/g, '');
      const emailMatch = patient.email.toLowerCase() === v;
      const phoneMatch = inputDigits.length >= 7 && (phoneDigits.includes(inputDigits) || inputDigits.includes(phoneDigits));
      if (!emailMatch && !phoneMatch) {
        return null;
      }
    }

    const doctor = this.data.doctors.find(d => d.id === app.doctor_id);
    const service = this.data.services.find(s => s.id === app.service_id);

    // Return sanitized patient info (no full list or other credentials)
    return {
      ...app,
      patient: {
        id: patient.id,
        name: patient.name,
        phone: patient.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1-****-$2'),
        email: patient.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        age: patient.age,
        created_at: patient.created_at
      },
      doctor,
      service
    };
  }

  // Admin: Get all appointments populated with patient, doctor, and service
  public getAllPopulatedAppointments(filters?: {
    date?: string;
    doctorId?: string;
    serviceId?: string;
    status?: string;
    search?: string;
  }): PopulatedAppointment[] {
    let list = this.data.appointments.map(app => {
      const patient = this.data.patients.find(p => p.id === app.patient_id);
      const doctor = this.data.doctors.find(d => d.id === app.doctor_id);
      const service = this.data.services.find(s => s.id === app.service_id);
      return {
        ...app,
        patient,
        doctor,
        service
      };
    });

    if (filters) {
      if (filters.date) {
        list = list.filter(a => a.appointment_date === filters.date);
      }
      if (filters.doctorId && filters.doctorId !== 'all') {
        list = list.filter(a => a.doctor_id === filters.doctorId);
      }
      if (filters.serviceId && filters.serviceId !== 'all') {
        list = list.filter(a => a.service_id === filters.serviceId);
      }
      if (filters.status && filters.status !== 'all') {
        list = list.filter(a => a.status.toLowerCase() === filters.status!.toLowerCase());
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        list = list.filter(a => {
          return (
            a.appointment_reference.toLowerCase().includes(q) ||
            (a.patient?.name && a.patient.name.toLowerCase().includes(q)) ||
            (a.patient?.phone && a.patient.phone.includes(q)) ||
            (a.patient?.email && a.patient.email.toLowerCase().includes(q)) ||
            (a.reason && a.reason.toLowerCase().includes(q))
          );
        });
      }
    }

    // Sort descending by appointment date and time
    return list.sort((a, b) => new Date(b.appointment_date + 'T' + (b.created_at || '00:00')).getTime() - new Date(a.appointment_date + 'T' + (a.created_at || '00:00')).getTime());
  }

  // Admin stats computation
  public getAdminStats(): AdminStats {
    const today = new Date().toISOString().split('T')[0];
    const total = this.data.appointments.length;
    let todayAppointments = 0;
    let upcomingAppointments = 0;
    let pendingRequests = 0;
    let completedAppointments = 0;
    let cancelledAppointments = 0;

    for (const app of this.data.appointments) {
      if (app.status === 'Pending') {
        pendingRequests++;
      } else if (app.status === 'Completed') {
        completedAppointments++;
      } else if (app.status === 'Cancelled') {
        cancelledAppointments++;
      }

      if (app.appointment_date === today) {
        todayAppointments++;
      } else if (app.appointment_date > today && app.status !== 'Cancelled') {
        upcomingAppointments++;
      }
    }

    return {
      todayAppointments,
      upcomingAppointments,
      pendingRequests,
      completedAppointments,
      cancelledAppointments,
      totalAppointments: total
    };
  }

  // Public Booking workflow: Create or reuse patient, generate unique reference, create appointment
  public bookAppointment(formData: BookingFormData): PopulatedAppointment {
    // 1. Locate or create patient
    let patient = this.data.patients.find(
      p => p.email.toLowerCase() === formData.email.trim().toLowerCase() ||
           p.phone.replace(/\D/g, '') === formData.phone.replace(/\D/g, '')
    );

    const nowIso = new Date().toISOString();

    if (!patient) {
      patient = {
        id: `pat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        age: Number(formData.age) || 30,
        is_new_patient: formData.isNewPatient ?? true,
        created_at: nowIso
      };
      this.data.patients.push(patient);
    } else {
      // Update age or phone if newer
      patient.name = formData.fullName.trim() || patient.name;
      patient.age = Number(formData.age) || patient.age;
      patient.phone = formData.phone.trim() || patient.phone;
    }

    // 2. Generate unique human-readable reference code: SC-XXXX-XXXX
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const serviceObj = this.data.services.find(s => s.id === formData.serviceId);
    const serviceTag = serviceObj ? serviceObj.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'DENT') : 'DENT';
    const reference = `SC-${randomHex}-${serviceTag}`;

    // 3. Create appointment
    const newAppointment: Appointment = {
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patient_id: patient.id,
      doctor_id: formData.doctorId,
      service_id: formData.serviceId,
      appointment_date: formData.preferredDate,
      appointment_time: formData.preferredTime,
      reason: formData.reason.trim(),
      notes: formData.additionalMessage ? formData.additionalMessage.trim() : '',
      is_new_patient: formData.isNewPatient ?? true,
      status: 'Pending',
      appointment_reference: reference,
      created_at: nowIso
    };

    this.data.appointments.unshift(newAppointment);
    this.saveData();

    const doctor = this.data.doctors.find(d => d.id === newAppointment.doctor_id);

    return {
      ...newAppointment,
      patient,
      doctor,
      service: serviceObj
    };
  }

  // Update appointment status (Confirm, Complete, Cancel, Reschedule)
  public updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string): PopulatedAppointment | null {
    const app = this.data.appointments.find(a => a.id === id);
    if (!app) return null;

    app.status = status;
    if (notes !== undefined) {
      app.notes = notes;
    }
    this.saveData();

    const patient = this.data.patients.find(p => p.id === app.patient_id);
    const doctor = this.data.doctors.find(d => d.id === app.doctor_id);
    const service = this.data.services.find(s => s.id === app.service_id);

    return {
      ...app,
      patient,
      doctor,
      service
    };
  }

  // Reschedule appointment date, time, and doctor
  public rescheduleAppointment(id: string, details: {
    appointment_date: string;
    appointment_time: string;
    doctor_id?: string;
    notes?: string;
  }): PopulatedAppointment | null {
    const app = this.data.appointments.find(a => a.id === id);
    if (!app) return null;

    app.appointment_date = details.appointment_date;
    app.appointment_time = details.appointment_time;
    if (details.doctor_id) {
      app.doctor_id = details.doctor_id;
    }
    if (details.notes) {
      app.notes = (app.notes ? app.notes + ' | ' : '') + details.notes;
    }
    app.status = 'Rescheduled';
    this.saveData();

    const patient = this.data.patients.find(p => p.id === app.patient_id);
    const doctor = this.data.doctors.find(d => d.id === app.doctor_id);
    const service = this.data.services.find(s => s.id === app.service_id);

    return {
      ...app,
      patient,
      doctor,
      service
    };
  }

  // Delete appointment
  public deleteAppointment(id: string): boolean {
    const index = this.data.appointments.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.data.appointments.splice(index, 1);
    this.saveData();
    return true;
  }

  // Contact form submission
  public saveContactMessage(msg: { name: string; email: string; phone: string; message: string }) {
    const item = {
      id: `msg-${Date.now()}`,
      name: msg.name.trim(),
      email: msg.email.trim(),
      phone: msg.phone.trim(),
      message: msg.message.trim(),
      created_at: new Date().toISOString()
    };
    this.data.contactMessages.push(item);
    this.saveData();
    return item;
  }
}

export const db = new DatabaseManager();
