import React, { useState, useEffect, useRef } from 'react';
import { backupAPI } from '../../api/backups';
import { authAPI } from '../../api/auth';
import { 
  Cloud,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Upload,
  LockKeyhole,
  RotateCcw,
  CalendarClock,
  Database
} from 'lucide-react';
import { getApiErrorMessage } from '../../utils/apiError';

const BackupManagement = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fileInputRef = useRef(null);
  const formatDateTime = (value) => new Date(value).toLocaleString('vi-VN');

  // Security Verification State
  const [securityAction, setSecurityAction] = useState(null); 
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await backupAPI.getBackups();
      setBackups(response.data?.result || response.data || []);
      setError(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không thể tải danh sách bản sao lưu'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setCreating(true);
    setSuccess(null);
    setError(null);
    try {
      await backupAPI.createBackup();
      setSuccess('Tạo bản sao lưu thành công!');
      fetchBackups();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Lỗi khi tạo bản sao lưu. Vui lòng thử lại.'));
    } finally {
      setCreating(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSecurityAction({ type: 'upload', fileName: file.name, file: file });
    }
  };

  const handleSecurityConfirm = async (e) => {
    if (e) e.preventDefault();
    if (!verifyPassword) {
      setVerifyError('Vui lòng nhập mật khẩu xác nhận');
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    
    try {
      await authAPI.verifyPassword(verifyPassword);
      if (securityAction.type === 'download') {
        await executeDownload(securityAction.fileName);
      } else if (securityAction.type === 'restore') {
        await executeRestore(securityAction.fileName);
      } else if (securityAction.type === 'delete') {
        await executeDelete(securityAction.fileName);
      } else if (securityAction.type === 'upload') {
        await executeUpload(securityAction.file);
      }
      setSecurityAction(null);
      setVerifyPassword('');
    } catch (err) {
      setVerifyError('Mật khẩu không chính xác. Vui lòng thử lại.');
    } finally {
      setVerifying(false);
    }
  };

  const executeDownload = async (fileName) => {
    try {
      const response = await backupAPI.downloadFile(fileName);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(`Đang tải bản sao lưu ${fileName}...`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Có lỗi khi tải tập tin.'));
    }
  };

  const executeRestore = async (fileName) => {
    try {
      await backupAPI.restoreBackup(fileName);
      setSuccess(`Đã khôi phục từ bản sao lưu ${fileName} thành công!`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Lỗi khi khôi phục bản sao lưu.'));
    }
  };

  const executeDelete = async (fileName) => {
    try {
      await backupAPI.deleteBackup(fileName);
      setSuccess(`Đã xóa bản sao lưu ${fileName} thành công!`);
      fetchBackups();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Lỗi khi xóa bản sao lưu.'));
    }
  };

  const executeUpload = async (file) => {
    setUploading(true);
    try {
      await backupAPI.uploadBackup(file);
      setSuccess(`Đã tải lên bản sao lưu ${file.name} thành công!`);
      fetchBackups();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Lỗi khi tải lên bản sao lưu.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-bg p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Kho lưu trữ <span className="text-primary-600">Hệ thống</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Quản lý, bảo mật và khôi phục dữ liệu cửa hàng của bạn một cách chuyên nghiệp.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-white dark:bg-dark-card p-1.5 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
                <button
                  onClick={fetchBackups}
                  disabled={loading || creating || uploading}
                  title="Làm mới"
                  className="p-2.5 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-dark-bg transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      await backupAPI.cleanupBackups();
                      await fetchBackups();
                      setSuccess('Đã dọn dẹp các bản backup cũ');
                    } catch (err) {
                      setError(getApiErrorMessage(err, 'Không thể dọn backup cũ'));
                    }
                  }}
                  disabled={loading || creating || uploading}
                  title="Dọn dẹp backup cũ"
                  className="p-2.5 rounded-xl text-gray-400 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-dark-bg transition-all disabled:opacity-50"
                >
                  <CalendarClock className="w-5 h-5" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".sql,.gz"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || creating}
                  title="Tải lên bản sao lưu"
                  className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-dark-bg transition-all disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                </button>
            </div>

            <button
              onClick={handleCreateBackup}
              disabled={creating || uploading}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-white transition-all shadow-xl active:scale-95 ${
                creating || uploading
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-primary-600 to-orange-500 hover:shadow-primary-600/30'
              }`}
            >
              {creating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
              <span>{creating ? 'Đang xử lý...' : 'Tạo Backup Ngay'}</span>
            </button>
          </div>
        </div>

        {/* Security Verification Modal */}
        {securityAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-dark-border max-w-md w-full p-10 animate-scale-up-center">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl ${
                    securityAction.type === 'delete' 
                      ? 'bg-rose-50 text-rose-600 shadow-rose-100' 
                      : 'bg-primary-50 text-primary-600 shadow-primary-100'
                  }`}>
                    {securityAction.type === 'delete' ? <Trash2 className="w-12 h-12" /> : <LockKeyhole className="w-12 h-12" />}
                  </div>
                  <h4 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Xác thực quyền Admin</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 max-w-[280px]">
                    Hành động <span className="text-gray-900 dark:text-white font-bold">{securityAction.type === 'upload' ? 'tải lên' : securityAction.type === 'delete' ? 'xóa' : 'khôi phục'}</span> yêu cầu xác thực bảo mật.
                  </p>
                </div>

              <form onSubmit={handleSecurityConfirm} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu xác nhận</label>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    className={`block w-full h-14 px-5 bg-gray-50 dark:bg-dark-bg border-2 rounded-2xl font-bold transition-all focus:ring-4 ${
                      verifyError 
                        ? 'border-rose-300 focus:ring-rose-100' 
                        : 'border-gray-100 dark:border-dark-border focus:ring-primary-50 focus:border-primary-500'
                    }`}
                    placeholder="••••••••"
                  />
                  {verifyError && (
                    <p className="text-xs font-bold text-rose-600 ml-1 mt-1">{verifyError}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSecurityAction(null);
                      setVerifyPassword('');
                      setVerifyError(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="flex-1 h-14 rounded-2xl border-2 border-gray-100 dark:border-dark-border text-gray-500 font-bold hover:bg-gray-50 dark:hover:bg-dark-bg transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={verifying}
                    className={`flex-1 h-14 rounded-2xl text-white font-black transition-all shadow-xl flex items-center justify-center gap-2 ${
                      securityAction.type === 'delete'
                        ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                        : 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'
                    }`}
                  >
                    {verifying ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-6 h-6" />
                        <span>Xác nhận</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 dark:border-dark-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="p-8">
            {(success || error) && (
              <div className={`mb-8 p-5 rounded-[1.5rem] flex items-center gap-4 animate-slide-in-right border-2 ${
                success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
              }`}>
                <div className={`p-2 rounded-xl ${success ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  {success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                </div>
                <span className="text-sm font-black tracking-tight">{success || error}</span>
              </div>
            )}

            <div className="overflow-hidden border border-gray-50 dark:border-dark-border rounded-3xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-dark-bg/50">
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tên bản sao lưu</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Dung lượng</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Thời gian tạo</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                    {backups.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-24 text-center">
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-dark-bg rounded-[2rem] flex items-center justify-center text-gray-200">
                              <Cloud className="w-12 h-12" />
                            </div>
                            <span className="text-lg font-black text-gray-300 tracking-tight">Chưa có bản sao lưu nào</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      backups.map((backup, index) => (
                        <tr 
                          key={backup.fileName} 
                          className={`hover:bg-gray-50/80 dark:hover:bg-dark-bg/50 transition-all group ${index % 2 === 1 ? 'bg-gray-50/30 dark:bg-dark-bg/10' : ''}`}
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-dark-bg rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all duration-300">
                                <Database className="w-6 h-6" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                  {backup.fileName}
                                </span>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Database Snapshot</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-bg text-[12px] font-black text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-dark-border">
                              {backup.fileSize}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-gray-600 dark:text-gray-300">
                                {formatDateTime(backup.createdAt)}
                              </span>
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hoàn tất</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                              <button
                                onClick={() => setSecurityAction({ type: 'download', fileName: backup.fileName })}
                                title="Tải xuống"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setSecurityAction({ type: 'restore', fileName: backup.fileName })}
                                title="Khôi phục"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              >
                                <RotateCcw className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setSecurityAction({ type: 'delete', fileName: backup.fileName })}
                                title="Xóa"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50/50 dark:bg-dark-bg/50 flex items-center justify-between border-t border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <p className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">
                Hệ thống bảo mật TechStore
              </p>
            </div>
            <div className="text-[11px] font-bold text-gray-400">
              {backups.length} bản sao lưu hiện có
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManagement;
