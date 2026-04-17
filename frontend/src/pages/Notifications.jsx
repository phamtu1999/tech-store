import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationsSlice'
import { Bell, Check, Trash2, ShoppingBag, CreditCard, Tag, AlertCircle, Inbox, CheckCheck, Clock, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

const Notifications = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount, isLoading } = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const handleMarkAsRead = async (notificationId) => {
    await dispatch(markAsRead(notificationId)).unwrap()
  }

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead()).unwrap()
  }

  const handleDelete = async (notificationId) => {
    await dispatch(deleteNotification(notificationId)).unwrap()
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    
    // Ensure the date string is treated as UTC if it doesn't specify a timezone
    let formattedDateString = dateString
    if (typeof dateString === 'string' && !dateString.includes('Z') && !dateString.includes('+')) {
      // If it has a space instead of T, replace it for better compatibility
      formattedDateString = dateString.replace(' ', 'T') + 'Z'
    }

    const date = new Date(formattedDateString)
    const now = new Date()
    
    let diff = now.getTime() - date.getTime()
    
    if (diff < 0) diff = 0
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
  }

  const getIcon = (type, isRead) => {
    const iconBase = "h-6 w-6"
    let colorClass = "text-gray-400"
    let bgClass = "bg-gray-100 dark:bg-white/5"

    switch (type) {
      case 'ORDER':
        colorClass = "text-blue-500"
        bgClass = "bg-blue-50 dark:bg-blue-500/10"
        break
      case 'PAYMENT':
        colorClass = "text-emerald-500"
        bgClass = "bg-emerald-50 dark:bg-emerald-500/10"
        break
      case 'PRODUCT':
        colorClass = "text-purple-500"
        bgClass = "bg-purple-50 dark:bg-purple-500/10"
        break
      case 'PROMOTION':
        colorClass = "text-orange-500"
        bgClass = "bg-orange-50 dark:bg-orange-500/10"
        break
      default:
        colorClass = "text-primary-500"
        bgClass = "bg-primary-50 dark:bg-primary-500/10"
    }

    return (
      <div className={`p-4 rounded-2xl transition-all ${bgClass} ${!isRead ? 'scale-110 shadow-lg' : 'opacity-60'}`}>
        {type === 'ORDER' && <ShoppingBag className={`${iconBase} ${colorClass}`} />}
        {type === 'PAYMENT' && <CreditCard className={`${iconBase} ${colorClass}`} />}
        {type === 'PRODUCT' && <Tag className={`${iconBase} ${colorClass}`} />}
        {type === 'PROMOTION' && <Tag className={`${iconBase} ${colorClass}`} />}
        {!(type === 'ORDER' || type === 'PAYMENT' || type === 'PRODUCT' || type === 'PROMOTION') && <Bell className={`${iconBase} ${colorClass}`} />}
      </div>
    )
  }

  const groupedNotifications = notifications.reduce((acc, note) => {
    const date = new Date(note.createdAt)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const label = isToday ? 'Mới nhất hôm nay' : 'Lịch sử trước đó'
    if (!acc[label]) acc[label] = []
    acc[label].push(note)
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-primary-MAIN animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary-MAIN animate-pulse" />
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-secondary-900 dark:text-white tracking-tighter leading-none uppercase">Thông báo</h1>
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                {unreadCount} tin mới
             </span>
             <p className="text-sm font-bold text-gray-400">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
            {unreadCount > 0 && (
            <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-6 py-4 bg-primary-600 text-white hover:bg-primary-700 rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95"
            >
                <CheckCheck className="h-4 w-4" />
                Đọc tất cả
            </button>
            )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-dark-card/50 rounded-[3rem] border border-gray-100 dark:border-white/5 p-24 text-center shadow-sm">
          <div className="bg-gray-50 dark:bg-white/5 w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 dark:border-white/5">
             <Inbox className="h-16 w-16 text-gray-200 dark:text-gray-700" />
          </div>
          <h2 className="text-3xl font-black text-secondary-900 dark:text-white mb-3 uppercase tracking-tight">Hộp thư đang trống</h2>
          <p className="text-gray-400 font-bold max-w-sm mx-auto">
            Không có ưu đãi hay tin tức nào cần bạn xử lý. Hãy quay lại sau nhé!
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedNotifications).map(([label, items]) => (
            <div key={label} className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent"></div>
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">{label}</h2>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent"></div>
              </div>

              <div className="grid gap-4">
                {items.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 border-2 ${
                      !notification.isRead 
                        ? 'bg-white dark:bg-dark-card border-primary-500 shadow-2xl shadow-primary-500/10' 
                        : 'bg-gray-50/50 dark:bg-dark-card/40 border-transparent hover:bg-white dark:hover:bg-dark-card hover:border-gray-200 dark:hover:border-white/10'
                    }`}
                  >
                    <div className="p-8">
                      <div className="flex items-start gap-8">
                        <div className="flex-shrink-0">
                          {getIcon(notification.type, notification.isRead)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3 mb-2">
                               <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${!notification.isRead ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                                  {notification.type || 'SYSTEM'}
                               </div>
                               <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(notification.createdAt)}
                               </span>
                           </div>

                          {notification.link ? (
                            <Link
                              to={notification.link}
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="block group/link"
                            >
                              <h3 className={`text-2xl font-black tracking-tighter mb-2 transition-colors ${
                                !notification.isRead ? 'text-secondary-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                              } group-hover/link:text-primary-500`}>
                                {notification.title}
                              </h3>
                              <p className={`text-base font-bold leading-relaxed transition-colors ${
                                !notification.isRead ? 'text-gray-600 dark:text-dark-textSecondary' : 'text-gray-400'
                              }`}>
                                {notification.message}
                              </p>
                            </Link>
                          ) : (
                            <div>
                               <h3 className={`text-2xl font-black tracking-tighter mb-2 ${
                                !notification.isRead ? 'text-secondary-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                              }`}>
                                {notification.title}
                              </h3>
                              <p className={`text-base font-bold leading-relaxed ${
                                !notification.isRead ? 'text-gray-600 dark:text-dark-textSecondary' : 'text-gray-400'
                              }`}>
                                {notification.message}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-4 bg-primary-500 text-white hover:bg-primary-600 rounded-2xl transition-all shadow-lg active:scale-90"
                              title="Đánh dấu đã đọc"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-4 bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all active:scale-90"
                            title="Xóa thông báo"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {!notification.isRead && (
                        <div className="absolute top-0 right-0 p-4">
                            <div className="h-3 w-3 bg-primary-500 rounded-full glow-primary animate-pulse"></div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
