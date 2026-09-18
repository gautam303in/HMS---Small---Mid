import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  BedDouble, 
  Percent, 
  UtensilsCrossed, 
  Package, 
  Users, 
  Database, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: 'Standard' | 'Deluxe' | 'Executive Suite' | 'Presidential Suite';
  baseRate: number;
  maxGuests: number;
  status: 'Available' | 'Occupied' | 'Dirty' | 'Cleaning' | 'Inspected' | 'OutOfOrder';
  amenities: string[];
}

interface MenuItem {
  id: string;
  name: string;
  category: 'Appetizer' | 'Main Course' | 'Beverage' | 'Dessert' | 'Alcohol';
  price: number;
  prepTime: string;
  available: boolean;
  description?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastRestocked?: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  phone: string;
  email: string;
  status: string;
}

interface DynamicPricingConfig {
  baseOccupancyThreshold: number;
  surgeMultiplier: number;
  weekendMultiplier: number;
  peakSeasonMultiplier: number;
  isSurgeActive: boolean;
}

interface HotelProperty {
  id?: string;
  name: string;
  code: string;
  currencyCode: string;
  currencySymbol: string;
  timezone: string;
  gstin: string;
  hsnSacCode: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

export const AdminMasterView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'rooms' | 'rates' | 'menu' | 'inventory' | 'staff' | 'profile' | 'supabase'
  >('rooms');

