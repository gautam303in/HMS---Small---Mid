import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  LogIn, 
  LogOut, 
  FileText, 
  ShieldAlert,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  List
} from 'lucide-react';
import { INDIAN_STATES, BOOKING_CHANNELS } from '../utils/dropdownData';
import { validateEntityForm } from '../utils/validationEngine';

interface ReservationsViewProps {
  onNavigateTab: (tab: any) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({ onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [checkInModal, setCheckInModal] = useState<any | null>(null);
  const [newBookingModal, setNewBookingModal] = useState(false);
  const [kycDocType, setKycDocType] = useState('Passport');
  const [kycDocNumber, setKycDocNumber] = useState('');

  // Local state initialized with rich realistic reservations
  const [reservations, setReservations] = useState([
    {
      id: 'res-1001',
      bookingRef: 'BK-2026-901',
      guestName: 'Sophia Laurent',
      guestEmail: 'sophia.laurent@paris.fr',
      roomNumber: '101',
      roomCategory: 'Deluxe',
      checkInDate: '2026-09-15',
      checkOutDate: '2026-09-18',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Booking.com',
      grandTotal: 11760,
      paidAmount: 11760,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'FR-8892104B'
    },
    {
      id: 'res-1002',
      bookingRef: 'BK-2026-902',
      guestName: 'Marcus Chen',
      guestEmail: 'marcus.chen@techglobal.sg',
      roomNumber: '102',
      roomCategory: 'Deluxe',
      checkInDate: '2026-09-16',
      checkOutDate: '2026-09-19',
      guestsCount: 1,
      status: 'CheckedIn',
      source: 'Direct',
      grandTotal: 12936,
      paidAmount: 5000,
      kycStatus: 'Verified',
      documentType: 'NationalID',
      documentNumber: 'SG-S9238411D'
    },
    {
      id: 'res-1003',
      bookingRef: 'BK-2026-903',
      guestName: 'David Miller',
      guestEmail: 'dmiller@austin-corp.com',
      roomNumber: '201',
      roomCategory: 'Executive Suite',
      checkInDate: '2026-09-14',
      checkOutDate: '2026-09-17',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Expedia',
      grandTotal: 21840,
      paidAmount: 21840,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'USA-55104821'
    },
    {
      id: 'res-1004',
      bookingRef: 'BK-2026-904',
      guestName: 'Amina Al-Mansoor',
      guestEmail: 'amina.mansoor@qatarholding.qa',
      roomNumber: '204',
      roomCategory: 'Deluxe',
      checkInDate: '2026-09-16',
      checkOutDate: '2026-09-20',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Airbnb',
      grandTotal: 15680,
      paidAmount: 15680,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'QA-71049281'
    },
    {
      id: 'res-1005',
      bookingRef: 'BK-2026-905',
      guestName: 'Lord Alistair Sterling',
      guestEmail: 'sterling.estates@uknet.co.uk',
      roomNumber: '301',
      roomCategory: 'Presidential Suite',
      checkInDate: '2026-09-15',
      checkOutDate: '2026-09-21',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Direct',
      grandTotal: 88500,
      paidAmount: 88500,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'GB-99014238'
    },
    {
      id: 'res-1006',
      bookingRef: 'BK-2026-906',
      guestName: 'Elena Rostova',
      guestEmail: 'elena.rostova@berlinart.de',
      roomNumber: '202',
      roomCategory: 'Executive Suite',
      checkInDate: '2026-09-17',
      checkOutDate: '2026-09-20',
      guestsCount: 1,
      status: 'Confirmed',
      source: 'Booking.com',
      grandTotal: 21840,
      paidAmount: 5000,
      kycStatus: 'Pending',
      documentType: 'Passport',
      documentNumber: ''
    }
  ]);

  // Calendar & Drag-Drop Rescheduling State
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [toastAlert, setToastAlert] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // New booking form fields
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestState: 'Goa',
    roomNumber: '104',
    roomCategory: 'Standard',
    checkInDate: '2026-09-18',
    checkOutDate: '2026-09-21',
    guestsCount: 1,
    source: 'Direct'
  });

  const handlePerformCheckIn = (resv: any) => {
    setCheckInModal(resv);
    setKycDocType(resv.documentType || 'Passport');
    setKycDocNumber(resv.documentNumber || '');
  };

  const handleSaveCheckIn = () => {
    if (!checkInModal) return;
    setReservations(reservations.map(r => {
      if (r.id === checkInModal.id) {
        return {
          ...r,
          status: 'CheckedIn',
          kycStatus: kycDocNumber.trim() ? 'Verified' : 'Pending',
          documentType: kycDocType,
          documentNumber: kycDocNumber
        };
      }
      return r;
    }));
    setCheckInModal(null);
  };

