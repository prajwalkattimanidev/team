import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  Sparkles 
} from 'lucide-react';
import { ClinicInfo, Service } from '../types';

interface FooterProps {
  clinic: ClinicInfo;
  services: Service[];
  onOpenBooking: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onSelectService: (serviceId: string) => void;
  onOpenPolicy: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  clinic,
  services,
  onOpenBooking,
  onOpenTracking,
  onOpenAdmin,
  onSelectService,
  onOpenPolicy,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-clinic-footer" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.5 2 6 4 6 7c0 2 .5 4 1.5 6.5C8.5 16 10 20 10 22c.2.2.5.3.8.3s.6-.1.8-.4c.8-1.5 1.4-3.5 1.4-5.4 0-1.2.2-2.5.5-3.5.3 1 .5 2.3.5 3.5 0 1.9.6 3.9 1.4 5.4.2.3.5.4.8.4s.6-.1.8-.3c0-2 1.5-6 2.5-8.5C20.5 11 21 9 21 7c0-3-2.5-5-6-5-1 0-2 .4-3 1-1-.6-2-1-3-1z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white tracking-tight">
                  Smile<span className="text-teal-400">Care</span>
                </div>
                <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Dental Clinic</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Providing premium, compassionate, and minimally invasive dental care for adults and children. We combine cutting-edge technology with warm patient service to build lasting smiles.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#facebook" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#twitter" aria-label="Twitter" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('hero-section')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Dental Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('doctors')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Our Specialists
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('testimonials')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Patient Reviews
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Contact & Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Dental Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Featured Services</h4>
            <ul className="space-y-2 text-xs">
              {services.slice(0, 6).map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => { scrollTo('services'); onSelectService(s.id); }}
                    className="hover:text-teal-400 transition-colors cursor-pointer text-left truncate max-w-full block"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Hours</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>{clinic.address}, {clinic.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href={`tel:${clinic.phone.replace(/\D/g, '')}`} className="hover:text-white font-medium">
                  {clinic.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href={`mailto:${clinic.email}`} className="hover:text-white">
                  {clinic.email}
                </a>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Opening Hours:</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5">{clinic.hoursWeekday}</p>
                <p className="text-[11px] text-slate-400 pl-5">{clinic.hoursWeekend}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {clinic.name}. All rights reserved. Your smile is our pride.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Shield className="w-3 h-3" />
              Staff Login
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
