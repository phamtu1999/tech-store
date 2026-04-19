import { Moon, Sun } from 'lucide-react'

interface HeaderProps {
  title: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onMenuClick: () => void
  username?: string
  role?: string
}

const Header = ({ title, isDarkMode, onToggleDarkMode, onMenuClick, username = 'Admin', role = 'Administrator' }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-dark-card border-b border-border dark:border-dark-border sticky top-0 z-10 transition-colors duration-300">
      <div className="px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg text-text-primary dark:text-dark-text"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-text-primary dark:text-dark-text truncate">
            {title}
          </h1>
        </div>
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
