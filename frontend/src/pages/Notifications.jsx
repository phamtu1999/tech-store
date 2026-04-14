import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationsSlice'
import { Bell, Check, Trash2, ShoppingBag, CreditCard, Tag, AlertCircle } from 'lucide-react'
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
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
  }

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER':
        return <ShoppingBag className="h-5 w-5 text-blue-600" />
      case 'PAYMENT':
        return <CreditCard className="h-5 w-5 text-green-600" />
      case 'PRODUCT':
        return <Tag className="h-5 w-5 text-purple-600" />
      case 'PROMOTION':
        return <Tag className="h-5 w-5 text-orange-600" />
      case 'REVIEW':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-secondary"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Không có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card ${!notification.isRead ? 'border-l-4 border-l-primary-600' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  {notification.link ? (
                    <Link
                      to={notification.link}
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="block"
                    >
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                    </Link>
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                    </>
                  )}
                  <p className="text-sm text-gray-500 mt-2">{formatTime(notification.createdAt)}</p>
                </div>
                <div className="flex space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Đánh dấu đã đọc"
                    >
                      <Check className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