  // Master Data State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [pricingConfig, setPricingConfig] = useState<DynamicPricingConfig>({
    baseOccupancyThreshold: 75,
    surgeMultiplier: 1.25,
    weekendMultiplier: 1.15,
    peakSeasonMultiplier: 1.30,
    isSurgeActive: true
  });
  const [property, setProperty] = useState<HotelProperty>({
    name: 'The Grand Azure Hotel & Suites',
    code: 'GA-GOA',
    currencyCode: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    gstin: '27AAAAA0000A1Z5',
    hsnSacCode: '996311',
    address: 'Grand Azure Boulevard, Candolim Beach Road, North Goa 403515',
    contactEmail: 'gm@grandazure.com',
    contactPhone: '+91 832 249 9000',
    logoUrl: ''
  });

  // Supabase State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseServiceKey, setSupabaseServiceKey] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState<{
    isConnected: boolean;
    mode: string;
    latencyMs?: number;
    lastPing?: string;
    errorMessage?: string;
  }>({ isConnected: false, mode: 'Hybrid-In-Memory' });
  const [isTestingSupa, setIsTestingSupa] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [sqlSchema, setSqlSchema] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Status Alerts
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals & Forms
  const [roomModal, setRoomModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: Partial<Room> }>({
    open: false,
    mode: 'create',
    data: {}
  });

  const [menuModal, setMenuModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: Partial<MenuItem> }>({
    open: false,
    mode: 'create',
    data: {}
  });

  const [invModal, setInvModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: Partial<InventoryItem> }>({
    open: false,
    mode: 'create',
    data: {}
  });

  const [staffModal, setStaffModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: Partial<StaffMember> }>({
    open: false,
    mode: 'create',
    data: {}
  });

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Rate Simulator State
  const [simOccupancy, setSimOccupancy] = useState(80);
  const [simIsWeekend, setSimIsWeekend] = useState(true);
  const [simCategory, setSimCategory] = useState<'Standard' | 'Deluxe' | 'Executive Suite' | 'Presidential Suite'>('Deluxe');

  const API_BASE = 'http://localhost:5000/api';

  // Load All Master Data
  const loadMasterData = async () => {
    try {
      const [roomsRes, menuRes, invRes, staffRes, pricingRes, propRes, supaRes, schemaRes] = await Promise.all([
        fetch(`${API_BASE}/rooms`).catch(() => null),
        fetch(`${API_BASE}/pos/menu`).catch(() => null),
        fetch(`${API_BASE}/inventory`).catch(() => null),
        fetch(`${API_BASE}/staff`).catch(() => null),
        fetch(`${API_BASE}/pricing/config`).catch(() => null),
        fetch(`${API_BASE}/hotel/properties`).catch(() => null),
        fetch(`${API_BASE}/integrations/supabase/status`).catch(() => null),
        fetch(`${API_BASE}/integrations/supabase/schema`).catch(() => null)
      ]);

      if (roomsRes && roomsRes.ok) setRooms(await roomsRes.json());
      if (menuRes && menuRes.ok) setMenuItems(await menuRes.json());
      if (invRes && invRes.ok) setInventory(await invRes.json());
      if (staffRes && staffRes.ok) setStaff(await staffRes.json());
      if (pricingRes && pricingRes.ok) setPricingConfig(await pricingRes.json());
      if (propRes && propRes.ok) {
        const propData = await propRes.json();
        setProperty(propData);
        if (propData.logoUrl) {
          localStorage.setItem('hms_hotel_logo', propData.logoUrl);
          window.dispatchEvent(new Event('hms_logo_updated'));
        }
      }
      if (supaRes && supaRes.ok) {
        const supaData = await supaRes.json();
        setSupabaseStatus(supaData);
        if (supaData.config?.url) setSupabaseUrl(supaData.config.url);
      }
      if (schemaRes && schemaRes.ok) {
        setSqlSchema(await schemaRes.text());
      }
    } catch (err) {
      console.error('Error loading master data:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await loadMasterData();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // -------------------------------------------------------------
  // ROOM CRUD
  // -------------------------------------------------------------
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = roomModal.data;
    try {
      const url = roomModal.mode === 'create' ? `${API_BASE}/rooms` : `${API_BASE}/rooms/${d.id}`;
      const method = roomModal.mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: d.roomNumber,
          floor: Number(d.floor) || 1,
          category: d.category || 'Standard',
          baseRate: Number(d.baseRate) || 2500,
          maxGuests: Number(d.maxGuests) || 2,
          status: d.status || 'Available',
          amenities: typeof d.amenities === 'string' 
            ? (d.amenities as string).split(',').map(s => s.trim()).filter(Boolean)
            : (d.amenities || ['Wi-Fi', 'Smart TV'])
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save room');
      }

      showNotification(`Room ${d.roomNumber} ${roomModal.mode === 'create' ? 'created' : 'updated'} successfully!`);
      setRoomModal({ open: false, mode: 'create', data: {} });
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteRoom = async (id: string, roomNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete Room ${roomNumber} from Master Data?`)) return;
    try {
      const res = await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete room');
      showNotification(`Room ${roomNumber} deleted successfully.`);
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // RATES & PRICING CRUD
  // -------------------------------------------------------------
  const handleSavePricingConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/pricing/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingConfig)
      });
      if (!res.ok) throw new Error('Failed to update dynamic pricing rules');
      showNotification('Dynamic surge pricing configuration saved successfully!');
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // MENU CRUD
  // -------------------------------------------------------------
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = menuModal.data;
    try {
      const url = menuModal.mode === 'create' ? `${API_BASE}/pos/menu` : `${API_BASE}/pos/menu/${d.id}`;
      const method = menuModal.mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: d.name,
          category: d.category || 'Main Course',
          price: Number(d.price) || 0,
          prepTime: d.prepTime || '15 min',
          available: d.available !== undefined ? d.available : true,
          description: d.description || ''
        })
      });

      if (!res.ok) throw new Error('Failed to save menu dish');
      showNotification(`Menu item "${d.name}" saved successfully!`);
      setMenuModal({ open: false, mode: 'create', data: {} });
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from F&B menu catalog?`)) return;
    try {
      const res = await fetch(`${API_BASE}/pos/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete menu item');
      showNotification(`"${name}" removed from menu.`);
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // INVENTORY CRUD
  // -------------------------------------------------------------
  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = invModal.data;
    try {
      const url = invModal.mode === 'create' ? `${API_BASE}/inventory` : `${API_BASE}/inventory/${d.id}`;
      const method = invModal.mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: d.name,
          category: d.category || 'Housekeeping Supplies',
          currentStock: Number(d.currentStock) || 0,
          minThreshold: Number(d.minThreshold) || 10,
          unit: d.unit || 'pcs',
          unitCost: Number(d.unitCost) || 0,
          supplier: d.supplier || 'Vendor'
        })
      });

      if (!res.ok) throw new Error('Failed to save inventory item');
      showNotification(`Inventory item "${d.name}" saved successfully!`);
      setInvModal({ open: false, mode: 'create', data: {} });
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteInventory = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from Inventory catalog?`)) return;
    try {
      const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete inventory SKU');
      showNotification(`"${name}" removed from inventory.`);
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // STAFF CRUD
  // -------------------------------------------------------------
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = staffModal.data;
    try {
      const url = staffModal.mode === 'create' ? `${API_BASE}/staff` : `${API_BASE}/staff/${d.id}`;
      const method = staffModal.mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: d.name,
          role: d.role || 'Front Desk Officer',
          department: d.department || 'Front Office',
          shift: d.shift || 'Morning (06:00-14:00)',
          phone: d.phone || '+91 98450 00000',
          email: d.email || `${d.name?.toLowerCase().replace(/\s+/g, '.')}@grandazure.com`,
          status: d.status || 'On Duty'
        })
      });

      if (!res.ok) throw new Error('Failed to save staff record');
      showNotification(`Staff member "${d.name}" saved successfully!`);
      setStaffModal({ open: false, mode: 'create', data: {} });
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from Active Staff Roster?`)) return;
    try {
      const res = await fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove staff member');
      showNotification(`"${name}" offboarded successfully.`);
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // HOTEL PROPERTY MASTER & LOGO UPLOAD
  // -------------------------------------------------------------
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification('Logo image must be smaller than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setProperty(prev => ({ ...prev, logoUrl: result }));
        showNotification('Logo selected! Click "Save Hotel Master Profile" to commit changes.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setProperty(prev => ({ ...prev, logoUrl: '' }));
    localStorage.removeItem('hms_hotel_logo');
    window.dispatchEvent(new Event('hms_logo_updated'));
    showNotification('Logo removed. Click "Save Hotel Master Profile" to confirm.');
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/hotel/properties`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property)
      });
      if (!res.ok) throw new Error('Failed to update hotel property');
      if (property.logoUrl) {
        localStorage.setItem('hms_hotel_logo', property.logoUrl);
      } else {
        localStorage.removeItem('hms_hotel_logo');
      }
      window.dispatchEvent(new Event('hms_logo_updated'));
      showNotification('Hotel Master Profile & Logo updated successfully!');
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // SUPABASE ACTIONS
  // -------------------------------------------------------------
  const handleConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingSupa(true);
    try {
      const res = await fetch(`${API_BASE}/integrations/supabase/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: supabaseUrl,
          anonKey: supabaseAnonKey,
          serviceRoleKey: supabaseServiceKey,
          databaseUrl
        })
      });
      const data = await res.json();
      setSupabaseStatus(data.status);
      if (data.success) {
        showNotification('Successfully connected to Supabase PostgreSQL database!');
      } else {
        showNotification(data.message || 'Connection test failed', 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setIsTestingSupa(false);
    }
  };

  const handleSyncMasterData = async (direction: 'push' | 'pull' = 'push') => {
    setIsSyncingData(true);
    try {
      const res = await fetch(`${API_BASE}/integrations/supabase/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
      } else {
        showNotification(data.message, 'error');
      }
      loadMasterData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setIsSyncingData(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    showNotification('Supabase PostgreSQL schema copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Simulated Rate Computation for Rates tab
  const calculateSimulatedRate = () => {
    const baseTariffs: Record<string, number> = {
      'Standard': 2500,
      'Deluxe': 3500,
      'Executive Suite': 6500,
      'Presidential Suite': 12500
    };
    let base = baseTariffs[simCategory] || 3500;
    let factor = 1.0;
    if (pricingConfig.isSurgeActive && simOccupancy >= pricingConfig.baseOccupancyThreshold) {
      factor *= pricingConfig.surgeMultiplier;
    }
    if (pricingConfig.isSurgeActive && simIsWeekend) {
      factor *= pricingConfig.weekendMultiplier;
    }
    return Math.round(base * factor);
  };

  return (
    <div className="animate-fade-in responsive-view-container">
      
      {/* Top Banner: Admin Master Data Hub */}
      <div className="lodgify-card admin-top-banner" style={{
        background: 'linear-gradient(135deg, #0A5360 0%, #0E94A8 100%)',
        color: '#FFFFFF',
        padding: '24px 28px',
        marginBottom: '24px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(14, 148, 168, 0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 'clamp(17px, 2vw, 20px)', fontWeight: '800', margin: 0, letterSpacing: '-0.3px' }}>
                Master Data Administration & Database Hub
              </h2>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                Enterprise Tier
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
              Configure master catalog records for Rooms, Rates, POS Menu, Inventory, Workforce, and Supabase Cloud Link.
            </p>
          </div>
        </div>

        {/* Supabase Status Pill on Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: supabaseStatus.isConnected ? '#34D399' : '#FBBF24'
          }} />
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Database Mode
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>
              {supabaseStatus.isConnected ? 'Supabase Connected' : 'Hybrid Resilient Store'}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {feedbackMsg && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: feedbackMsg.type === 'success' ? '#065F46' : '#991B1B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="responsive-subtabs" style={{
        marginBottom: '20px',
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'rooms', label: `Rooms Matrix (${rooms.length})`, icon: BedDouble },
          { id: 'rates', label: 'Rates & Dynamic Surge', icon: Percent },
          { id: 'menu', label: `F&B Menu Catalog (${menuItems.length})`, icon: UtensilsCrossed },
          { id: 'inventory', label: `Inventory Items (${inventory.length})`, icon: Package },
          { id: 'staff', label: `Staff & Roster (${staff.length})`, icon: Users },
          { id: 'profile', label: 'Hotel Master Profile', icon: Building2 },
          { id: 'supabase', label: 'Supabase Database Link', icon: Database, badge: supabaseStatus.isConnected ? 'Live' : 'Ready' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setCategoryFilter('All');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isActive ? '#0E94A8' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#475569',
                fontSize: '13px',
                fontWeight: isActive ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(14, 148, 168, 0.25)' : 'none'
              }}
            >
              <Icon size={16} color={isActive ? '#FFFFFF' : '#64748B'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : '#D1FAE5',
                  color: isActive ? '#FFFFFF' : '#065F46'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. ROOMS CATALOG TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'rooms' && (
        <div className="lodgify-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Room Inventory & Master Rates
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Add and manage room inventory, room categories, default base tariffs, and room amenity packages.
              </p>
            </div>
            <button
              onClick={() => setRoomModal({ open: true, mode: 'create', data: { floor: 1, category: 'Standard', baseRate: 2500, maxGuests: 2, status: 'Available' } })}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> Add New Room
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 12px' }}>Room #</th>
                  <th style={{ padding: '10px 12px' }}>Floor</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Base Tariff (INR)</th>
                  <th style={{ padding: '10px 12px' }}>Capacity</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Amenities</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px', fontWeight: '800', color: '#0F172A' }}>
                      {room.roomNumber}
                    </td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      Floor {room.floor}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8'
                      }}>
                        {room.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0F172A' }}>
                      ₹{room.baseRate.toLocaleString()}
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '400' }}> / nt</span>
                    </td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      {room.maxGuests} Guests
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: room.status === 'Available' ? '#D1FAE5' : room.status === 'Occupied' ? '#EFF6FF' : '#FEF08A',
                        color: room.status === 'Available' ? '#065F46' : room.status === 'Occupied' ? '#1D4ED8' : '#854D0E'
                      }}>
                        {room.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748B', maxWidth: '240px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(room.amenities || []).slice(0, 3).map((am, i) => (
                          <span key={i} style={{ fontSize: '10px', backgroundColor: '#F1F5F9', padding: '1px 6px', borderRadius: '4px' }}>
                            {am}
                          </span>
                        ))}
                        {(room.amenities || []).length > 3 && (
                          <span style={{ fontSize: '10px', color: '#94A3B8' }}>+{(room.amenities || []).length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => setRoomModal({ open: true, mode: 'edit', data: room })}
                        style={{ background: 'none', border: 'none', color: '#0E94A8', cursor: 'pointer', marginRight: '8px' }}
                        title="Edit Room"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                        title="Delete Room"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RATES & DYNAMIC SURGE TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'rates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Left: Dynamic Pricing Rules Form */}
          <div className="lodgify-card">
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Dynamic Surge Pricing Parameters
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
              Automated rate adjustments based on property occupancy, weekend dates, and peak holiday seasons.
            </p>

            <form onSubmit={handleSavePricingConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Surge Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                    Automated Surge Pricing Active
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    When enabled, booking rates float based on the rules below.
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={pricingConfig.isSurgeActive}
                    onChange={e => setPricingConfig({ ...pricingConfig, isSurgeActive: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: pricingConfig.isSurgeActive ? '#0E94A8' : '#CBD5E1',
                    borderRadius: '24px',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      height: '18px',
                      width: '18px',
                      left: pricingConfig.isSurgeActive ? '22px' : '3px',
                      bottom: '3px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      transition: '0.3s'
                    }} />
                  </span>
                </label>
              </div>

              {/* Base Occupancy Threshold */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Occupancy Surge Trigger Threshold ({pricingConfig.baseOccupancyThreshold}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={pricingConfig.baseOccupancyThreshold}
                  onChange={e => setPricingConfig({ ...pricingConfig, baseOccupancyThreshold: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#0E94A8' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8' }}>
                  <span>50%</span>
                  <span>75% (Standard)</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Multipliers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Occupancy Surge
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="2.5"
                    value={pricingConfig.surgeMultiplier}
                    onChange={e => setPricingConfig({ ...pricingConfig, surgeMultiplier: Number(e.target.value) })}
                    className="input-clean"
                  />
                  <span style={{ fontSize: '10px', color: '#64748B' }}>e.g. 1.25 = +25%</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Weekend Factor
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="2.0"
                    value={pricingConfig.weekendMultiplier}
                    onChange={e => setPricingConfig({ ...pricingConfig, weekendMultiplier: Number(e.target.value) })}
                    className="input-clean"
                  />
                  <span style={{ fontSize: '10px', color: '#64748B' }}>e.g. 1.15 = +15%</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Peak Season
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="3.0"
                    value={pricingConfig.peakSeasonMultiplier}
                    onChange={e => setPricingConfig({ ...pricingConfig, peakSeasonMultiplier: Number(e.target.value) })}
                    className="input-clean"
                  />
                  <span style={{ fontSize: '10px', color: '#64748B' }}>e.g. 1.30 = +30%</span>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                Save Dynamic Pricing Rules
              </button>
            </form>
          </div>

          {/* Right: Live Tariff Simulation Simulator */}
          <div className="lodgify-card" style={{ backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} color="#0E94A8" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Live Rate Calculator & Simulator
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Select Room Category</label>
                <select
                  value={simCategory}
                  onChange={e => setSimCategory(e.target.value as any)}
                  className="input-clean"
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  <option value="Standard">Standard Room (Base: ₹2,500)</option>
                  <option value="Deluxe">Deluxe Room (Base: ₹3,500)</option>
                  <option value="Executive Suite">Executive Suite (Base: ₹6,500)</option>
                  <option value="Presidential Suite">Presidential Suite (Base: ₹12,500)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                  Simulated Hotel Occupancy: {simOccupancy}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={simOccupancy}
                  onChange={e => setSimOccupancy(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0E94A8', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="simWeekend"
                  checked={simIsWeekend}
                  onChange={e => setSimIsWeekend(e.target.checked)}
                />
                <label htmlFor="simWeekend" style={{ fontSize: '12px', color: '#334155', fontWeight: '600' }}>
                  Simulate Weekend Booking (Fri - Sun)
                </label>
              </div>

              {/* Calculated Rate Result Card */}
              <div style={{
                marginTop: '12px',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Effective Dynamic Tariff
                </span>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#0E94A8', marginTop: '4px' }}>
                  ₹{calculateSimulatedRate().toLocaleString()}
                  <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '400' }}> / night</span>
                </div>
                <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '6px', fontWeight: '600' }}>
                  {simOccupancy >= pricingConfig.baseOccupancyThreshold && pricingConfig.isSurgeActive && (
                    <span>• High Occupancy Surge (+{((pricingConfig.surgeMultiplier - 1) * 100).toFixed(0)}%) </span>
                  )}
                  {simIsWeekend && pricingConfig.isSurgeActive && (
                    <span>• Weekend Demand (+{((pricingConfig.weekendMultiplier - 1) * 100).toFixed(0)}%)</span>
                  )}
                  {(!pricingConfig.isSurgeActive || (simOccupancy < pricingConfig.baseOccupancyThreshold && !simIsWeekend)) && (
                    <span>Standard Base Tariff Applied</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MENU CATALOG TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'menu' && (
        <div className="lodgify-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Restaurant & In-Room Dining Menu Catalog
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Manage dishes, pricing in INR, preparation times, and dish availability across POS terminals.
              </p>
            </div>
            <button
              onClick={() => setMenuModal({ open: true, mode: 'create', data: { category: 'Main Course', price: 500, prepTime: '15 min', available: true } })}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> Add Menu Dish
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['All', 'Main Course', 'Appetizer', 'Beverage', 'Dessert', 'Alcohol'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: categoryFilter === cat ? '#0F172A' : '#FFFFFF',
                  color: categoryFilter === cat ? '#FFFFFF' : '#475569',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 12px' }}>Dish Name</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Price (INR)</th>
                  <th style={{ padding: '10px 12px' }}>Prep Time</th>
                  <th style={{ padding: '10px 12px' }}>Availability</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems
                  .filter(m => categoryFilter === 'All' || m.category === categoryFilter)
                  .map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '700', color: '#0F172A' }}>{item.name}</div>
                        {item.description && (
                          <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '300px' }}>{item.description}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '11px', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '800', color: '#0F172A' }}>
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: '#64748B' }}>
                        {item.prepTime}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: item.available ? '#D1FAE5' : '#FEE2E2',
                          color: item.available ? '#065F46' : '#991B1B'
                        }}>
                          {item.available ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => setMenuModal({ open: true, mode: 'edit', data: item })}
                          style={{ background: 'none', border: 'none', color: '#0E94A8', cursor: 'pointer', marginRight: '8px' }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id, item.name)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INVENTORY CATALOG TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'inventory' && (
        <div className="lodgify-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Hotel & Kitchen Inventory Master
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Housekeeping amenities, linen pars, food ingredients, and supplier replenishment settings.
              </p>
            </div>
            <button
              onClick={() => setInvModal({ open: true, mode: 'create', data: { category: 'Kitchen', currentStock: 20, minThreshold: 10, unit: 'pcs', unitCost: 100 } })}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> Add Inventory SKU
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 12px' }}>Item Name</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Stock Balance</th>
                  <th style={{ padding: '10px 12px' }}>Threshold</th>
                  <th style={{ padding: '10px 12px' }}>Unit Cost</th>
                  <th style={{ padding: '10px 12px' }}>Supplier</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0F172A' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        fontWeight: '700',
                        color: item.currentStock <= item.minThreshold ? '#DC2626' : '#0F172A'
                      }}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748B' }}>
                      {item.minThreshold} {item.unit}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '600' }}>
                      ₹{item.unitCost} / {item.unit}
                    </td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      {item.supplier}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => setInvModal({ open: true, mode: 'edit', data: item })}
                        style={{ background: 'none', border: 'none', color: '#0E94A8', cursor: 'pointer', marginRight: '8px' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteInventory(item.id, item.name)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. STAFF & WORKFORCE TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'staff' && (
        <div className="lodgify-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Staff Directory & Workforce Roster
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Add new team members, assign operational roles, departments, and working shift timings.
              </p>
            </div>
            <button
              onClick={() => setStaffModal({ open: true, mode: 'create', data: { role: 'Front Desk Officer', department: 'Front Office', shift: 'Morning (06:00-14:00)', status: 'On Duty' } })}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> Onboard Staff Member
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 12px' }}>Staff Name</th>
                  <th style={{ padding: '10px 12px' }}>Role</th>
                  <th style={{ padding: '10px 12px' }}>Department</th>
                  <th style={{ padding: '10px 12px' }}>Shift</th>
                  <th style={{ padding: '10px 12px' }}>Contact</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px', fontWeight: '800', color: '#0F172A' }}>
                      {member.name}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#334155' }}>
                      {member.role}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                        {member.department}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748B' }}>
                      {member.shift}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#475569' }}>
                      <div>{member.phone}</div>
                      <div style={{ color: '#94A3B8' }}>{member.email}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: member.status === 'On Duty' ? '#D1FAE5' : '#F1F5F9',
                        color: member.status === 'On Duty' ? '#065F46' : '#64748B'
                      }}>
                        {member.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => setStaffModal({ open: true, mode: 'edit', data: member })}
                        style={{ background: 'none', border: 'none', color: '#0E94A8', cursor: 'pointer', marginRight: '8px' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member.id, member.name)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. HOTEL MASTER PROFILE TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
          <div className="lodgify-card">
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Hotel Property & Statutory Compliance
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
              Configure property entity details, GSTIN number, HSN/SAC codes, and official receipt headers.
            </p>

            <form onSubmit={handleSaveProperty} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Hotel Brand Logo Upload Section */}
              <div style={{
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={18} color="#0E94A8" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                        Hotel Brand Logo
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Upload your official property logo (PNG, JPG, SVG, WebP up to 2MB).
                      </div>
                    </div>
                  </div>
                  {property.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: '#EF4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '700'
                      }}
                    >
                      <X size={14} /> Remove Logo
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Logo Preview */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '2px dashed #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    {property.logoUrl ? (
                      <img
                        src={property.logoUrl}
                        alt="Property Logo Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                        <ImageIcon size={28} />
                        <div style={{ fontSize: '9px', marginTop: '2px' }}>No Logo</div>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#0E94A8',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      width: 'fit-content'
                    }}>
                      <Upload size={14} />
                      <span>Choose Logo File</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        onChange={handleLogoFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>or URL:</span>
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={property.logoUrl || ''}
                        onChange={e => setProperty({ ...property, logoUrl: e.target.value })}
                        className="input-clean"
                        style={{ fontSize: '11px', padding: '6px 10px', height: '32px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Property Legal Name
                </label>
                <input
                  type="text"
                  value={property.name}
                  onChange={e => setProperty({ ...property, name: e.target.value })}
                  className="input-clean"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Property Code
                  </label>
                  <input
                    type="text"
                    value={property.code}
                    onChange={e => setProperty({ ...property, code: e.target.value })}
                    className="input-clean"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Default Currency
                  </label>
                  <input
                    type="text"
                    value={`${property.currencyCode} (${property.currencySymbol})`}
                    disabled
                    className="input-clean"
                    style={{ backgroundColor: '#F8FAFC', color: '#64748B' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    GSTIN Number (Tax Identifier)
                  </label>
                  <input
                    type="text"
                    value={property.gstin}
                    onChange={e => setProperty({ ...property, gstin: e.target.value })}
                    className="input-clean"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    HSN/SAC Code (Lodging)
                  </label>
                  <input
                    type="text"
                    value={property.hsnSacCode}
                    onChange={e => setProperty({ ...property, hsnSacCode: e.target.value })}
                    className="input-clean"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Property Address
                </label>
                <input
                  type="text"
                  value={property.address || ''}
                  onChange={e => setProperty({ ...property, address: e.target.value })}
                  className="input-clean"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={property.contactEmail || ''}
                    onChange={e => setProperty({ ...property, contactEmail: e.target.value })}
                    className="input-clean"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={property.contactPhone || ''}
                    onChange={e => setProperty({ ...property, contactPhone: e.target.value })}
                    className="input-clean"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                Save Hotel Master Profile
              </button>
            </form>
          </div>

          {/* Admin User Profile Card */}
          <div className="lodgify-card" style={{ backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
              Administrator Account Details
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFE4E6, #FECDD3)',
                color: '#E11D48',
                fontSize: '20px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}>
                JD
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Jaylon Dorwart</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>General Manager & Head Administrator</div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#FEF08A',
                  color: '#854D0E',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  marginTop: '4px'
                }}>
                  Super Admin
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
                <span style={{ color: '#64748B' }}>Username:</span>
                <strong style={{ color: '#0F172A' }}>admin</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
                <span style={{ color: '#64748B' }}>Department:</span>
                <strong style={{ color: '#0F172A' }}>Administration</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
                <span style={{ color: '#64748B' }}>Active Access Modules:</span>
                <strong style={{ color: '#10B981' }}>14 Modules (Full RBAC)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
                <span style={{ color: '#64748B' }}>Security Token:</span>
                <span style={{ color: '#64748B', fontFamily: 'monospace' }}>jwt-simulated-active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SUPABASE DATABASE LINK TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'supabase' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Left: Supabase Config Form */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Database size={20} color="#059669" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Supabase Project Credentials & Link
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                  Connect your cloud Supabase PostgreSQL database for persistent master data.
                </p>
              </div>
            </div>

            <form onSubmit={handleConnectSupabase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  className="input-clean"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Supabase Anon / Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={e => setSupabaseAnonKey(e.target.value)}
                  className="input-clean"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Service Role Key (Optional - for high-privilege sync)
                </label>
                <input
                  type="password"
                  placeholder="Optional service_role secret"
                  value={supabaseServiceKey}
                  onChange={e => setSupabaseServiceKey(e.target.value)}
                  className="input-clean"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Direct PostgreSQL Pooler URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres"
                  value={databaseUrl}
                  onChange={e => setDatabaseUrl(e.target.value)}
                  className="input-clean"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isTestingSupa}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} className={isTestingSupa ? 'animate-spin' : ''} />
                  <span>{isTestingSupa ? 'Verifying Link...' : 'Save & Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSyncMasterData('push')}
                  disabled={isSyncingData}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: isSyncingData ? 'not-allowed' : 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={isSyncingData ? 'animate-spin' : ''} />
                  <span>{isSyncingData ? 'Syncing...' : 'Sync Master Data to Cloud'}</span>
                </button>
              </div>
            </form>

            {/* Link Status Card */}
            <div style={{
              marginTop: '20px',
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: supabaseStatus.isConnected ? '#D1FAE5' : '#FEF3C7',
              border: `1px solid ${supabaseStatus.isConnected ? '#A7F3D0' : '#FDE68A'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {supabaseStatus.isConnected ? (
                  <CheckCircle2 size={18} color="#059669" />
                ) : (
                  <AlertTriangle size={18} color="#D97706" />
                )}
                <strong style={{ fontSize: '13px', color: supabaseStatus.isConnected ? '#065F46' : '#92400E' }}>
                  {supabaseStatus.isConnected ? 'Cloud PostgreSQL Link Active' : 'Operating in Resilient Hybrid Mode'}
                </strong>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: supabaseStatus.isConnected ? '#047857' : '#B45309' }}>
                {supabaseStatus.errorMessage || (supabaseStatus.isConnected 
                  ? `Response latency: ${supabaseStatus.latencyMs || 45}ms. Master records are automatically mirrored.`
                  : 'All master data CRUD actions are fully operational in the fast in-memory store. Connect your Supabase project URL & API key to enable instant cloud synchronization.')}
              </p>
            </div>
          </div>

          {/* Right: Supabase SQL Migration Script Box */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Supabase Schema Migration SQL
                </h3>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>
                  Copy & run in your Supabase Dashboard &gt; SQL Editor.
                </p>
              </div>
              <button
                onClick={handleCopySql}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: copiedSql ? '#10B981' : '#0E94A8',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {copiedSql ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <div style={{
              maxHeight: '440px',
              overflowY: 'auto',
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              padding: '14px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '11px',
              lineHeight: 1.5
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {sqlSchema || 'Loading migration schema...'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT ROOM */}
      {/* ========================================================================= */}
      {roomModal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="lodgify-card" style={{ width: '480px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
              {roomModal.mode === 'create' ? 'Create New Room' : `Edit Room ${roomModal.data.roomNumber}`}
            </h3>

            <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Room Number</label>
                  <input
                    type="text"
                    required
                    value={roomModal.data.roomNumber || ''}
                    onChange={e => setRoomModal({ ...roomModal, data: { ...roomModal.data, roomNumber: e.target.value } })}
                    className="input-clean"
                    placeholder="e.g. 401"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Floor</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={roomModal.data.floor || 1}
                    onChange={e => setRoomModal({ ...roomModal, data: { ...roomModal.data, floor: Number(e.target.value) } })}
                    className="input-clean"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Category</label>
                  <select
                    value={roomModal.data.category || 'Standard'}
                    onChange={e => setRoomModal({ ...roomModal, data: { ...roomModal.data, category: e.target.value as any } })}
                    className="input-clean"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Base Tariff (INR ₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    required
                    value={roomModal.data.baseRate || 2500}
                    onChange={e => setRoomModal({ ...roomModal, data: { ...roomModal.data, baseRate: Number(e.target.value) } })}
                    className="input-clean"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Max Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={roomModal.data.maxGuests || 2}
                    onChange={e => setRoomModal({ ...roomModal, data: { ...roomModal.data, maxGuests: Number(e.target.value) } })}
                    className="input-clean"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Initial Status</label>
                  <select
                    value={roomModal.data.status || 'Available'}
                    onChange={e => setRoomModal({ ...roomModal, data: { ...roomModal.data, status: e.target.value as any } })}
                    className="input-clean"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Dirty">Dirty</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Inspected">Inspected</option>
                    <option value="OutOfOrder">Out of Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Amenities (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(roomModal.data.amenities) ? roomModal.data.amenities.join(', ') : (roomModal.data.amenities || '')}
                  onChange={e => setRoomModal({ ...roomModal, data: { ...roomModal.data, amenities: e.target.value as any } })}
                  className="input-clean"
                  placeholder="e.g. Wi-Fi, King Bed, Balcony, Smart TV"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRoomModal({ open: false, mode: 'create', data: {} })}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT MENU ITEM */}
      {/* ========================================================================= */}
      {menuModal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="lodgify-card" style={{ width: '480px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
              {menuModal.mode === 'create' ? 'Add Menu Dish' : `Edit ${menuModal.data.name}`}
            </h3>

            <form onSubmit={handleSaveMenuItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Dish Name</label>
                <input
                  type="text"
                  required
                  value={menuModal.data.name || ''}
                  onChange={e => setMenuModal({ ...menuModal, data: { ...menuModal.data, name: e.target.value } })}
                  className="input-clean"
                  placeholder="e.g. Goan Prawn Curry"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Category</label>
                  <select
                    value={menuModal.data.category || 'Main Course'}
                    onChange={e => setMenuModal({ ...menuModal, data: { ...menuModal.data, category: e.target.value as any } })}
                    className="input-clean"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Alcohol">Alcohol</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Price (INR ₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={menuModal.data.price || 0}
                    onChange={e => setMenuModal({ ...menuModal, data: { ...menuModal.data, price: Number(e.target.value) } })}
                    className="input-clean"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Prep Time</label>
                  <input
                    type="text"
                    value={menuModal.data.prepTime || '15 min'}
                    onChange={e => setMenuModal({ ...menuModal, data: { ...menuModal.data, prepTime: e.target.value } })}
                    className="input-clean"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Availability</label>
                  <select
                    value={menuModal.data.available !== false ? 'true' : 'false'}
                    onChange={e => setMenuModal({ ...menuModal, data: { ...menuModal.data, available: e.target.value === 'true' } })}
                    className="input-clean"
                  >
                    <option value="true">In Stock / Available</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Description</label>
                <textarea
                  value={menuModal.data.description || ''}
                  onChange={e => setMenuModal({ ...menuModal, data: { ...menuModal.data, description: e.target.value } })}
                  className="input-clean"
                  rows={2}
                  placeholder="Ingredients and culinary notes..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setMenuModal({ open: false, mode: 'create', data: {} })}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT INVENTORY SKU */}
      {/* ========================================================================= */}
      {invModal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="lodgify-card" style={{ width: '480px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
              {invModal.mode === 'create' ? 'Add Inventory SKU' : `Edit ${invModal.data.name}`}
            </h3>

            <form onSubmit={handleSaveInventory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Item Name</label>
                <input
                  type="text"
                  required
                  value={invModal.data.name || ''}
                  onChange={e => setInvModal({ ...invModal, data: { ...invModal.data, name: e.target.value } })}
                  className="input-clean"
                  placeholder="e.g. Linen Bed Sheets King"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Category</label>
                  <select
                    value={invModal.data.category || 'Housekeeping Supplies'}
                    onChange={e => setInvModal({ ...invModal, data: { ...invModal.data, category: e.target.value } })}
                    className="input-clean"
                  >
                    <option value="Kitchen">Kitchen</option>
                    <option value="Amenities">Amenities</option>
                    <option value="Minibar">Minibar</option>
                    <option value="Linen">Linen</option>
                    <option value="Housekeeping Supplies">Housekeeping Supplies</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Unit</label>
                  <input
                    type="text"
                    value={invModal.data.unit || 'pcs'}
                    onChange={e => setInvModal({ ...invModal, data: { ...invModal.data, unit: e.target.value } })}
                    className="input-clean"
                    placeholder="pcs, kg, bottles..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={invModal.data.currentStock || 0}
                    onChange={e => setInvModal({ ...invModal, data: { ...invModal.data, currentStock: Number(e.target.value) } })}
                    className="input-clean"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Min Alert</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={invModal.data.minThreshold || 10}
                    onChange={e => setInvModal({ ...invModal, data: { ...invModal.data, minThreshold: Number(e.target.value) } })}
                    className="input-clean"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Unit Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={invModal.data.unitCost || 0}
                    onChange={e => setInvModal({ ...invModal, data: { ...invModal.data, unitCost: Number(e.target.value) } })}
                    className="input-clean"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Supplier Vendor</label>
                <input
                  type="text"
                  value={invModal.data.supplier || ''}
                  onChange={e => setInvModal({ ...invModal, data: { ...invModal.data, supplier: e.target.value } })}
                  className="input-clean"
                  placeholder="e.g. GreenValley Agro"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setInvModal({ open: false, mode: 'create', data: {} })}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT STAFF MEMBER */}
      {/* ========================================================================= */}
      {staffModal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="lodgify-card" style={{ width: '480px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
              {staffModal.mode === 'create' ? 'Onboard Team Member' : `Edit ${staffModal.data.name}`}
            </h3>

            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={staffModal.data.name || ''}
                  onChange={e => setStaffModal({ ...staffModal, data: { ...staffModal.data, name: e.target.value } })}
                  className="input-clean"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Role</label>
                  <input
                    type="text"
                    required
                    value={staffModal.data.role || 'Front Desk Officer'}
                    onChange={e => setStaffModal({ ...staffModal, data: { ...staffModal.data, role: e.target.value } })}
                    className="input-clean"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Department</label>
                  <select
                    value={staffModal.data.department || 'Front Office'}
                    onChange={e => setStaffModal({ ...staffModal, data: { ...staffModal.data, department: e.target.value } })}
                    className="input-clean"
                  >
                    <option value="Front Office">Front Office</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Administration">Administration</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Shift</label>
                  <select
                    value={staffModal.data.shift || 'Morning (06:00-14:00)'}
                    onChange={e => setStaffModal({ ...staffModal, data: { ...staffModal.data, shift: e.target.value } })}
                    className="input-clean"
                  >
                    <option value="Morning (06:00-14:00)">Morning (06:00-14:00)</option>
                    <option value="Evening (14:00-22:00)">Evening (14:00-22:00)</option>
                    <option value="Night (22:00-06:00)">Night (22:00-06:00)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Duty Status</label>
                  <select
                    value={staffModal.data.status || 'On Duty'}
                    onChange={e => setStaffModal({ ...staffModal, data: { ...staffModal.data, status: e.target.value } })}
                    className="input-clean"
                  >
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Phone</label>
                  <input
                    type="text"
                    value={staffModal.data.phone || ''}
                    onChange={e => setStaffModal({ ...staffModal, data: { ...staffModal.data, phone: e.target.value } })}
                    className="input-clean"
                    placeholder="+91 98450 00000"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Email</label>
                  <input
                    type="email"
                    value={staffModal.data.email || ''}
                    onChange={e => setStaffModal({ ...staffModal, data: { ...staffModal.data, email: e.target.value } })}
                    className="input-clean"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStaffModal({ open: false, mode: 'create', data: {} })}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
