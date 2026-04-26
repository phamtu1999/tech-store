import { Plus, MapPin, Phone, Trash2 } from 'lucide-react'

const ProfileAddresses = ({ addresses, handleAddAddress, handleDeleteAddress }) => {
  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase">Sổ địa chỉ</h2>
        <button 
          onClick={handleAddAddress}
          className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-100 hover:bg-primary-700 transition-all w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Thêm địa chỉ mới
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {addresses.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 px-4">
             <MapPin className="h-14 w-14 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
             <p className="text-sm sm:text-base text-gray-500 font-bold">Bạn chưa có địa chỉ giao hàng nào</p>
          </div>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} className={`p-4 sm:p-6 rounded-3xl border transition-all group ${addr.isDefault ? 'border-primary-500 bg-primary-50/20' : 'border-gray-100 bg-white hover:border-primary-100'}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2 min-w-0 w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                     <p className="font-black text-gray-900 text-base sm:text-lg uppercase break-words">{addr.receiverName}</p>
                     {addr.isDefault && <span className="text-[10px] font-black bg-primary-600 text-white px-2 py-0.5 rounded-lg uppercase whitespace-nowrap">Mặc định</span>}
                  </div>
                  <p className="text-sm text-gray-600 flex items-start gap-2 font-medium break-words">
                    <Phone className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" /> <span className="break-words">{addr.phone}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex items-start gap-2 break-words leading-relaxed">
                    <MapPin className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" /> <span className="break-words">{addr.detailedAddress}, {addr.ward}, {addr.district}, {addr.province}</span>
                  </p>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProfileAddresses
