import { useState, useEffect, useCallback } from 'react'
import { Shield, Lock, History, Globe, Clock, Save, ShieldCheck, Smartphone, Mail, Key, Info, Users, RefreshCcw, Activity } from 'lucide-react'
import { securityAPI } from '../../api/securityAPI'
import Swal from 'sweetalert2'

// Sub-components
import ActiveSessionsTable from '../../components/admin/security/ActiveSessionsTable'
import LoginHistoryTable from '../../components/admin/security/LoginHistoryTable'

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString))
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A'
  const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000)
  if (diffInSeconds < 60) return 'vừa xong'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`
}

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState(null)
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyFilters, setHistoryFilters] = useState({ username: '', status: 'ALL', startDate: '', endDate: '' })
  const [historyPage, setHistoryPage] = useState(0)
  const [historyTotalPages, setHistoryTotalPages] = useState(0)
  const [historyTotalElements, setHistoryTotalElements] = useState(0)
  const [twoFactorUsers, setTwoFactorUsers] = useState([])
  
  const [form, setForm] = useState({
    twoFactorEnabled: false, allowedTwoFactorMethods: [], passwordMinLength: 8, requireSpecialChar: true, requireUppercase: true, requireNumeric: true,
    passwordExpirationDays: 90, maxFailedLoginAttempts: 5, accountLockoutMinutes: 30, accessTokenLifetimeMinutes: 15, refreshTokenLifetimeDays: 7,
    sessionTimeoutMinutes: 30, rememberMeEnabled: false, rememberMeLifetimeDays: 30, corsAllowedDomains: '', rateLimitPerMinute: 100,
    apiKeyAuthEnabled: false, ipWhitelist: '', ipBlacklist: ''
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, sessRes, uRes] = await Promise.all([securityAPI.getSecuritySettings(), securityAPI.getActiveSessions(), securityAPI.get2FAUsers()])
      if (sRes.data.result) {
        const s = sRes.data.result
        setSettings(s)
        setForm({ ...s, corsAllowedDomains: s.corsAllowedDomains?.join('\n') || '', ipWhitelist: s.ipWhitelist?.join('\n') || '', ipBlacklist: s.ipBlacklist?.join('\n') || '', allowedTwoFactorMethods: s.allowedTwoFactorMethods || [] })
      }
      setSessions(sessRes.data.result || []); setTwoFactorUsers(uRes.data.result || []); fetchHistory()
    } catch (err) { Swal.fire('Lỗi', 'Không thể tải dữ liệu bảo mật', 'error') }
    finally { setLoading(false) }
  }, [])

  const fetchHistory = async () => {
    setHistoryLoading(true)
    try {
      const { data } = await securityAPI.getLoginHistory(historyFilters, historyPage)
      setHistory(data.result.content || [])
      setHistoryTotalPages(data.result.totalPages || 0)
      setHistoryTotalElements(data.result.totalElements || 0)
    } finally { setHistoryLoading(false) }
  }

  const fetchSessions = async () => {
    setSessionsLoading(true)
    try {
      const { data } = await securityAPI.getActiveSessions()
      setSessions(data.result || [])
    } finally { setSessionsLoading(false) }
  }

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { 
    fetchHistory()
  }, [historyPage])
  useEffect(() => { 
    const timer = setInterval(fetchSessions, 60000); return () => clearInterval(timer) 
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handle2FAMethodToggle = (method) => {
    setForm(prev => {
      const methods = prev.allowedTwoFactorMethods.includes(method) 
        ? prev.allowedTwoFactorMethods.filter(m => m !== method) 
        : [...prev.allowedTwoFactorMethods, method]
      return { ...prev, allowedTwoFactorMethods: methods }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, corsAllowedDomains: form.corsAllowedDomains.split('\n').filter(d => d.trim()), ipWhitelist: form.ipWhitelist.split('\n').filter(ip => ip.trim()), ipBlacklist: form.ipBlacklist.split('\n').filter(ip => ip.trim()) }
      await securityAPI.updateSecuritySettings(payload)
      Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          text: 'Cấu hình bảo mật đã được áp dụng',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
      }); 
      fetchData()
    } catch (err) { Swal.fire('Lỗi', 'Không thể lưu cấu hình', 'error') }
    finally { setSaving(false) }
  }

  const handleTerminateSession = async (id) => {
    const res = await Swal.fire({ title: 'Chấm dứt phiên?', icon: 'warning', showCancelButton: true })
    if (res.isConfirmed) {
      try { await securityAPI.terminateSession(id); fetchSessions() } catch { Swal.fire('Lỗi', 'Thất bại', 'error') }
    }
  }

  if (loading && !settings) return <div className="py-20 text-center"><div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" /></div>

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Stats Section with Consistent Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-[1.5rem] border border-gray-100 dark:border-dark-border shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1 group">
            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-gray-400 group-hover:text-gray-600 transition-colors">
                <Activity className="h-7 w-7" />
            </div>
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang hoạt động</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{sessions.length}</h3>
            </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-[1.5rem] border border-gray-100 dark:border-dark-border shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1 group">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
                <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
                <p className="text-xs font-black text-emerald-600/60 uppercase tracking-widest">Người dùng 2FA</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{twoFactorUsers.length}</h3>
            </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-[1.5rem] border border-gray-100 dark:border-dark-border shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1 group">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl text-orange-600">
                <History className="h-7 w-7" />
            </div>
            <div>
                <p className="text-xs font-black text-orange-600/60 uppercase tracking-widest">Lịch sử hôm nay</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{history.length}+</h3>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2FA Card - Enhanced UI */}
        <div className="p-8 bg-white dark:bg-dark-card rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-dark-border space-y-8">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-950/30 rounded-xl text-primary-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Xác thực 2 lớp (2FA)</h3>
                <p className="text-sm text-gray-500 font-medium">Bảo vệ tài khoản bằng lớp bảo mật thứ hai</p>
              </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-dashed border-gray-200 dark:border-dark-border">
              <div className="space-y-1">
                <p className="font-black text-gray-900 dark:text-white">Bật 2FA toàn hệ thống</p>
                <p className="text-xs text-gray-500 font-medium italic">Yêu cầu tất cả nhân viên phải sử dụng 2FA</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-125 mr-2">
                  <input type="checkbox" className="sr-only peer" checked={form.twoFactorEnabled} onChange={(e) => setForm(p=>({...p, twoFactorEnabled: e.target.checked}))} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
          </div>

          {form.twoFactorEnabled && (
              <div className="space-y-4 animate-scale-up-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Các phương thức cho phép</p>
                  <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'SMS', label: 'Tin nhắn SMS', icon: Smartphone },
                        { id: 'EMAIL', label: 'Thư điện tử (Email)', icon: Mail },
                        { id: 'AUTHENTICATOR_APP', label: 'Authenticator App', icon: Key }
                      ].map(m => (
                          <button 
                            key={m.id} 
                            onClick={() => handle2FAMethodToggle(m.id)} 
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                                form.allowedTwoFactorMethods.includes(m.id) 
                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/10' 
                                : 'border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-gray-200'
                            }`}
                          >
                              <div className="flex items-center gap-3">
                                  <m.icon className={`h-5 w-5 ${form.allowedTwoFactorMethods.includes(m.id) ? 'text-primary-600' : 'text-gray-400'}`} />
                                  <span className={`text-sm font-bold ${form.allowedTwoFactorMethods.includes(m.id) ? 'text-primary-700' : 'text-gray-500'}`}>{m.label}</span>
                              </div>
                              {form.allowedTwoFactorMethods.includes(m.id) && <ShieldCheck className="h-5 w-5 text-primary-600" />}
                          </button>
                      ))}
                  </div>
              </div>
          )}
        </div>

        {/* Security Policy Card */}
        <div className="p-8 bg-white dark:bg-dark-card rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-dark-border space-y-8">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/30 rounded-xl text-indigo-600">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Chính sách mật khẩu</h3>
                <p className="text-sm text-gray-500 font-medium">Thiết lập độ phức tạp và quy tắc đăng nhập</p>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Độ dài Min</label>
                <input 
                    type="number" 
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white" 
                    value={form.passwordMinLength} 
                    onChange={handleInputChange} 
                    name="passwordMinLength" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Thử sai tối đa</label>
                <input 
                    type="number" 
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white" 
                    value={form.maxFailedLoginAttempts} 
                    onChange={handleInputChange} 
                    name="maxFailedLoginAttempts" 
                />
              </div>
          </div>

          <div className="space-y-3">
              {[
                  { id: 'requireUppercase', label: 'Bắt buộc Chữ in hoa' },
                  { id: 'requireNumeric', label: 'Bắt buộc Chữ số (0-9)' },
                  { id: 'requireSpecialChar', label: 'Bắt buộc Ký tự đặc biệt' }
              ].map(k => (
                  <div key={k.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl">
                      <span className="text-sm font-bold text-gray-600">{k.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={form[k.id]} onChange={handleInputChange} name={k.id} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                  </div>
              ))}
          </div>
        </div>
      </div>

      <ActiveSessionsTable sessions={sessions} sessionsLoading={sessionsLoading} fetchSessions={fetchSessions} handleTerminateSession={handleTerminateSession} handleTerminateAllSessions={()=>{}} formatDate={formatDate} formatRelativeTime={formatRelativeTime} />

      <LoginHistoryTable history={history} historyLoading={historyLoading} historyFilters={historyFilters} setHistoryFilters={setHistoryFilters} historyPage={historyPage} setHistoryPage={setHistoryPage} historyTotalPages={historyTotalPages} historyTotalElements={historyTotalElements} fetchHistory={fetchHistory} handleExportHistory={()=>{}} formatDate={formatDate} />

      <div className="flex justify-end pt-8">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="group h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4"
          >
              <div className={`p-2 rounded-lg ${saving ? 'bg-transparent' : 'bg-white/10 dark:bg-gray-100'}`}>
                {saving ? <RefreshCcw className="h-6 w-6 animate-spin" /> : <ShieldCheck className="h-6 w-6" />}
              </div>
              <span className="uppercase tracking-tight">{saving ? 'Đang áp dụng...' : 'Lưu cấu hình bảo mật'}</span>
          </button>
      </div>
    </div>
  )
}

export default SecuritySettings
