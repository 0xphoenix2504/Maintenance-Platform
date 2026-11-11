import { useState } from 'react';
import type { Asset, DeviceStatus } from '../types';
import {
  Plus,
  Search,
  QrCode,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Filter,
  ChevronDown
} from 'lucide-react';

interface AssetsViewProps {
  assets: Asset[];
  onNewAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
  onSelectAsset: (asset: Asset) => void;
  onNewTicketForAsset: (assetId: string) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({
  assets,
  onNewAsset,
  onEditAsset,
  onDeleteAsset,
  onSelectAsset,
  onNewTicketForAsset
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.currentUser.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'operational': return <span className="badge badge-operational"><CheckCircle2 size={12} /> يعمل بكفاءة</span>;
      case 'in_maintenance': return <span className="badge badge-maintenance"><Clock size={12} /> تحت الصيانة</span>;
      case 'needs_parts': return <span className="badge badge-needs-parts"><AlertTriangle size={12} /> بانتظار قطع</span>;
      case 'damaged': return <span className="badge badge-damaged">تالف</span>;
      case 'spare': return <span className="badge badge-spare">احتياطي</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: '#0b0e14',
      minHeight: '100%',
      color: '#ffffff'
    }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            سجل وإدارة الأجهزة والعهد (IT Asset Registry)
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            قاعدة بيانات الأجهزة والمحطات الطبية والسيرفرات مع أكواد الـ QR وملصقات الفحص
          </p>
        </div>

        <button
          onClick={onNewAsset}
          className="btn btn-primary"
          style={{ borderRadius: '9999px', padding: '0.6rem 1.4rem' }}
        >
          <Plus size={16} />
          <span>إضافة جهاز جديد</span>
        </button>
      </div>

      {/* Modern Filter Pills Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        background: '#141824',
        padding: '0.85rem 1.25rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="form-control"
            style={{
              paddingRight: '2.4rem',
              borderRadius: '9999px',
              background: '#10141d',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              fontSize: '0.84rem'
            }}
            placeholder="بحث بالكود، السيريال، الموقع، أو العهدة... 🔍"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div className="filter-pill">
          <Filter size={14} color="#8af10a" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">كافة أنواع الأجهزة</option>
            <option value="Laptop">Laptop (محمول)</option>
            <option value="Desktop">Desktop (مكتبي)</option>
            <option value="Medical Workstation">Medical WS (محطة طبية)</option>
            <option value="Server">Server (خادم)</option>
            <option value="Printer">Printer (طابعة)</option>
            <option value="Network Switch">Network Switch (سويتش)</option>
          </select>
          <ChevronDown size={14} />
        </div>

        {/* Status Filter */}
        <div className="filter-pill">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">كافة الحالات</option>
            <option value="operational">يعمل بكفاءة</option>
            <option value="in_maintenance">تحت الصيانة</option>
            <option value="needs_parts">بانتظار قطع غيار</option>
            <option value="damaged">تالف</option>
          </select>
          <ChevronDown size={14} />
        </div>

        {/* View Mode Pill Toggle */}
        <div style={{
          display: 'flex',
          background: '#10141d',
          padding: '3px',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: viewMode === 'grid' ? '#8af10a' : 'transparent',
              color: viewMode === 'grid' ? '#0b0e14' : '#94a3b8',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}
          >
            بطاقات
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: viewMode === 'table' ? '#8af10a' : 'transparent',
              color: viewMode === 'table' ? '#0b0e14' : '#94a3b8',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}
          >
            جدول
          </button>
        </div>
      </div>

      {/* Grid View Cards */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              style={{
                background: '#141824',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(138, 241, 10, 0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#8af10a', fontSize: '0.96rem' }}>
                    #{asset.id}
                  </span>
                  {getStatusBadge(asset.status)}
                </div>

                <h3
                  onClick={() => onSelectAsset(asset)}
                  style={{ fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', marginBottom: '4px', color: '#ffffff' }}
                  title="انقر لفتح الملف وسجل الصيانة"
                >
                  {asset.brand} {asset.model}
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  S/N: <span style={{ fontFamily: 'var(--font-mono)' }}>{asset.serialNumber}</span>
                </p>

                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.84rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  background: '#10141d',
                  padding: '0.75rem 1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  <div>
                    <span style={{ color: '#64748b' }}>الموقع: </span>
                    <strong style={{ color: '#ffffff' }}>{asset.department}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>العهدة: </span>
                    <strong style={{ color: '#8af10a' }}>{asset.currentUser}</strong>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onSelectAsset(asset)}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: '9999px', padding: '0.35rem 0.85rem' }}
                    title="فتح ملف الجهاز وتاريخ الصيانة وملصق QR"
                  >
                    <QrCode size={14} />
                    <span>ملف الجهاز</span>
                  </button>
                  <button
                    onClick={() => onNewTicketForAsset(asset.id)}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: '9999px', padding: '0.35rem 0.85rem' }}
                    title="تسجيل بلاغ صيانة لهذا الجهاز"
                  >
                    صيانة
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => onEditAsset(asset)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="تعديل"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`هل تريد حذف الجهاز ${asset.id}؟`)) {
                        onDeleteAsset(asset.id);
                      }
                    }}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px', color: '#f43f5e' }}
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div style={{
          background: '#141824',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.25rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <div className="custom-table-container" style={{ background: '#10141d', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <table className="custom-table">
              <thead>
                <tr style={{ background: '#161c28' }}>
                  <th style={{ color: '#94a3b8' }}>كود الجهاز</th>
                  <th style={{ color: '#94a3b8' }}>النوع والماركة</th>
                  <th style={{ color: '#94a3b8' }}>الرقم التسلسلي</th>
                  <th style={{ color: '#94a3b8' }}>الموقع / القسم</th>
                  <th style={{ color: '#94a3b8' }}>اسم المستخدم / العهدة</th>
                  <th style={{ color: '#94a3b8' }}>الحالة</th>
                  <th style={{ color: '#94a3b8' }}>عنوان IP</th>
                  <th style={{ color: '#94a3b8' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map(asset => (
                  <tr key={asset.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: '#8af10a', fontSize: '0.92rem' }}>
                        #{asset.id}
                      </strong>
                    </td>
                    <td>
                      <div onClick={() => onSelectAsset(asset)} style={{ cursor: 'pointer', fontWeight: 700, color: '#ffffff' }}>
                        {asset.brand} {asset.model}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{asset.type}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#94a3b8' }}>{asset.serialNumber}</span>
                    </td>
                    <td style={{ color: '#ffffff' }}>{asset.department}</td>
                    <td style={{ color: '#cbd5e1' }}>{asset.currentUser}</td>
                    <td>{getStatusBadge(asset.status)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8' }}>{asset.ipAddress || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <button onClick={() => onSelectAsset(asset)} className="btn-icon" style={{ width: '30px', height: '30px' }}>
                          <QrCode size={14} />
                        </button>
                        <button onClick={() => onNewTicketForAsset(asset.id)} className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                          صيانة
                        </button>
                        <button onClick={() => onEditAsset(asset)} className="btn-icon" style={{ width: '30px', height: '30px' }}>
                          <Edit size={14} />
                        </button>
                        <button onClick={() => onDeleteAsset(asset.id)} className="btn-icon" style={{ width: '30px', height: '30px', color: '#f43f5e' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredAssets.length === 0 && (
        <div style={{
          background: '#141824',
          borderRadius: '24px',
          textAlign: 'center',
          padding: '3.5rem',
          color: '#64748b',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          لا توجد أجهزة مطابقة لمعايير البحث.
        </div>
      )}

    </div>
  );
};
