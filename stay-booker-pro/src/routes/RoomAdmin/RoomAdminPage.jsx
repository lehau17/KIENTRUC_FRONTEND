import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, Space, Table, message } from 'antd';
import axiosInstance from 'api/instance';
import { useEffect, useState } from 'react';
import AddRoomFormModal from './AddRoomFormModal';
import EditRoomFormModal from './EditRoomFormModal';

const RoomAdminPage = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // 📝 Lấy danh sách phòng
    const fetchRooms = async (page = 1, pageSize = 10) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/room?page=${page}&limit=${pageSize}`);
            setRooms(response.data.data.data);
            setPagination({
                current: parseInt(response.data.data.pagination.page),
                pageSize: parseInt(response.data.data.pagination.limit),
                total: response.data.data.pagination.total,
            });
        } catch (error) {
            message.error('Failed to fetch rooms.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // 🗑️ Xóa phòng
    const handleDeleteRoom = async (id) => {
        try {
            await axiosInstance.delete(`/room/${id}`);
            message.success('Room deleted successfully.');
            fetchRooms(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete room.');
        }
    };

    // ✏️ Sửa phòng
    const handleEditRoom = (room) => {
        setSelectedRoom(room);
        setIsEditModalVisible(true);
    };

    // ➕ Thêm phòng
    const handleAddRoom = () => {
        setIsAddModalVisible(true);
    };

    // 📝 Cột của bảng
    const columns = [
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                images.length > 0 ? (
                    <Image width={100} src={images[0]} alt="Room Image" />
                ) : (
                    <span>No Image</span>
                )
            ),
        },
        {
            title: 'Room Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
        },
        {
            title: 'Room Type',
            dataIndex: 'roomType',
            key: 'roomType',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Available',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            render: (value) => (value ? 'Yes' : 'No'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditRoom(record)}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteRoom(record._id)}
                    />
                </Space>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        fetchRooms(pagination.current, pagination.pageSize);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Room Management</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddRoom}
                >
                    Add Room
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={rooms}
                loading={isLoading}
                rowKey="_id"
                pagination={pagination}
                onChange={handleTableChange}
            />

            <EditRoomFormModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSubmit={fetchRooms}
                room={selectedRoom}
            />

            <AddRoomFormModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSubmit={fetchRooms}
            />
        </div>
    );
};

export default RoomAdminPage;
