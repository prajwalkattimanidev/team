import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { DoctorsSection } from './components/DoctorsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { TrackAppointmentModal } from './components/TrackAppointmentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PolicyModal } from './components/PolicyModals';
import { ClinicData, Doctor, FaqItem, Service, Testimonial } from './types';
import { API } from './utils/api';

export default function App() {
  // Clinic data state
  const [clinicData, setClinicData] = useState<ClinicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View Navigation
  const [currentView, setCurrentView] = useState<'website' | 'booking-page' | 'admin'>('website');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();

  // Tracking Modal State
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  // Policy Modal State
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  // Load clinic data from backend
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await API.getClinicData();
        setClinicData(data);
      } catch (err: any) {
        console.error('Failed to load clinic data:', err);
        setError('Failed to load clinic information. Please check connection.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handlers for booking triggers
  const handleOpenBooking = (serviceId?: string, doctorId?: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedServiceId(undefined);
    setSelectedDoctorId(undefined);
  };

  if (isLoading && !clinicData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-700 flex items-center justify-center text-white shadow-lg animate-bounce">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.5 2 6 4 6 7c0 2 .5 4 1.5 6.5C8.5 16 10 20 10 22c.2.2.5.3.8.3s.6-.1.8-.4c.8-1.5 1.4-3.5 1.4-5.4 0-1.2.2-2.5.5-3.5.3 1 .5 2.3.5 3.5 0 1.9.6 3.9 1.4 5.4.2.3.5.4.8.4s.6-.1.8-.3c0-2 1.5-6 2.5-8.5C20.5 11 21 9 21 7c0-3-2.5-5-6-5-1 0-2 .4-3 1-1-.6-2-1-3-1z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading SmileCare Dental Clinic...</p>
      </div>
    );
  }

  if (error && !clinicData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Issue</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-800"
          >
            Reload Website
          </button>
        </div>
      </div>
    );
  }

  const { clinic, services, doctors, testimonials, faqs } = clinicData!;

  // If Admin View is active
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onBackToWebsite={() => setCurrentView('website')}
        services={services}
        doctors={doctors}
        onOpenBooking={() => handleOpenBooking()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        clinic={clinic}
        onOpenBooking={() => handleOpenBooking()}
        onOpenTracking={() => setIsTrackOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Main Website View */}
      {currentView === 'booking-page' ? (
        <div className="pt-20">
          <BookingModal
            isOpen={true}
            isStandalonePage={true}
            onClose={() => setCurrentView('website')}
            services={services}
            doctors={doctors}
            initialServiceId={selectedServiceId}
            initialDoctorId={selectedDoctorId}
          />
        </div>
      ) : (
        <main className="flex-grow">
          {/* Hero Section */}
          <Hero
            clinic={clinic}
            onBookAppointment={() => handleOpenBooking()}
            onExploreServices={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* About Clinic Section */}
          <AboutSection
            onOpenBooking={() => handleOpenBooking()}
          />

          {/* Dental Services Section */}
          <ServicesSection
            services={services}
            onBookService={(serviceId) => handleOpenBooking(serviceId)}
          />

          {/* Specialists & Dental Team Section */}
          <DoctorsSection
            doctors={doctors}
            onBookDoctor={(doctorId) => handleOpenBooking(undefined, doctorId)}
          />

          {/* Why Choose Us Section */}
          <WhyChooseUs
            onBookAppointment={() => handleOpenBooking()}
          />

          {/* Patient Testimonials Section */}
          <TestimonialsSection
            testimonials={testimonials}
            onBookNow={() => handleOpenBooking()}
          />

          {/* Frequently Asked Questions Accordion */}
          <FaqSection
            faqs={faqs}
            onOpenBooking={() => handleOpenBooking()}
            onContactSupport={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Contact Section & Map */}
          <ContactSection
            clinic={clinic}
            onBookAppointment={() => handleOpenBooking()}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        clinic={clinic}
        services={services}
        onOpenBooking={() => handleOpenBooking()}
        onOpenTracking={() => setIsTrackOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        onSelectService={(serviceId) => handleOpenBooking(serviceId)}
        onOpenPolicy={(type) => setPolicyType(type)}
      />

      {/* Booking Modal (Popup) */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        services={services}
        doctors={doctors}
        initialServiceId={selectedServiceId}
        initialDoctorId={selectedDoctorId}
      />

      {/* Track Appointment Status Modal */}
      <TrackAppointmentModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />

      {/* Policy & Terms Modal */}
      <PolicyModal
        isOpen={policyType !== null}
        type={policyType}
        onClose={() => setPolicyType(null)}
      />

    </div>
  );
}
