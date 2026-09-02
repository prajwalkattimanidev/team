import { AdminStats, BookingFormData, ClinicData, ClinicInfo, Doctor, FaqItem, PopulatedAppointment, Service, Testimonial } from '../types';

export const API = {
  // Fetch all clinic data at once
  async getClinicData(): Promise<ClinicData> {
    const [clinic, doctors, services, testimonials, faqs] = await Promise.all([
      this.getClinic(),
      this.getDoctors(),
      this.getServices(),
      this.getTestimonials(),
      this.getFaqs(),
    ]);
    return { clinic, doctors, services, testimonials, faqs };
  },

  // Public data
  async getClinic(): Promise<ClinicInfo> {
    const res = await fetch('/api/clinic');
    if (!res.ok) throw new Error('Failed to fetch clinic information');
    return res.json();
  },

  async getDoctors(): Promise<Doctor[]> {
    const res = await fetch('/api/doctors');
    if (!res.ok) throw new Error('Failed to fetch doctors list');
    return res.json();
  },

  async getServices(): Promise<Service[]> {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  async getFaqs(): Promise<FaqItem[]> {
    const res = await fetch('/api/faqs');
    if (!res.ok) throw new Error('Failed to fetch FAQs');
    return res.json();
  },

  // Appointment Booking
  async bookAppointment(data: BookingFormData): Promise<{
    success: boolean;
    message: string;
    appointment: PopulatedAppointment;
    reference: string;
  }> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit appointment request');
    }
    return result;
  },

  // Track appointment
  async lookupAppointment(reference: string, verificationInput?: string): Promise<{ appointment: PopulatedAppointment }> {
    const params = new URLSearchParams();
    params.set('ref', reference);
    if (verificationInput) params.set('verify', verificationInput);

    const res = await fetch(`/api/appointments/lookup?${params.toString()}`);
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Appointment not found');
    }
    return result;
  },

  // Send contact message
  async sendContact(data: { name: string; email: string; phone: string; message: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to send message');
    }
    return result;
  },

  // Admin authentication
  async adminLogin(passcode: string): Promise<{ success: boolean; token: string; clinic: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Invalid staff passcode');
    }
    return result;
  },

  // Admin stats
  async getAdminStats(token: string): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized or failed to fetch stats');
    return res.json();
  },

  // Admin appointments with filters
  async getAdminAppointments(
    token: string,
    filters?: { date?: string; doctorId?: string; serviceId?: string; status?: string; search?: string }
  ): Promise<PopulatedAppointment[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.set('date', filters.date);
    if (filters?.doctorId) params.set('doctorId', filters.doctorId);
    if (filters?.serviceId) params.set('serviceId', filters.serviceId);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);

    const res = await fetch(`/api/admin/appointments?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized or failed to fetch appointments');
    return res.json();
  },

  // Admin update status
  async updateAppointmentStatus(
    token: string,
    id: string,
    status: string,
    notes?: string
  ): Promise<{ success: boolean; appointment: PopulatedAppointment }> {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, notes })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update status');
    return result;
  },

  // Admin reschedule
  async rescheduleAppointment(
    token: string,
    id: string,
    rescheduleData: { appointment_date: string; appointment_time: string; doctor_id?: string; notes?: string }
  ): Promise<{ success: boolean; appointment: PopulatedAppointment }> {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ reschedule: rescheduleData })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reschedule appointment');
    return result;
  },

  // Admin delete
  async deleteAppointment(token: string, id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete appointment');
    return result;
  }
};