  const handlePerformCheckOut = (resv: any) => {
    setReservations(reservations.map(r => {
      if (r.id === resv.id) {
        return { ...r, status: 'CheckedOut' };
      }
      return r;
    }));
    alert(`Guest ${resv.guestName} successfully checked out. Room ${resv.roomNumber} is now marked as DIRTY for Housekeeping.`);
  };

  const handleDropBooking = (targetDateStr: string) => {
    if (!draggedBookingId) return;
    const booking = reservations.find(r => r.id === draggedBookingId);
    if (!booking) return;
    if (booking.checkInDate === targetDateStr) return;

    const d1 = new Date(booking.checkInDate).getTime();
    const d2 = new Date(booking.checkOutDate).getTime();
    const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

    const targetDate = new Date(targetDateStr);
    const newCheckOut = new Date(targetDate.getTime() + nights * 24 * 60 * 60 * 1000);
    const newCheckOutStr = newCheckOut.toISOString().slice(0, 10);

    setReservations(prev => prev.map(r => {
      if (r.id === booking.id) {
        return {
          ...r,
          checkInDate: targetDateStr,
          checkOutDate: newCheckOutStr
        };
      }
      return r;
    }));

    setToastAlert(`Rescheduled "${booking.guestName}" (${booking.bookingRef}) to ${targetDateStr} → ${newCheckOutStr} (${nights} nights)`);
    setTimeout(() => setToastAlert(null), 4500);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEntityForm('reservation', formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    setFormErrors({});

    const newRes = {
      id: `res-${Date.now()}`,
      bookingRef: `BK-2026-${Math.floor(100 + Math.random() * 900)}`,
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      guestPhone: formData.guestPhone,
      guestState: formData.guestState,
      roomNumber: formData.roomNumber,
      roomCategory: formData.roomCategory,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guestsCount: Number(formData.guestsCount),
      status: 'Confirmed',
      source: formData.source,
      grandTotal: 8400,
      paidAmount: 0,
      kycStatus: 'Pending',
      documentType: 'Passport',
      documentNumber: ''
    };
    setReservations([newRes, ...reservations]);
    setNewBookingModal(false);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestState: 'Goa',
      roomNumber: '104',
      roomCategory: 'Standard',
      checkInDate: '2026-09-18',
      checkOutDate: '2026-09-21',
      guestsCount: 1,
      source: 'Direct'
    });
    setToastAlert(`Booking ${newRes.bookingRef} created for ${newRes.guestName}!`);
    setTimeout(() => setToastAlert(null), 4000);
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = 
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Month calendar variables
  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0: Sun
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleResetToActiveMonth = () => {
    setCalendarDate(new Date(2026, 8, 1));
  };

