import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  ArrowLeft, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Filter, 
  Lock, 
  LogOut, 
  Mail, 
  Phone, 
  Plus, 
  RefreshCw, 
  Search, 
  Shield, 
  Trash2, 
  User, 
  UserCheck, 
  X, 
  XCircle 
} from 'lucide-react';
import { AdminStats, AppointmentStatus, Doctor, PopulatedAppointment, Service } from '../types';
import { API } from '../utils/api';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
  services: Service[];
  doctors: Doctor[];
  onOpenBooking: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToWebsite,
  services,
  doctors,
  onOpenBooking
}) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smilecare_staff_token'));
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [appointments, setAppointments] = useState<PopulatedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters State
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'custom'>('all');
  const [customDate, setCustomDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals inside Admin
  const [viewingAppointment, setViewingAppointment] = useState<PopulatedAppointment | null>(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<PopulatedAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM');
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState('');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  const timeSlots = [
    '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
    '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM',
    '04:30 PM', '05:15 PM', '06:00 PM', '07:00 PM'
  ];

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const res = await API.adminLogin(passcode);
      setToken(res.token);
      localStorage.setItem('smilecare_staff_token', res.token);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid staff passcode');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('smilecare_staff_token');
  };

  // Helper date calculations
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Fetch stats & appointments
  const fetchData = async () => {
    if (!token) return;
    setIsLoading(true);
    setActionError(null);

    let targetDate: string | undefined;
    if (selectedDateFilter === 'today') targetDate = getTodayString();
    else if (selectedDateFilter === 'tomorrow') targetDate = getTomorrowString();
    else if (selectedDateFilter === 'custom' && customDate) targetDate = customDate;

    try {
      const [statsData, apptsData] = await Promise.all([
        API.getAdminStats(token),
        API.getAdminAppointments(token, {
          date: targetDate,
          doctorId: doctorFilter !== 'all' ? doctorFilter : undefined,
          serviceId: serviceFilter !== 'all' ? serviceFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery.trim() || undefined
        })
      ]);

      setStats(statsData);
      setAppointments(apptsData);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized')) {
        handleLogout();
      } else {
        setActionError(err.message || 'Failed to load clinic records');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, selectedDateFilter, customDate, statusFilter, doctorFilter, serviceFilter]);

  // Handle Search Debounce or trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  // Status Action handler (Confirm, Complete, Cancel)
  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus, notes?: string) => {
    if (!token) return;
    try {
      await API.updateAppointmentStatus(token, appointmentId, newStatus, notes);
      setActionSuccess(`Appointment status successfully updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchData();
      if (viewingAppointment?.id === appointmentId) {
        setViewingAppointment(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to update status');
    }
  };

  // Reschedule submit
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !reschedulingAppointment || !rescheduleDate || !rescheduleTime) return;

    try {
      await API.rescheduleAppointment(token, reschedulingAppointment.id, {
        appointment_date: rescheduleDate,
        appointment_time: rescheduleTime,
        doctor_id: rescheduleDoctorId || reschedulingAppointment.doctor_id,
        notes: rescheduleNotes ? `Rescheduled: ${rescheduleNotes}` : undefined
      });
      setActionSuccess('Appointment successfully rescheduled!');
      setTimeout(() => setActionSuccess(null), 3000);
      setReschedulingAppointment(null);
      fetchData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to reschedule');
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Check className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      case 'Rescheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <RefreshCw className="w-3 h-3" />
            Rescheduled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending Request
          </span>
        );
    }
  };

  // If NOT authenticated, show Login View
  if (!token) {
    return (
      <div id="admin-login-screen" className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 text-white p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">SmileCare Staff Portal</h2>
            <p className="text-xs text-slate-400">Restricted authentication for clinic receptionists & dentists</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Staff Access Passcode
              </label>
              <div className="relative">
                <input
                  id="admin-passcode-input"
                  type="password"
                  required
                  placeholder="Enter passcode (hint: smilecare2026)"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Default clinic password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono font-bold">smilecare2026</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono font-bold">admin123</code>
              </p>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAuthenticating ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToWebsite}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Public Website
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div id="clinic-admin-dashboard" className="min-h-screen bg-slate-100/70 pb-16">
      
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="admin-back-website-btn"
              onClick={onBackToWebsite}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>SmileCare Clinic Management</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                  STAFF ACTIVE
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Alerts */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5 Statistics KPI Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Stat 1: Today's Appointments */}
            <div 
              onClick={() => { setSelectedDateFilter('today'); setStatusFilter('all'); }}
              className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedDateFilter === 'today' ? 'ring-2 ring-blue-600 border-blue-600 shadow-md' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-900">{stats.todayAppointments}</div>
              <div className="text-[11px] text-slate-500 mt-1">Scheduled for today</div>
            </div>

            {/* Stat 2: Upcoming Appointments */}
            <div 
              onClick={() => { setSelectedDateFilter('all'); setStatusFilter('Confirmed'); }}
              className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                statusFilter === 'Confirmed' ? 'ring-2 ring-sky-500 border-sky-500 shadow-md' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming</span>
                <Calendar className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-900">{stats.upcomingAppointments}</div>
              <div className="text-[11px] text-slate-500 mt-1">Confirmed upcoming visits</div>
            </div>

            {/* Stat 3: Pending Requests */}
            <div 
              onClick={() => { setSelectedDateFilter('all'); setStatusFilter('Pending'); }}
              className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                statusFilter === 'Pending' ? 'ring-2 ring-amber-500 border-amber-500 shadow-md' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Requests</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{stats.pendingRequests}</div>
              <div className="text-[11px] text-amber-700/80 mt-1">Awaiting clinic approval</div>
            </div>

            {/* Stat 4: Completed Appointments */}
            <div 
              onClick={() => { setSelectedDateFilter('all'); setStatusFilter('Completed'); }}
              className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                statusFilter === 'Completed' ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">{stats.completedAppointments}</div>
              <div className="text-[11px] text-slate-500 mt-1">Treated & discharged</div>
            </div>

            {/* Stat 5: Cancelled Appointments */}
            <div 
              onClick={() => { setSelectedDateFilter('all'); setStatusFilter('Cancelled'); }}
              className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                statusFilter === 'Cancelled' ? 'ring-2 ring-rose-500 border-rose-500 shadow-md' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cancelled</span>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-900">{stats.cancelledAppointments}</div>
              <div className="text-[11px] text-slate-500 mt-1">Revoked bookings</div>
            </div>

          </div>
        )}

        {/* Filter Toolbar & Search */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
              <input
                id="admin-search-patients-input"
                type="text"
                placeholder="Search patient name, phone, email, or reference..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            {/* Actions: Quick Walk-in Booking & Reset Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setSelectedDateFilter('all');
                  setStatusFilter('all');
                  setDoctorFilter('all');
                  setServiceFilter('all');
                  setSearchQuery('');
                  setCustomDate('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Reset Filters
              </button>

              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New In-Clinic Booking</span>
              </button>
            </div>
          </div>

          {/* Secondary Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            {/* Date Quick Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Date Scope</label>
              <select
                id="admin-filter-date-scope"
                value={selectedDateFilter}
                onChange={e => setSelectedDateFilter(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="today">Today Only ({getTodayString()})</option>
                <option value="tomorrow">Tomorrow ({getTomorrowString()})</option>
                <option value="custom">Pick Specific Date</option>
              </select>
              {selectedDateFilter === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  className="mt-1.5 w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              )}
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status</label>
              <select
                id="admin-filter-status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending Approval</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Dentist Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Dentist</label>
              <select
                id="admin-filter-dentist"
                value={doctorFilter}
                onChange={e => setDoctorFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Dentists</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Dental Service</label>
              <select
                id="admin-filter-service"
                value={serviceFilter}
                onChange={e => setServiceFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Dental Services</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table / Cards Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Clinic Appointment Records</h2>
              <p className="text-xs text-slate-500">
                Showing {appointments.length} record{appointments.length === 1 ? '' : 's'} matching current criteria
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-slate-500 space-y-2">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Loading patient database...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <Calendar className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No appointments found matching your filters</p>
              <button
                onClick={() => {
                  setSelectedDateFilter('all');
                  setStatusFilter('all');
                  setDoctorFilter('all');
                  setServiceFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table id="admin-appointments-table" className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Ref & Patient</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Service & Doctor</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map(app => (
                    <tr 
                      key={app.id} 
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Ref & Patient */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[11px] text-blue-900 block">
                          {app.appointment_reference}
                        </span>
                        <span className="font-bold text-sm text-slate-900 block mt-0.5">
                          {app.patient?.name || 'Unknown Patient'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Age: {app.patient?.age || 'N/A'} • {app.is_new_patient ? 'New Patient' : 'Existing'}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${app.patient?.phone?.replace(/\D/g, '')}`} className="hover:underline">
                            {app.patient?.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[150px]">{app.patient?.email}</span>
                        </div>
                      </td>

                      {/* Service & Doctor */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">
                          {app.service?.name}
                        </span>
                        <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
                          {app.doctor?.name}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">
                          {app.appointment_date}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {app.appointment_time}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick View Details */}
                          <button
                            onClick={() => setViewingAppointment(app)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Full Patient Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Confirm Button if Pending */}
                          {app.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'Confirmed')}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                              title="Confirm Appointment"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Complete Button if Confirmed/Rescheduled */}
                          {(app.status === 'Confirmed' || app.status === 'Rescheduled') && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'Completed')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                              title="Mark as Completed"
                            >
                              Complete
                            </button>
                          )}

                          {/* Reschedule Button */}
                          <button
                            onClick={() => {
                              setReschedulingAppointment(app);
                              setRescheduleDate(app.appointment_date);
                              setRescheduleTime(app.appointment_time);
                              setRescheduleDoctorId(app.doctor_id);
                              setRescheduleNotes('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            title="Reschedule Appointment"
                          >
                            Reschedule
                          </button>

                          {/* Cancel Button */}
                          {app.status !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel appointment ${app.appointment_reference} for ${app.patient?.name}?`)) {
                                  handleStatusChange(app.id, 'Cancelled');
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Appointment Detail Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
            <button
              onClick={() => setViewingAppointment(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-4 pr-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointment Reference</span>
                <h3 className="text-xl font-mono font-bold text-blue-900">{viewingAppointment.appointment_reference}</h3>
              </div>
              <div>{getStatusBadge(viewingAppointment.status)}</div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-900 uppercase">Patient Information</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Name</span>
                    <span className="font-bold text-sm text-slate-900">{viewingAppointment.patient?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Age</span>
                    <span className="font-semibold">{viewingAppointment.patient?.age} yrs old</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone</span>
                    <a href={`tel:${viewingAppointment.patient?.phone}`} className="font-bold text-blue-700 hover:underline">
                      {viewingAppointment.patient?.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email</span>
                    <span className="font-semibold">{viewingAppointment.patient?.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-900 uppercase">Treatment Details</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Dental Service</span>
                    <span className="font-bold text-slate-900">{viewingAppointment.service?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Doctor</span>
                    <span className="font-bold text-teal-700">{viewingAppointment.doctor?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Appointment Date</span>
                    <span className="font-semibold">{viewingAppointment.appointment_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Scheduled Time</span>
                    <span className="font-semibold">{viewingAppointment.appointment_time}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Reason for Visit</span>
                <p className="text-slate-800 font-medium leading-relaxed">{viewingAppointment.reason}</p>
              </div>

              {viewingAppointment.notes && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 space-y-1">
                  <span className="text-amber-800 block uppercase font-bold text-[10px]">Staff Notes / Patient Requests</span>
                  <p className="text-amber-900 leading-relaxed">{viewingAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Status Modifiers in Drawer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Update Status:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleStatusChange(viewingAppointment.id, 'Confirmed')}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs hover:bg-blue-200 cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusChange(viewingAppointment.id, 'Completed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs hover:bg-emerald-200 cursor-pointer"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleStatusChange(viewingAppointment.id, 'Cancelled')}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 font-bold text-xs hover:bg-rose-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
            <button
              onClick={() => setReschedulingAppointment(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Reschedule Appointment</h3>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-bold text-slate-800">{reschedulingAppointment.patient?.name}</span> ({reschedulingAppointment.appointment_reference})
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Appointment Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Time Slot</label>
                <select
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Dentist</label>
                <select
                  value={rescheduleDoctorId}
                  onChange={e => setRescheduleDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Reschedule (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Patient requested morning slot"
                  value={rescheduleNotes}
                  onChange={e => setRescheduleNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingAppointment(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md cursor-pointer"
                >
                  Save New Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
