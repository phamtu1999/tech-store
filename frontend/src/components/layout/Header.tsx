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
    <header className="bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border-b border-border dark:border-dark-border sticky top-0 z-20 transition-colors duration-300">
      <div className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button 
            onClick={onMenuClick}
            className="lg:hidden flex-shrink-0 p-2.5 -ml-1 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg text-text-primary dark:text-dark-text"
            aria-label="Mở menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-text-primary dark:text-dark-text truncate leading-tight">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors duration-200"
            title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            aria-label={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-text-primary dark:text-dark-text" />
            ) : (
              <Moon className="h-5 w-5 text-text-primary dark:text-dark-text" />
            )}
          </button>
          
          {/* User info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block max-w-[140px]">
              <p className="text-sm font-medium text-text-primary dark:text-dark-text truncate">{username}</p>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary-main rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
