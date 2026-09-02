import React, { useState } from 'react';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  Sparkles 
} from 'lucide-react';
import { ClinicInfo } from '../types';
import { API } from '../utils/api';

interface ContactSectionProps {
  clinic: ClinicInfo;
  onBookAppointment: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ clinic, onBookAppointment }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await API.sendContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to send message. Please try again or call us.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            We’re Here for Your Dental Needs
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Have an inquiry or seeking guidance before your visit? Reach out via phone, email, or message below.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Cards & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact Cards */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-5">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinic Address</h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{clinic.address}</p>
                  <p className="text-xs text-slate-600">{clinic.city}</p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-200/60">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments & Inquiries</h4>
                  <a href={`tel:${clinic.phone.replace(/\D/g, '')}`} className="text-sm font-bold text-blue-700 hover:underline block mt-0.5">
                    {clinic.phone}
                  </a>
                  <p className="text-xs text-rose-600 font-semibold mt-0.5">
                    Emergency: {clinic.emergencyPhone}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-200/60">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Us</h4>
                  <a href={`mailto:${clinic.email}`} className="text-sm font-semibold text-slate-800 hover:text-blue-700 mt-0.5 block">
                    {clinic.email}
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-200/60">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinic Working Hours</h4>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{clinic.hoursWeekday}</p>
                  <p className="text-xs text-slate-600 font-medium">{clinic.hoursWeekend}</p>
                </div>
              </div>

            </div>

            {/* Two Action Buttons: Call Us & Book Appointment */}
            <div className="grid grid-cols-2 gap-3">
              <a
                id="contact-call-us-btn"
                href={`tel:${clinic.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Call Us Now</span>
              </a>

              <button
                id="contact-book-appointment-btn"
                onClick={onBookAppointment}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                <Calendar className="w-4 h-4 text-sky-200" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Interactive Google Map Embed */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-56 w-full shadow-xs relative bg-slate-100">
              <iframe
                title="SmileCare Dental Clinic Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.428784139886!2d-73.985130!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU1LjciTiA3M8KwNTknMDYuNSJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out this form and our clinical coordinator will respond to your questions within 2 hours during normal clinic operation hours.
            </p>

            {status === 'success' && (
              <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Thank you! Your message has been received. Our clinical staff will contact you shortly.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Message / Inquiry Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what procedure you're interested in or how we can help..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'loading' ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
