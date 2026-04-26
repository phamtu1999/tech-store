import { User, Package, MapPin, Heart, Lock, LogOut, ChevronRight, Camera } from 'lucide-react'

const ProfileSidebar = ({ profile, activeTab, setActiveTab, handleLogout }) => {
  const menuItems = [
    { id: 'info', icon: User, label: 'Thông tin cá nhân' },
    { id: 'orders', icon: Package, label: 'Đơn hàng của tôi' },
    { id: 'addresses', icon: MapPin, label: 'Địa chỉ nhận hàng' },
    { id: 'wishlist', icon: Heart, label: 'Sản phẩm yêu thích' },
    { id: 'security', icon: Lock, label: 'Bảo mật tài khoản' },
  ]

  return (
    <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex flex-col items-center">
        <div className="group relative mb-3 sm:mb-4">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[1.4rem] sm:rounded-[1.8rem] border-4 border-white shadow-xl bg-primary-50 flex items-center justify-center overflow-hidden">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} className="h-full w-full object-cover" alt="Avatar" />
            ) : (
              <User className="h-10 w-10 text-primary-500" />
            )}
          </div>
          <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-gray-100 text-primary-600 hover:scale-110 transition-all">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-gray-900 text-center leading-tight break-words max-w-full">{profile?.fullName}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-1 uppercase italic tracking-widest">Premium Member</p>
      </div>

      <div className="p-3 sm:p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all group ${
              activeTab === item.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-orange-100' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                activeTab === item.id ? 'text-white' : 'text-primary-500 group-hover:scale-110 transition-transform'
              }`} />
              <span className="font-bold text-sm text-left truncate">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
          </button>
        ))}
        
        <hr className="my-2 border-gray-100" />
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}

export default ProfileSidebar
