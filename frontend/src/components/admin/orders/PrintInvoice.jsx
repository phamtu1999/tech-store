import React from 'react';
import { createPortal } from 'react-dom';

const PrintInvoice = ({ order }) => {
  if (!order) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const invoiceContent = (
    <div id="printable-invoice" className="hidden print:block p-10 bg-white text-black font-sans">
      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-600 mb-2 font-serif tracking-tighter">TECH STORE</h1>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Premium Technology Store</p>
          <div className="mt-6 text-[10px] text-gray-500 leading-relaxed font-bold space-y-0.5">
            <p>Địa chỉ: 123 Đường Công Nghệ, Quận 1, TP. HCM</p>
            <p>Hotline: 1900 8888 | Email: contact@techstore.com</p>
            <p>Mã số thuế: 0102030405</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-gray-900 text-white px-6 py-2 rounded-lg inline-block mb-4">
            <h2 className="text-xl font-black uppercase tracking-widest">HÓA ĐƠN BÁN HÀNG</h2>
          </div>
          <p className="text-sm font-black text-gray-900">Số đơn: <span className="text-primary-600">#{order.orderNumber}</span></p>
          <p className="text-[10px] text-gray-500 font-black mt-1 uppercase tracking-widest">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Thông tin khách hàng</h3>
          <div className="text-sm space-y-1.5">
            <p className="text-lg font-black text-gray-900">{order.receiverName}</p>
            <p className="font-bold text-gray-700">SĐT: {order.receiverPhone}</p>
            <p className="text-gray-500 font-medium leading-relaxed">Địa chỉ: {order.shippingAddress}</p>
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Phương thức thanh toán</h3>
          <div className="text-sm space-y-1.5">
            <p className="font-black text-gray-900 uppercase tracking-tight">{order.paymentMethod === 'COD' ? 'Thanh toán trực tiếp (COD)' : 'Chuyển khoản / VNPay'}</p>
            <p className="text-gray-500 font-medium italic">Ghi chú: {order.note || 'Không có ghi chú'}</p>
          </div>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-gray-900 text-[10px] font-black uppercase text-gray-900 bg-gray-50/50">
            <th className="py-4 px-2 text-left">Sản phẩm</th>
            <th className="py-4 text-center w-24">Số lượng</th>
            <th className="py-4 text-right w-32">Đơn giá</th>
            <th className="py-4 text-right w-40 pr-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items?.map((item, idx) => (
            <tr key={idx} className="text-sm font-bold text-gray-800">
              <td className="py-5 px-2">
                <p className="font-black text-gray-900">{item.productName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.variantName}</p>
              </td>
              <td className="py-5 text-center text-gray-600">{item.quantity}</td>
              <td className="py-5 text-right text-gray-600">{formatCurrency(item.priceAtPurchase)}</td>
              <td className="py-5 text-right font-black text-gray-900 pr-2">{formatCurrency(item.priceAtPurchase * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end pt-8">
        <div className="w-80 space-y-4">
          <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
            <span>Tạm tính:</span>
            <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
            <span>Phí vận chuyển:</span>
            <span className="text-gray-900">+{formatCurrency(order.shippingFee || 0)}</span>
          </div>
          <div className="h-px bg-gray-200 border-dashed border-t"></div>
          <div className="flex justify-between items-end">
            <span className="text-xs font-black text-primary-600 uppercase tracking-[0.2em]">Tổng cộng:</span>
            <span className="text-2xl font-black text-gray-900">
              {formatCurrency(order.totalAmount + (order.shippingFee || 0))}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-2 text-center text-xs font-black uppercase tracking-widest">
        <div className="space-y-24">
          <p>Khách hàng ký tên</p>
          <div className="w-48 h-px bg-gray-200 mx-auto"></div>
        </div>
        <div className="space-y-24">
          <p>Xác nhận nhà bán hàng</p>
          <p className="text-[10px] font-bold text-gray-400 italic">Hóa đơn điện tử Tech Store v2</p>
        </div>
      </div>

      <div className="mt-32 pt-10 border-t border-gray-100 text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">WWW.TECHSTORE.COM</p>
      </div>
    </div>
  );

  return createPortal(invoiceContent, document.body);
};

export default PrintInvoice;
