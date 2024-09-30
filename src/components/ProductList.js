import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import ProductForm from "./ProductForm";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);

    useEffect(() => {
        fetchPigs();
    }, []);

    const fetchPigs = () => {
        axios.get('http://localhost:3030/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    };

    const handleOpenFormModal = () => {
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        setShowFormModal(false);
    };

    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');


    const handleSearch = () => {
        axios.get('http://localhost:3030/products')
            .then(response => {
                const filteredPigs = response.data.filter(pig => {
                    return (searchName === '' || pig.name.toLowerCase().includes(searchName.toLowerCase())) &&
                        (searchCategory === '' || pig.category.toLowerCase().includes(searchCategory.toLowerCase()));
                });
                setProducts(filteredPigs);
            })
            .catch(error => console.error(error));
    };


    return (
        <div>
            <h2 className="text-center mb-4 text-danger-emphasis">Danh Sách Sản Phẩm</h2>

            {/* Form Tìm kiếm */}
            <div className={"mb-2 d-flex align-items-center"}>
                <input
                    className={"form-control"}
                    style={{width:"40%", margin:"10px" }}

                    type="text"
                    placeholder="Tìm theo tên sản phẩm"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />

                <input
                    className={"form-control"}
                    style={{width:"40%", margin:"10px" }}
                    type="text"
                    placeholder="Tìm theo thể loại"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                />
                <button onClick={handleSearch} className={"btn btn-info"}>Tìm kiếm</button>
            </div>
            <button className={"btn btn-primary mb-4"} onClick={handleOpenFormModal}><i
                className="fas fa-plus-circle"></i> Thêm mới
            </button>
            <table className={"table table-info table-hover table-striped table-bordered"}>
                <thead>
                <tr style={{backgroundColor: "green"}}>
                    <th style={{backgroundColor: "orange"}} className="table-header">STT</th>

                    <th style={{backgroundColor: "orange"}} className="table-header">Mã sản phẩm</th>
                    <th style={{backgroundColor: "orange"}} className="text-center">Tên sản phẩm</th>
                    <th style={{backgroundColor: "orange"}} className="text-center">Thể loại</th>
                    <th style={{backgroundColor: "orange"}} className="text-center">Số lượng</th>
                    <th style={{backgroundColor: "orange"}} className="text-center">Giá</th>
                    <th style={{backgroundColor: "orange"}} className="text-center">Ngày nhập</th>
                </tr>
                </thead>
                <tbody className={"align-items-center"}>
                {products.map((product, index) => (
                    <tr key={product.id} className="align-middle">
                        <td>{index+1}</td>
                        <td>{product.code}</td>
                        <td>{product.name}</td>
                        <td>{product.category} </td>
                        <td>{product.quantity}</td>
                        <td>{product.price}</td>
                        <td>{new Date(product.exitDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal show={showFormModal} onHide={handleCloseFormModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductForm onSave={fetchPigs} onClose={handleCloseFormModal} pigs={products}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseFormModal}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )


}
export default ProductList
