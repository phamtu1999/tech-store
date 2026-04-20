import { Edit2, Trash2, MoreVertical, Copy, EyeOff, Eye } from 'lucide-react'
import { useState } from 'react'

const AdminTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onToggleStatus,
  actions, 
  showIndex = false, 
  currentPage = 0, 
  pageSize = 10,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  sortConfig,
  onSort,
  rowClassName
}) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const hasActions = onEdit || onDelete || actions
  const hasSelection = onSelectRow && onSelectAll
  const allSelected = hasSelection && data.length > 0 && selectedRows.length === data.length

  const handleSort = (key) => {
    if (onSort) {
      const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
      onSort({ key, direction })
    }
  }

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return '↕️'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto touch-pan-x -mx-3 sm:mx-0 px-3 sm:px-0">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200">
            <tr>
              {hasSelection && (
                <th className="px-2 sm:px-4 py-3 w-10 sm:w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </th>
              )}
              {showIndex && (
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12 sm:w-16">
                  STT
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <span className="text-gray-400 text-sm">{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24 sm:w-32">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0) + (showIndex ? 1 : 0) + (hasSelection ? 1 : 0)}
                  className="px-4 py-16 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-medium">Không có dữ liệu</p>
                    <p className="text-sm text-gray-400 mt-1">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors duration-150 ${rowClassName ? rowClassName(row) : ''}`}
                >
                  {hasSelection && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => onSelectRow(row.id, e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                  )}
                  {showIndex && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {currentPage * pageSize + index + 1}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900"
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-1">
                        {actions ? actions(row) : (
                          <>
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Sửa"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            {(onDuplicate || onToggleStatus) && (
                              <div className="relative">
                                <button
                                  onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Thêm"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                {openDropdown === index && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={() => setOpenDropdown(null)}
                                    />
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                      {onDuplicate && (
                                        <button
                                          onClick={() => { onDuplicate(row); setOpenDropdown(null) }}
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                          <Copy className="h-4 w-4" />
                                          Nhân bản
                                        </button>
                                      )}
                                      {onToggleStatus && (
                                        <button
                                          onClick={() => { onToggleStatus(row); setOpenDropdown(null) }}
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                          {row.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                          {row.active ? 'Ẩn' : 'Hiện'}
                                        </button>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTable
