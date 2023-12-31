import React, { useEffect, useState } from "react";
import axios from 'axios'
import SideBar from "../components/sidebar";
import { Pagination } from 'react-bootstrap';
import EditTrack from "../components/popup/edit_track";
import Notication from "../components/notify";
import Upload from "../components/popup/upload";

const Audios = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [audioId, setAudioId] = useState('');

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
    const handleEditTrack = (audioId) => {
        setShowEdit(!showEdit);
        setAudioId(audioId);
    }
    const handleUpload = () => {
        setShowUpload(true);
    }

    const handleCloseUpload = () => {
        setShowUpload(false)
    }

    const onClose = () => {
        setShowEdit(false);
    }
    useEffect(() => {
        axios.get('http://audiocloud.asia:8000/v1/audio/get-all-audio')
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
        axios.get(`http://audiocloud.asia:8000/v1/audio/search?queries=${searchQuery}`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error searching users:', error);
            });
    }, [searchQuery]);

    const handleRemoveAudio = async (userId, audioId) => {
        try {
            // Ask for user confirmation
            const isConfirmed = window.confirm('Xác nhận xóa bài hát này');

            // If the user confirms, proceed with the deletion
            if (isConfirmed) {
                // Make an API request to delete the user with the provided userId
                await axios.delete(`http://audiocloud.asia:8000/v1/audio/removeAudio/${userId}/${audioId}`);
                window.alert('Xóa người dùng thành công');
            } else {
                window.alert('Đã hủy xóa thành công');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            window.alert('Đã xảy ra lỗi khi xóa. Hãy thử lại');
        }
    };

    return (
        <div>
            <SideBar />
            <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
                <div class="container-fluid py-1 px-3">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                            <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="">Trang chủ</a></li>
                            <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Bài hát</li>
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
                    {/* <div className="mt-3">
                        <button className="btn btn-primary" onClick={handleUpload}>Đăng bài hát</button>
                    </div> */}
                </div>
            </nav>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                                    <h6 className="text-white text-capitalize ps-3">Quản lý bài hát</h6>
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2">
                                <div className="table-responsive p-0">
                                    <table className="table align-items-center mb-0">
                                        <thead>
                                            <tr>
                                                <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">ID</th>
                                                <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">Tiêu đề</th>
                                                <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Sở hữu</th>
                                                <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Trạng thái</th>
                                                <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Sửa</th>
                                                <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((item) => (
                                                <tr>
                                                    <td>
                                                        <p className="text-x text-secondary mb-0" key={item._id}>{item.AudioId}</p>
                                                    </td>
                                                    <td>
                                                        <p className="text-x text-secondary mb-0" key={item._id}>{item.AudioName}</p>
                                                    </td>
                                                    <td className="align-middle text-center text-sm">
                                                        <span className="text-secondary text-x font-weight-bold" key={item._id}>{item.UserDisplayname}</span>
                                                    </td>
                                                    <td className="align-middle text-center text-sm">
                                                        {item.IsPublic ? <span className="text-secondary text-x font-weight-bold" key={item._id}>Công khai</span> :
                                                            <span className="text-secondary text-x font-weight-bold" key={item._id}>Cá nhân</span>}
                                                    </td>
                                                    <td className="align-middle">
                                                        <button href="" class="btn-1" data-toggle="tooltip" data-original-title="Remove user" onClick={() => handleEditTrack(item.AudioId)}>
                                                            Sửa
                                                        </button>
                                                    </td>
                                                    <td className="align-middle">
                                                        <button href="" class="btn-1" data-toggle="tooltip" data-original-title="Remove user" onClick={() => handleRemoveAudio(item.UserId, item.AudioId)}>
                                                            Xóa
                                                        </button>
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
                {showEdit ? <EditTrack audioId={audioId} closePopup={onClose} /> : null}
                {showUpload ? <Upload closePopup={handleCloseUpload}/> : null}
            </div>
        </div>
    );
}
export default Audios;