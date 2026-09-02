import React, { useState } from 'react';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  ShieldCheck, 
  User, 
  X 
} from 'lucide-react';
import { PopulatedAppointment } from '../types';
import { API } from '../utils/api';

interface TrackAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackAppointmentModal: React.FC<TrackAppointmentModalProps> = ({ isOpen, onClose }) => {
  const [reference, setReference] = useState('');
  const [verification, setVerification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<PopulatedAppointment | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      setError('Please enter your appointment reference code.');
      return;
    }

    setLoading(true);
    setError(null);
    setAppointment(null);

    try {
      const res = await API.lookupAppointment(reference.trim(), verification.trim() || undefined);
      setAppointment(res.appointment);
    } catch (err: any) {
      setError(err.message || 'Unable to locate appointment. Please double check your reference code.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">Confirmed</span>;
      case 'Completed':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200">Cancelled</span>;
      case 'Rescheduled':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-200">Rescheduled</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">Pending Clinic Confirmation</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Track Dental Appointment</h3>
          <p className="text-xs text-slate-500">
            Enter your unique booking reference number provided upon submission to view current scheduling status.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Appointment Reference <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SC-8491-WHIT"
              value={reference}
              onChange={e => setReference(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 uppercase font-mono font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Registered Phone or Email (For Verification)
            </label>
            <input
              type="text"
              placeholder="e.g. (555) 234-8901 or your@email.com"
              value={verification}
              onChange={e => setVerification(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Quick hint: Try seed reference <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">SC-8491-WHIT</code></span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Looking up record...' : 'Lookup Appointment'}
          </button>
        </form>

        {appointment && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Current Status</span>
                <div className="mt-1">{getStatusBadge(appointment.status)}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Reference</span>
                <span className="font-mono text-sm font-bold text-blue-900">{appointment.appointment_reference}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-800">{appointment.patient?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800">{appointment.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-semibold text-slate-800">{appointment.doctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-semibold text-slate-800">{appointment.appointment_date} at {appointment.appointment_time}</span>
              </div>
              {appointment.notes && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 block mb-0.5">Clinic Notes:</span>
                  <span className="text-slate-700 italic">{appointment.notes}</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Need to change or cancel? Call our reception at (800) 555-7645</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
