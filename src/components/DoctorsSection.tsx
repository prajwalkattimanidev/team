import React from 'react';
import { 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Sparkles, 
  Star 
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorsSectionProps {
  doctors: Doctor[];
  onBookDoctor: (doctorId: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ doctors, onBookDoctor }) => {
  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide uppercase">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Meet Our Dental Specialists
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Distinguished Dentists Dedicated to Your Care
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Our multi-disciplinary team brings decades of combined expertise, academic excellence, and a warm, gentle touch to every patient encounter.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map(doctor => (
            <div
              key={doctor.id}
              id={`doctor-card-${doctor.id}`}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group"
            >
              {/* Doctor Photo */}
              <div className="relative aspect-[3/3.6] w-full overflow-hidden bg-slate-100">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{doctor.experience}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>

              {/* Doctor Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {doctor.name}
                    </h3>
                    <div className="text-xs font-semibold text-teal-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{doctor.qualification}</span>
                    </div>
                  </div>

                  <div className="text-xs font-medium text-slate-700 bg-sky-50 px-2.5 py-1 rounded-md inline-block">
                    {doctor.specialization}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {doctor.bio}
                  </p>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    id={`doc-book-btn-${doctor.id}`}
                    onClick={() => onBookDoctor(doctor.id)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Doctor Consultation Banner */}
        <div className="mt-12 text-center bg-sky-50/60 rounded-2xl p-6 border border-sky-100 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900">Unsure which specialist you need?</h4>
            <p className="text-xs text-slate-600">Our intake team will review your symptoms and match you with the ideal dental expert.</p>
          </div>
          <button
            onClick={() => onBookDoctor('doc-1')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            General Consultation Intake
          </button>
        </div>

      </div>
    </section>
  );
};
