import React from 'react';
import { 
  Award, 
  Cpu, 
  Heart, 
  Shield, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Smile
} from 'lucide-react';
import { ClinicInfo } from '../types';

interface AboutSectionProps {
  clinic: ClinicInfo;
  onBookConsultation: () => void;
  onExploreDoctors: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  clinic, 
  onBookConsultation, 
  onExploreDoctors 
}) => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            About SmileCare Dental Clinic
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Setting the Benchmark for Gentle, Patient-First Dentistry
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We believe a healthy, confident smile transforms lives. From routine checkups to complex restorations, our dedicated specialists deliver painless, transparent, and lifelong dental wellness.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage with Experience Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Clinic Operatory Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Dental Clinic Operatory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-widest font-semibold text-teal-300">Hygienic Excellence</p>
                    <h3 className="text-lg font-bold">Class-B Hospital-Grade Sterilization Protocols</h3>
                  </div>
                </div>
              </div>

              {/* Overlapping Secondary Image */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 w-56 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                  alt="Dental Consultation with patient"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute -top-6 -left-4 sm:-left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3.5 border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                  <Smile className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-teal-400">100% Focused</div>
                  <div className="text-xs text-slate-300">On Patient Comfort & Pain Relief</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Mission, Key Differentiators & Action */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Mission Statement Callout */}
            <div className="bg-sky-50/70 border border-sky-100 p-6 rounded-2xl relative">
              <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">Our Core Mission</div>
              <p className="text-base text-slate-700 italic font-medium leading-relaxed">
                "To deliver ethical, transparent, and compassionate dental care using cutting-edge medical technology, ensuring every patient feels relaxed, empowered, and proud of their healthy smile."
              </p>
            </div>

            {/* Why Patients Choose Us - 4 Pillars */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Why Patients Choose SmileCare</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Pillar 1: Modern Technology */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Modern Technology</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-normal">
                    Low-dose digital 3D CBCT imaging, painless ultrasonic scaling, and intraoral cameras for accurate diagnosis.
                  </p>
                </div>

                {/* Pillar 2: Experienced Dental Professionals */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Experienced Dentists</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-normal">
                    Team of board-certified cosmetic, orthodontics, surgical, and pediatric specialists with 10+ years practice.
                  </p>
                </div>

                {/* Pillar 3: Comfortable Environment */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Comfortable Environment</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-normal">
                    Spa-like calming atmosphere, noise-cancelling entertainment, and warm blankets designed to ease dental anxiety.
                  </p>
                </div>

                {/* Pillar 4: Personalized Treatment */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Personalized Treatment</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-normal">
                    Zero surprise costs, custom treatment trajectories tailored to your lifestyle, and flexible dental financing.
                  </p>
                </div>

              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="about-cta-book-consult"
                onClick={onBookConsultation}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-700/20 transition-all cursor-pointer"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="about-cta-meet-doctors"
                onClick={onExploreDoctors}
                className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700 font-semibold text-sm px-5 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
              >
                <span>Meet Our Specialists</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