  return (
    <div className="animate-fade-in responsive-view-container">
      
      {/* Top action header */}
      <div className="responsive-action-header">
        <div>
          <h2 style={{ fontSize: 'clamp(18px, 2vw, 20px)', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Guest Reservations & Front Desk
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Omnichannel bookings with digital KYC verification, room key issuance, and interactive month calendar rescheduling.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? '#0F172A' : '#64748B',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <List size={14} /> Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: viewMode === 'calendar' ? '#0E94A8' : 'transparent',
                color: viewMode === 'calendar' ? '#FFFFFF' : '#64748B',
                boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <CalendarIcon size={14} /> Month Calendar
            </button>
          </div>

          <button onClick={() => setNewBookingModal(true)} className="btn-primary">
            <Plus size={16} color="#0F172A" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="lodgify-card responsive-action-header" style={{ padding: '16px 20px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '320px', maxWidth: '100%' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
          <input
            type="text"
            placeholder="Search by guest, ref code, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-clean"
            style={{ width: '100%', paddingLeft: '42px', fontSize: '13px' }}
          />
        </div>

        <div className="responsive-subtabs" style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Confirmed', 'CheckedIn', 'CheckedOut'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === st ? '#D4F05B' : '#F1F5F9',
                color: statusFilter === st ? '#0F172A' : '#64748B',
                transition: 'all 0.15s ease'
              }}
            >
              {st === 'CheckedIn' ? 'Checked In' : st === 'CheckedOut' ? 'Checked Out' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Month Calendar or Table View */}
      {viewMode === 'calendar' ? (
        <div className="lodgify-card" style={{ padding: '24px' }}>
          {/* Calendar Header with navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarIcon size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Drag & drop bookings across date cells to automatically reschedule stay check-in dates.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handlePrevMonth}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={handleResetToActiveMonth}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Active (Sep 2026)
              </button>

              <button
                onClick={handleNextMonth}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* 7-Day Column Grid Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '8px',
            marginBottom: '8px'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: '#64748B',
                  padding: '6px 0',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '6px'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '8px'
          }}>
            {/* Empty padding days before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                style={{
                  minHeight: '115px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  opacity: 0.35,
                  border: '1px dashed #E2E8F0'
                }}
              />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
              const dayNum = dayIdx + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isDragOver = dragOverDate === dateStr;

              // Find bookings that check in on this day
              const dayBookings = filteredReservations.filter(r => r.checkInDate === dateStr);

              return (
                <div
                  key={dateStr}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverDate(dateStr);
                  }}
                  onDragLeave={() => {
                    if (dragOverDate === dateStr) setDragOverDate(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropBooking(dateStr);
                    setDragOverDate(null);
                    setDraggedBookingId(null);
                  }}
                  style={{
                    minHeight: '115px',
                    backgroundColor: isDragOver ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: '10px',
                    border: isDragOver ? '2px dashed #0284C7' : '1px solid #E2E8F0',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                    boxShadow: isDragOver ? '0 4px 14px rgba(2, 132, 199, 0.2)' : 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: '#1E293B',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: isDragOver ? '#DBEAFE' : '#F1F5F9'
                    }}>
                      {dayNum}
                    </span>
                    {dayBookings.length > 0 && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#0E94A8',
                        backgroundColor: '#E0F2FE',
                        padding: '1px 6px',
                        borderRadius: '9999px'
                      }}>
                        {dayBookings.length} {dayBookings.length === 1 ? 'res' : 'res'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflowY: 'auto' }}>
                    {dayBookings.map((res) => {
                      const isBeingDragged = draggedBookingId === res.id;
                      const nights = Math.max(1, Math.round((new Date(res.checkOutDate).getTime() - new Date(res.checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
                      return (
                        <div
                          key={res.id}
                          draggable={true}
                          onDragStart={() => setDraggedBookingId(res.id)}
                          onDragEnd={() => {
                            setDraggedBookingId(null);
                            setDragOverDate(null);
                          }}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            backgroundColor: 
                              res.status === 'CheckedIn' ? '#D4F05B' :
                              res.status === 'Confirmed' ? '#E0F2FE' : '#F1F5F9',
                            color: '#0F172A',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'grab',
                            opacity: isBeingDragged ? 0.35 : 1,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '4px',
                            border: '1px solid rgba(0,0,0,0.06)'
                          }}
                          title={`Booking: ${res.bookingRef}\nGuest: ${res.guestName}\nRoom: ${res.roomNumber} (${res.roomCategory})\nDates: ${res.checkInDate} to ${res.checkOutDate} (${nights} nights)\nStatus: ${res.status}\n\nDrag to another date to reschedule!`}
                        >
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: '800' }}>R{res.roomNumber}:</span> {res.guestName.split(' ')[0]}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                            <span style={{ fontSize: '9px', opacity: 0.85, backgroundColor: 'rgba(0,0,0,0.08)', padding: '1px 4px', borderRadius: '4px' }}>
                              {nights}n
                            </span>
                            <GripVertical size={11} style={{ opacity: 0.5 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Reservations Table */
        <div className="lodgify-card responsive-table-wrapper" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref & Guest</th>
                <th>Room & Type</th>
                <th>Stay Dates</th>
                <th>Source</th>
                <th>KYC Status</th>
                <th>Folio / Balance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => {
                const balance = res.grandTotal - res.paidAmount;
                return (
                  <tr key={res.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{res.guestName}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{res.bookingRef}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>Room {res.roomNumber}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{res.roomCategory}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A' }}>
                        {res.checkInDate} → {res.checkOutDate}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{res.guestsCount} Guest(s)</div>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: 
                          res.source === 'Booking.com' ? '#E0F2FE' : 
                          res.source === 'Airbnb' ? '#FEE2E2' : 
                          res.source === 'Expedia' ? '#FEF3C7' : '#D1FAE5',
                        color:
                          res.source === 'Booking.com' ? '#0369A1' : 
                          res.source === 'Airbnb' ? '#991B1B' : 
                          res.source === 'Expedia' ? '#92400E' : '#065F46',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 9px',
                        borderRadius: '9999px'
                      }}>
                        {res.source}
                      </span>
                    </td>
                    <td>
                      {res.kycStatus === 'Verified' ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#065F46',
                          backgroundColor: '#D1FAE5',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '9999px'
                        }}>
                          <CheckCircle2 size={12} /> {res.documentType}
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#92400E',
                          backgroundColor: '#FEF3C7',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '9999px'
                        }}>
                          <Clock size={12} /> Pending ID
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>₹{res.grandTotal.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: balance > 0 ? '#EF4444' : '#10B981', fontWeight: '600' }}>
                        {balance > 0 ? `Due: ₹${balance.toLocaleString()}` : 'Fully Paid'}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: 
                          res.status === 'CheckedIn' ? '#D4F05B' : 
                          res.status === 'Confirmed' ? '#E2E8F0' : '#F1F5F9',
                        color: '#0F172A',
                        fontWeight: '700',
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '9999px'
                      }}>
                        {res.status === 'CheckedIn' ? 'Checked In' : res.status === 'Confirmed' ? 'Confirmed' : 'Checked Out'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {res.status === 'Confirmed' && (
                          <button
                            onClick={() => handlePerformCheckIn(res)}
                            style={{
                              backgroundColor: '#D4F05B',
                              color: '#0F172A',
                              border: 'none',
                              fontWeight: '700',
                              fontSize: '12px',
                              padding: '6px 12px',
                              borderRadius: '9999px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <LogIn size={13} /> Check In
                          </button>
                        )}

                        {res.status === 'CheckedIn' && (
                          <button
                            onClick={() => handlePerformCheckOut(res)}
                            style={{
                              backgroundColor: '#FEE2E2',
                              color: '#991B1B',
                              border: 'none',
                              fontWeight: '700',
                              fontSize: '12px',
                              padding: '6px 12px',
                              borderRadius: '9999px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <LogOut size={13} /> Check Out
                          </button>
                        )}

                        <button
                          onClick={() => onNavigateTab('financials')}
                          title="View Folio & Billing"
                          style={{
                            backgroundColor: '#F8FAFC',
                            color: '#0F172A',
                            border: '1px solid #E2E8F0',
                            padding: '6px 10px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          <FileText size={13} /> Folio
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Digital Check-in & KYC Modal */}
      {checkInModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '28px', maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={20} color="#065F46" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Digital Check-in & KYC Verification
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  {checkInModal.guestName} • Room {checkInModal.roomNumber} ({checkInModal.roomCategory})
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Government ID Document Type
                </label>
                <select
                  value={kycDocType}
                  onChange={(e) => setKycDocType(e.target.value)}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                >
                  <option value="Passport">Passport</option>
                  <option value="DrivingLicense">Driving License</option>
                  <option value="NationalID">National ID Card / Aadhaar</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  ID / Document Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. US-9912048X or SG-S9238411D"
                  value={kycDocNumber}
                  onChange={(e) => setKycDocNumber(e.target.value)}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>

              <div style={{
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldAlert size={18} color="#10B981" />
                <span style={{ fontSize: '12px', color: '#475569' }}>
                  Digital KYC will encrypt document credentials and mark guest verified for hospitality compliance.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setCheckInModal(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveCheckIn} className="btn-primary">
                Complete Check-In & Issue Room Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Reservation Modal */}
      {newBookingModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '28px', maxWidth: '620px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '18px' }}>
              Create New Reservation
            </h3>

            <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Olivia Vance"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px', borderColor: formErrors.guestName ? '#EF4444' : undefined }}
                  />
                  {formErrors.guestName && (
                    <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{formErrors.guestName}</span>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Guest Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="olivia@domain.com"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px', borderColor: formErrors.guestEmail ? '#EF4444' : undefined }}
                  />
                  {formErrors.guestEmail && (
                    <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{formErrors.guestEmail}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Mobile Phone *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px', borderColor: formErrors.guestPhone ? '#EF4444' : undefined }}
                  />
                  {formErrors.guestPhone && (
                    <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{formErrors.guestPhone}</span>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>State / Union Territory *</label>
                  <select
                    value={formData.guestState}
                    onChange={(e) => setFormData({ ...formData, guestState: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Room Number & Type</label>
                  <select
                    value={formData.roomNumber}
                    onChange={(e) => {
                      const num = e.target.value;
                      const cat = num.startsWith('1') ? 'Deluxe' : num.startsWith('2') ? 'Executive Suite' : 'Presidential Suite';
                      setFormData({ ...formData, roomNumber: num, roomCategory: cat });
                    }}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="104">Room 104 - Standard (₹2,500/nt)</option>
                    <option value="106">Room 106 - Standard (₹2,500/nt)</option>
                    <option value="203">Room 203 - Executive Suite (₹6,500/nt)</option>
                    <option value="302">Room 302 - Executive Suite (₹6,500/nt)</option>
                    <option value="303">Room 303 - Deluxe (₹3,500/nt)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Booking Channel</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    {BOOKING_CHANNELS.map(ch => (
                      <option key={ch.value} value={ch.value}>
                        {ch.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Check-in Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Check-out Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setNewBookingModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Booking & Issue Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Toast Alert */}
      {toastAlert && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 28px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: '600',
          border: '1px solid #334155'
        }}>
          <CheckCircle2 size={18} color="#D4F05B" />
          <span>{toastAlert}</span>
        </div>
      )}

    </div>
  );
};
