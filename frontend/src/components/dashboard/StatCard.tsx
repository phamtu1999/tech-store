import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  color: 'orange' | 'green' | 'blue' | 'purple' | 'red'
  index: number
}

const colorClasses = {
  orange: 'bg-primary-main',
  green: 'bg-success-DEFAULT',
  blue: 'bg-info-DEFAULT',
  purple: 'bg-purple-500',
  red: 'bg-error-DEFAULT',
}

const StatCard = ({ title, value, change, icon: Icon, color, index }: StatCardProps) => {
  const bgClass = colorClasses[color] || colorClasses.orange

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <motion.p 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
            className="text-2xl font-bold text-text-primary dark:text-dark-text mt-2"
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${change >= 0 ? 'text-success-DEFAULT' : 'text-error-DEFAULT'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% so với tháng trước
            </p>
          )}
        </div>
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
          className={`${bgClass} p-4 rounded-2xl shadow-md`}
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StatCard
