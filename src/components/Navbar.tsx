import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Menu, 
  Phone, 
  Search, 
  Shield, 
  Sparkles, 
  UserCheck, 
  X 
} from 'lucide-react';
import { ClinicInfo } from '../types';

interface NavbarProps {
  clinic: ClinicInfo;
  onOpenBooking: (prefill?: { serviceId?: string; doctorId?: string }) => void;
  onOpenTracking: () => void;
  onToggleAdmin: () => void;
  activeView: 'home' | 'booking' | 'admin';
  setActiveView: (view: 'home' | 'booking' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  clinic,
  onOpenBooking,
  onOpenTracking,
  onToggleAdmin,
  activeView,
  setActiveView,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Banner with clinic contact info & quick actions */}
      <div id="top-announcement-bar" className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-teal-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Accepting New Patients & Emergency Cases
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Mon-Sat: 9:00 AM – 8:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              id="top-emergency-phone"
              href={`tel:${clinic.emergencyPhone.replace(/\D/g, '')}`} 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold">{clinic.phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              id="nav-track-booking-btn"
              onClick={onOpenTracking}
              className="flex items-center gap-1 text-slate-300 hover:text-teal-300 transition-colors font-medium text-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Track Appointment
            </button>
            <span className="text-slate-600">|</span>
            <button
              id="nav-staff-portal-btn"
              onClick={onToggleAdmin}
              className="flex items-center gap-1 text-slate-400 hover:text-teal-300 transition-colors text-xs cursor-pointer"
              title="Staff & Clinic Management Portal"
            >
              <Shield className="w-3 h-3 text-teal-500" />
              Staff Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        id="main-navigation-header"
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button 
            id="nav-logo-btn"
            onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 6 4 6 7c0 2 .5 4 1.5 6.5C8.5 16 10 20 10 22c.2.2.5.3.8.3s.6-.1.8-.4c.8-1.5 1.4-3.5 1.4-5.4 0-1.2.2-2.5.5-3.5.3 1 .5 2.3.5 3.5 0 1.9.6 3.9 1.4 5.4.2.3.5.4.8.4s.6-.1.8-.3c0-2 1.5-6 2.5-8.5C20.5 11 21 9 21 7c0-3-2.5-5-6-5-1 0-2 .4-3 1-1-.6-2-1-3-1z" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1">
                Smile<span className="text-sky-600">Care</span>
              </div>
              <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">Dental Clinic</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              id="nav-link-home"
              onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeView === 'home' ? 'text-blue-700 font-semibold bg-sky-50' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-link-about"
              onClick={() => scrollToSection('about')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              About Us
            </button>
            <button
              id="nav-link-services"
              onClick={() => scrollToSection('services')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              id="nav-link-doctors"
              onClick={() => scrollToSection('doctors')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Doctors
            </button>
            <button
              id="nav-link-why-us"
              onClick={() => scrollToSection('why-us')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Why Us
            </button>
            <button
              id="nav-link-testimonials"
              onClick={() => scrollToSection('testimonials')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Testimonials
            </button>
            <button
              id="nav-link-faq"
              onClick={() => scrollToSection('faq')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              id="nav-link-contact"
              onClick={() => scrollToSection('contact')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="nav-book-appointment-btn"
              onClick={() => onOpenBooking()}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-book-btn-compact"
              onClick={() => onOpenBooking()}
              className="sm:hidden inline-flex items-center gap-1.5 bg-blue-700 text-white font-semibold text-xs px-3 py-2 rounded-lg"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div id="mobile-navigation-drawer" className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <button
              id="mobile-nav-home"
              onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              Home
            </button>
            <button
              id="mobile-nav-about"
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              About Us
            </button>
            <button
              id="mobile-nav-services"
              onClick={() => scrollToSection('services')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              Dental Services
            </button>
            <button
              id="mobile-nav-doctors"
              onClick={() => scrollToSection('doctors')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              Our Dentists
            </button>
            <button
              id="mobile-nav-why-us"
              onClick={() => scrollToSection('why-us')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              Why Choose Us
            </button>
            <button
              id="mobile-nav-testimonials"
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              Patient Testimonials
            </button>
            <button
              id="mobile-nav-faq"
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              Frequently Asked Questions
            </button>
            <button
              id="mobile-nav-contact"
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-sky-50"
            >
              Contact Us
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                id="mobile-nav-track-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenTracking(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50"
              >
                <Search className="w-4 h-4 text-slate-500" />
                Track My Appointment
              </button>
              <button
                id="mobile-nav-book-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-700 text-white font-semibold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Book an Appointment
              </button>
              <button
                id="mobile-nav-admin-btn"
                onClick={() => { setMobileMenuOpen(false); onToggleAdmin(); }}
                className="w-full text-center py-2 text-xs text-slate-500 hover:text-slate-800"
              >
                Clinic Staff Administration Portal
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
