import React, { useState, useEffect, useRef } from 'react';
import { backupAPI } from '../../api/backups';
import { authAPI } from '../../api/auth';
import { 
  CloudArrowUpIcon, 
  ArrowDownTrayIcon, 
  TrashIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getApiErrorMessage } from '../../utils/apiError';

const BackupManagement = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fileInputRef = useRef(null);

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
    <div className="bg-white dark:bg-dark-card rounded-[1.5rem] border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* Premium Security Verification Modal */}
      {securityAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-2xl border border-gray-100 dark:border-dark-border max-w-sm w-full p-8 animate-scale-up-center">
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                  securityAction.type === 'delete' ? 'bg-rose-100 text-rose-600 shadow-rose-100' : 'bg-primary-100 text-primary-600 shadow-primary-100'
                }`}>
                  {securityAction.type === 'delete' ? <TrashIcon className="w-10 h-10" /> : <LockClosedIcon className="w-10 h-10" />}
                </div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Xác thực Admin</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                  Vui lòng nhập mật khẩu để xác nhận hành động <span className="font-bold text-gray-900 dark:text-white uppercase">{securityAction.type === 'upload' ? 'tải lên' : securityAction.type === 'delete' ? 'xóa' : 'tải về'}</span> dữ liệu quan trọng.
                </p>
              </div>

            <form onSubmit={handleSecurityConfirm} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Mật khẩu của bạn</label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  className={`block w-full h-12 px-4 bg-gray-50 dark:bg-dark-bg border rounded-xl font-bold transition-all focus:ring-4 ${
                    verifyError 
                      ? 'border-rose-300 focus:ring-rose-100' 
                      : 'border-gray-100 dark:border-dark-border focus:ring-primary-100 focus:border-primary-500'
                  }`}
                  placeholder="••••••••"
                />
                {verifyError && (
                  <p className="text-xs font-bold text-rose-600 pl-1 mt-1">{verifyError}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSecurityAction(null);
                    setVerifyPassword('');
                    setVerifyError(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex-1 h-12 rounded-xl border border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  className={`flex-1 h-12 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    securityAction.type === 'delete'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                      : 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'
                  }`}
                >
                  {verifying ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span>Xác nhận</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main UI Header */}
      <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            🛡️ Kho lưu trữ hệ thống
          </h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Quản lý các bản sao lưu cơ sở dữ liệu an toàn
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchBackups}
            disabled={loading || creating || uploading}
            className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg text-gray-400 hover:text-primary-600 border border-gray-100 dark:border-dark-border transition-all flex items-center justify-center disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>Khôi phục file</span>
          </button>
          
          <button
            onClick={handleCreateBackup}
            disabled={creating || uploading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white transition-all shadow-xl ${
              creating || uploading
                ? 'bg-gray-200 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary-600 to-orange-500 hover:shadow-primary-100'
            }`}
          >
            {creating ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <CloudArrowUpIcon className="w-5 h-5" />}
            <span>{creating ? 'Đang sao lưu...' : 'Sao lưu ngay'}</span>
          </button>
        </div>
      </div>

      <div className="px-8 pb-8">
        {(success || error) && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-4 animate-slide-in-right border ${
            success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
             {success ? <CheckCircleIcon className="w-6 h-6 text-emerald-500" /> : <ExclamationCircleIcon className="w-6 h-6 text-rose-500" />}
            <span className="text-sm font-bold tracking-tight">{success || error}</span>
          </div>
        )}

        <div className="overflow-hidden border border-gray-50 dark:border-dark-border rounded-2xl">
          <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-dark-bg/50">
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tên bản sao lưu</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Dung lượng</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Thời gian tạo</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
              {backups.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center">
                        <CloudArrowUpIcon className="w-10 h-10 text-gray-200" />
                      </div>
                      <span className="text-sm font-bold text-gray-400">Danh sách trống</span>
                    </div>
                  </td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.fileName} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-dark-bg rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          <CloudArrowUpIcon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {backup.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-[11px] font-black text-gray-500 uppercase">{backup.fileSize}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[13px] font-bold text-gray-500">
                        {format(new Date(backup.createdAt), 'HH:mm • dd/MM/yyyy', { locale: vi })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSecurityAction({ type: 'download', fileName: backup.fileName })}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSecurityAction({ type: 'delete', fileName: backup.fileName })}
                          className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
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
      
      <div className="p-4 sm:p-6 bg-gray-50/50 flex items-center gap-3 border-t border-gray-100">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Môi trường bảo mật được mã hóa
        </p>
      </div>
    </div>
  );
};

export default BackupManagement;
