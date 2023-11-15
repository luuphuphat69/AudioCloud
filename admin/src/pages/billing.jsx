import React, { useEffect, useState } from "react";
import axios from 'axios'
import SideBar from "../components/sidebar";
import { Pagination } from 'react-bootstrap';

const Billing = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Get current items based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    useEffect(() => {
        axios.get('http://audiocloud.asia:8000/v1/billing/get-bills')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching default data:', error);
            });
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            // If the search query is empty, do not make the API call
            return;
        }

        // If there's a search query, perform the search
        axios.get(`http://audiocloud.asia:8000/v1/billing/search?queries=${searchQuery}`)
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error searching users:', error);
            });
    }, [searchQuery]);

    return (
        <div>
            <SideBar />
            <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
                <div class="container-fluid py-1 px-3">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                            <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="">Trang chủ</a></li>
                            <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Hóa đơn</li>
                        </ol>
                    </nav>
                    <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                        <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                            <div class="input-group input-group-outline">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Quản lý hóa đơn</h6>
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">
                                <div className="table-responsive p-0">
                                    <table className="table align-items-center mb-0">
                                        <thead>
                                            <tr>
                                                <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">ID Hóa đơn</th>
                                                <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">ID Người dùng</th>
                                                <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">Gói</th>
                                                <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">Giá trị</th>
                                                <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Thời gian</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((item) => (
                                                <tr>
                                                    <td>
                                                        <p className="text-x text-secondary mb-0" key={item._id}>{item.BillId}</p>
                                                    </td>
                                                    <td>
                                                        <p className="text-x text-secondary mb-0" key={item._id}>{item.UserId}</p>
                                                    </td>
                                                    <td>
                                                        <p className="text-x text-secondary mb-0" key={item._id}>NextPro</p>
                                                    </td>
                                                    <td>
                                                        <p className="text-x text-secondary mb-0" key={item._id}>30$</p>
                                                    </td>
                                                    <td>
                                                        <p className="text-x text-secondary mb-0" key={item._id}>{item.DateTime}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination>
                                    {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map((page) => (
                                        <Pagination.Item
                                            key={page + 1}
                                            active={page + 1 === currentPage}
                                            onClick={() => handlePageChange(page + 1)}
                                        >
                                            {page + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Billing;