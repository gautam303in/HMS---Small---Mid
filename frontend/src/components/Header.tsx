import React from 'react';
import { Search, Bell, Settings, RefreshCw, LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSyncOta?: () => void;
  isSyncing?: boolean;
  currentUser?: {
    name: string;
    username: string;
    role: string;
    department?: string;
  };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onSyncOta, 
  isSyncing,
  currentUser,
  onLogout
}) => {
  const userName = currentUser?.name || 'Jaylon Dorwart';
  const userRole = currentUser?.role || 'Admin';
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return { bg: '#FEF08A', color: '#854D0E' };
      case 'Reception': return { bg: '#BAE6FD', color: '#0369A1' };
      case 'Housekeeping': return { bg: '#A7F3D0', color: '#065F46' };
      case 'Kitchen': return { bg: '#FECDD3', color: '#991B1B' };
      default: return { bg: '#E2E8F0', color: '#334155' };
    }
  };

  const roleStyle = getRoleColor(userRole);

  return (
    <header style={{
      height: '76px',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E8EEF5',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: '22px',
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: '-0.3px',
        margin: 0
      }}>
        {title}
      </h1>

      {/* Right controls: Search + Actions + User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Search input pill */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '280px'
        }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
          <input
            type="text"
            placeholder="Search room, guest, book, etc"
            className="input-clean"
            style={{
              width: '100%',
              paddingLeft: '42px',
              paddingRight: '16px',
              backgroundColor: '#F8FAFC',
              borderColor: '#E8EEF5',
              fontSize: '13px'
            }}
          />
        </div>

        {/* OTA Channel Sync button */}
        {onSyncOta && userRole === 'Admin' && (
          <button
            onClick={onSyncOta}
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              padding: '8px 14px',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              cursor: isSyncing ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} color={isSyncing ? '#94A3B8' : '#10B981'} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Channels'}</span>
          </button>
        )}

        {/* Settings Button */}
        {userRole === 'Admin' && (
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#64748B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Settings size={18} />
          </button>
        )}

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#64748B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bell size={18} />
          </button>
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: '#EF4444',
            borderRadius: '50%',
            border: '2px solid #FFFFFF'
          }} />
        </div>

        {/* User Profile Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: '12px',
          borderLeft: '1px solid #E8EEF5'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFE4E6, #FECDD3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            color: '#E11D48',
            fontSize: '13px',
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', lineHeight: 1.2 }}>
              {userName}
            </div>
            <span style={{
              display: 'inline-block',
              backgroundColor: roleStyle.bg,
              color: roleStyle.color,
              fontSize: '10px',
              fontWeight: '800',
              padding: '1px 6px',
              borderRadius: '9999px',
              marginTop: '2px'
            }}>
              {userRole}
            </span>
          </div>

          {/* Sign Out Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '8px'
              }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
