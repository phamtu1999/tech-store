import { Users, RefreshCcw, Trash2 } from 'lucide-react'

const ActiveSessionsTable = ({ 
  sessions, 
  sessionsLoading, 
  fetchSessions, 
  handleTerminateSession, 
  handleTerminateAllSessions,
  formatDate,
  formatRelativeTime
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Quản lý phiên đăng nhập</h3>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSessions} disabled={sessionsLoading} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
            <RefreshCcw className={`h-5 w-5 ${sessionsLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleTerminateAllSessions} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all">
            Chấm dứt tất cả các phiên khác
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 dark:border-dark-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-dark-bg/80 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Thiết bị</th>
                <th className="px-6 py-4">Đăng nhập lúc</th>
                <th className="px-6 py-4">Hoạt động cuối</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border text-sm">
              {sessions.map((session, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-700">{session.username}</td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">{session.ipAddress}</td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]" title={session.deviceInfo}>{session.deviceInfo}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(session.loginTimestamp)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatRelativeTime(session.lastActivityTimestamp)}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleTerminateSession(session.sessionId)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">Không tìm thấy phiên nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ActiveSessionsTable
