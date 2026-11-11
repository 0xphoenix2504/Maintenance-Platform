import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Laptop,
  Package,
  CalendarCheck,
  History,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles
} from 'lucide-react';
import type { UserAccount, UserProfile, PermissionKey } from '../types';

export type NavTab = 'dashboard' | 'tickets' | 'assets' | 'inventory' | 'preventive' | 'logs' | 'user_management';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  ticketCount: number;
  assetCount: number;
  lowStockCount: number;
  activePreventiveCount: number;
  logCount?: number;
  pendingUsersCount?: number;
  currentUser?: UserAccount | UserProfile;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  ticketCount,
  assetCount,
  lowStockCount,
  activePreventiveCount,
  logCount = 0,
  pendingUsersCount = 0,
  currentUser,
  onLogout
}) => {
  const userPerms: PermissionKey[] = currentUser?.permissions || [];
  const isAdmin = currentUser?.role === 'admin' || userPerms.includes('user_management');

  const allNavItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'لوحة التحكم والتحليلات',
      icon: LayoutDashboard,
      badge: null,
      requiredPerm: 'dashboard' as PermissionKey
    },
    {
      id: 'tickets' as NavTab,
      label: 'تقارير وتذاكر الصيانة',
      icon: FileText,
      badge: ticketCount > 0 ? ticketCount : null,
      requiredPerm: 'tickets' as PermissionKey
    },
    {
      id: 'assets' as NavTab,
      label: 'سجل الأجهزة والعهد',
      icon: Laptop,
      badge: assetCount > 0 ? assetCount : null,
      requiredPerm: 'assets' as PermissionKey
    },
    {
      id: 'inventory' as NavTab,
      label: 'قطع الغيار والمخزون',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} ناقص` : null,
      badgeVariant: lowStockCount > 0 ? 'badge-damaged' : '',
      requiredPerm: 'inventory' as PermissionKey
    },
    {
      id: 'preventive' as NavTab,
      label: 'الصيانة الوقائية الدورية',
      icon: CalendarCheck,
      badge: activePreventiveCount > 0 ? activePreventiveCount : null,
      requiredPerm: 'preventive' as PermissionKey
    },
    {
      id: 'logs' as NavTab,
      label: 'سجل النشاطات والتعديلات',
      icon: History,
      badge: logCount > 0 ? logCount : null,
      requiredPerm: 'logs' as PermissionKey
    },
    {
      id: 'user_management' as NavTab,
      label: 'إدارة المستخدمين والصلاحيات',
      icon: ShieldCheck,
      badge: pendingUsersCount > 0 ? `${pendingUsersCount} جديد` : null,
      badgeVariant: pendingUsersCount > 0 ? 'badge-needs-parts' : '',
      requiredPerm: 'user_management' as PermissionKey
    }
  ];

  const permittedNavItems = allNavItems.filter(item => {
    if (isAdmin) return true;
    return userPerms.includes(item.requiredPerm);
  });

  return (
    <aside className="sidebar-wrapper" style={{
      background: '#0e121a',
      borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.25rem 1.15rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #161c28 0%, #1e2638 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(138, 241, 10, 0.25)',
          border: '1.5px solid rgba(138, 241, 10, 0.4)',
          flexShrink: 0
        }}>
          <Sparkles size={22} color="#8af10a" />
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: '1.02rem', fontWeight: 900, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            مستشفى نيل الأمل
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#8af10a', fontWeight: 700, letterSpacing: '0.02em' }}>
            قسم تكنولوجيا المعلومات IT
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', padding: '0 0.6rem 0.4rem 0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          القائمة الرئيسية
        </div>

        {permittedNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.95rem',
                borderRadius: '14px',
                border: isActive ? '1px solid rgba(138, 241, 10, 0.35)' : '1px solid transparent',
                background: isActive ? 'rgba(138, 241, 10, 0.12)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'right',
                width: '100%',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={19} color={isActive ? '#8af10a' : 'currentColor'} />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`badge ${item.badgeVariant || (isActive ? 'badge-operational' : '')}`}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    background: isActive ? '#8af10a' : undefined,
                    color: isActive ? '#0b0e14' : undefined,
                    fontWeight: 800
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {permittedNavItems.length === 0 && (
          <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            لا توجد أقسام مفعلة لحسابك حالياً
          </div>
        )}
      </div>

      {/* User Profile & Logout Footer */}
      <div style={{
        padding: '0.9rem 1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#121620',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: isAdmin ? 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #8af10a 0%, #10b981 100%)',
            color: isAdmin ? '#ffffff' : '#0b0e14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(138, 241, 10, 0.25)'
          }}>
            {isAdmin ? <ShieldCheck size={18} /> : <UserCheck size={18} />}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || 'مستخدم النظام'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8af10a', fontWeight: 700 }}>
              {isAdmin ? 'مدير النظام (Admin)' : (currentUser?.role || 'فني صيانة')}
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: '#f43f5e', padding: '0.4rem', borderRadius: '10px' }}
            title="تسجيل الخروج من الحساب"
          >
            <LogOut size={14} />
            <span>تسجيل الخروج</span>
          </button>
        )}
      </div>
    </aside>
  );
};
