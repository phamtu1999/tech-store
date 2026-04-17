import { History, Download, Search, Filter, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react'

const LoginHistoryTable = ({
  history,
  historyLoading,
  historyFilters,
  setHistoryFilters,
  historyPage,
  setHistoryPage,
  historyTotalPages,
  historyTotalElements,
  fetchHistory,
  handleExportHistory,
  formatDate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Lịch sử đăng nhập</h3>
        </div>
        <button onClick={handleExportHistory} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all">
          <Download className="h-4 w-4" /> Xuất báo cáo CSV
        </button>
      </div>

      {/* Filters */}
      <div className="p-6 bg-gray-50/50 dark:bg-dark-bg/50 rounded-[2rem] border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Người dùng</label>
          <div className="relative">
            <input type="text" className="input h-10 pl-9 text-sm" placeholder="Tìm user..." value={historyFilters.username} onChange={(e) => setHistoryFilters(p => ({...p, username: e.target.value}))} />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Trạng thái</label>
          <select className="input h-10 text-sm" value={historyFilters.status} onChange={(e) => setHistoryFilters(p => ({...p, status: e.target.value}))}>
            <option value="ALL">Tất cả</option>
            <option value="SUCCESS">Thành công</option>
            <option value="FAILURE">Thất bại</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Từ ngày</label>
          <input type="date" className="input h-10 text-sm" value={historyFilters.startDate} onChange={(e) => setHistoryFilters(p => ({...p, startDate: e.target.value}))} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Đến ngày</label>
          <input type="date" className="input h-10 text-sm" value={historyFilters.endDate} onChange={(e) => setHistoryFilters(p => ({...p, endDate: e.target.value}))} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setHistoryPage(0); fetchHistory(); }} className="flex-1 h-10 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <Filter className="h-4 w-4" /> Lọc
          </button>
          <button onClick={() => { setHistoryFilters({username:'', status:'ALL', startDate:'', endDate:''}); setHistoryPage(0); setTimeout(fetchHistory, 100); }} className="h-10 w-10 bg-white border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center hover:text-primary-600">
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm relative">
        {historyLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-[2rem]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="text-sm font-bold text-gray-500">Đang tải...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-dark-bg/80 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">IP & Thiết bị</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-bold">Không có dữ liệu</p>
                    </td>
                  </tr>
                ) : (
                  history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(item.timestamp)}</td>
                        <td className="px-6 py-4 font-bold text-gray-700">{item.username}</td>
                        <td className="px-6 py-4">
                            <p className="text-gray-700 font-mono text-xs">{item.ipAddress}</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{item.deviceInfo}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
                            </span>
                        </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
        {historyTotalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Trang {historyPage + 1} / {historyTotalPages}
                  {historyTotalElements && <span className="ml-2 text-gray-400">({historyTotalElements} bản ghi)</span>}
                </span>
                <div className="flex gap-2">
                    <button disabled={historyPage === 0} onClick={() => setHistoryPage(p => p - 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all"><ChevronLeft className="h-4 w-4" /></button>
                    <button disabled={historyPage >= historyTotalPages - 1} onClick={() => setHistoryPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all"><ChevronRight className="h-4 w-4" /></button>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default LoginHistoryTable
