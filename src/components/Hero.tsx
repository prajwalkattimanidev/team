import React from 'react';
import { 
  Award, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  HeartHandshake, 
  ShieldCheck, 
  Smile, 
  Sparkles, 
  Star, 
  Users 
} from 'lucide-react';

interface HeroProps {
  onBookAppointment: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookAppointment, onExploreServices }) => {
  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle decorative background circles */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-900 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Welcoming New Patients • Gentle & Pain-Free Focus</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Your Smile Deserves the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-sky-600 to-teal-600">Best Care</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Comprehensive dental care delivered by experienced professionals in a comfortable, modern environment.
              </p>
            </div>

            {/* Quick feature checklist */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-slate-700 font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Zero Wait Time Booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>100% Sterilized Operatories</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Same-Day Emergency Relief</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-cta-book-appointment"
                onClick={onBookAppointment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-sky-200" />
                <span>Book an Appointment</span>
              </button>

              <button
                id="hero-cta-explore-services"
                onClick={onExploreServices}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-base font-semibold px-6 py-3.5 rounded-xl shadow-xs hover:border-slate-300 transition-all cursor-pointer"
              >
                <span>Explore Our Services</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Patient review mini preview */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img 
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="Patient" 
                />
                <img 
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
                  alt="Patient" 
                />
                <img 
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" 
                  alt="Patient" 
                />
              </div>
              <div className="text-left text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="ml-1.5 font-bold text-slate-800">4.9 / 5.0</span>
                </div>
                <span className="text-slate-500 font-medium">Over 5,000+ verified patient smiles</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Floating Highlights */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Outer decorative backdrop border */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-blue-600 via-sky-400 to-teal-400 opacity-20 blur-lg transform -rotate-1" />
              
              {/* Main Doctor / Clinic Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/5] sm:aspect-[4/4.5] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80"
                  alt="SmileCare Dental Clinic Doctor and Patient Care"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              </div>

              {/* Floating Badge 1: 5.0 Rating */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Certified Excellence</div>
                  <div className="text-[11px] text-slate-500">Board-Certified Specialists</div>
                </div>
              </div>

              {/* Floating Badge 2: Quick Booking Guarantee */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[240px]">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Quick Online Booking</div>
                  <div className="text-[11px] text-slate-500">Instant confirmation & zero waiting queues</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Trust Indicators Bar Below Hero */}
        <div id="trust-indicators-bar" className="mt-16 pt-10 border-t border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Indicator 1: 10+ Years of Experience */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">10+</div>
                <div className="text-sm font-semibold text-slate-800">Years Experience</div>
                <p className="text-xs text-slate-500 mt-0.5">Continuous clinical excellence</p>
              </div>
            </div>

            {/* Indicator 2: 5,000+ Happy Patients */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">5,000+</div>
                <div className="text-sm font-semibold text-slate-800">Happy Patients</div>
                <p className="text-xs text-slate-500 mt-0.5">Smiles restored and protected</p>
              </div>
            </div>

            {/* Indicator 3: Experienced Dentists */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">4+</div>
                <div className="text-sm font-semibold text-slate-800">Specialist Doctors</div>
                <p className="text-xs text-slate-500 mt-0.5">Orthodontics, cosmetic & pediatric</p>
              </div>
            </div>

            {/* Indicator 4: Modern Equipment */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">100%</div>
                <div className="text-sm font-semibold text-slate-800">Modern Equipment</div>
                <p className="text-xs text-slate-500 mt-0.5">3D scans, digital X-rays, painless tools</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
