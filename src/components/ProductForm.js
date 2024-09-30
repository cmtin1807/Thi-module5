import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ onSave, onClose, products }) => {
    const [code, setCode] = useState('');
    const [exitDate, setExitDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [categorys, setCategorys] = useState([]);
    const [errors, setErrors] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3030/categorys')
            .then(response => setCategorys(response.data))
            .catch(error => console.error(error));
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!/^PROD-\d{4}$/.test(code)) {
            newErrors.code = 'Mã số sản phẩm phải theo định dạng PROD-XXXX (XXXX là các số)';
        }

        const currentDate = new Date().toISOString().split('T')[0];
        if (!exitDate || exitDate > currentDate) {
            newErrors.exitDate = 'Ngày nhập phải nhỏ hơn hoặc bằng ngày hiện tại';
        }

        if (!quantity || quantity <= 0) {
            newErrors.quantity = 'Số lượng khi nhập phải lớn hơn 0';
        }

        if (!category) {
            newErrors.category = 'Thể loại là bắt buộc';
        }

        if (!name) {
            newErrors.name = 'Tên sản phẩm là bắt buộc';
        }
        if (!description) {
            newErrors.description = 'Mô tả là bắt buộc';
        }
        if (!price) {
            newErrors.price = 'Giá là bắt buộc';
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const newProduct = {
                code: code,
                name: name,
                description: description,
                exitDate: exitDate,
                quantity: parseInt(quantity),
                category: category,
                price: parseInt(price)
            };
            console.log(newProduct);


            axios.post('http://localhost:3030/products', newProduct)
                .then(() => {
                    onSave();
                    onClose();
                    alert("Thêm mới thành công");

                })
                .catch(error => console.error(error));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
            <div className="mb-3">
                <label className="form-label">Mã số sản phẩm</label>
                <input
                    type="text"
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Tên sản phẩm</label>
                <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Mô tả sản phẩm</label>
                <input
                    type="text"
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Ngày nhập</label>
                <input
                    type="date"
                    className={`form-control ${errors.exitDate ? 'is-invalid' : ''}`}
                    value={exitDate}
                    onChange={(e) => setExitDate(e.target.value)}
                />
                {errors.exitDate && <div className="invalid-feedback">{errors.exitDate}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Số lượng nhập</label>
                <input
                    type="number"
                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Giá nhập</label>
                <input
                    type="number"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Thể loại</label>
                <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Chọn thể loại</option>
                    {categorys.map(o => (
                        <option key={o.id} value={o.name}>{o.name}</option>
                    ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Lưu</button>
        </form>
    );
};

export default ProductForm;
