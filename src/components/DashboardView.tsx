import { useState, useMemo } from 'react';
import type { Asset, MaintenanceTicket, SparePartInventoryItem, PreventiveScheduleItem, AuditLog, UserProfile } from '../types';
import {
  Wrench,
  ArrowRight,
  History,
  PlusCircle,
  Edit3,
  RefreshCw,
  Layers,
  Trash2,
  Calendar,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
  Printer,
  Search
} from 'lucide-react';

interface DashboardViewProps {
  assets: Asset[];
  tickets: MaintenanceTicket[];
  spareParts: SparePartInventoryItem[];
  preventiveSchedules?: PreventiveScheduleItem[];
  logs?: AuditLog[];
  currentUser?: UserProfile;
  onViewTicketReport: (ticket: MaintenanceTicket) => void;
  onEditTicket: (ticket: MaintenanceTicket) => void;
  onSelectAsset: (asset: Asset) => void;
  onNavigateToTab: (tab: any) => void;
  onNewTicket: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assets,
  tickets,
  spareParts,
  preventiveSchedules: _preventiveSchedules,
  logs = [],
  currentUser: _currentUser,
  onViewTicketReport,
  onEditTicket,
  onSelectAsset,
  onNavigateToTab,
  onNewTicket
}) => {
  // KPI Metrics Calculation
  const totalAssets = assets.length;
  const activeTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved');
  const needsPartsTickets = tickets.filter(t => t.statusAfterMaintenance === 'needs_parts' || t.status === 'pending_parts');
  
  const totalDowntimeHours = tickets.reduce((acc, t) => acc + (t.downtimeHours || 0), 0);
  const avgDowntimeHours = tickets.length > 0 ? (totalDowntimeHours / tickets.length).toFixed(1) : '0';
  const totalPartsCost = tickets.reduce((acc, t) => acc + (t.totalCost || 0), 0);
  const _lowStockParts = spareParts.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock');

  // Filter Bar States
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Segmented Pill Tab in Bottom Section
  const [bottomSegment, setBottomSegment] = useState<'all' | 'pending' | 'needs_parts'>('needs_parts');

  // Selected Ticket in the Bottom Split-Surface Card
  const [selectedTicketId, setSelectedTicketId] = useState<string>(() => {
    return tickets[0]?.id || '';
  });

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    assets.forEach(a => {
      if (a.department) set.add(a.department.split('-')[0].trim());
    });
    return Array.from(set);
  }, [assets]);

  // Bottom section tickets list
  const splitTickets = useMemo(() => {
    return tickets.filter(t => {
      if (bottomSegment === 'pending') {
        return t.status === 'open' || t.status === 'in_progress';
      }
      if (bottomSegment === 'needs_parts') {
        return t.statusAfterMaintenance === 'needs_parts' || t.status === 'pending_parts';
      }
      return true;
    }).slice(0, 7);
  }, [tickets, bottomSegment]);

  // Current active ticket details
  const activeDetailedTicket = useMemo(() => {
    const found = tickets.find(t => t.id === selectedTicketId);
    return found || splitTickets[0] || tickets[0] || null;
  }, [tickets, selectedTicketId, splitTickets]);

  const activeAsset = useMemo(() => {
    if (!activeDetailedTicket) return null;
    return assets.find(a => a.id === activeDetailedTicket.assetId);
  }, [assets, activeDetailedTicket]);

  // Time format helper
  const formatTimeAgo = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays === 1) return 'أمس';
      if (diffDays < 30) return `منذ ${diffDays} يوم`;
      return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    } catch {
      return isoDate;
    }
  };

  return (
    <div style={{
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem',
      backgroundColor: '#0b0e14',
      minHeight: '100%',
      color: '#ffffff'
    }}>
      
      {/* Page Title & Quick Action Bar (Like Invoices Header in reference) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => onNavigateToTab('dashboard')}
            className="btn-icon"
            style={{ width: '38px', height: '38px', borderRadius: '50%' }}
            title="تحديث الشاشة"
          >
            <RefreshCw size={16} />
          </button>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              تقارير وبلاغات الصيانة
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
              مستشفى نيل الأمل • وحدة تكنولوجيا المعلومات والنظم الطبية
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigateToTab('tickets')}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '9999px', padding: '0.55rem 1.1rem' }}
          >
            <SlidersHorizontal size={15} />
            <span>عرض كل التذاكر ({tickets.length})</span>
          </button>

          <button
            onClick={onNewTicket}
            className="btn btn-primary"
            style={{ borderRadius: '9999px', padding: '0.55rem 1.25rem' }}
          >
            <Wrench size={16} />
            <span>+ تسجيل بلاغ صيانة</span>
          </button>
        </div>
      </div>

      {/* TOP SECTION: Two Hero Cards (60% / 40% Split from Reference Image) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* Left Hero Card: Overview & Timeline Progress Bar */}
        <div style={{
          background: '#141824',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}>
          {/* 3 Metric Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>
                بلاغات قيد المتابعة
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {activeTickets.length} <span style={{ fontSize: '0.9rem', color: '#8af10a', fontWeight: 700 }}>بلاغ</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>
                بانتظار قطع غيار
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {needsPartsTickets.length} <span style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: 700 }}>أجهزة</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>
                متوسط وقت الإصلاح MTTR
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {avgDowntimeHours} <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>ساعات</span>
              </div>
            </div>
          </div>

          {/* Timeline & Progress Track with Avatars (Exactly like in the reference) */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>
              <span>سبتمبر</span>
              <span>أكتوبر</span>
              <span>نوفمبر</span>
              <span>ديسمبر</span>
            </div>

            {/* Segmented Timeline Bar with Neon Lime Highlight */}
            <div style={{
              height: '5px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              overflow: 'hidden',
              display: 'flex',
              gap: '4px',
              marginBottom: '1rem'
            }}>
              <div style={{ width: '25%', background: '#8af10a', borderRadius: '9999px' }} />
              <div style={{ width: '45%', background: '#8af10a', borderRadius: '9999px' }} />
              <div style={{ width: '15%', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '9999px' }} />
              <div style={{ width: '15%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px' }} />
            </div>

            {/* Engineer Avatar Cluster along the timeline */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {['م. محمد كمال', 'م. سارة علي', 'م. حسام الدين', 'م. آية أحمد'].map((name, i) => (
                  <div
                    key={name}
                    title={name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: i === 0 ? 'linear-gradient(135deg, #8af10a 0%, #10b981 100%)' : i === 1 ? 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)' : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                      color: i === 0 ? '#0b0e14' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      border: '2px solid #141824',
                      marginRight: i > 0 ? '-10px' : '0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    {name.split(' ')[1]?.[0] || 'IT'}
                  </div>
                ))}
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginRight: '16px', fontWeight: 600 }}>
                  فريق مهندسي الصيانة المتاح
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#8af10a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>جاهزية الأنظمة 98.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Card: Total Spare Parts Value & 3 Mini Fast Cards */}
        <div style={{
          background: '#141824',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.25rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                إجمالي تكلفة قطع الغيار المسجلة
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: '#8af10a',
                background: 'rgba(138, 241, 10, 0.12)',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {totalAssets} جهاز مسجل
              </span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '6px' }}>
              {totalPartsCost.toLocaleString('ar-EG')} <span style={{ fontSize: '1rem', color: '#8af10a' }}>ج.م</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: _lowStockParts.length > 0 ? '#fbbf24' : '#8af10a', marginTop: '4px', fontWeight: 700 }}>
              {_lowStockParts.length > 0 ? `⚠️ ${_lowStockParts.length} أصناف تحت حد الأمان بالمخزن` : 'المخزون متزن'}
            </div>
          </div>

          {/* 3 Mini Device/Payment Category Cards (One Highlighted in Neon Lime) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem'
          }}>
            {/* Mini Card 1: Regular Dark */}
            <div
              onClick={() => onNavigateToTab('assets')}
              style={{
                background: '#1c2232',
                borderRadius: '16px',
                padding: '0.75rem 0.65rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>#4443</div>
              <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 800, marginTop: '8px' }}>محطات طبية</div>
            </div>

            {/* Mini Card 2: SIGNATURE ELECTRIC NEON LIME ACCENT CARD (From Reference) */}
            <div
              onClick={() => onNavigateToTab('assets')}
              style={{
                background: '#8af10a',
                borderRadius: '16px',
                padding: '0.75rem 0.65rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(138, 241, 10, 0.4)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#0b0e14', fontWeight: 900 }}>#177210</div>
              <div style={{ fontSize: '0.78rem', color: '#0b0e14', fontWeight: 900, marginTop: '8px' }}>أجهزة ومحمول</div>
            </div>

            {/* Mini Card 3: Regular Dark */}
            <div
              onClick={() => onNavigateToTab('inventory')}
              style={{
                background: '#1c2232',
                borderRadius: '16px',
                padding: '0.75rem 0.65rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>#711221</div>
              <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 800, marginTop: '8px' }}>قطع المخزن</div>
            </div>
          </div>

          {/* Bottom Action Button: White pill like "Pay out now" */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onNavigateToTab('inventory')}
              className="btn btn-white btn-sm"
              style={{ borderRadius: '9999px', padding: '0.5rem 1.4rem' }}
            >
              <span>متابعة حركة المخزون</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* FILTER PILLS BAR (From Reference Screenshot) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.65rem',
        padding: '0.25rem 0'
      }}>
        {/* Active Filters Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#ffffff',
          fontSize: '0.86rem',
          fontWeight: 700,
          marginLeft: '0.5rem'
        }}>
          <Filter size={15} color="#8af10a" />
          <span>الفلاتر النشطة</span>
          <span style={{
            background: '#8af10a',
            color: '#0b0e14',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 900
          }}>
            2
          </span>
        </div>

        {/* Filter Dropdown 1: Department */}
        <div className="filter-pill">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
          >
            <option value="all">كافة الأقسام والمباني</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>

        {/* Filter Dropdown 2: Status */}
        <div className="filter-pill">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="all">كافة الحالات</option>
            <option value="open">قيد الانتظار</option>
            <option value="needs_parts">بانتظار قطع غيار</option>
            <option value="repaired">تم الإصلاح</option>
          </select>
          <ChevronDown size={14} />
        </div>

        {/* Date Filter Pills */}
        <div className="filter-pill">
          <Calendar size={14} color="#8af10a" />
          <span>نوفمبر 2026</span>
        </div>

        <div className="filter-pill">
          <Calendar size={14} />
          <span>ديسمبر 2026</span>
        </div>

        {/* Search Pill Input */}
        <div style={{ position: 'relative', minWidth: '220px', marginRight: 'auto' }}>
          <Search size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="form-control"
            style={{
              paddingRight: '2.2rem',
              paddingLeft: '0.85rem',
              paddingTop: '0.45rem',
              paddingBottom: '0.45rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              background: '#141824',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
            placeholder="بحث برقم البلاغ #... 🔍"
            value={dashboardSearch}
            onChange={(e) => setDashboardSearch(e.target.value)}
          />
        </div>
      </div>

      {/* THE ICONIC DUAL SPLIT-SURFACE SECTION (Bottom Section from Reference Image) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Segmented Pill Tabs above the dual card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '4px' }}>
          <button
            onClick={() => setBottomSegment('all')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: bottomSegment === 'all' ? '#8af10a' : '#141824',
              color: bottomSegment === 'all' ? '#0b0e14' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            كافة البلاغات
          </button>

          <button
            onClick={() => setBottomSegment('pending')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: bottomSegment === 'pending' ? '#8af10a' : '#141824',
              color: bottomSegment === 'pending' ? '#0b0e14' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            جديد وقيد الفحص <span style={{ opacity: 0.8 }}>({activeTickets.length})</span>
          </button>

          {/* Active Highlighted Pill in Solid Neon Lime (Like "Unpaid 5" in reference image) */}
          <button
            onClick={() => setBottomSegment('needs_parts')}
            style={{
              padding: '6px 18px',
              borderRadius: '9999px',
              border: 'none',
              background: bottomSegment === 'needs_parts' ? '#8af10a' : '#141824',
              color: bottomSegment === 'needs_parts' ? '#0b0e14' : '#94a3b8',
              fontWeight: 900,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: bottomSegment === 'needs_parts' ? '0 2px 14px rgba(138, 241, 10, 0.4)' : 'none',
              transition: 'all 0.18s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>بانتظار قطع غيار</span>
            <span style={{
              background: bottomSegment === 'needs_parts' ? '#0b0e14' : '#8af10a',
              color: bottomSegment === 'needs_parts' ? '#8af10a' : '#0b0e14',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 900
            }}>
              {needsPartsTickets.length}
            </span>
          </button>
        </div>

        {/* The Two Complementary Cards (White Card on Right/Left + Dark Obsidian Card) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(380px, 1.4fr)',
          gap: '1.25rem',
          alignItems: 'stretch'
        }}>
          
          {/* Card A: High-Contrast Crisp White Card (Unpaid Invoices List) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: '1.5rem',
            color: '#0f172a',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              {/* White Card Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  البلاغات النشطة وغير المعتمدة
                </h3>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn-icon" style={{ width: '32px', height: '32px', background: '#f1f5f9', color: '#475569', border: 'none' }}>
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Ticket List Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {splitTickets.map(ticket => {
                  const isSelected = activeDetailedTicket?.id === ticket.id;
                  const asset = assets.find(a => a.id === ticket.assetId);

                  if (isSelected) {
                    /* SELECTED ROW: Sleek Dark Obsidian Rounded Pill Container (From Reference Screenshot!) */
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        style={{
                          background: '#141824',
                          color: '#ffffff',
                          borderRadius: '9999px',
                          padding: '0.65rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: '#8af10a',
                            color: '#0b0e14',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 900,
                            flexShrink: 0
                          }}>
                            {ticket.requesterName?.[0] || 'IT'}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                              #{ticket.id}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              {formatTimeAgo(ticket.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {ticket.statusAfterMaintenance === 'needs_parts' ? 'بانتظار قطع' : 'قيد الفحص'}
                        </div>

                        <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#8af10a', fontFamily: 'var(--font-mono)' }}>
                          {(ticket.totalCost || 250).toLocaleString('ar-EG')} ج.م
                        </div>
                      </div>
                    );
                  }

                  /* Regular Inactive Row (On White Background) */
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#f1f5f9',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {ticket.requesterName?.[0] || asset?.brand?.[0] || 'IT'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                            #{ticket.id}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {formatTimeAgo(ticket.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        color: '#64748b',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {ticket.status === 'open' ? 'جديد' : 'قيد المتابعة'}
                      </div>

                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                        {(ticket.totalCost || 0).toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>
                  );
                })}

                {splitTickets.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    لا توجد بلاغات مسجلة في هذا القسم
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => onNavigateToTab('tickets')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0f172a',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                عرض كل البلاغات في جدول تفصيلي ←
              </button>
            </div>
          </div>

          {/* Card B: Deep Dark Obsidian Card (Ticket Details & Action Breakdown) */}
          <div style={{
            background: '#141824',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.75rem',
            color: '#ffffff',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            {activeDetailedTicket ? (
              <>
                {/* Header Information: Ticket Code, Department, Requester */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>
                        تفاصيل البلاغ المحدد
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                        <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                          #{activeDetailedTicket.id}
                        </h2>
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {activeDetailedTicket.statusAfterMaintenance === 'needs_parts' ? 'بانتظار قطع غيار' : 'قيد المعالجة'}
                        </span>
                      </div>
                    </div>

                    <div
                      onClick={() => activeAsset && onSelectAsset(activeAsset)}
                      style={{ cursor: activeAsset ? 'pointer' : 'default' }}
                      title={activeAsset ? 'انقر لفتح ملف الجهاز' : undefined}
                    >
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>القسم / الجهاز</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                        {activeDetailedTicket.location || activeAsset?.department || 'قسم الحضانة والعناية'}
                        {activeAsset && <span style={{ fontSize: '0.75rem', color: '#8af10a', marginRight: '6px' }}>({activeAsset.brand} {activeAsset.model})</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 900
                      }}>
                        {activeDetailedTicket.requesterName?.[0] || 'د'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                          {activeDetailedTicket.requesterName || 'د. طارق السعيد'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {activeDetailedTicket.technicianName ? `الفني: ${activeDetailedTicket.technicianName}` : 'فني المناوبة'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Dark Nested Metric Sub-Cards with Diagonal Arrow ↗ (From Reference Screenshot!) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.25rem'
                  }}>
                    {/* Sub Card 1 */}
                    <div style={{
                      background: '#1b2130',
                      borderRadius: '16px',
                      padding: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                          {(activeDetailedTicket.totalCost || 1250).toLocaleString('ar-EG')} ج.م
                        </span>
                        <ArrowUpRight size={15} color="#8af10a" />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                        تكلفة قطع الغيار
                      </div>
                    </div>

                    {/* Sub Card 2 */}
                    <div style={{
                      background: '#1b2130',
                      borderRadius: '16px',
                      padding: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#ffffff' }}>
                          {activeDetailedTicket.downtimeFormatted || '3.5 ساعات'}
                        </span>
                        <ArrowUpRight size={15} color="#38bdf8" />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                        مدة توقف الجهاز
                      </div>
                    </div>

                    {/* Sub Card 3 */}
                    <div style={{
                      background: '#1b2130',
                      borderRadius: '16px',
                      padding: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#8af10a' }}>
                          {activeDetailedTicket.issueCategory === 'hardware' ? 'هاردوير' : activeDetailedTicket.issueCategory === 'software' ? 'سوفت وير' : 'طابعة وشبكات'}
                        </span>
                        <ArrowUpRight size={15} color="#8af10a" />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                        تصنيف العطل
                      </div>
                    </div>
                  </div>

                  {/* Problem Description & Diagnosis Inset Box */}
                  <div style={{
                    background: '#10141e',
                    borderRadius: '14px',
                    padding: '0.85rem 1.1rem',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    fontSize: '0.82rem',
                    color: '#cbd5e1',
                    lineHeight: 1.6
                  }}>
                    <strong style={{ color: '#ffffff' }}>وصف المشكلة: </strong>
                    {activeDetailedTicket.userProblemDescription || 'عطل مفاجئ أثناء التشغيل يستلزم فحص وحدة التغذية الكهربائية واللوحة الأم.'}
                    {activeDetailedTicket.diagnosis && (
                      <div style={{ marginTop: '4px', color: '#8af10a' }}>
                        <strong>التشخيص الفني: </strong>{activeDetailedTicket.diagnosis}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Footer Action Bar: Totals + NEON LIME PILL BUTTON ("Pay out now" counterpart) */}
                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>المجموع الفرعي</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        {(activeDetailedTicket.totalCost || 1250).toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>إجمالي التكلفة</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#8af10a', fontFamily: 'var(--font-mono)' }}>
                        {(activeDetailedTicket.totalCost || 1250).toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      onClick={() => onEditTicket(activeDetailedTicket)}
                      className="btn-icon"
                      title="تعديل بيانات البلاغ"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={() => onViewTicketReport(activeDetailedTicket)}
                      className="btn-icon"
                      title="طباعة التقرير الرسمي"
                    >
                      <Printer size={15} />
                    </button>

                    {/* Signature Electric Neon Lime Pill Button */}
                    <button
                      onClick={() => onViewTicketReport(activeDetailedTicket)}
                      className="btn btn-primary"
                      style={{
                        borderRadius: '9999px',
                        padding: '0.65rem 1.4rem',
                        fontSize: '0.88rem',
                        fontWeight: 900
                      }}
                    >
                      <span>عرض التقرير المعتمد</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                اختر بلاغاً من القائمة الجانبية لعرض كافة التفاصيل والإجراءات
              </div>
            )}
          </div>

        </div>

      </div>

      {/* RECENT AUDIT TRAIL WIDGET (Preserved with the matching obsidian dark look) */}
      {logs.length > 0 && (
        <div style={{
          background: '#141824',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.5rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={17} color="#8af10a" />
                سجل النشاطات والتعديلات الأخيرة في النظام
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                تتبع لحظي للعمليات المنجزة بواسطة فريق الصيانة
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('logs')}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '9999px' }}
            >
              عرض السجل الكامل ({logs.length})
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {logs.slice(0, 4).map(log => (
              <div
                key={log.id}
                style={{
                  background: '#10141d',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  padding: '0.75rem 1rem',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: log.actionType === 'create' ? 'rgba(138, 241, 10, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: log.actionType === 'create' ? '#8af10a' : '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {log.actionType === 'create' ? <PlusCircle size={15} /> : log.actionType === 'status_change' ? <RefreshCw size={15} /> : log.actionType === 'stock_adjust' ? <Layers size={15} /> : log.actionType === 'delete' ? <Trash2 size={15} /> : <Edit3 size={15} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
                      {log.description}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      بواسطة: <strong style={{ color: '#8af10a' }}>{log.userName}</strong> • الهدف: <span style={{ fontFamily: 'var(--font-mono)' }}>{log.targetId}</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  {formatTimeAgo(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
