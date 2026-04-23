import { memo } from 'react'

const AdminUsersStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
          </div>
          <div className={`p-4 bg-${stat.color}-50 rounded-2xl`}>
            <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(AdminUsersStats)
