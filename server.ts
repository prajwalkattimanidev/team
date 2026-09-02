import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { AppointmentStatus, BookingFormData } from './src/types';

const ADMIN_TOKEN = 'smilecare-staff-session-secure-token';
const ADMIN_PASSCODE = 'smilecare2026';

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const queryToken = req.query.token as string;
  const token = authHeader?.replace('Bearer ', '') || queryToken;

  if (token === ADMIN_TOKEN || token === ADMIN_PASSCODE) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized staff access. Please log in.' });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- PUBLIC API ROUTES ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Clinic information (easy to configure)
  app.get('/api/clinic', (_req: Request, res: Response) => {
    res.json(db.getClinic());
  });

  // Doctors
  app.get('/api/doctors', (_req: Request, res: Response) => {
    res.json(db.getDoctors());
  });

  // Services
  app.get('/api/services', (_req: Request, res: Response) => {
    res.json(db.getServices());
  });

  // Testimonials
  app.get('/api/testimonials', (_req: Request, res: Response) => {
    res.json(db.getTestimonials());
  });

  // FAQs
  app.get('/api/faqs', (_req: Request, res: Response) => {
    res.json(db.getFaqs());
  });

  // Public booking endpoint
  app.post('/api/appointments', (req: Request, res: Response) => {
    try {
      const data: BookingFormData = req.body;

      // Validation
      if (!data.fullName || data.fullName.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter patient full name.' });
      }
      if (!data.phone || data.phone.trim().length < 7) {
        return res.status(400).json({ error: 'Please enter a valid phone number.' });
      }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      if (!data.serviceId) {
        return res.status(400).json({ error: 'Please select a dental service.' });
      }
      if (!data.doctorId) {
        return res.status(400).json({ error: 'Please select a preferred dentist.' });
      }
      if (!data.preferredDate) {
        return res.status(400).json({ error: 'Please select a preferred date.' });
      }
      if (!data.preferredTime) {
        return res.status(400).json({ error: 'Please select a preferred time slot.' });
      }

      const bookedAppointment = db.bookAppointment(data);
      return res.status(201).json({
        success: true,
        message: 'Your appointment request has been submitted successfully. Our clinic team will contact you shortly to confirm your appointment.',
        appointment: bookedAppointment,
        reference: bookedAppointment.appointment_reference
      });
    } catch (err: any) {
      console.error('Booking error:', err);
      return res.status(500).json({ error: err.message || 'Failed to submit appointment request.' });
    }
  });

  // Patient lookup: view appointment status securely with reference number & optional phone/email
  app.get('/api/appointments/lookup', (req: Request, res: Response) => {
    const ref = (req.query.ref as string || '').trim();
    const verification = (req.query.verify as string || '').trim();

    if (!ref) {
      return res.status(400).json({ error: 'Appointment reference code is required.' });
    }

    const appt = db.lookupAppointment(ref, verification || undefined);
    if (!appt) {
      return res.status(404).json({
        error: 'Appointment not found. Please verify your reference number and contact information.'
      });
    }

    return res.json({ appointment: appt });
  });

  // Contact form submission
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const saved = db.saveContactMessage({ name, email, phone: phone || '', message });
    return res.json({ success: true, message: 'Thank you! Your message has been received.', data: saved });
  });

  // --- ADMIN / STAFF ROUTES ---

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { passcode } = req.body;
    if (passcode === ADMIN_PASSCODE || passcode === 'admin123') {
      return res.json({
        success: true,
        token: ADMIN_TOKEN,
        clinic: db.getClinic().name
      });
    }
    return res.status(401).json({ error: 'Incorrect passcode. Try smilecare2026 or admin123' });
  });

  // Admin: Get stats
  app.get('/api/admin/stats', adminAuthMiddleware, (_req: Request, res: Response) => {
    const stats = db.getAdminStats();
    res.json(stats);
  });

  // Admin: Get all appointments with optional filters
  app.get('/api/admin/appointments', adminAuthMiddleware, (req: Request, res: Response) => {
    const { date, doctorId, serviceId, status, search } = req.query;
    const appointments = db.getAllPopulatedAppointments({
      date: date as string,
      doctorId: doctorId as string,
      serviceId: serviceId as string,
      status: status as string,
      search: search as string
    });
    res.json(appointments);
  });

  // Admin: Update appointment status or reschedule
  app.patch('/api/admin/appointments/:id', adminAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes, reschedule } = req.body;

    if (reschedule && reschedule.appointment_date && reschedule.appointment_time) {
      const updated = db.rescheduleAppointment(id, {
        appointment_date: reschedule.appointment_date,
        appointment_time: reschedule.appointment_time,
        doctor_id: reschedule.doctor_id,
        notes: notes || reschedule.notes
      });
      if (!updated) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      return res.json({ success: true, appointment: updated });
    }

    if (status) {
      const validStatuses: AppointmentStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const updated = db.updateAppointmentStatus(id, status, notes);
      if (!updated) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      return res.json({ success: true, appointment: updated });
    }

    return res.status(400).json({ error: 'Nothing to update' });
  });

  // Admin: Delete appointment
  app.delete('/api/admin/appointments/:id', adminAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const success = db.deleteAppointment(id);
    if (!success) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    return res.json({ success: true });
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dental Clinic Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
