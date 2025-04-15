import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axios'; 
import IngredientForm from '../../components/IngredientForm/IngredientForm'; 
import styles from './ManagerIngredientPage.module.css'; 
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa'; 

function ManageIngredientsPage() {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null); 
    const [formLoading, setFormLoading] = useState(false); 
    const [formError, setFormError] = useState(null);

    const fetchIngredients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/ingredients'); 
            if (response.data && response.data.success) {
                setIngredients(response.data.ingredients || []);
            } else {
                throw new Error(response.data?.message || "Failed to fetch ingredients");
            }
        } catch (err) {
            console.error("Fetch ingredients error:", err);
            setError(err.message || "Lỗi tải dữ liệu nguyên liệu.");
            setIngredients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleOpenModal = (ingredient = null) => {
        setEditingIngredient(ingredient); 
        setFormError(null); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingIngredient(null); 
        setFormError(null);
    };

    const handleFormSubmit = async (formData, id) => {
        setFormLoading(true);
        setFormError(null);
        const apiUrl = id ? `/ingredients/${id}` : '/ingredients'; 
        const apiMethod = id ? 'put' : 'post'; 

        try {
            const response = await axiosInstance[apiMethod](apiUrl, formData);
            if (response.data && response.data.success) {
                handleCloseModal(); 
                fetchIngredients(); 
            } else {
                throw new Error(response.data?.message || `Failed to ${id ? 'update' : 'create'} ingredient`);
            }
        } catch (err) {
            console.error("Form submit error:", err);
            setFormError(err.response?.data?.message || err.message || "Đã có lỗi xảy ra.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (ingredientId, ingredientName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa nguyên liệu "${ingredientName}" không? Hành động này không thể hoàn tác.`)) {
            try {
                 const response = await axiosInstance.delete(`/ingredients/${ingredientId}`);
                  if (response.data && response.data.success) {
                     fetchIngredients();
                 } else {
                     throw new Error(response.data?.message || "Failed to delete ingredient");
                 }
            } catch (err) {
                 console.error("Delete ingredient error:", err);
                alert(`Lỗi khi xóa nguyên liệu: ${err.response?.data?.message || err.message}`); 
            }
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h1>Quản lý Nguyên liệu</h1>

            <button className={styles.addButton} onClick={() => handleOpenModal()}>
                <FaPlus /> Thêm Nguyên liệu mới
            </button>

            {error && <p className={styles.errorFetch}>{error}</p>}

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên Nguyên liệu</th>
                            <th>Tồn kho</th>
                            <th>Đơn vị</th>
                            <th>Ngưỡng cảnh báo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.length === 0 && !loading ? (
                            <tr><td colSpan="5">Chưa có nguyên liệu nào.</td></tr>
                        ) : (
                            ingredients.map(ing => (
                                <tr key={ing._id} className={ing.stock <= ing.threshold ? styles.lowStock : ''}>
                                    <td>
                                        {ing.name}
                                         {ing.stock <= ing.threshold && <FaExclamationTriangle title="Dưới ngưỡng cảnh báo" className={styles.warningIcon}/>}
                                     </td>
                                    <td>{ing.stock}</td>
                                    <td>{ing.unit}</td>
                                    <td>{ing.threshold}</td>
                                    <td>
                                        <button
                                            className={`${styles.actionBtn} ${styles.editBtn}`}
                                            onClick={() => handleOpenModal(ing)}
                                            title="Sửa"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(ing._id, ing.name)}
                                            title="Xóa"
                                        >
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
                        <h2>{editingIngredient ? 'Sửa Nguyên liệu' : 'Thêm Nguyên liệu mới'}</h2>
                        <IngredientForm onSubmit={handleFormSubmit} initialData={editingIngredient} isLoading={formLoading} error={formError} 
                        />
                        <button className={styles.closeButton} onClick={handleCloseModal} disabled={formLoading}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageIngredientsPage;