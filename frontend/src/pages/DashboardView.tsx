import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  LogIn, 
  LogOut, 
  IndianRupee, 
  Bookmark, 
  MoreHorizontal, 
  Plus, 
  ChevronDown 
} from 'lucide-react';

import { TodaysArrivals } from '../components/TodaysArrivals';

interface DashboardViewProps {
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const [revenueRange] = useState('Last 6 Months');
  const [reservationsRange] = useState('Last 7 Days');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      date: 'June 19, 2028',
      title: 'Set Up Conference Room B for 10 AM Meeting',
      highlight: false
    },
    {
      id: 2,
      date: 'June 19, 2028',
      title: 'Restock Housekeeping Supplies on 3rd Floor',
      highlight: true
    },
    {
      id: 3,
      date: 'June 20, 2028',
      title: 'Inspect and Clean the Pool Area',
      highlight: false
    },
    {
      id: 4,
      date: 'June 20, 2028',
      title: 'Check-In Assistance During Peak Hours (4 PM - 6 PM)',
      highlight: false
    }
  ]);

  const [newTaskModal, setNewTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        date: 'Today',
        title: taskInput,
        highlight: false
      }
    ]);
    setTaskInput('');
    setNewTaskModal(false);
  };

  return (
    <div className="animate-fade-in dashboard-container" style={{ padding: 'clamp(14px, 2.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. TOP METRIC CARDS ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1: New Bookings */}
        <div className="lodgify-card" style={{
          backgroundColor: '#E6F9EE',
          borderColor: '#D1F4DE',
          padding: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#4B6354', fontWeight: '600' }}>New Bookings</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}>
              <Bookmark size={16} color="#10B981" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            840
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowUpRight size={12} /> 8.70%
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>

        {/* Card 2: Check-In */}
        <div className="lodgify-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Check-In</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogIn size={16} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            231
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowUpRight size={12} /> 3.56%
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>

        {/* Card 3: Check-Out */}
        <div className="lodgify-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Check-Out</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogOut size={16} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            124
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowDownRight size={12} /> 1.06%
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="lodgify-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Total Revenue</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IndianRupee size={16} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            ₹123,980
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowUpRight size={12} /> 5.70%
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S ARRIVALS */}
      <TodaysArrivals onNavigateTab={onNavigateTab} />

      {/* 3. MAIN GRID: 2 COLUMNS (LEFT 2/3, RIGHT 1/3) */}
      <div className="dashboard-main-grid" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        
        {/* LEFT COLUMN: ROOM AVAILABILITY & REVENUE, RESERVATIONS & BOOKING PLATFORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ROW 1: Room Availability (Left) + Revenue Wave (Right) */}
          <div className="dashboard-sub-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: '20px'
          }}>
            {/* Room Availability Card */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Room Availability</h2>
                <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Segmented bar matching screenshot */}
              <div style={{
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                overflow: 'hidden',
                marginBottom: '24px',
                gap: '2px'
              }}>
                <div style={{ flex: 6.8, backgroundColor: '#D1FAE5' }} title="Occupied (68%)" />
                <div style={{ flex: 2.1, backgroundColor: '#FEF08A' }} title="Reserved (21%)" />
                <div style={{ flex: 0.8, backgroundColor: '#BEF264' }} title="Available (8%)" />
                <div style={{ flex: 0.3, backgroundColor: '#E2E8F0' }} title="Not Ready (3%)" />
              </div>

              {/* 4 Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Occupied</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>286</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Reserved</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>87</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Available</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>32</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Not Ready</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>13</div>
                </div>
              </div>
            </div>

            {/* Revenue Chart Card */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Revenue</h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F4FBD0',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}>
                  <span>{revenueRange}</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* SVG Wavy Revenue Line Chart with Badge */}
              <div style={{ position: 'relative', width: '100%', height: '180px', marginTop: '10px' }}>
                {/* Floating Badge ₹315,060 */}
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  left: '46%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#D4F05B',
                  color: '#0F172A',
                  fontWeight: '800',
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                  zIndex: 5
                }}>
                  ₹315,060
                  {/* Small triangular pointer */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '4px solid #D4F05B'
                  }} />
                </div>

                <svg viewBox="0 0 500 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4F05B" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#D4F05B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#E2E8F0" />

                  {/* Smooth curve */}
                  <path
                    d="M 10 90 Q 60 100 110 80 T 230 45 T 350 85 T 480 95 L 480 150 L 10 150 Z"
                    fill="url(#revenueGrad)"
                  />
                  <path
                    d="M 10 90 Q 60 100 110 80 T 230 45 T 350 85 T 480 95"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                  />

                  {/* Active Point dot */}
                  <circle cx="230" cy="45" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
                </svg>

                {/* X-Axis labels */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: '#94A3B8',
                  marginTop: '4px'
                }}>
                  <span>Dec 2027</span>
                  <span>Jan 2028</span>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>Feb 2028</span>
                  <span>Mar 2028</span>
                  <span>Apr 2028</span>
                  <span>May 2028</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Reservations Bar Chart + Booking by Platform Donut */}
          <div className="dashboard-sub-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '20px'
          }}>
            {/* Reservations Bar Chart */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Reservations</h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F4FBD0',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}>
                  <span>{reservationsRange}</span>
                  <ChevronDown size={12} />
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D1FAE5' }} />
                  <span style={{ color: '#64748B' }}>Booked</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FEF08A' }} />
                  <span style={{ color: '#64748B' }}>Canceled</span>
                </div>
              </div>

              {/* 7-day Bar chart matching screenshot */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '130px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                {[
                  { day: '12 Jun', booked: 65, canceled: 15 },
                  { day: '13 Jun', booked: 75, canceled: 20 },
                  { day: '14 Jun', booked: 60, canceled: 12 },
                  { day: '15 Jun', booked: 85, canceled: 18 },
                  { day: '16 Jun', booked: 90, canceled: 22 },
                  { day: '17 Jun', booked: 70, canceled: 15 },
                  { day: '18 Jun', booked: 80, canceled: 16 }
                ].map((col, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '28px' }}>
                    <div style={{
                      width: '18px',
                      height: `${col.booked + col.canceled}px`,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column-reverse'
                    }}>
                      <div style={{ height: `${col.booked}px`, backgroundColor: '#D1FAE5' }} />
                      <div style={{ height: `${col.canceled}px`, backgroundColor: '#FEF08A' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>{col.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking by Platform Donut Chart */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Booking by Platform</h2>
                <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                {/* SVG Donut Chart */}
                <div style={{ width: '120px', height: '120px', minWidth: '120px' }}>
                  <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Ring segments */}
                    {/* Direct Booking 61% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#A7F3D0" strokeWidth="6" strokeDasharray="61 39" strokeDashoffset="0" />
                    {/* Booking.com 12% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#D4F05B" strokeWidth="6" strokeDasharray="12 88" strokeDashoffset="-61" />
                    {/* Agoda 11% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#BEF264" strokeWidth="6" strokeDasharray="11 89" strokeDashoffset="-73" />
                    {/* Airbnb 9% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FEF08A" strokeWidth="6" strokeDasharray="9 91" strokeDashoffset="-84" />
                    {/* Hotels.com 5% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="5 95" strokeDashoffset="-93" />
                    {/* Others 2% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#94A3B8" strokeWidth="6" strokeDasharray="2 98" strokeDashoffset="-98" />
                  </svg>
                </div>

                {/* Legend list matching screenshot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A7F3D0' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>61%</span>
                    <span style={{ color: '#64748B' }}>Direct Booking</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4F05B' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>12%</span>
                    <span style={{ color: '#64748B' }}>Booking.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#BEF264' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>11%</span>
                    <span style={{ color: '#64748B' }}>Agoda</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FEF08A' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>9%</span>
                    <span style={{ color: '#64748B' }}>Airbnb</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>5%</span>
                    <span style={{ color: '#64748B' }}>Hotels.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>2%</span>
                    <span style={{ color: '#64748B' }}>Others</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OVERALL RATING & TASKS WIDGET */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Overall Rating */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Overall Rating</h2>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Score header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                fontWeight: '800',
                fontSize: '20px',
                padding: '6px 14px',
                borderRadius: '12px'
              }}>
                4.6 <span style={{ fontSize: '13px', fontWeight: '600', opacity: 0.8 }}>/5</span>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Impressive</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>from 2,544 reviews</div>
              </div>
            </div>

            {/* Category breakdown bars matching screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Facilities', score: 4.4, width: '88%' },
                { name: 'Cleanliness', score: 4.7, width: '94%' },
                { name: 'Services', score: 4.6, width: '92%' },
                { name: 'Comfort', score: 4.8, width: '96%' },
                { name: 'Location', score: 4.5, width: '90%' }
              ].map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
                  <span style={{ width: '80px', color: '#64748B', fontWeight: '500' }}>{cat.name}</span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: cat.width, height: '100%', backgroundColor: '#FEF08A', borderRadius: '9999px' }} />
                  </div>
                  <span style={{ width: '24px', textAlign: 'right', fontWeight: '700', color: '#0F172A' }}>{cat.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Tasks Widget matching screenshot */}
          <div className="lodgify-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Tasks</h2>
              <button
                onClick={() => setNewTaskModal(true)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#D4F05B',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                }}
              >
                <Plus size={16} color="#0F172A" />
              </button>
            </div>

            {/* Tasks list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    backgroundColor: t.highlight ? '#FEF9C3' : '#F8FAFC',
                    border: t.highlight ? '1px solid #FEF08A' : '1px solid #E8EEF5',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{t.date}</span>
                    <button style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 0 }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', lineHeight: 1.4 }}>
                    {t.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* New Task Modal */}
      {newTaskModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '440px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: '#0F172A' }}>
              Add Management Task
            </h3>
            <input
              type="text"
              placeholder="e.g. VIP guest welcome gift in Room 301"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="input-clean"
              style={{ width: '100%', marginBottom: '18px', borderRadius: '12px' }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setNewTaskModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddTask} className="btn-primary">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
