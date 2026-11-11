import { useState } from 'react';
import type { UserAccount } from '../types';
import { storageService } from '../services/storageService';
import {
  Lock,
  User,
  Briefcase,
  ArrowLeft,
  UserPlus,
  LogIn,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('قسم تكنولوجيا المعلومات IT');
  const [regJobTitle, setRegJobTitle] = useState('مهندس صيانة ودعم فني');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }

    const result = storageService.login(loginIdentifier, loginPassword);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setErrorMsg(result.error || 'فشل تسجيل الدخول، يرجى التحقق من البيانات.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regUsername.trim() || !regPassword) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    if (regPassword.length < 3) {
      setErrorMsg('كلمة المرور يجب ألا تقل عن 3 أحرف.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('كلمات المرور غير متطابقة.');
      return;
    }

    const result = storageService.register({
      name: regName.trim(),
      username: regUsername.trim(),
      email: regEmail.trim(),
      department: regDepartment.trim(),
      jobTitle: regJobTitle.trim(),
      password: regPassword
    });

    if (result.success && result.user) {
      setSuccessMsg('تم إنشاء الحساب بنجاح! سيتم تحويلك إلى النظام.');
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 800);
    } else {
      setErrorMsg(result.error || 'حدث خطأ أثناء إنشاء الحساب.');
    }
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = (userType: 'admin' | 'tech' | 'pending' | 'enduser') => {
    if (userType === 'admin') {
      const res = storageService.login('admin', 'admin');
      if (res.success && res.user) onLoginSuccess(res.user);
    } else if (userType === 'tech') {
      const res = storageService.login('mohamed', '123');
      if (res.success && res.user) onLoginSuccess(res.user);
    } else if (userType === 'pending') {
      const res = storageService.login('sara', '123');
      if (res.success && res.user) onLoginSuccess(res.user);
    } else if (userType === 'enduser') {
      const res = storageService.login('enduser', 'User@Demo2026');
      if (res.success && res.user) onLoginSuccess(res.user);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      background: '#0b0e14',
      color: '#ffffff'
    }}>
      {/* Background Ambient Glow */}
      <div className="bg-ambient" />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 10 }}>
        
        {/* Hospital Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #161c28 0%, #1e2638 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(138, 241, 10, 0.3)',
            border: '2px solid rgba(138, 241, 10, 0.5)',
            padding: '10px',
            marginBottom: '1rem'
          }}>
            <Sparkles size={36} color="#8af10a" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            مستشفى نيل الأمل
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#8af10a', fontWeight: 700, letterSpacing: '0.02em' }}>
            منظومة إدارة وصيانة تكنولوجيا المعلومات IT
          </p>
        </div>

        {/* Auth Card Container */}
        <div style={{
          background: '#141824',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem',
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.6)'
        }}>
          
          {/* Mode Switcher Tabs (Segmented Pill) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: '#10141d',
            padding: '5px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              style={{
                padding: '0.65rem 0.5rem',
                border: 'none',
                borderRadius: '9999px',
                background: mode === 'login' ? '#8af10a' : 'transparent',
                color: mode === 'login' ? '#0b0e14' : '#94a3b8',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? '0 2px 10px rgba(138, 241, 10, 0.35)' : 'none',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={16} />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              style={{
                padding: '0.65rem 0.5rem',
                border: 'none',
                borderRadius: '9999px',
                background: mode === 'register' ? '#8af10a' : 'transparent',
                color: mode === 'register' ? '#0b0e14' : '#94a3b8',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? '0 2px 10px rgba(138, 241, 10, 0.35)' : 'none',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={16} />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(138, 241, 10, 0.15)',
              color: '#8af10a',
              border: '1px solid rgba(138, 241, 10, 0.3)',
              borderRadius: '14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={17} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>اسم المستخدم أو البريد الإلكتروني</label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{
                      paddingRight: '2.6rem',
                      borderRadius: '14px',
                      background: '#10141d',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff'
                    }}
                    placeholder="مثال: admin أو mohamed"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>كلمة المرور</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    className="form-control form-control-mono"
                    style={{
                      paddingRight: '2.6rem',
                      paddingLeft: '2.6rem',
                      borderRadius: '14px',
                      background: '#10141d',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff'
                    }}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  justifyContent: 'center',
                  padding: '0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.98rem'
                }}
              >
                <span>دخول إلى المنصة</span>
                <ArrowLeft size={18} />
              </button>
            </form>
          ) : (
            /* TAB 2: REGISTER FORM */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>الاسم الكامل (مع اللقب) *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingRight: '2.5rem', borderRadius: '12px', background: '#10141d', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
                    placeholder="مثال: ENG أحمد فتحي"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>اسم المستخدم *</label>
                  <input
                    type="text"
                    className="form-control form-control-mono"
                    style={{ borderRadius: '12px', background: '#10141d', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
                    placeholder="ahmed_it"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="form-control"
                    style={{ borderRadius: '12px', background: '#10141d', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
                    placeholder="ahmed@noh.local"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>القسم / الموقع</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: '12px', background: '#10141d', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
                    placeholder="قسم IT"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>المسمى الوظيفي</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: '12px', background: '#10141d', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
                    placeholder="مهندس صيانة"
                    value={regJobTitle}
                    onChange={(e) => setRegJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>كلمة المرور *</label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      {showRegPassword ? 'إخفاء' : 'إظهار'}
                    </button>
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    className="form-control form-control-mono"
                    style={{ borderRadius: '12px', background: '#10141d', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, color: '#94a3b8' }}>تأكيد المرور *</label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    className="form-control form-control-mono"
                    style={{ borderRadius: '12px', background: '#10141d', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.74rem', color: '#94a3b8', background: '#10141d', padding: '0.6rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                ℹ️ <strong>ملاحظة الأمان:</strong> عند إنشاء الحساب، سيكون الحساب بانتظار قيام مدير النظام باعتماده وتحديد الصلاحيات.
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.35rem', justifyContent: 'center', padding: '0.8rem', borderRadius: '9999px', fontSize: '0.98rem' }}
              >
                <span>إنشاء الحساب</span>
                <UserPlus size={18} />
              </button>
            </form>
          )}

          {/* Quick Demo Test Logins */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', marginBottom: '0.75rem', textAlign: 'center', letterSpacing: '0.04em' }}>
              ⚡ حسابات تجريبية سريعة بنقرة واحدة:
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                style={{
                  background: '#10141d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  padding: '0.55rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: '#ffffff',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#8af10a" />
                  <strong style={{ fontSize: '0.84rem' }}>مدير النظام (Admin)</strong>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#8af10a', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>admin / admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('tech')}
                style={{
                  background: '#10141d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  padding: '0.55rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: '#ffffff',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} color="#38bdf8" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>فني صيانة معتمد</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>mohamed / 123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('enduser')}
                style={{
                  background: '#10141d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  padding: '0.55rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: '#ffffff',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#a78bfa" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>بوابة الموظف (End User)</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>enduser / 123</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: '#64748b' }}>
          مستشفى نيل الأمل لجراحات الأطفال © 2026 • قسم تكنولوجيا المعلومات
        </div>

      </div>
    </div>
  );
};
