import { Lock } from 'lucide-react'

const ProfileSecurity = ({ passwordForm, setPasswordForm, handleChangePassword }) => {
  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
         <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-orange-600" />
         </div>
         <h2 className="text-2xl font-black text-gray-900 uppercase">Thay đổi mật khẩu</h2>
         <p className="text-sm text-gray-500">Bảo mật tài khoản của bạn bằng mật khẩu mạnh</p>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Mật khẩu cũ</label>
          <input 
            type="password"
            className="w-full bg-gray-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-2xl p-4 transition-all"
            placeholder="********"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Mật khẩu mới</label>
          <input 
            type="password"
            className="w-full bg-gray-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-2xl p-4 transition-all"
            placeholder="Min 6 characters"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Xác nhận mật khẩu</label>
          <input 
            type="password"
            className="w-full bg-gray-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-2xl p-4 transition-all"
            placeholder="********"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95">
           CẬP NHẬT MẬT KHẨU
        </button>
      </form>
    </div>
  )
}

export default ProfileSecurity
