import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axios';
import InventoryLogForm from '../../components/InventoryLogForm/InventoryLogForm';
import styles from './ManagerInventoryLogPage.module.css'; 
import { FaPlus, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
    } catch (error) {
        return dateString; 
    }
};

const formatCurrency = (amount) => {
     if (amount == null || isNaN(amount)) return '';
     return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function ManageInventoryLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [viewingLog, setViewingLog] = useState(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const response = await axiosInstance.get('/inventory-logs'); 
            if (response.data && response.data.success) {
                const sortedLogs = (response.data.logs || []).sort((a, b) => new Date(b.date) - new Date(a.date));
                setLogs(sortedLogs);
            } else { throw new Error(response.data?.message || "Failed to fetch logs"); }
        } catch (err) {
            console.error("Fetch logs error:", err); setError(err.message || "Lỗi tải dữ liệu phiếu."); setLogs([]);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const handleOpenFormModal = (log = null) => {
        setEditingLog(log); setFormError(null); setViewingLog(null); setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false); setEditingLog(null); setViewingLog(null); setFormError(null);
    };

    const handleOpenViewModal = (log) => {
         setViewingLog(log); setEditingLog(null); setFormError(null); setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData, id) => {
        setFormLoading(true); setFormError(null);
        const apiUrl = id ? `/inventory-logs/${id}` : '/inventory-logs';
        const apiMethod = id ? 'put' : 'post';
        try {
            const response = await axiosInstance[apiMethod](apiUrl, formData);
            if (response.data && response.data.success) {
                handleCloseModal(); fetchLogs();
            } else { throw new Error(response.data?.message || `Failed to ${id ? 'update' : 'create'} log`); }
        } catch (err) {
            console.error("Form submit error:", err);
            setFormError(err.response?.data?.message || err.message || "Đã có lỗi xảy ra.");
        } finally { setFormLoading(false); }
    };

    const handleDelete = async (logId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa phiếu này? Lưu ý: Hành động này KHÔNG tự động hoàn tác số lượng tồn kho.`)) {
            try {
                 const response = await axiosInstance.delete(`/inventory-logs/${logId}`);
                  if (response.data && response.data.success) { fetchLogs(); }
                  else { throw new Error(response.data?.message || "Failed to delete log"); }
            } catch (err) {
                 console.error("Delete log error:", err); alert(`Lỗi khi xóa phiếu: ${err.response?.data?.message || err.message}`);
            }
        }
    };

     const getItemSummary = (items) => {
         if (!items || items.length === 0) return "Không có";
         const firstItem = items[0];
         let summary = `${firstItem.quantity} ${firstItem.unit} ${firstItem.name}`;
         if (items.length > 1) {
             summary += ` và ${items.length - 1} loại khác`;
         }
         return summary;
     }


    return (
        <div className={styles.pageContainer}>
            <h1>Quản lý Nhập/Xuất Kho</h1>

            <button className={styles.addButton} onClick={() => handleOpenFormModal()}>
                <FaPlus /> Tạo Phiếu Mới
            </button>

            {error && <p className={styles.errorFetch}>{error}</p>}

            {loading ? ( <p>Đang tải dữ liệu...</p> ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Loại Phiếu</th>
                            <th>Ngày</th>
                            <th>Mặt hàng</th>
                            <th>Tổng tiền (Nhập)</th>
                            <th>Ghi chú</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 && !loading ? (
                            <tr><td colSpan="6">Chưa có phiếu nhập/xuất nào.</td></tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log._id}>
                                    <td className={log.type === 'import' ? styles.importType : styles.exportType}>
                                         {log.type === 'import' ? 'Nhập kho' : 'Xuất kho'}
                                     </td>
                                    <td>{formatDate(log.date)}</td>
                                    <td>{getItemSummary(log.items)}</td>
                                     <td>{log.type === 'import' ? formatCurrency(log.totalAmount) : '-'}</td>
                                    <td className={styles.notesCell}>{log.notes || '-'}</td>
                                    <td>
                                         <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={() => handleOpenViewModal(log)} title="Xem chi tiết">
                                            <FaInfoCircle />
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenFormModal(log)} title="Sửa">
                                            <FaEdit />
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(log._id)} title="Xóa">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                         <h2>
                             {editingLog ? 'Sửa Phiếu Nhập/Xuất Kho' : (viewingLog ? 'Chi Tiết Phiếu Nhập/Xuất Kho' : 'Tạo Phiếu Nhập/Xuất Kho')}
                         </h2>

                         {viewingLog ? (
                             <div className={styles.viewDetails}>
                                 <p><strong>Loại phiếu:</strong> {viewingLog.type === 'import' ? 'Nhập kho' : 'Xuất kho'}</p>
                                 <p><strong>Ngày tạo:</strong> {formatDate(viewingLog.date)}</p>
                                 <p><strong>Ghi chú:</strong> {viewingLog.notes || 'Không có'}</p>
                                 {viewingLog.type === 'import' && <p><strong>Tổng tiền:</strong> {formatCurrency(viewingLog.totalAmount)}</p>}
                                 <p><strong>Danh sách mặt hàng:</strong></p>
                                 <ul className={styles.itemList}>
                                     {viewingLog.items?.map((item, index) => (
                                         <li key={item.ingredientId || index}>
                                             {item.quantity} {item.unit} {item.name}
                                             {viewingLog.type === 'import' && item.totalCost != null && ` (${formatCurrency(item.totalCost)})`}
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                         ) : (
                             <InventoryLogForm
                                onSubmit={handleFormSubmit}
                                initialData={editingLog}
                                isLoading={formLoading}
                                error={formError}
                             />
                         )}

                        <button className={styles.closeButton} onClick={handleCloseModal} disabled={formLoading}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageInventoryLogsPage;