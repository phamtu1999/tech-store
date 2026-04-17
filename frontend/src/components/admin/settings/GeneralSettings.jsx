import { Upload, Store, DollarSign, Globe2, Clock, Hash, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const GeneralSettings = ({ 
  logo, 
  uploading, 
  handleLogoChange, 
  storeName, 
  setStoreName, 
  supportEmail, 
  setSupportEmail, 
  hotlinePhone, 
  setHotlinePhone, 
  address, 
  setAddress, 
  currency, 
  setCurrency, 
  timezone, 
  setTimezone, 
  vatRate, 
  setVatRate, 
  storeStatus, 
  setStoreStatus 
}) => {
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
    return phoneRegex.test(phone.replace(/[\s.-]/g, ''))
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setSupportEmail(value)
    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Email không hợp lệ' }))
    } else {
      setErrors(prev => ({ ...prev, email: null }))
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value
    setHotlinePhone(value)
    if (value && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ' }))
    } else {
      setErrors(prev => ({ ...prev, phone: null }))
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Branding Section */}
      <div className="bg-white dark:bg-dark-card rounded-[1.5rem] p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                🏷️ Nhận diện thương hiệu
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Quản lý Logo và hình ảnh đại diện của cửa hàng</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start gap-8">
            <label className="relative group cursor-pointer flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-all group-hover:shadow-xl group-hover:scale-[1.02]">
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 border-3 border-primary-500 border-t-transparent animate-spin rounded-full"></div>
                        </div>
                    ) : (
                        <img src={logo} alt="Store Logo" className="w-full h-full object-contain p-4" />
                    )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                   <Upload className="h-6 w-6 text-white" />
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} disabled={uploading} />
            </label>
            <div className="space-y-4 flex-1">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Logo chính thức</h4>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">Sử dụng trên Header, hóa đơn và email thông báo. Hình ảnh nên có nền trong suốt (PNG) để hiển thị tốt nhất.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-50 dark:bg-dark-bg rounded-lg text-[10px] font-bold text-gray-500 border border-gray-100">PNG, SVG</span>
                    <span className="px-3 py-1 bg-gray-50 dark:bg-dark-bg rounded-lg text-[10px] font-bold text-gray-500 border border-gray-100">MAX 2MB</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="bg-white dark:bg-dark-card rounded-[1.5rem] p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                    🏪 Thông tin cơ bản
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Các thông tin liên hệ chính của cửa hàng</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${storeStatus ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                <div className={`h-2 w-2 rounded-full ${storeStatus ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                <span className="text-[11px] font-black uppercase tracking-wider">{storeStatus ? 'Đang hoạt động' : 'Tạm đóng cửa'}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Tên cửa hàng</label>
                <input
                    type="text"
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-900 dark:text-white"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email hỗ trợ</label>
                <input
                    type="email"
                    className={`w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 transition-all font-bold text-gray-900 dark:text-white ${
                        errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-gray-100 dark:border-dark-border focus:ring-primary-500 focus:bg-white'
                    }`}
                    value={supportEmail}
                    onChange={handleEmailChange}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Hotline CSKH</label>
                <input
                    type="text"
                    className={`w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border rounded-xl focus:ring-2 transition-all font-bold text-gray-900 dark:text-white ${
                        errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-gray-100 dark:border-dark-border focus:ring-primary-500 focus:bg-white'
                    }`}
                    value={hotlinePhone}
                    onChange={handlePhoneChange}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Trạng thái vận hành</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl">
                    <span className="text-xs font-bold text-gray-600 px-1">Cho phép đặt hàng</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={storeStatus} onChange={(e) => setStoreStatus(e.target.checked)} />
                        <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>
            </div>
        </div>

        <div className="mt-8 space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Địa chỉ trụ sở chính</label>
            <textarea
                className="w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-900 dark:text-white resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
        </div>
      </div>

      {/* Commercial Config Section */}
      <div className="bg-white dark:bg-dark-card rounded-[1.5rem] p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                ⚙️ Cấu hình thương mại
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Thiết lập tiền tệ, múi giờ và thuế suất mặc định</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600"><DollarSign className="h-5 w-5" /></div>
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Tiền tệ</label>
                </div>
                <select
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-900 dark:text-white cursor-pointer"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <option value="VND">Vietnamese Dong (₫)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                </select>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600"><Globe2 className="h-5 w-5" /></div>
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Múi giờ hệ thống</label>
                </div>
                <select
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-900 dark:text-white cursor-pointer"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                >
                    <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                    <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                </select>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600"><Hash className="h-5 w-5" /></div>
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Thuế suất VAT (%)</label>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-900 dark:text-white"
                        value={vatRate}
                        onChange={(e) => setVatRate(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400">%</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralSettings
