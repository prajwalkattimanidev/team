import React, { useState } from 'react';
import { 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Quote, 
  Sparkles, 
  Star 
} from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onBookNow: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, onBookNow }) => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold tracking-wide uppercase">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Patient Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real Stories from Real Smiles
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Read how our dedicated team helped patients conquer dental anxiety, restore chewing confidence, and love their smiles again.
          </p>
        </div>

        {/* Testimonials Grid (5 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(item => (
            <div
              key={item.id}
              id={`testimonial-card-${item.id}`}
              className="bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-200/70 hover:border-blue-300 hover:bg-white shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                {/* Rating stars & procedure tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                    {item.procedure}
                  </span>
                </div>

                {/* Comment quote */}
                <p className="text-sm text-slate-700 leading-relaxed italic relative z-10">
                  "{item.comment}"
                </p>
              </div>

              {/* Patient footer */}
              <div className="pt-5 mt-5 border-t border-slate-200/60 flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    {item.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600" title="Verified Patient" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Callout Card to invite feedback / booking */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-7 text-white flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-teal-400 opacity-60" />
              <h3 className="text-xl font-bold">Ready to Start Your Smile Journey?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Join over 5,000 delighted patients who trust SmileCare for gentle, world-class dental treatments.
              </p>
            </div>
            <button
              onClick={onBookNow}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
            >
              Book Your Visit Today
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
