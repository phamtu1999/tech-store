import { LucideIcon } from 'lucide-react'

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    orange: 'bg-primary-MAIN',
  }

  const bgClasses = colorClasses[color] || colorClasses.orange

  return (
    <div className="card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% so với tháng trước
            </p>
          )}
        </div>
        <div className={`${bgClasses} p-4 rounded-2xl shadow-md`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
