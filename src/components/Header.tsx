import React from 'react';
import type { Asset, MaintenanceTicket, UserAccount, UserProfile, PermissionKey } from '../types';
import type { NavTab } from './Sidebar';
import { 
  QrCode, 
  Plus, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  Laptop, 
  UserCheck, 
  ShieldCheck, 
  LogOut, 
  Printer, 
  Database,
  LayoutDashboard,
  FileText,
  Package,
  CalendarCheck,
  History,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNewTicket: () => void;
  onNewAsset: () => void;
  onOpenQRScanner: () => void;
  onOpenBatchQR?: () => void;
  onOpenDataManagement?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  assets?: Asset[];
  tickets: MaintenanceTicket[];
  currentUser?: UserAccount | UserProfile;
  onLogout?: () => void;
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  permittedTabs?: NavTab[];
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onNewTicket,
  onNewAsset,
  onOpenQRScanner,
  onOpenBatchQR,
  onOpenDataManagement,
  searchQuery,
  onSearchChange,
  tickets,
  currentUser,
  onLogout,
  activeTab = 'dashboard',
  onTabChange,
  permittedTabs
}) => {
  const pendingPartsCount = tickets.filter(t => t.statusAfterMaintenance === 'needs_parts' || t.status === 'pending_parts').length;
  const userPerms: PermissionKey[] = currentUser?.permissions || [];
  const isAdmin = currentUser?.role === 'admin' || userPerms.includes('user_management');

  const canCreateTicket = isAdmin || userPerms.includes('tickets');
  const canCreateAsset = isAdmin || userPerms.includes('assets');

  const navItems: { id: NavTab; label: string; icon: React.FC<{ size?: number; color?: string; className?: string }> }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'tickets', label: 'تذاكر الصيانة', icon: FileText },
    { id: 'assets', label: 'سجل الأجهزة', icon: Laptop },
    { id: 'inventory', label: 'قطع الغيار', icon: Package },
    { id: 'preventive', label: 'الوقائية', icon: CalendarCheck },
    { id: 'logs', label: 'النشاطات', icon: History }
  ];

  if (isAdmin) {
    navItems.push({ id: 'user_management', label: 'المستخدمين', icon: ShieldAlert });
  }

  const allowedNavItems = navItems.filter(item => {
    if (!permittedTabs) return true;
    return permittedTabs.includes(item.id);
  });

  return (
    <header style={{
      background: 'rgba(11, 14, 20, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.75rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.25rem',
      position: 'sticky',
      top: 0,
      zIndex: 35,
      transition: 'all 0.25s ease'
    }}>
      {/* Brand & Logo Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #161c28 0%, #1e2638 100%)',
          border: '1px solid rgba(138, 241, 10, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(138, 241, 10, 0.2)',
          padding: '4px'
        }}>
          <Sparkles size={20} color="#8af10a" />
        </div>
        <div className="hidden-mobile">
          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            مستشفى نيل الأمل
          </div>
          <div style={{ fontSize: '0.7rem', color: '#8af10a', fontWeight: 700, letterSpacing: '0.02em' }}>
            NOH Maintenance Platform
          </div>
        </div>
      </div>

      {/* Signature Floating Segmented Pill Capsule Navigation (From the reference design) */}
      {onTabChange && allowedNavItems.length > 0 && (
        <nav className="pill-nav-capsule" style={{ display: 'flex', flexShrink: 0 }}>
          {allowedNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`pill-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive ? '#8af10a' : 'transparent',
                  color: isActive ? '#0b0e14' : '#334155',
                  boxShadow: isActive ? '0 2px 10px rgba(138, 241, 10, 0.35)' : 'none'
                }}
              >
                {isActive && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#0b0e14',
                    display: 'inline-block'
                  }} />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Search & Actions Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
        
        {/* Search Pill Input */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{
              paddingRight: '2.2rem',
              paddingLeft: '0.75rem',
              paddingTop: '0.45rem',
              paddingBottom: '0.45rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff'
            }}
            placeholder="بحث سريع... 🔍"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* QR Scanner Trigger */}
        {canCreateAsset && (
          <button
            onClick={onOpenQRScanner}
            className="btn-icon"
            title="مسح كود QR أو باركود الجهاز"
          >
            <QrCode size={16} />
          </button>
        )}

        {/* Batch QR Print Trigger */}
        {canCreateAsset && onOpenBatchQR && (
          <button
            onClick={onOpenBatchQR}
            className="btn-icon"
            title="طباعة ملصقات الباركود المجمعة"
          >
            <Printer size={16} />
          </button>
        )}

        {/* Data Backup & Restore Trigger */}
        {isAdmin && onOpenDataManagement && (
          <button
            onClick={onOpenDataManagement}
            className="btn-icon"
            title="النسخ الاحتياطي وإدارة البيانات"
          >
            <Database size={16} />
          </button>
        )}

        {/* New Asset Button */}
        {canCreateAsset && (
          <button
            onClick={onNewAsset}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '9999px', padding: '0.45rem 0.95rem' }}
            title="إضافة جهاز جديد إلى السجل"
          >
            <Laptop size={15} />
            <span className="hidden-mobile">إضافة جهاز</span>
          </button>
        )}

        {/* New Ticket Quick Pill Button */}
        {canCreateTicket && (
          <button
            onClick={onNewTicket}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.45rem 1rem' }}
          >
            <Plus size={16} />
            <span>تسجيل بلاغ</span>
          </button>
        )}

        {/* Notifications Icon with Badge */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            title="التنبيهات والأجهزة المعلقة"
          >
            <Bell size={16} />
            {pendingPartsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#8af10a',
                color: '#0b0e14',
                fontSize: '10px',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(138, 241, 10, 0.6)'
              }}>
                {pendingPartsCount}
              </span>
            )}
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#8af10a" />}
        </button>

        {/* Logged in User Avatar & Info Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.3rem 0.75rem 0.3rem 0.35rem',
            borderRadius: '9999px',
            marginRight: '4px'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isAdmin ? 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #8af10a 0%, #10b981 100%)',
            color: isAdmin ? '#ffffff' : '#0b0e14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 800,
            boxShadow: '0 0 10px rgba(138, 241, 10, 0.25)'
          }}>
            {isAdmin ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser?.name || 'مستخدم'}
          </span>
        </div>

        {/* Logout Quick Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="btn-icon"
            style={{ color: '#f43f5e' }}
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        )}

      </div>
    </header>
  );
};
