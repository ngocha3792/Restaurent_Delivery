import React, { useState, useEffect } from 'react';
import styles from './IngredientForm.module.css';

function IngredientForm({ onSubmit, initialData, isLoading, error }) {
    const [formData, setFormData] = useState({
        name: '',
        stock: 0,
        unit: '',
        threshold: 5, 
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                stock: initialData.stock || 0,
                unit: initialData.unit || '',
                threshold: initialData.threshold || 5,
            });
        } else {
            setFormData({ name: '', stock: 0, unit: '', threshold: 5 });
        }
         setFormError(''); 
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
        setFormError(''); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(''); 

        if (!formData.name.trim()) {
             setFormError("Tên nguyên liệu không được để trống.");
             return;
        }
        if (!formData.unit.trim()) {
             setFormError("Đơn vị tính không được để trống.");
             return;
        }
         if (formData.stock < 0) {
             setFormError("Số lượng tồn kho không thể âm.");
             return;
         }
         if (formData.threshold < 0) {
            setFormError("Ngưỡng cảnh báo không thể âm.");
            return;
         }


        onSubmit(formData, initialData?._id);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Tên nguyên liệu:</label>
                <input
                    type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="stock">Tồn kho:</label>
                <input
                    type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required min="0" disabled={isLoading}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="unit">Đơn vị tính:</label>
                <input type="text" id="unit" name="unit" value={formData.unit} onChange={handleChange} required placeholder="Ví dụ: kg, gram, lít, cái,..." disabled={isLoading}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="threshold">Ngưỡng cảnh báo:</label>
                <input type="number" id="threshold" name="threshold" value={formData.threshold} onChange={handleChange} required min="0" disabled={isLoading}
                />
            </div>

            {(formError || error) && <p className={styles.errorMessage}>{formError || error}</p>}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Thêm mới')}
            </button>
        </form>
    );
}

export default IngredientForm;