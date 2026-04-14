import { useState } from 'react'
import { Settings, Store, CreditCard, Search, Mail, Phone, MapPin, Globe, Save, RefreshCcw, BellRing, ShieldCheck, Upload } from 'lucide-react'
import { filesAPI } from '../../api/files'
import Swal from 'sweetalert2'

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general')
    const [logo, setLogo] = useState('https://res.cloudinary.com/demo/image/upload/v1622540000/sample.jpg')
    const [uploading, setUploading] = useState(false)

    const handleLogoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const response = await filesAPI.upload(file, 'settings')
            setLogo(response.data.data)
            Swal.fire({
                icon: 'success',
                title: 'Đã cập nhật logo',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            })
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể tải logo lên', 'error')
        } finally {
            setUploading(false)
        }
    }

    const handleSave = () => {
        Swal.fire({
            title: 'Đang lưu cấu hình...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        })
        
        setTimeout(() => {
            Swal.fire('Thành công', 'Đã cập nhật cấu hình hệ thống', 'success')
        }, 1500)
    }

    const tabs = [
        { id: 'general', label: 'Cửa hàng', icon: Store },
        { id: 'payment', label: 'Thanh toán', icon: CreditCard },
        { id: 'seo', label: 'SEO & Metadata', icon: Globe },
        { id: 'security', label: 'Bảo mật', icon: ShieldCheck },
        { id: 'notification', label: 'Thông báo', icon: BellRing },
    ]

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-72 space-y-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                            activeTab === tab.id 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 translate-x-1' 
                            : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border'
                        }`}
                    >
                        <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`} />
                        <span className="font-semibold">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white dark:bg-dark-card rounded-[2rem] shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-8 pb-4 border-b border-gray-100 dark:border-dark-border">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-gray-500 mt-1">Cấu hình chi tiết các tham số của hệ thống</p>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                    {activeTab === 'general' && (
                        <div className="space-y-8 max-w-2xl">
                            {/* Logo Section */}
                            <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50/50 dark:bg-dark-bg/50 rounded-3xl border border-gray-100 dark:border-dark-border">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white shadow-inner border border-gray-100 flex items-center justify-center">
                                        <img src={logo} alt="Store Logo" className="w-full h-full object-contain p-2" />
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                        {uploading ? <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <Upload className="h-4 w-4" />}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </label>
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">Logo cửa hàng</h4>
                                    <p className="text-sm text-gray-500">Logo này sẽ hiển thị trên Header và các hóa đơn của shop.</p>
                                    <p className="text-[10px] text-gray-400 mt-2 italic">Định dạng hỗ trợ: PNG, JPG, SVG. Tối đa 2MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Store className="h-4 w-4 text-primary-500" /> Tên cửa hàng
                                    </label>
                                    <input type="text" className="input h-12" defaultValue="Tech Store" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary-500" /> Email hỗ trợ
                                    </label>
                                    <input type="email" className="input h-12" defaultValue="support@techstore.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary-500" /> Số điện thoại Hotline
                                </label>
                                <input type="text" className="input h-12" defaultValue="0987.654.321" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary-500" /> Địa chỉ trụ sở
                                </label>
                                <textarea className="input min-h-[80px] py-3" defaultValue="123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh" />
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-dark-border flex gap-4">
                                <button onClick={handleSave} className="btn btn-primary px-8 h-12 flex items-center gap-2">
                                    <Save className="h-5 w-5" /> Lưu thay đổi
                                </button>
                                <button className="btn btn-secondary px-8 h-12 flex items-center gap-2">
                                    <RefreshCcw className="h-5 w-5" /> Khôi phục
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="space-y-8 max-w-2xl">
                            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/20">
                                <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" /> Cấu hình cổng thanh toán
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'VNPAY', enabled: true },
                                        { name: 'Momo', enabled: true },
                                        { name: 'Thanh toán khi nhận hàng (COD)', enabled: true },
                                        { name: 'Chuyển khoản ngân hàng', enabled: false },
                                    ].map((method, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-dark-bg rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">{method.name}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={method.enabled} />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleSave} className="btn btn-primary w-full h-12">Lưu cấu hình thanh toán</button>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Meta Title mặc định</label>
                                <input type="text" className="input h-12" defaultValue="Tech Store - Cửa hàng thiết bị di động uy tín" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Meta Keywords</label>
                                <input type="text" className="input h-12" defaultValue="điện thoại, laptop, phụ kiện, chính hãng" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Meta Description</label>
                                <textarea className="input min-h-[100px] py-3" defaultValue="Chuyên cung cấp các thiết bị di động chính hãng với giá tốt nhất thị trường. Bảo hành 12 tháng, giao hàng toàn quốc." />
                            </div>
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    <strong>Lưu ý:</strong> Những cấu hình này sẽ ảnh hưởng đến khả năng tìm kiếm của Website trên Google.
                                </p>
                            </div>
                            <button onClick={handleSave} className="btn btn-primary px-10 h-12">Cập nhật SEO</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
