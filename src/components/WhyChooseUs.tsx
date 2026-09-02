import React from 'react';
import { 
  Award, 
  CalendarCheck2, 
  Cpu, 
  DollarSign, 
  HeartHandshake, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface WhyChooseUsProps {
  onBookAppointment: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onBookAppointment }) => {
  const points = [
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'hover:border-blue-300',
      title: 'Experienced Dentists',
      description: 'Our certified specialists have over a decade of clinical practice, continuous CME training, and high treatment success rates.'
    },
    {
      icon: <Cpu className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50',
      border: 'hover:border-teal-300',
      title: 'Advanced Dental Technology',
      description: 'Ultra-low radiation digital 3D CBCT, painless rotary endodontics, intraoral digital scanners, and diode lasers.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-300',
      title: 'Patient-Centered Care',
      description: 'We listen attentively to your goals and anxieties. Every treatment plan is co-designed to match your comfort and timetable.'
    },
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-300',
      title: 'Affordable Treatment',
      description: 'Clear, transparent upfront cost estimates with no surprise bills. We accept all major PPO insurances and offer 0% interest financing.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'hover:border-sky-300',
      title: 'Sterilized & Hygienic Environment',
      description: 'Strict adherence to CDC and OSHA infection-control guidelines with medical autoclave sterilization for every instrument.'
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-red-600" />,
      bg: 'bg-red-50',
      border: 'hover:border-red-300',
      title: 'Emergency Support',
      description: 'Immediate relief for severe toothaches, trauma, and broken dental crowns with designated daily urgent care openings.'
    },
    {
      icon: <CalendarCheck2 className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'hover:border-amber-300',
      title: 'Easy Appointment Booking',
      description: 'Seamless online appointment scheduling in under 2 minutes. Instant reference code generation and SMS/email confirmations.'
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-50/80 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            The SmileCare Difference
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Thousands of Families Trust Our Clinic
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We merge clinical mastery with genuine hospitality so you always leave feeling cared for, valued, and smiling.
          </p>
        </div>

        {/* 7 Interactive Reason Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {points.map((p, idx) => (
            <div
              key={idx}
              id={`why-card-${idx}`}
              className={`bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between ${p.border}`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-teal-600">
                <span>Verified Quality Standard</span>
              </div>
            </div>
          ))}

          {/* Quick CTA Card */}
          <div className="bg-gradient-to-br from-blue-700 to-sky-600 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-200">Start Today</span>
              <h3 className="text-xl font-bold">Experience the Dental Difference</h3>
              <p className="text-xs text-sky-100 leading-relaxed">
                Take the first step toward optimal dental health and a radiant smile. No waitlists or complications.
              </p>
            </div>
            <button
              onClick={onBookAppointment}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-white text-blue-900 hover:bg-sky-50 font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
            >
              Book Your Appointment Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
