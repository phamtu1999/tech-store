import { useState, useEffect } from 'react'
import { Settings, Store, CreditCard, Globe, Save, RefreshCcw, BellRing, ShieldCheck, ChevronRight, DollarSign, Database } from 'lucide-react'
import { filesAPI } from '../../api/files'
import { settingsAPI } from '../../api/settings'
import Swal from 'sweetalert2'
import SecuritySettings from './SecuritySettings'

// Sub-components
import GeneralSettings from '../../components/admin/settings/GeneralSettings'
import BroadcastNotification from '../../components/admin/settings/BroadcastNotification'
import BackupManagement from '../../components/admin/BackupManagement'

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general')
    const [logo, setLogo] = useState('https://res.cloudinary.com/demo/image/upload/v1622540000/sample.jpg')
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [originalData, setOriginalData] = useState(null)

    // Form state for store settings
    const [storeName, setStoreName] = useState('Tech Store')
    const [supportEmail, setSupportEmail] = useState('support@techstore.com')
    const [hotlinePhone, setHotlinePhone] = useState('0987.654.321')
    const [address, setAddress] = useState('123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh')
    const [currency, setCurrency] = useState('VND')
    const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh')
    const [vatRate, setVatRate] = useState('10')
    const [storeStatus, setStoreStatus] = useState(true)

    // Payment settings states
    const [paymentMethods, setPaymentMethods] = useState({
        vnpay: true, momo: true, cod: true, bankTransfer: true
    })
    const [codFee, setCodFee] = useState('0')
    const [minOrder, setMinOrder] = useState('0')

    // SEO states
    const [metaTitle, setMetaTitle] = useState('Tech Store')
    const [metaKeywords, setMetaKeywords] = useState('điện thoại, laptop')
    const [metaDescription, setMetaDescription] = useState('Hệ thống bán lẻ điện thoại, laptop chính hãng')

    useEffect(() => {
        fetchSettings()
    }, [])

    useEffect(() => {
        if (!originalData) return;
        
        const currentData = {
            storeName, supportEmail, hotlinePhone, address, logo, currency, timezone, vatRate: parseFloat(vatRate), storeStatus,
            paymentMethods, codFee: parseFloat(codFee), minOrder: parseFloat(minOrder),
            metaTitle, metaKeywords, metaDescription
        };

        const changed = JSON.stringify(currentData) !== JSON.stringify(originalData);
        setHasChanges(changed);
    }, [storeName, supportEmail, hotlinePhone, address, logo, currency, timezone, vatRate, storeStatus, paymentMethods, codFee, minOrder, metaTitle, metaKeywords, metaDescription, originalData])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const response = await settingsAPI.getSettings()
            const settings = response.data.result
            if (settings) {
                const data = {
                    logoUrl: settings.logoUrl || 'https://res.cloudinary.com/demo/image/upload/v1622540000/sample.jpg',
                    storeName: settings.storeName || 'Tech Store',
                    supportEmail: settings.supportEmail || 'support@techstore.com',
                    hotlinePhone: settings.hotlinePhone || '0987.654.321',
                    address: settings.address || '123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh',
                    currency: settings.currency || 'VND',
                    timezone: settings.timezone || 'Asia/Ho_Chi_Minh',
                    vatRate: settings.vatRate || 10,
                    storeStatus: settings.storeStatus !== undefined ? settings.storeStatus : true
                }
                
                setLogo(data.logoUrl)
                setStoreName(data.storeName)
                setSupportEmail(data.supportEmail)
                setHotlinePhone(data.hotlinePhone)
                setAddress(data.address)
                setCurrency(data.currency)
                setTimezone(data.timezone)
                setVatRate(data.vatRate.toString())
                setStoreStatus(data.storeStatus)
                
                // Save original for comparison
                setOriginalData({
                    storeName: data.storeName,
                    supportEmail: data.supportEmail,
                    hotlinePhone: data.hotlinePhone,
                    address: data.address,
                    logo: data.logoUrl,
                    currency: data.currency,
                    timezone: data.timezone,
                    vatRate: data.vatRate,
                    storeStatus: data.storeStatus,
                    paymentMethods: mockPayment,
                    codFee: 0,
                    minOrder: 0,
                    metaTitle: 'Tech Store',
                    metaKeywords: 'điện thoại, laptop',
                    metaDescription: 'Hệ thống bán lẻ điện thoại, laptop chính hãng'
                })
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setLoading(false)
            setHasChanges(false)
        }
    }

    const handleLogoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'File quá lớn', text: 'Vui lòng chọn file nhỏ hơn 2MB', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
            return
        }

        setUploading(true)
        try {
            const response = await filesAPI.upload(file, 'settings')
            setLogo(response.data.result)
            Swal.fire({ icon: 'success', title: 'Đã tải logo lên', text: 'Nhớ nhấn "Lưu thay đổi" để áp dụng', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Lỗi tải logo', text: 'Không thể tải logo lên', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await settingsAPI.updateSettings({
                storeName, logoUrl: logo, supportEmail, hotlinePhone, address, currency, timezone, vatRate: parseFloat(vatRate), storeStatus
            })
            Swal.fire({ 
                icon: 'success', 
                title: 'Đã lưu cài đặt thành công!', 
                html: '<div class="text-sm text-gray-600 mt-2">✓ Thông tin cửa hàng<br/>✓ Cấu hình thương mại<br/>✓ Logo & trạng thái</div>',
                toast: true, 
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                window.location.reload()
            })
            setHasChanges(false)
        } catch (error) {
            Swal.fire({ 
                icon: 'error', 
                title: 'Lỗi lưu cấu hình', 
                text: error.response?.data?.message || 'Không thể lưu cấu hình', 
                toast: true, 
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 4000,
                timerProgressBar: true
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDiscard = () => {
        if (!originalData) return;
        setStoreName(originalData.storeName)
        setSupportEmail(originalData.supportEmail)
        setHotlinePhone(originalData.hotlinePhone)
        setAddress(originalData.address)
        setLogo(originalData.logo)
        setCurrency(originalData.currency || 'VND')
        setTimezone(originalData.timezone || 'Asia/Ho_Chi_Minh')
        setVatRate((originalData.vatRate || 10).toString())
        setStoreStatus(originalData.storeStatus !== undefined ? originalData.storeStatus : true)
        setPaymentMethods(originalData.paymentMethods || { vnpay: true, momo: true, cod: true, bankTransfer: true })
        setCodFee((originalData.codFee || 0).toString())
        setMinOrder((originalData.minOrder || 0).toString())
        setMetaTitle(originalData.metaTitle || 'Tech Store')
        setMetaKeywords(originalData.metaKeywords || 'điện thoại, laptop')
        setMetaDescription(originalData.metaDescription || 'Hệ thống bán lẻ điện thoại, laptop chính hãng')
        setHasChanges(false)

        
        Swal.fire({
            icon: 'info',
            title: 'Đã hoàn tác',
            text: 'Mọi thay đổi đã được quay về trạng thái ban đầu',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        })
    }

    const tabs = [
        { id: 'general', label: 'Cửa hàng', icon: Store, group: 'Cài đặt chung' },
        { id: 'payment', label: 'Thanh toán', icon: CreditCard, group: 'Cài đặt chung' },
        { id: 'seo', label: 'SEO & Metadata', icon: Globe, group: 'Marketing' },
        { id: 'security', label: 'Bảo mật', icon: ShieldCheck, group: 'Hệ thống' },
        { id: 'notification', label: 'Thông báo', icon: BellRing, group: 'Hệ thống' },
        { id: 'database', label: 'Dữ liệu', icon: Database, group: 'Hệ thống' },
    ]

    const groupedTabs = tabs.reduce((acc, tab) => {
        if (!acc[tab.group]) acc[tab.group] = []
        acc[tab.group].push(tab)
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-dark-bg -m-6 p-6 space-y-6 animate-fade-in pb-32">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="hover:text-primary-600 cursor-pointer transition-colors" onClick={() => navigate('/admin')}>Dashboard</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-gray-900">Cài đặt</span>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-200">
                        <Settings className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Cài đặt hệ thống</h1>
                        <p className="text-gray-500 font-medium mt-1">Quản lý cấu hình, bảo mật và tùy chỉnh cửa hàng</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-72 space-y-6">
                    {Object.entries(groupedTabs).map(([group, groupTabs]) => (
                        <div key={group} className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 pt-4 pb-2">{group}</h3>
                            {groupTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                                        activeTab === tab.id 
                                            ? 'bg-primary-50 text-primary-700' 
                                            : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        <span className={`text-[13px] tracking-tight ${activeTab === tab.id ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                                    </div>
                                    {activeTab === tab.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex-1">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{tabs.find(t => t.id === activeTab)?.label}</h2>
                        <p className="text-gray-500 font-medium text-sm mt-1">Cấu hình chi tiết các tham số của hệ thống</p>
                    </div>

                    <div className="max-w-4xl">
                        {activeTab === 'general' && <GeneralSettings 
                             logo={logo} uploading={uploading} handleLogoChange={handleLogoChange}
                             storeName={storeName} setStoreName={setStoreName} supportEmail={supportEmail} setSupportEmail={setSupportEmail}
                             hotlinePhone={hotlinePhone} setHotlinePhone={setHotlinePhone} address={address} setAddress={setAddress}
                             currency={currency} setCurrency={setCurrency} timezone={timezone} setTimezone={setTimezone}
                             vatRate={vatRate} setVatRate={setVatRate} storeStatus={storeStatus} setStoreStatus={setStoreStatus}
                        />}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
                                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" /> 
                                        Cổng thanh toán
                                    </h3>
                                    <p className="text-sm text-blue-700 mb-4">Quản lý các phương thức thanh toán khả dụng cho khách hàng</p>
                                    
                                    <div className="space-y-3">
                                        {/* VNPAY */}
                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <CreditCard className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">VNPAY</span>
                                                        <span className="text-xs text-gray-500">Cổng thanh toán trực tuyến</span>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={paymentMethods.vnpay} 
                                                        onChange={(e) => setPaymentMethods(p => ({...p, vnpay: e.target.checked}))}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Momo */}
                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-xl font-bold text-pink-600">M</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">Momo</span>
                                                        <span className="text-xs text-gray-500">Ví điện tử Momo</span>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={paymentMethods.momo} 
                                                        onChange={(e) => setPaymentMethods(p => ({...p, momo: e.target.checked}))}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* COD */}
                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <DollarSign className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">Thanh toán COD</span>
                                                        <span className="text-xs text-gray-500">Thanh toán khi nhận hàng</span>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={paymentMethods.cod} 
                                                        onChange={(e) => setPaymentMethods(p => ({...p, cod: e.target.checked}))}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Bank Transfer */}
                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <Store className="h-6 w-6 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">Chuyển khoản ngân hàng</span>
                                                        <span className="text-xs text-gray-500">Chuyển khoản trực tiếp</span>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={paymentMethods.bankTransfer} 
                                                        onChange={(e) => setPaymentMethods(p => ({...p, bankTransfer: e.target.checked}))}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Stripe (International) */}
                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden opacity-60">
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                        <Globe className="h-6 w-6 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block flex items-center gap-2">
                                                            Stripe
                                                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">Sắp ra mắt</span>
                                                        </span>
                                                        <span className="text-xs text-gray-500">Thanh toán quốc tế</span>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-not-allowed">
                                                    <input type="checkbox" className="sr-only peer" disabled />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Settings */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-4">Cài đặt thanh toán</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <span className="font-semibold text-gray-900 block">Phí COD</span>
                                                <span className="text-xs text-gray-500">Phí thu thêm khi thanh toán COD</span>
                                            </div>
                                            <input 
                                                type="number" 
                                                className="w-48 h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold text-gray-900" 
                                                value={codFee}
                                                onChange={(e) => setCodFee(e.target.value)}
                                                placeholder="0 ₫"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                            <div>
                                                <span className="font-bold text-gray-900 block tracking-tight text-lg">Đơn hàng tối thiểu</span>
                                                <span className="text-sm text-gray-500 font-medium">Giá trị đơn hàng tối thiểu để được phép đặt hàng</span>
                                            </div>
                                            <input 
                                                type="number" 
                                                className="w-48 h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold text-gray-900" 
                                                value={minOrder}
                                                onChange={(e) => setMinOrder(e.target.value)}
                                                placeholder="0 ₫"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'seo' && (
                            <div className="space-y-8">
                                <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-gray-100 dark:border-dark-border shadow-sm space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl text-indigo-600">
                                            <Globe className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Cấu hình SEO</h3>
                                            <p className="text-sm text-gray-500 font-medium">Tối ưu hóa khả năng tìm kiếm trên Google, Facebook</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Meta Title mặc định</label>
                                            <input 
                                                type="text" 
                                                className="w-full h-14 px-5 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-all outline-none" 
                                                value={metaTitle}
                                                onChange={(e) => setMetaTitle(e.target.value)}
                                                placeholder="Nhập tiêu đề trang..." 
                                            />
                                            <div className="flex justify-between px-1">
                                                <span className="text-[11px] text-gray-400 font-medium">Tiêu đề xuất hiện trên tab trình duyệt</span>
                                                <span className={`text-[11px] font-bold ${metaTitle.length > 60 ? 'text-orange-500' : 'text-gray-400'}`}>{metaTitle.length}/60</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Meta Keywords</label>
                                            <input 
                                                type="text" 
                                                className="w-full h-14 px-5 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-all outline-none" 
                                                value={metaKeywords}
                                                onChange={(e) => setMetaKeywords(e.target.value)}
                                                placeholder="Từ khóa cách nhau bởi dấu phẩy..." 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Meta Description (Mô tả)</label>
                                            <textarea 
                                                className="w-full h-32 p-5 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white transition-all outline-none resize-none" 
                                                value={metaDescription}
                                                onChange={(e) => setMetaDescription(e.target.value)}
                                                placeholder="Nhập mô tả ngắn về cửa hàng của bạn..."
                                            />
                                            <div className="flex justify-between px-1">
                                                <span className="text-[11px] text-gray-400 font-medium">Mô tả xuất hiện dưới link tìm kiếm Google</span>
                                                <span className={`text-[11px] font-bold ${metaDescription.length > 160 ? 'text-orange-500' : 'text-gray-400'}`}>{metaDescription.length}/160</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Card */}
                                <div className="bg-gray-900 rounded-[2rem] p-8 shadow-2xl border border-gray-800">
                                    <h4 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Xem trước trên Google
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="text-[#8ab4f8] text-xl font-medium hover:underline cursor-pointer truncate max-w-full">
                                            {metaTitle || 'Chưa có tiêu đề'}
                                        </div>
                                        <div className="text-[#34a853] text-[15px] flex items-center gap-1">
                                            https://techstore.com <span className="text-gray-500">▼</span>
                                        </div>
                                        <div className="text-gray-400 text-[14px] leading-relaxed line-clamp-2">
                                            {metaDescription || 'Chưa có mô tả để hiển thị kết quả tìm kiếm...'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'notification' && <BroadcastNotification />}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'database' && <BackupManagement />}
                    </div>
                </div>
            </div>

            {hasChanges && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-5xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border border-white dark:border-dark-border shadow-[0_25px_60px_rgba(0,0,0,0.18)] z-50 animate-slide-up rounded-[1.5rem] overflow-hidden">
                    <div className="px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="h-12 w-12 bg-primary-100 dark:bg-primary-950/30 rounded-full flex items-center justify-center">
                                    <RefreshCcw className={`h-6 w-6 text-primary-600 ${loading ? 'animate-spin' : ''}`} />
                                </div>
                                <div className="absolute top-0 right-0 h-4 w-4 bg-orange-500 rounded-full border-[3px] border-white animate-pulse"></div>
                            </div>
                            <div>
                                <span className="text-[15px] font-black text-gray-900 dark:text-white block tracking-tight">Thay đổi được phát hiện</span>
                                <span className="text-[13px] text-gray-600 dark:text-gray-400 font-bold">Dữ liệu hiện tại khác biệt so với cấu hình gốc trên máy chủ</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleDiscard} 
                                disabled={loading || saving} 
                                className="px-6 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-rose-600 transition-all disabled:opacity-50"
                            >
                                Hủy bỏ (Discard)
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={saving || loading} 
                                className="px-10 h-12 rounded-xl font-black text-white bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 hover:shadow-2xl hover:shadow-primary-200 transition-all flex items-center gap-2 disabled:opacity-50 group"
                            >
                                {saving ? (
                                    <>
                                        <div className="h-5 w-5 border-[3px] border-white border-t-transparent animate-spin rounded-full"></div>
                                        <span>Đang cập nhật...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
                                        <span>Lưu thay đổi</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSettings
