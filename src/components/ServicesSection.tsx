import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  Award, 
  Check, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Flame, 
  HeartHandshake, 
  Layers, 
  Search, 
  ShieldCheck, 
  Smile, 
  Sparkles, 
  Sun, 
  X, 
  Zap 
} from 'lucide-react';
import { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onBookService: (serviceId: string) => void;
}

// Icon mapper helper
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
    case 'Sparkles': return <Sparkles className="w-6 h-6" />;
    case 'Search': return <Search className="w-6 h-6" />;
    case 'Sun': return <Sun className="w-6 h-6" />;
    case 'Zap': return <Zap className="w-6 h-6" />;
    case 'Layers': return <Layers className="w-6 h-6" />;
    case 'Smile': return <Smile className="w-6 h-6" />;
    case 'HeartHandshake': return <HeartHandshake className="w-6 h-6" />;
    case 'Award': return <Award className="w-6 h-6" />;
    case 'Activity': return <Activity className="w-6 h-6" />;
    case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6" />;
    case 'Flame': return <Flame className="w-6 h-6" />;
    default: return <Sparkles className="w-6 h-6" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onBookService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalService, setActiveModalService] = useState<Service | null>(null);

  const categories = ['All', 'Preventive', 'Cosmetic', 'Restorative', 'Orthodontics', 'Pediatric', 'Emergency'];

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase() || (selectedCategory === 'Emergency' && s.id === 'serv-12'));

  return (
    <section id="services" className="py-20 bg-slate-50/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Comprehensive Dental Care
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Services Tailored for Every Smile
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From routine dental hygiene to transformative cosmetic enhancements and urgent tooth relief, our state-of-the-art clinic covers all your family oral health needs.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              id={`service-cat-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid (12 Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map(service => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Image Header */}
              {service.image && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-600" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-blue-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                    {service.category}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price and Details */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-slate-400 block">Est. Cost</span>
                    <span className="text-sm font-bold text-slate-900">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id={`service-learn-more-${service.id}`}
                      onClick={() => setActiveModalService(service)}
                      className="text-xs font-semibold text-slate-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Learn More
                    </button>
                    <button
                      id={`service-book-btn-${service.id}`}
                      onClick={() => onBookService(service.id)}
                      className="text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white px-3.5 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Emergency Callout Box */}
        <div className="mt-14 bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              Dental Emergency?
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Experiencing severe tooth pain or a broken tooth?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              We reserve immediate daily appointment slots for emergency cases. Call our priority hotline right now for immediate triage.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              id="emergency-call-cta"
              href="tel:18005559110"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              Call Emergency Helpline
            </a>
            <button
              id="emergency-book-cta"
              onClick={() => onBookService('serv-12')}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              Book Urgent Slot
            </button>
          </div>
        </div>

      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                {getServiceIcon(activeModalService.iconName)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">{activeModalService.category} Dentistry</span>
                <h3 className="text-2xl font-bold text-slate-900">{activeModalService.name}</h3>
              </div>
            </div>

            {activeModalService.image && (
              <div className="w-full h-52 rounded-2xl overflow-hidden mb-5 bg-slate-100">
                <img 
                  src={activeModalService.image} 
                  alt={activeModalService.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            <div className="space-y-4 text-slate-700">
              <p className="text-sm leading-relaxed">
                {activeModalService.fullDescription || activeModalService.description}
              </p>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium block">Average Duration</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    {activeModalService.duration}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium block">Typical Pricing</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <DollarSign className="w-4 h-4 text-teal-600" />
                    {activeModalService.price}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">What to Expect</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Full pre-procedure digital scan and comfort consultation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Painless anesthesia & noise-reduction headphones available
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Post-treatment recovery guidelines and follow-up support
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                id={`modal-book-now-${activeModalService.id}`}
                onClick={() => {
                  const id = activeModalService.id;
                  setActiveModalService(null);
                  onBookService(id);
                }}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                <span>Book This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
