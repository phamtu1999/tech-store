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
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import api from '../../utils/axios'
import Swal from 'sweetalert2'
import { useDebounce } from '../../hooks/useDebounce'

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
  const [stockFilter, setStockFilter] = useState('') // '' or 'low-stock'
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 0,
    size: 15,
    totalPages: 0,
    totalElements: 0
  })

  useEffect(() => {
    fetchMainStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'stock') {
      fetchStock(pagination.page)
    } else {
      fetchHistory()
    }
  }, [activeTab, debouncedSearch, pagination.page, stockFilter])

  const fetchMainStats = async () => {
    try {
       const [lowStockRes, valuationRes] = await Promise.all([
        api.get('/admin/inventory/low-stock'),
        isFinanceVisible ? api.get('/admin/inventory/valuation') : Promise.resolve({ data: { result: 0 } })
      ])
      setSummary({
        lowStockCount: lowStockRes.data.result?.length || 0,
        totalValue: valuationRes.data.result || 0
      })
    } catch (error) {
      console.error('Stats fetch error:', error)
    }
  }

  const fetchStock = async (page = 0) => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/inventory/variants`, {
        params: {
          page,
          size: pagination.size,
          search: debouncedSearch,
          filter: stockFilter
        }
      })
      const { content, totalPages, totalElements, number } = response.data.result
      setVariants(content || [])
      setPagination(prev => ({
        ...prev,
        totalPages,
        totalElements,
        page: number
      }))
    } catch (error) {
      console.error('Failed to fetch variants:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/inventory/history?size=25')
      setHistory(response.data.result?.content || [])
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustStock = async (variant) => {
    const { value: formValues } = await Swal.fire({
      title: 'Điều chỉnh kho hàng',
      html: `
        <div class="text-left mb-4">
          <p class="text-sm font-bold text-gray-600">Sản phẩm: ${variant.productName}</p>
          <p class="text-xs text-gray-400">Biến thể: ${variant.variantName} (${variant.sku})</p>
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
        await api.post('/admin/inventory/transaction', {
          variantId: variant.id,
          type: formValues.type,
          quantity: formValues.quantity,
          costPrice: formValues.costPrice || null,
          note: formValues.note,
          warehouse: 'Kho Chính'
        })
        Swal.fire('Thành công', 'Kho hàng đã được cập nhật!', 'success')
        fetchStock(pagination.page)
      } catch (error) {
        Swal.fire('Lỗi', error.response?.data?.message || 'Không thể cập nhật kho', 'error')
      }
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)

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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Kho <span className="text-primary-600">Hàng</span> <small className="text-[10px] text-gray-300">v3.0</small></h2>
      </div>
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
        <div 
          onClick={() => {
            setStockFilter(stockFilter === 'low-stock' ? '' : 'low-stock')
            setPagination(p => ({...p, page: 0}))
          }}
          className={`bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border flex items-center gap-5 group hover:shadow-xl transition-all cursor-pointer ${stockFilter === 'low-stock' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-100 dark:border-dark-border hover:shadow-red-500/5'}`}
        >
          <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${stockFilter === 'low-stock' ? 'bg-red-500 text-white' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
            <AlertTriangle className="h-8 w-8" />
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
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng mã SKU (trang này)</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{pagination.totalElements} mã hàng</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl flex gap-1.5 w-fit">
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'stock' ? 'bg-white dark:bg-dark-card text-primary-MAIN shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <Package className="h-4 w-4" />
          Quản lý tồn kho
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white dark:bg-dark-card text-primary-MAIN shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPagination(p => ({...p, page: 0}))
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500"
                />
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
                {stockFilter && (
                  <button 
                    onClick={() => setStockFilter('')}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-red-100 transition-colors"
                  >
                    Bỏ lọc: Sắp hết <Filter className="h-3 w-3" />
                  </button>
                )}
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Hiển thị {variants.length} / {pagination.totalElements} mã hàng
                </div>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-primary-600 bg-primary-50/30 w-16">STT</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Sản phẩm & Biến thể</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tồn kho</th>
                  {isFinanceVisible && <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tài chính</th>}
                  {isFinanceVisible && <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Biên LN</th>}
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {variants.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                       Không tìm thấy kết quả phù hợp
                    </td>
                  </tr>
                ) : variants.map((v, index) => {
                  const margin = v.price > 0 && v.costPrice > 0 
                    ? (((v.price - v.costPrice) / v.price) * 100).toFixed(1) 
                    : 0;
                  
                  return (
                    <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 even:bg-gray-50/20 dark:even:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5 text-xs font-black text-gray-400">
                        {pagination.page * pagination.size + index + 1}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border overflow-hidden flex-shrink-0">
                            {v.imageUrl ? <img src={v.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="h-6 w-6" /></div>}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight line-clamp-1">{v.productName}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                <span className="text-primary-500">{v.variantName}</span> • <span className="font-mono">#{v.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-gray-900 dark:text-white">{v.stockQuantity}</span>
                          </div>
                          {v.stockQuantity <= 0 ? (
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit">Hết hàng</span>
                          ) : v.stockQuantity <= 20 ? (
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit animate-pulse">Sắp hết</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit">Sẵn sàng</span>
                          )}
                        </div>
                      </td>
                      {isFinanceVisible && (
                        <td className="px-8 py-5">
                            <p className="text-sm font-bold text-pink-600 font-mono tracking-tighter">{formatCurrency(v.costPrice)}</p>
                            <p className="text-[9px] font-black uppercase text-gray-400">Giá nhập</p>
                        </td>
                      )}
                      {isFinanceVisible && (
                        <td className="px-8 py-5 text-center">
                          <div className={`text-lg font-black ${parseFloat(margin) > 30 ? 'text-emerald-500' : 'text-primary-500'}`}>
                            {margin}%
                          </div>
                        </td>
                      )}
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => handleAdjustStock(v)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          <ArrowRightLeft className="h-3 w-3" />
                          Sửa kho
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
              <div className="p-8 border-t border-gray-100 dark:border-dark-border flex items-center justify-between bg-gray-50/20">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Trang <span className="text-primary-600">{pagination.page + 1}</span> / {pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                      <button 
                          onClick={() => setPagination(prev => ({...prev, page: Math.max(0, prev.page - 1)}))}
                          disabled={pagination.page === 0}
                          className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-dark-border bg-white disabled:opacity-20 hover:shadow-md transition-all"
                      >
                          <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button 
                          onClick={() => setPagination(prev => ({...prev, page: Math.min(prev.totalPages - 1, prev.page + 1)}))}
                          disabled={pagination.page === pagination.totalPages - 1}
                          className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-dark-border bg-white disabled:opacity-20 hover:shadow-md transition-all"
                      >
                          <ChevronRight className="h-5 w-5" />
                      </button>
                  </div>
              </div>
          )}
        </div>
      ) : (
        /* History View */
        <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
             <h3 className="text-lg font-black text-gray-900 dark:text-white">Lịch sử biến động 25 gần nhất</h3>
             {/* Simple history search */}
             <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Lọc lịch sử (SKU, loại...)"
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-dark-bg border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    setHistory(prev => {
                        // This is a bit hacky since it filters local state but we'll fetch full anyway if they tab back
                        return prev; 
                    });
                  }}
                />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-12">STT</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thời gian</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Loại / SKU</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Số lượng</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Dư sau</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {history.map((log, index) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 even:bg-gray-50/20 dark:even:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 text-xs font-black text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{new Date(log.createdAt).toLocaleString('vi-VN')}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: #{log.id}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div>{getTransactionLabel(log.transactionType)}</div>
                      <div className="text-[10px] font-black text-gray-500 mt-1 uppercase tracking-widest font-mono">{log.sku}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-1 font-black ${log.transactionType === 'IMPORT' || log.transactionType === 'RETURN' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {log.transactionType === 'IMPORT' || log.transactionType === 'RETURN' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        {log.quantity}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="font-black text-gray-900 dark:text-white text-lg">{log.balanceAfter}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-gray-500 font-medium italic line-clamp-1 max-w-[200px]" title={log.note}>"{log.note || '---'}"</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase mt-1 truncate max-w-[150px]">Ref: {log.referenceNumber || 'N/A'}</div>
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
