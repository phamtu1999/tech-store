import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, X, Check, ShoppingCart, Info, BellRing, Trash2 } from 'lucide-react'
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationsSlice'
import { Link } from 'react-router-dom'

const NotificationDropdown = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector((state) => state.notifications)
  const { user } = useSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications())
    }
  }, [dispatch, user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = async (notificationId) => {
    await dispatch(markAsRead(notificationId)).unwrap()
  }

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead()).unwrap()
  }

  const handleDelete = async (e, notificationId) => {
    e.preventDefault()
    e.stopPropagation()
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
    
    // If diff is slightly negative due to minor sync issues, set to 0
    if (diff < 0) diff = 0
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
  }

  const getIcon = (title) => {
    const t = title.toLowerCase()
    if (t.includes('giỏ hàng') || t.includes('cart')) return <ShoppingCart className="h-4 w-4 text-orange-500" />
    if (t.includes('đơn hàng') || t.includes('order')) return <BellRing className="h-4 w-4 text-primary-500" />
    return <Info className="h-4 w-4 text-blue-500" />
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 group"
      >
        <Bell className={`h-6 w-6 transition-colors ${isOpen ? 'text-primary-600' : 'text-gray-700 dark:text-gray-400 group-hover:text-primary-500'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-primary-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-dark-bg transition-transform group-hover:scale-110">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white dark:bg-dark-card/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 z-50 overflow-hidden animate-scale-up origin-top-right">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
            <div>
                <h3 className="font-black text-secondary-900 dark:text-white uppercase tracking-widest text-xs">Thông báo</h3>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">Bạn có {unreadCount} tin nhắn mới</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-gray-50 dark:bg-white/5 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-white/5">
                    <Bell className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Không có thông báo mới</p>
              </div>
            ) : (
              notifications.slice(0, 50).map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-5 border-b border-gray-50 dark:border-white/5 transition-all duration-300 group ${
                    !notification.isRead ? 'bg-primary-50/30 dark:bg-primary-500/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center border transition-all ${!notification.isRead ? 'bg-white dark:bg-dark-bg border-primary-100 dark:border-primary-500/20 shadow-sm' : 'bg-gray-50 dark:bg-white/5 border-transparent'}`}>
                        {getIcon(notification.title)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                          <p className={`font-black text-[13px] truncate pr-4 ${!notification.isRead ? 'text-secondary-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap pt-0.5">
                            {formatTime(notification.createdAt)}
                          </span>
                      </div>
                      
                      {notification.link ? (
                        <Link
                          to={notification.link}
                          onClick={() => {
                            handleMarkAsRead(notification.id)
                            setIsOpen(false)
                          }}
                          className="block"
                        >
                          <p className="text-sm font-bold text-gray-600 dark:text-dark-textSecondary line-clamp-2 leading-relaxed group-hover:text-primary-600 transition-colors">
                            {notification.message}
                          </p>
                        </Link>
                      ) : (
                        <p className="text-sm font-bold text-gray-600 dark:text-dark-textSecondary line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         {!notification.isRead && (
                             <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest"
                             >
                                <Check className="h-3 w-3" />
                                Đọc
                             </button>
                         )}
                         <button
                            onClick={(e) => handleDelete(e, notification.id)}
                            className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest"
                         >
                            <Trash2 className="h-3 w-3" />
                            Xóa
                         </button>
                      </div>
                    </div>
                  </div>
                  
                  {!notification.isRead && (
                    <div className="absolute top-1/2 left-2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(255,106,0,0.5)]"></div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-50/50 dark:bg-white/5">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="group block w-full py-3 bg-white dark:bg-dark-bg border border-gray-100 dark:border-white/10 rounded-2xl text-center text-xs font-black text-secondary-900 dark:text-white uppercase tracking-widest hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm"
            >
              Xem toàn bộ lịch sử
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
