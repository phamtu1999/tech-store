import { Moon, Sun } from 'lucide-react'

interface HeaderProps {
  title: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
  username?: string
  role?: string
}

const Header = ({ title, isDarkMode, onToggleDarkMode, username = 'Admin', role = 'Administrator' }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-dark-card border-b border-border dark:border-dark-border sticky top-0 z-10 transition-colors duration-300">
      <div className="px-6 sm:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-dark-text">
          {title}
        </h1>
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors duration-200"
            title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-text-primary dark:text-dark-text" />
            ) : (
              <Moon className="h-5 w-5 text-text-primary dark:text-dark-text" />
            )}
          </button>
          
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-text-primary dark:text-dark-text">{username}</p>
              <p className="text-xs text-text-secondary">
                {role === 'ROLE_SUPER_ADMIN' ? 'Super Admin' : 
                 role === 'ROLE_ADMIN' ? 'Administrator' : 
                 role === 'ROLE_STAFF' ? 'Staff' : 'Member'}
              </p>
            </div>
            <div className="h-10 w-10 bg-primary-main rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
