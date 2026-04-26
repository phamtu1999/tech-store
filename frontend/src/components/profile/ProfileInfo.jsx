import { Edit2, User, Mail, Phone, Calendar } from 'lucide-react'

const ProfileInfo = ({ profile, handleUpdateProfile }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex items-start sm:items-center justify-between gap-3 border-b pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase leading-tight">Thông tin tài khoản</h2>
        <button 
          onClick={handleUpdateProfile}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 whitespace-nowrap"
        >
          <Edit2 className="h-4 w-4" /> Chỉnh sửa
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-3xl space-y-4 border border-gray-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-11 w-11 sm:h-12 sm:w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Họ và tên</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base break-words">{profile?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-11 w-11 sm:h-12 sm:w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Email</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base break-words">{profile?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-3xl space-y-4 border border-gray-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-11 w-11 sm:h-12 sm:w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Số điện thoại</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base break-words">{profile?.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-11 w-11 sm:h-12 sm:w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Ngày sinh / Giới tính</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base break-words">
                  {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa rõ'} 
                  {' • '} 
                  {profile?.gender === 'MALE' ? 'Nam' : profile?.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo
