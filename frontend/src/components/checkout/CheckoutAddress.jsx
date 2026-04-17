import { MapPin, Package, Check, Phone, MapPinned, ChevronRight, User, FileText } from 'lucide-react'

const CheckoutAddress = ({ 
  addresses, 
  showAddressList, 
  setShowAddressList, 
  handleSelectAddress, 
  formData, 
  handleChange 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Thông tin giao hàng</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddressList(!showAddressList)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center transition-colors"
          >
            <MapPin className="w-4 h-4 mr-1" />
            {showAddressList ? 'Đóng' : 'Chọn địa chỉ'}
          </button>
        </div>
      </div>

      {showAddressList && addresses.length > 0 && (
        <div className="mb-6 space-y-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-3 flex items-center">
            <Package className="w-3.5 h-3.5 mr-1.5" />
            Địa chỉ đã lưu
          </p>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => handleSelectAddress(addr)}
              className="p-4 bg-white rounded-xl border-2 border-gray-100 cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-bold text-gray-900">{addr.receiverName}</p>
                    {(addr.isDefault || addr.default) && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full uppercase flex items-center">
                        <Check className="w-3 h-3 mr-0.5" />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {addr.phone}
                  </p>
                  <p className="text-sm text-gray-500 flex items-start">
                    <MapPinned className="w-3.5 h-3.5 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{addr.detailedAddress}, {addr.ward}, {addr.district}, {addr.province}</span>
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2"> Người nhận <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              required
              placeholder="Nhập tên người nhận"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
              required
              placeholder="Nhập số điện thoại"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-4 pointer-events-none">
              <MapPinned className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Nhập địa chỉ chi tiết"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú (không bắt buộc)</label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-4 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={2}
              placeholder="Ghi chú cho người bán"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutAddress
