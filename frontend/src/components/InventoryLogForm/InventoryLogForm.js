import React, { useState, useEffect } from 'react';
import styles from './InventoryLogForm.module.css';
import { FaPlus, FaTrash } from 'react-icons/fa';

function InventoryLogForm({ onSubmit, initialData, isLoading, error }) {
    const [type, setType] = useState('import'); 
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState([{ name: '', quantity: 1, unit: '', totalCost: 0 }]);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (initialData) {
            setType(initialData.type || 'import');
            setNotes(initialData.notes || '');
            setItems(initialData.items ? JSON.parse(JSON.stringify(initialData.items)) : [{ name: '', quantity: 1, unit: '', totalCost: 0 }]);
        } else {
            setType('import');
            setNotes('');
            setItems([{ name: '', quantity: 1, unit: '', totalCost: 0 }]);
        }
        setFormError('');
    }, [initialData]);

    const handleMainChange = (e) => {
        const { name, value } = e.target;
        if (name === 'type') setType(value);
        if (name === 'notes') setNotes(value);
        setFormError('');
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        const numValue = Number(value); 

        if (field === 'quantity' || field === 'totalCost') {
             if (!isNaN(numValue) && numValue >= 0) {
                updatedItems[index][field] = numValue;
             } else if (value === '') { 
                 updatedItems[index][field] = ''; 
             }
        } else {
             updatedItems[index][field] = value;
        }

        setItems(updatedItems);
        setFormError('');
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, unit: '', totalCost: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length <= 1) {
            setFormError("Phải có ít nhất một mặt hàng.");
            return; 
        }
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
         setFormError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        if (items.length === 0) {
            setFormError("Cần ít nhất một mặt hàng trong phiếu.");
            return;
        }
        for (const item of items) {
            if (!item.name?.trim() || !item.unit?.trim() || item.quantity == null || item.quantity <= 0) {
                 setFormError("Tất cả mặt hàng phải có Tên, Đơn vị và Số lượng > 0.");
                return;
            }
             if (type === 'import' && (item.totalCost == null || item.totalCost < 0)) {
                 setFormError("Khi nhập kho, các mặt hàng phải có Tổng chi phí >= 0.");
                 return;
             }
        }

        const logData = {
            type,
            notes,
            items: items.map(item => ({ 
                name: item.name.trim(),
                quantity: Number(item.quantity),
                unit: item.unit.trim(),
                ...(type === 'import' && { totalCost: Number(item.totalCost || 0) })
            })),
        };

        onSubmit(logData, initialData?._id);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="type">Loại phiếu:</label>
                    <select id="type" name="type" value={type} onChange={handleMainChange} disabled={isLoading}>
                        <option value="import">Nhập kho</option>
                        <option value="export">Xuất kho</option>
                    </select>
                </div>
            </div>


            <fieldset className={styles.itemsFieldset}>
                <legend>Danh sách mặt hàng</legend>
                {items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                        <input type="text" placeholder="Tên nguyên liệu" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} required disabled={isLoading} className={styles.itemName}
                        />
                        <input type="number" placeholder="Số lượng" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required min="1"  disabled={isLoading} className={styles.itemQuantity}
                        />
                        <input type="text" placeholder="Đơn vị" value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} required disabled={isLoading} className={styles.itemUnit}
                        />

                        {type === 'import' && (
                             <input type="number" placeholder="Tổng chi phí" value={item.totalCost} onChange={(e) => handleItemChange(index, 'totalCost', e.target.value)} required min="0" disabled={isLoading} className={styles.itemCost}
                            />
                        )}
                         <button type="button" onClick={() => removeItem(index)} className={styles.removeItemBtn} disabled={isLoading || items.length <= 1} 
                         >
                             <FaTrash />
                         </button>
                    </div>
                ))}
                <button type="button" onClick={addItem} className={styles.addItemBtn} disabled={isLoading}>
                    <FaPlus /> Thêm mặt hàng
                </button>
            </fieldset>

            <div className={styles.formGroup}>
                <label htmlFor="notes">Ghi chú (không bắt buộc):</label>
                <textarea id="notes" name="notes" rows="3" value={notes} onChange={handleMainChange} disabled={isLoading}
                ></textarea>
            </div>

            {(formError || error) && <p className={styles.errorMessage}>{formError || error}</p>}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : (initialData ? 'Cập nhật Phiếu' : 'Tạo Phiếu')}
            </button>
        </form>
    );
}

export default InventoryLogForm;