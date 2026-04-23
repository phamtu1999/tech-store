import { memo } from 'react'
import { Trash2, MoreVertical } from 'lucide-react'

const AdminUsersRowActions = ({ user, onDelete }) => {
  return (
    <div className="flex justify-end gap-1">
      <button onClick={() => onDelete(user)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
        <Trash2 className="h-4 w-4" />
      </button>
      <button className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all">
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  )
}

export default memo(AdminUsersRowActions)
