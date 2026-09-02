import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Clock, 
  Copy, 
  HelpCircle, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  User, 
  X 
} from 'lucide-react';
import { BookingFormData, Doctor, PopulatedAppointment, Service } from '../types';
import { API } from '../utils/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  doctors: Doctor[];
  initialServiceId?: string;
  initialDoctorId?: string;
  isStandalonePage?: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  doctors,
  initialServiceId,
  initialDoctorId,
  isStandalonePage = false,
}) => {
  // Form State
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    isNewPatient: true,
    serviceId: initialServiceId || (services[0]?.id || ''),
    doctorId: initialDoctorId || (doctors[0]?.id || ''),
    preferredDate: '',
    preferredTime: '10:00 AM',
    reason: '',
    additionalMessage: '',
  });

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<PopulatedAppointment | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Time Slots
  const availableTimeSlots = [
    '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
    '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM',
    '04:30 PM', '05:15 PM', '06:00 PM', '07:00 PM'
  ];

  // Update initial selections if passed
  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
    if (initialDoctorId) {
      setFormData(prev => ({ ...prev, doctorId: initialDoctorId }));
    }
  }, [initialServiceId, initialDoctorId]);

  // Set default min date to tomorrow
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name.';
    }

    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || phoneClean.length < 7) {
      errs.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    const numAge = Number(formData.age);
    if (!formData.age || isNaN(numAge) || numAge < 1 || numAge > 120) {
      errs.age = 'Please enter a valid age (1-120).';
    }

    if (!formData.serviceId) {
      errs.serviceId = 'Please select a dental service.';
    }

    if (!formData.doctorId) {
      errs.doctorId = 'Please select a preferred dentist.';
    }

    if (!formData.preferredDate) {
      errs.preferredDate = 'Please select your preferred appointment date.';
    }

    if (!formData.preferredTime) {
      errs.preferredTime = 'Please select a preferred time slot.';
    }

    if (!formData.reason.trim()) {
      errs.reason = 'Please provide a brief reason for your dental visit.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error on mobile
      const firstError = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstError}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await API.bookAppointment(formData);
      setConfirmedAppointment(response.appointment);
      setSubmissionSuccess(true);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit appointment. Please try again or call our clinic.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (confirmedAppointment?.appointment_reference) {
      navigator.clipboard.writeText(confirmedAppointment.appointment_reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handleReset = () => {
    setSubmissionSuccess(false);
    setConfirmedAppointment(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      age: '',
      isNewPatient: true,
      serviceId: services[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      preferredDate: '',
      preferredTime: '10:00 AM',
      reason: '',
      additionalMessage: '',
    });
    if (!isStandalonePage) onClose();
  };

  if (!isOpen && !isStandalonePage) return null;

  const selectedServiceObj = services.find(s => s.id === formData.serviceId);
  const selectedDoctorObj = doctors.find(d => d.id === formData.doctorId);

  return (
    <div className={isStandalonePage ? 'min-h-screen py-10 bg-slate-50' : 'fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6'}>
      <div 
        id="appointment-booking-container"
        className={`bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden relative ${isStandalonePage ? 'mx-auto' : 'my-8'}`}
      >
        
        {/* Modal Close Button */}
        {!isStandalonePage && (
          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Top Branding Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 text-white p-6 sm:p-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Online Patient Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Book Your Dental Appointment
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
            Schedule a convenient visit with our dental team in under two minutes. We will confirm your time and send appointment instructions.
          </p>
        </div>

        {/* Successful Submission View */}
        {submissionSuccess && confirmedAppointment ? (
          <div id="booking-confirmation-view" className="p-6 sm:p-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                Appointment Requested
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Thank You, {confirmedAppointment.patient?.name}!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Your appointment request has been submitted successfully. Our clinic team will contact you shortly to confirm your appointment.
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="bg-sky-50/80 border border-sky-200/70 rounded-2xl p-5 max-w-md mx-auto space-y-2 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>Your Appointment Reference</span>
                <span className="text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded text-[10px] font-bold">SAVE THIS</span>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-blue-900 tracking-wider">
                  {confirmedAppointment.appointment_reference}
                </span>
                <button
                  id="copy-reference-btn"
                  onClick={handleCopyReference}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 hover:text-blue-700 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                You can use this reference code to check your booking status in the "Track Appointment" section anytime.
              </p>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block uppercase font-medium text-[10px]">Service</span>
                <span className="font-bold text-slate-800 text-sm">{confirmedAppointment.service?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-medium text-[10px]">Assigned Dentist</span>
                <span className="font-bold text-slate-800 text-sm">{confirmedAppointment.doctor?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-medium text-[10px]">Date & Time</span>
                <span className="font-bold text-slate-800 text-sm">{confirmedAppointment.appointment_date} at {confirmedAppointment.appointment_time}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-medium text-[10px]">Patient Type</span>
                <span className="font-bold text-slate-800 text-sm">{confirmedAppointment.is_new_patient ? 'New Patient' : 'Existing Patient'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="book-another-btn"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Main Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {errors.form && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Section 1: Patient Information */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>1. Patient Information</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div id="field-fullName" className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-booking-fullname"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 font-medium">{errors.fullName}</p>}
                </div>

                {/* Phone Number */}
                <div id="field-phone" className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-booking-phone"
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 234-5678"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
                </div>

                {/* Email Address */}
                <div id="field-email" className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-booking-email"
                    type="email"
                    required
                    placeholder="e.g. sarah.jenkins@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
                </div>

                {/* Patient Age & New/Existing Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <div id="field-age" className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-booking-age"
                      type="number"
                      required
                      min="1"
                      max="120"
                      placeholder="e.g. 32"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.age ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                      }`}
                    />
                    {errors.age && <p className="text-[11px] text-red-500 font-medium">{errors.age}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Patient Type
                    </label>
                    <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                      <button
                        type="button"
                        id="patient-type-new"
                        onClick={() => setFormData({ ...formData, isNewPatient: true })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          formData.isNewPatient ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        New
                      </button>
                      <button
                        type="button"
                        id="patient-type-existing"
                        onClick={() => setFormData({ ...formData, isNewPatient: false })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          !formData.isNewPatient ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Existing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Appointment Details */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>2. Appointment Information</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Service */}
                <div id="field-serviceId" className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Dental Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="select-booking-service"
                    value={formData.serviceId}
                    onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.duration} • {s.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Dentist */}
                <div id="field-doctorId" className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Preferred Dentist <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="select-booking-doctor"
                    value={formData.doctorId}
                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date */}
                <div id="field-preferredDate" className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-booking-date"
                    type="date"
                    required
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={formData.preferredDate}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.preferredDate ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.preferredDate && <p className="text-[11px] text-red-500 font-medium">{errors.preferredDate}</p>}
                </div>

                {/* Preferred Time Slot */}
                <div id="field-preferredTime" className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Preferred Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="select-booking-time"
                    value={formData.preferredTime}
                    onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {availableTimeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason for Visit */}
              <div id="field-reason" className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Reason for Visit / Symptoms <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-booking-reason"
                  type="text"
                  required
                  placeholder="e.g. Routine checkup and cleaning, or tooth pain on upper molar"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.reason ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                  }`}
                />
                {errors.reason && <p className="text-[11px] text-red-500 font-medium">{errors.reason}</p>}
              </div>

              {/* Additional Message / Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Additional Message / Medical Notes (Optional)
                </label>
                <textarea
                  id="input-booking-notes"
                  rows={2}
                  placeholder="Any medical conditions, dental phobia, or special requests..."
                  value={formData.additionalMessage}
                  onChange={e => setFormData({ ...formData, additionalMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Privacy & Guarantee note */}
            <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 text-xs text-slate-600 border border-slate-200/70">
              <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span>
                Your health data is protected and confidential. We never share patient records with third parties.
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              {!isStandalonePage && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                id="submit-booking-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-700/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-sky-200" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
