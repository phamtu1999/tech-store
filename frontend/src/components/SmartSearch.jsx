import { useState, useEffect, useRef } from 'react'
import { Search, TrendingUp, Clock, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { searchProducts } from '../store/slices/productsSlice'

const SmartSearch = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [trendingSearches] = useState([
    'iPhone 15 Pro',
    'MacBook Air M3',
    'AirPods Pro',
    'Samsung Galaxy S24',
    'iPad Pro',
  ])
  const searchRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, 5)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    setRecentSearches(updated)

    // Perform search
    dispatch(searchProducts({ keyword: searchQuery, params: { page: 0, size: 20 } }))
    setIsOpen(false)
  }

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches')
    setRecentSearches([])
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto px-0 sm:px-0">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query)
            }
          }}
          placeholder="Tìm kiếm sản phẩm, thương hiệu..."
          className="w-full pl-12 sm:pl-14 pr-10 sm:pr-4 py-3.5 sm:py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary-MAIN transition-all text-sm font-medium placeholder:text-gray-400 shadow-sm hover:shadow-md"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 sm:p-4 z-50 max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Clock className="h-4 w-4" />
                  Tìm kiếm gần đây
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-2"
                  >
                    <Clock className="h-3 w-3 text-gray-400" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <TrendingUp className="h-4 w-4 text-red-500" />
              Tìm kiếm phổ biến
            </div>
            <div className="space-y-1">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search)
                    handleSearch(search)
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-2"
                >
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartSearch
