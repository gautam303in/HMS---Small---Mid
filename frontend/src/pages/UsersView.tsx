import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  username: string;
  role: 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen';
  department: string;
  allowedTabs: string[];
  landingTab: string;
  createdAt: string;
}

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: 'usr-1',
      name: 'Jaylon Dorwart',
      username: 'admin',
      role: 'Admin',
      department: 'Administration',
      allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'users', 'audit'],
      landingTab: 'dashboard',
      createdAt: '2026-09-01'
    },
    {
      id: 'usr-2',
      name: 'Kavita Nair',
      username: 'reception',
      role: 'Reception',
      department: 'Front Office',
      allowedTabs: ['reservation', 'rooms', 'calendar', 'financials'],
      landingTab: 'reservation',
      createdAt: '2026-09-05'
    },
    {
      id: 'usr-3',
      name: 'Priya Sharma',
      username: 'cleaner',
      role: 'Housekeeping',
      department: 'Housekeeping',
      allowedTabs: ['housekeeping'],
      landingTab: 'housekeeping',
      createdAt: '2026-09-08'
    },
    {
      id: 'usr-4',
      name: 'Antonio Rossi',
      username: 'chef',
      role: 'Kitchen',
      department: 'Food & Beverage',
      allowedTabs: ['concierge', 'inventory'],
      landingTab: 'concierge',
      createdAt: '2026-09-10'
    }
  ]);

  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Reception' as 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen'
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:5000/api/users')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (mounted && data) setUsers(data);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.username || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setUsers([data, ...users]);
        setSuccessMsg(`User "${data.username}" created successfully with ${data.role} access!`);
        setCreateModal(false);
        setFormData({ name: '', username: '', password: '', role: 'Reception' });
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch {
      // Local fallback
      const rolePerms = {
        Reception: { allowedTabs: ['reservation', 'rooms', 'calendar', 'financials'], landingTab: 'reservation', department: 'Front Office' },
        Housekeeping: { allowedTabs: ['housekeeping'], landingTab: 'housekeeping', department: 'Housekeeping' },
        Kitchen: { allowedTabs: ['concierge', 'inventory'], landingTab: 'concierge', department: 'Food & Beverage' },
        Admin: { allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'users', 'audit'], landingTab: 'dashboard', department: 'Administration' }
      }[formData.role];

      const newUser: SystemUser = {
        id: `usr-${Date.now()}`,
        name: formData.name,
        username: formData.username.toLowerCase().trim(),
        role: formData.role,
        department: rolePerms.department,
        allowedTabs: rolePerms.allowedTabs,
        landingTab: rolePerms.landingTab,
        createdAt: new Date().toISOString().slice(0, 10)
      };

      setUsers([newUser, ...users]);
      setSuccessMsg(`User "${newUser.username}" created successfully with ${newUser.role} access!`);
      setCreateModal(false);
      setFormData({ name: '', username: '', password: '', role: 'Reception' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return { bg: '#FEF3C7', color: '#92400E', label: '👑 Admin (Full Access)' };
      case 'Reception':
        return { bg: '#E0F2FE', color: '#0369A1', label: '🏨 Reception (Booking & Billing)' };
      case 'Housekeeping':
        return { bg: '#D1FAE5', color: '#065F46', label: '🧹 Housekeeping Only' };
      case 'Kitchen':
        return { bg: '#FEE2E2', color: '#991B1B', label: '🍳 Kitchen & POS Only' };
      default:
        return { bg: '#F1F5F9', color: '#475569', label: role };
    }
  };

  return (
    <div className="animate-fade-in responsive-view-container">
      
      {/* Top Header */}
      <div className="responsive-action-header">
        <div>
          <h2 style={{ fontSize: 'clamp(18px, 2vw, 20px)', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            User Management & Role-Based Access Control (RBAC)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Exclusive Admin Portal: Provision staff credentials and assign module permissions.
          </p>
        </div>

        <button onClick={() => setCreateModal(true)} className="btn-primary">
          <UserPlus size={16} color="#0F172A" />
          <span>Create New User</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div style={{
          backgroundColor: '#D1FAE5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          borderRadius: '12px',
          padding: '12px 18px',
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role Scoping Explanation Cards */}
      <div className="responsive-auto-grid">
        {[
          { role: 'Admin', title: 'Administrator', access: 'All 12 Modules + User Creation', landing: 'Dashboard', bg: '#FEF9C3', border: '#FEF08A' },
          { role: 'Reception', title: 'Reception / Front Desk', access: 'Bookings, Rooms & Final Bill Invoicing', landing: 'Reservation', bg: '#E0F2FE', border: '#BAE6FD' },
          { role: 'Housekeeping', title: 'Housekeeping Team', access: 'Room Status Board & Cleaning Tasks', landing: 'Housekeeping', bg: '#D1FAE5', border: '#A7F3D0' },
          { role: 'Kitchen', title: 'Chef & F&B Crew', access: 'Kitchen POS, KDS Tickets & Ingredients', landing: 'Concierge (KDS)', bg: '#FEE2E2', border: '#FECDD3' }
        ].map((info) => (
          <div key={info.role} className="lodgify-card" style={{ padding: '16px', backgroundColor: info.bg, borderColor: info.border }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: '4px' }}>
              {info.title}
            </div>
            <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4, marginBottom: '8px' }}>
              {info.access}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>
              📍 Lands directly on: <u>{info.landing}</u>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="lodgify-card responsive-table-wrapper" style={{ padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8EEF5', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="#0F172A" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            System Staff Accounts & Role Assignments
          </h3>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Staff Full Name</th>
              <th>User ID / Username</th>
              <th>Assigned Role</th>
              <th>Department</th>
              <th>Landing Destination</th>
              <th>Created On</th>
              <th style={{ textAlign: 'right' }}>Security Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const badge = getRoleBadge(u.role);
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0F172A' }}>{u.name}</div>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      backgroundColor: '#F1F5F9',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#0F172A'
                    }}>
                      {u.username}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '9999px'
                    }}>
                      {badge.label}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{u.department}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                      /{u.landingTab}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{u.createdAt}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#D1FAE5',
                      color: '#065F46',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '9999px'
                    }}>
                      ● Active
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {createModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '32px', maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#D4F05B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserPlus size={20} color="#0F172A" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Create System Staff User
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  Assign a role to restrict landing and accessible modules.
                </p>
              </div>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Staff Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    User ID / Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. reception_sarah"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                  Assign Role & Module Access
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'Reception', label: 'Reception / Front Desk', desc: 'Can access Booking / Reservation and Final Bill Invoicing only.' },
                    { id: 'Housekeeping', label: 'Housekeeping Staff', desc: 'Can access Housekeeping room status board and tasks only.' },
                    { id: 'Kitchen', label: 'Kitchen & F&B Crew', desc: 'Can access Kitchen POS, KDS tickets, and kitchen inventory only.' },
                    { id: 'Admin', label: 'System Administrator', desc: 'Full unrestricted access to all 12 modules + User Creation.' }
                  ].map((r) => (
                    <label
                      key={r.id}
                      onClick={() => setFormData({ ...formData, role: r.id as any })}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '10px',
                        border: formData.role === r.id ? '2px solid #0F172A' : '1px solid #E2E8F0',
                        backgroundColor: formData.role === r.id ? '#F8FAFC' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="userRole"
                        checked={formData.role === r.id}
                        onChange={() => setFormData({ ...formData, role: r.id as any })}
                        style={{ marginTop: '3px', accentColor: '#0F172A' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{r.label}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{r.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User & Grant Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
