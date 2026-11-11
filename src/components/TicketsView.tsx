import { useState } from 'react';
import type { MaintenanceTicket, Asset } from '../types';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react';

interface TicketsViewProps {
  tickets: MaintenanceTicket[];
  assets: Asset[];
  onNewTicket: () => void;
  onEditTicket: (ticket: MaintenanceTicket) => void;
  onDeleteTicket: (ticketId: string) => void;
  onViewReport: (ticket: MaintenanceTicket) => void;
  onSelectAsset: (asset: Asset) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  assets,
  onNewTicket,
  onEditTicket,
  onDeleteTicket,
  onViewReport,
  onSelectAsset
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    const asset = assets.find(a => a.id === ticket.assetId);
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userProblemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Boolean(ticket.title && ticket.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      Boolean(ticket.location && ticket.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      Boolean(ticket.floor && ticket.floor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      Boolean(ticket.problemType && ticket.problemType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      Boolean(ticket.requesterName && ticket.requesterName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset && (asset.currentUser.toLowerCase().includes(searchTerm.toLowerCase()) || asset.department.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = categoryFilter === 'all' || ticket.issueCategory === categoryFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'open' ? ticket.status === 'open' : ticket.statusAfterMaintenance === statusFilter);

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            سجل تذاكر وتقارير الصيانة
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            إدارة كافة بلاغات الصيانة الطارئة والوقائية وتصدير التقارير المعتمدة
          </p>
        </div>

        <button
          onClick={onNewTicket}
          className="btn btn-primary"
          style={{ borderRadius: '9999px', padding: '0.6rem 1.4rem' }}
        >
          <Plus size={16} />
          <span>تسجيل بلاغ صيانة جديد</span>
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
            placeholder="بحث برقم التقرير، كود الجهاز، الفني، أو الموظف... 🔍"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter Pill */}
        <div className="filter-pill">
          <Filter size={14} color="#8af10a" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">كافة أنواع الأعطال</option>
            <option value="hardware">هاردوير (Hardware)</option>
            <option value="software">سوفت وير (Software)</option>
            <option value="network">شبكات (Network)</option>
            <option value="printer">طابعات (Printers)</option>
            <option value="preventive">صيانة وقائية</option>
          </select>
          <ChevronDown size={14} />
        </div>

        {/* Status Filter Pill */}
        <div className="filter-pill">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">كافة الحالات</option>
            <option value="open">جديد / بانتظار الإجراء</option>
            <option value="repaired">تم الإصلاح بنجاح</option>
            <option value="needs_parts">يحتاج قطعة غيار</option>
            <option value="under_observation">قيد الملاحظة</option>
            <option value="unrepairable">تالف</option>
          </select>
          <ChevronDown size={14} />
        </div>

        <div style={{ fontSize: '0.78rem', color: '#8af10a', fontWeight: 800, marginRight: 'auto' }}>
          {filteredTickets.length} بلاغات مطابقة
        </div>
      </div>

      {/* Tickets Table Card */}
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
                <th style={{ color: '#94a3b8' }}>رقم التقرير</th>
                <th style={{ color: '#94a3b8' }}>كود الجهاز</th>
                <th style={{ color: '#94a3b8' }}>الموقع / القسم</th>
                <th style={{ color: '#94a3b8' }}>المستخدم / مقدم البلاغ</th>
                <th style={{ color: '#94a3b8' }}>نوع العطل</th>
                <th style={{ color: '#94a3b8' }}>الفني المسؤول</th>
                <th style={{ color: '#94a3b8' }}>وقت البلاغ</th>
                <th style={{ color: '#94a3b8' }}>مدة التوقف</th>
                <th style={{ color: '#94a3b8' }}>الحالة</th>
                <th style={{ color: '#94a3b8' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => {
                const asset = assets.find(a => a.id === ticket.assetId);
                return (
                  <tr key={ticket.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: '#8af10a', fontSize: '0.92rem' }}>
                        #{ticket.id}
                      </strong>
                    </td>
                    <td>
                      <div
                        onClick={() => asset && onSelectAsset(asset)}
                        style={{ cursor: asset ? 'pointer' : 'default', fontWeight: 700, color: '#ffffff' }}
                        title={asset ? 'انقر لفتح ملف وسجل الجهاز' : undefined}
                      >
                        {ticket.assetId === 'GENERAL-REQ' ? (
                          <span className="badge" style={{ background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                            طلب عام ({ticket.problemType || 'مستخدم'})
                          </span>
                        ) : (
                          ticket.assetId
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {asset ? `${asset.brand} ${asset.model}` : (ticket.title || 'بلاغ موجه')}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                        {ticket.location ? `${ticket.location} - ${ticket.floor || ''}` : (asset?.department || '—')}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {ticket.requesterName || asset?.currentUser || '—'}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        {ticket.issueCategory === 'hardware' ? 'هاردوير' : ticket.issueCategory === 'software' ? 'سوفت وير' : ticket.issueCategory === 'printer' ? 'طابعة' : 'وقائية'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{ticket.technicianName}</strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{ticket.reportDateTime}</div>
                    </td>
                    <td>
                      <span style={{ color: '#fb923c', fontWeight: 700, fontSize: '0.82rem' }}>
                        {ticket.downtimeFormatted}
                      </span>
                    </td>
                    <td>
                      {ticket.status === 'open' ? (
                        <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                          <Clock size={12} /> جديد (بانتظار الإجراء)
                        </span>
                      ) : ticket.status === 'closed' ? (
                        <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                          <CheckCircle2 size={12} /> مغلق ومعتمد
                        </span>
                      ) : ticket.statusAfterMaintenance === 'repaired' || ticket.status === 'resolved' ? (
                        <span className="badge badge-operational"><CheckCircle2 size={12} /> تم الإصلاح</span>
                      ) : ticket.statusAfterMaintenance === 'needs_parts' || ticket.status === 'pending_parts' ? (
                        <span className="badge badge-needs-parts"><AlertTriangle size={12} /> يحتاج قطعة غيار</span>
                      ) : (
                        <span className="badge badge-maintenance">قيد الملاحظة</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <button
                          onClick={() => onViewReport(ticket)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.85rem', borderRadius: '9999px' }}
                          title="عرض التقرير الرسمي المعتمد وطباعته وتصديره PDF"
                        >
                          <FileText size={13} />
                          <span>التقرير</span>
                        </button>
                        <button
                          onClick={() => onEditTicket(ticket)}
                          className="btn-icon"
                          style={{ width: '30px', height: '30px' }}
                          title="تعديل"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف التقرير ${ticket.id}؟`)) {
                              onDeleteTicket(ticket.id);
                            }
                          }}
                          className="btn-icon"
                          style={{ width: '30px', height: '30px', color: '#f43f5e' }}
                          title="حذف"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                    لا توجد بلاغات تطابق معايير البحث المحددة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
