import { useEffect, useState } from 'react'
import { usersAPI } from '../../api/users'
import AdminTable from '../../components/admin/AdminTable'
import { UserCog, Shield, ShieldAlert, Trash2, UserPlus, Search, UserCheck, UserX } from 'lucide-react'
import Swal from 'sweetalert2'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await usersAPI.getAllUsers()
            setUsers(response.data)
        } catch (error) {
            console.error('Error fetching users:', error)
            Swal.fire('Lỗi', 'Không thể tải danh sách người dùng', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleStatus = async (user) => {
        const action = user.enabled ? 'Khóa' : 'Mở khóa'
        const result = await Swal.fire({
            title: `${action} tài khoản?`,
            text: `Bạn có chắc muốn ${action.toLowerCase()} tài khoản của ${user.fullName || user.username}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: user.enabled ? '#ef4444' : '#22c55e',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        })

        if (result.isConfirmed) {
            try {
                await usersAPI.toggleStatus(user.id)
                Swal.fire('Thành công', `Đã ${action.toLowerCase()} tài khoản`, 'success')
                fetchUsers()
            } catch (error) {
                Swal.fire('Lỗi', 'Thao tác thất bại', 'error')
            }
        }
    }

    const handleChangeRole = async (user) => {
        const currentRole = user.roles[0] || 'ROLE_USER'
        const newRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN'
        
        const result = await Swal.fire({
            title: 'Thay đổi quyền hạn?',
            text: `Chuyển người dùng này sang vai trò ${newRole === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Người dùng'}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        })

        if (result.isConfirmed) {
            try {
                await usersAPI.updateRole(user.id, newRole)
                Swal.fire('Thành công', 'Đã cập nhật vai trò', 'success')
                fetchUsers()
            } catch (error) {
                Swal.fire('Lỗi', 'Cập nhật thất bại', 'error')
            }
        }
    }

    const handleDelete = async (user) => {
        const result = await Swal.fire({
            title: 'Xóa vĩnh viễn?',
            text: `Tài khoản ${user.username} sẽ bị xóa khỏi hệ thống. Thao tác này không thể hoàn tác!`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Xóa ngay',
            cancelButtonText: 'Hủy'
        })

        if (result.isConfirmed) {
            try {
                await usersAPI.deleteUser(user.id)
                Swal.fire('Đã xóa', 'Người dùng đã được xóa khỏi hệ thống', 'success')
                fetchUsers()
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể xóa người dùng này', 'error')
            }
        }
    }

    const columns = [
        { 
            key: 'avatar', 
            label: 'Người dùng',
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-md">
                        {row.avatar ? (
                            <img src={row.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            row.fullName?.charAt(0) || row.username?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-dark-text">{row.fullName || 'Chưa cập nhật'}</p>
                        <p className="text-xs text-gray-500 italic">@{row.username}</p>
                    </div>
                </div>
            )
        },
        { key: 'email', label: 'Email' },
        { 
            key: 'roles', 
            label: 'Quyền hạn',
            render: (value) => {
                const isAdmin = value?.includes('ROLE_ADMIN')
                return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        isAdmin ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                        {isAdmin ? <ShieldAlert className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                )
            }
        },
        { 
            key: 'enabled', 
            label: 'Trạng thái',
            render: (value) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    value ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                    {value ? 'Đang hoạt động' : 'Đang khóa'}
                </span>
            )
        },
    ]

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, username hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10 h-11"
                    />
                </div>
                <div className="flex w-full md:w-auto gap-2">
                    <button className="btn btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 h-11">
                        <UserPlus className="h-5 w-5" />
                        <span className="hidden sm:inline">Thêm Admin</span>
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Danh sách người dùng</h2>
                        <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản và quyền hạn thành viên</p>
                    </div>
                </div>

                <div className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent shadow-lg"></div>
                        </div>
                    ) : (
                        <AdminTable
                            columns={columns}
                            data={filteredUsers}
                            actions={(user) => (
                                <div className="flex items-center gap-1 justify-end">
                                    <button 
                                        onClick={() => handleChangeRole(user)}
                                        className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                        title="Đổi vai trò"
                                    >
                                        <UserCog className="h-5 w-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleToggleStatus(user)}
                                        className={`p-2 rounded-lg transition-all ${user.enabled ? 'text-emerald-500 hover:bg-emerald-50' : 'text-rose-500 hover:bg-rose-50'}`}
                                        title={user.enabled ? 'Khóa tài khoản' : 'Mở khóa'}
                                    >
                                        {user.enabled ? <UserCheck className="h-5 w-5" /> : <UserX className="h-5 w-5" />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user)}
                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Xóa vĩnh viễn"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminUsers
