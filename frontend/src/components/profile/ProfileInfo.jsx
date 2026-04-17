import { Edit2, User, Mail, Phone, Calendar } from 'lucide-react'

const ProfileInfo = ({ profile, handleUpdateProfile }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900 uppercase">Thông tin tài khoản</h2>
        <button 
          onClick={handleUpdateProfile}
          className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700"
        >
          <Edit2 className="h-4 w-4" /> Chỉnh sửa
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <User className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Họ và tên</p>
                <p className="font-bold text-gray-900">{profile?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Mail className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                <p className="font-bold text-gray-900">{profile?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Phone className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Số điện thoại</p>
                <p className="font-bold text-gray-900">{profile?.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Calendar className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Ngày sinh / Giới tính</p>
                <p className="font-bold text-gray-900">
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
