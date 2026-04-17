import { BellRing, Send, Settings, Mail, ShieldCheck, Bell } from 'lucide-react'
import Swal from 'sweetalert2'

const BroadcastNotification = () => {
  const handleBroadcast = async () => {
    const title = document.getElementById('broadcast-title').value;
    const message = document.getElementById('broadcast-message').value;
    const type = document.getElementById('broadcast-type').value;
    const link = document.getElementById('broadcast-link').value;
    
    if (!title || !message) {
        Swal.fire({
            icon: 'error',
            title: 'Thiếu thông tin',
            text: 'Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        return;
    }

    try {
        const { notificationsAPI } = await import('../../../api/notifications');
        await notificationsAPI.broadcastNotification({ title, message, type, link });
        Swal.fire({
            icon: 'success',
            title: 'Gửi thành công',
            text: 'Thông báo đã được gửi đến toàn thể người dùng',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        document.getElementById('broadcast-title').value = '';
        document.getElementById('broadcast-message').value = '';
        document.getElementById('broadcast-link').value = '';
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi gửi thông báo',
            text: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Broadcast Card */}
      <div className="bg-white dark:bg-dark-card rounded-[1.5rem] p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                📢 Gửi thông báo hệ thống
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Nội dung này sẽ được gửi tới <strong>tất cả</strong> khách hàng ngay lập tức</p>
        </div>
        
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Tiêu đề thông báo</label>
                    <input 
                        id="broadcast-title" 
                        type="text" 
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-gray-900 dark:text-white" 
                        placeholder="VD: Cửa hàng bảo trì định kỳ..." 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phân loại</label>
                    <select id="broadcast-type" className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-gray-900 dark:text-white cursor-pointer">
                        <option value="SYSTEM">Hệ thống</option>
                        <option value="PROMOTION">Khuyến mãi</option>
                        <option value="ORDER">Đơn hàng</option>
                        <option value="IMPORTANT">Quan trọng</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nội dung chi tiết</label>
                <textarea 
                    id="broadcast-message" 
                    className="w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-gray-900 dark:text-white resize-none" 
                    placeholder="Nhập nội dung thông báo tại đây..." 
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Đường dẫn liên kết (Tùy chọn)</label>
                <input 
                    id="broadcast-link" 
                    type="text" 
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-gray-900 dark:text-white" 
                    placeholder="VD: /products/iphone-15" 
                />
            </div>

            <button 
                onClick={handleBroadcast} 
                className="w-full h-14 bg-gradient-to-r from-primary-600 to-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-100 hover:shadow-primary-200 transition-all flex items-center justify-center gap-3"
            >
                <Send className="h-6 w-6" /> Gửi tới toàn bộ khách hàng
            </button>
        </div>
      </div>

      {/* Auto Notifications Section */}
      <div className="bg-white dark:bg-dark-card rounded-[1.5rem] p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                ⚙️ Thông báo tự động
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Cấu hình các kịch bản gửi tin nhắn tự động từ hệ thống</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { label: 'Đơn hàng mới', enabled: true, desc: 'Báo cho Admin khi có người mua hàng', icon: Bell },
                { label: 'Xác nhận đơn', enabled: true, desc: 'Gửi Email xác nhận cho khách hàng', icon: Mail },
                { label: 'Bảo mật Step-up', enabled: true, desc: 'Yêu cầu OTP khi thao tác nhạy cảm', icon: ShieldCheck },
                { label: 'Thông báo đẩy', enabled: false, desc: 'Gửi Web Push thông báo khuyến mãi', icon: BellRing },
            ].map((pref, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-2xl hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white dark:bg-dark-card rounded-xl shadow-sm text-gray-400 group-hover:text-primary-600 transition-colors">
                            <pref.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-gray-900 dark:text-gray-200 font-black text-[13px] tracking-tight">{pref.label}</p>
                            <p className="text-xs text-gray-500 font-medium">{pref.desc}</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={pref.enabled} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default BroadcastNotification
