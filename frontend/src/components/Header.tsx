import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, RefreshCw, LogOut, Sun, Moon } from 'lucide-react';

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
  onNavigateTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onSyncOta, 
  isSyncing,
  currentUser,
  onLogout,
  onNavigateTab
}) => {
  const userName = currentUser?.name || 'Jaylon Dorwart';
  const userRole = currentUser?.role || 'Admin';
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('hms_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hms_theme', theme);
    window.dispatchEvent(new CustomEvent('hms_theme_changed', { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
    <header className="app-header" style={{
      height: '76px',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(18px, 2vw, 22px)',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.3px',
        margin: 0
      }}>
        {title}
      </h1>

      {/* Right controls: Search + Actions + User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search input pill */}
        <div className="app-header-search" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '260px'
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
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              cursor: isSyncing ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} color={isSyncing ? '#94A3B8' : '#10B981'} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Channels'}</span>
          </button>
        )}

        {/* Theme Toggle Button (Dark / Light Scheme) */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Scheme' : 'Switch to Light Scheme'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: theme === 'dark' ? '#FBBF24' : '#64748B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease, transform 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Settings Button */}
        {userRole === 'Admin' && (
          <button 
            onClick={() => onNavigateTab?.('admin')}
            title="Master Data & Admin Settings"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: '#64748B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
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
        <div 
          onClick={() => userRole === 'Admin' && onNavigateTab?.('admin')}
          title={userRole === 'Admin' ? 'Open Master Data & Admin Profile' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingLeft: '12px',
            borderLeft: '1px solid #E8EEF5',
            cursor: userRole === 'Admin' ? 'pointer' : 'default'
          }}
        >
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
          <div className="header-user-info">
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>
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
