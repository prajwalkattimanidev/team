import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {type === 'privacy' ? 'Patient Privacy Policy (HIPAA Compliant)' : 'Terms of Dental Care & Services'}
            </h3>
            <span className="text-xs text-slate-500">SmileCare Dental Clinic Patient Safeguards</span>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>1. Patient Health Information Security:</strong> SmileCare Dental Clinic complies with international medical records privacy standards (including HIPAA). All personal and clinical information provided through our online appointment booking is stored in encrypted, access-restricted databases.
              </p>
              <p>
                <strong>2. Use of Information:</strong> Contact details (phone and email) are utilized strictly for appointment scheduling, clinical follow-ups, and dental emergency notifications. We will never sell, rent, or distribute patient contact details to commercial third parties.
              </p>
              <p>
                <strong>3. Digital Records Access:</strong> Patients have the right to request copies of their digital radiographs, orthodontic scans, and clinical notes upon presentation of valid photo identification.
              </p>
              <p>
                <strong>4. Cookies & Data Collection:</strong> We use minimal functional session tokens solely to keep clinic staff logged in securely and track appointment status inquiries.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Appointments & Confirmations:</strong> Online booking submissions generate an appointment request with a unique reference number. Our reception team will reach out via call/SMS to verify patient medical suitability before final confirmation.
              </p>
              <p>
                <strong>2. Cancellation & Rescheduling Policy:</strong> If you must cancel or reschedule an appointment, we kindly ask for at least 24 hours advance notice to allow waiting emergency patients to utilize the operatory time slot.
              </p>
              <p>
                <strong>3. Treatment Estimates & Insurance:</strong> Cost quotes provided on this website are baseline estimations. A personalized treatment plan and exact fee schedule will be presented following clinical examination and digital radiographs.
              </p>
              <p>
                <strong>4. Emergency Cases:</strong> Patients experiencing acute dental emergencies outside regular hours are advised to call our priority emergency line or proceed to the nearest hospital emergency department if severe swelling or uncontrolled bleeding occurs.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
