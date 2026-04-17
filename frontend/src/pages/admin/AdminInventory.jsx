import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  Package, 
  History, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Filter,
  ArrowRightLeft,
  Plus,
  Minus,
  DollarSign
} from 'lucide-react'
import axios from 'axios'
import Swal from 'sweetalert2'

const AdminInventory = () => {
  const { user } = useSelector((state) => state.auth)
  const userRole = user?.role
  const isFinanceVisible = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_SUPER_ADMIN'

  const [activeTab, setActiveTab] = useState('stock') // 'stock' or 'history'
  const [loading, setLoading] = useState(true)
  const [variants, setVariants] = useState([])
  const [history, setHistory] = useState([])
  const [summary, setSummary] = useState({
    totalValue: 0,
    lowStockCount: 0
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [variantsRes, lowStockRes, valuationRes, historyRes] = await Promise.all([
        axios.get('/api/v1/admin/inventory/variants'),
        axios.get('/api/v1/admin/inventory/low-stock'),
        axios.get('/api/v1/admin/inventory/valuation'),
        axios.get('/api/v1/admin/inventory/history?size=20')
      ])

      setVariants(variantsRes.data.result || [])
      setSummary({
        lowStockCount: lowStockRes.data.result?.length || 0,
        totalValue: valuationRes.data.result || 0
      })
      setHistory(historyRes.data.result?.content || [])
    } catch (error) {
      console.error('Failed to fetch inventory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustStock = async (variant) => {
    const { value: formValues } = await Swal.fire({
      title: 'Điều chỉnh kho hàng',
      html: `
        <div class="text-left mb-4">
          <p class="text-sm font-bold text-gray-600">Sản phẩm: ${variant.product?.name}</p>
          <p class="text-xs text-gray-400">Biến thể: ${variant.name} (${variant.sku})</p>
        </div>
        <div class="space-y-4">
           <div>
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Loại giao dịch</label>
            <select id="swal-type" class="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500">
              <option value="IMPORT">Nhập thêm hàng (+)</option>
              <option value="ADJUSTMENT">Cập nhật số lượng thực tế (=)</option>
              <option value="DAMAGED">Hủy hàng / Hỏng (-)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Số lượng</label>
            <input id="swal-quantity" type="number" class="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500" placeholder="VD: 50">
          </div>
          ${isFinanceVisible ? `
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Giá vốn mới (Omit if no change)</label>
            <input id="swal-cost" type="number" class="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500" placeholder="VD: 15000000">
          </div>
          ` : ''}
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Ghi chú</label>
            <textarea id="swal-note" class="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500" placeholder="Lý do thay đổi kho..."></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Cập nhật ngay',
      cancelButtonText: 'Hủy bỏ',
      customClass: {
        confirmButton: 'bg-primary-MAIN hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary-500/30',
        cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-8 py-3 rounded-xl'
      },
      buttonsStyling: false,
      preConfirm: () => {
        return {
          type: document.getElementById('swal-type').value,
          quantity: parseInt(document.getElementById('swal-quantity').value),
          costPrice: isFinanceVisible ? document.getElementById('swal-cost').value : null,
          note: document.getElementById('swal-note').value
        }
      }
    })

    if (formValues) {
      try {
        await axios.post('/api/v1/admin/inventory/transaction', {
          variantId: variant.id,
          type: formValues.type,
          quantity: formValues.quantity,
          costPrice: formValues.costPrice || null,
          note: formValues.note,
          warehouse: 'Kho Chính'
        })
        Swal.fire('Thành công', 'Kho hàng đã được cập nhật!', 'success')
        fetchData()
      } catch (error) {
        Swal.fire('Lỗi', error.response?.data?.message || 'Không thể cập nhật kho', 'error')
      }
    }
  }

  const filteredVariants = variants.filter(v => 
    v.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
  }

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'IMPORT': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Nhập kho</span>
      case 'EXPORT': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Xuất bán</span>
      case 'RETURN': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Trả hàng</span>
      case 'DAMAGED': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Hủy hàng</span>
      case 'ADJUSTMENT': return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Điều chỉnh</span>
      default: return type
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isFinanceVisible && (
            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center gap-5 group hover:shadow-xl hover:shadow-primary-500/5 transition-all">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-8 w-8 text-primary-MAIN" />
                </div>
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng giá trị kho</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{formatCurrency(summary.totalValue)}</h3>
                </div>
            </div>
        )}

        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center gap-5 group hover:shadow-xl hover:shadow-red-500/5 transition-all">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sắp hết hàng</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{summary.lowStockCount} sản phẩm</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center gap-5 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
            <Package className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Danh mục SKU</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{variants.length} mã hàng</h3>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white dark:bg-dark-card p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex gap-2 w-fit">
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'stock' ? 'bg-primary-MAIN text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
        >
          <Package className="h-4 w-4" />
          Quản lý tồn kho
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-primary-MAIN text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
        >
          <History className="h-4 w-4" />
          Nhật ký biến động
        </button>
      </div>

      {activeTab === 'stock' ? (
        <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Tìm theo SKU hoặc tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500"
                />
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-dark-bg text-zinc-900 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/5 transition-all">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </button>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thông tin biến thể</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Tồn kho</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Giá vốn / Giá bán</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {filteredVariants.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-black text-gray-900 dark:text-white">{v.product?.name}</div>
                      <div className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-0.5">{v.name} • SKU: {v.sku}</div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col items-center">
                          <span className={`text-lg font-black ${v.stockQuantity <= 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                            {v.stockQuantity}
                          </span>
                          {v.stockQuantity <= 5 && (
                            <span className="text-[8px] font-black uppercase text-red-400 flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="h-2 w-2" />
                              Cảnh báo hết hàng
                            </span>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="w-12 text-[8px] font-black uppercase text-pink-500">Giá nhập</span>
                           <span className="text-sm font-black text-pink-600">{formatCurrency(v.costPrice)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="w-12 text-[8px] font-black uppercase text-indigo-500">Giá bán</span>
                           <span className="text-sm font-black text-indigo-600">{formatCurrency(v.price)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <button
                         onClick={() => handleAdjustStock(v)}
                         className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10"
                       >
                         <ArrowRightLeft className="h-3 w-3" />
                         Điều chỉnh kho
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
          <div className="p-8 border-b border-gray-50 dark:border-dark-border">
             <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Lịch sử biến động 20 gần nhất</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thời gian</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Loại / SKU</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Số lượng</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Dư sau</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {history.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{new Date(log.createdAt).toLocaleString('vi-VN')}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">ID: ${log.id}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div>{getTransactionLabel(log.transactionType)}</div>
                      <div className="text-[10px] font-black text-gray-500 mt-1 uppercase tracking-widest">{log.variant?.sku}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-1 font-black ${log.transactionType === 'IMPORT' || log.transactionType === 'RETURN' ? 'text-green-500' : 'text-red-500'}`}>
                        {log.transactionType === 'IMPORT' || log.transactionType === 'RETURN' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        {log.quantity}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="font-black text-gray-900 dark:text-white text-lg">
                         {log.balanceAfter}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-gray-500 font-medium italic">"{log.note || '---'}"</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Ref: {log.referenceNumber || 'N/A'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminInventory
