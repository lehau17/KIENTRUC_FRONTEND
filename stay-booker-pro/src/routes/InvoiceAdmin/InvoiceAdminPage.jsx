import { DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Table, Typography, message } from 'antd';
import axiosInstance from 'api/instance';
import { useEffect, useState } from 'react';

const { Title } = Typography;

const InvoiceAdminPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // 📥 Lấy danh sách hóa đơn
    const fetchInvoices = async (page = 1, pageSize = 10) => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/invoices?page=${page}&limit=${pageSize}`);
            const data = res.data?.data?.data || [];
            const pag = res.data?.data?.pagination || {};

            setInvoices(data);
            setPagination({
                current: parseInt(pag.page),
                pageSize: parseInt(pag.limit),
                total: parseInt(pag.total),
            });
        } catch (err) {
            message.error('Không thể tải danh sách hóa đơn');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // 🗑️ Xóa hóa đơn
    const handleDeleteInvoice = async (id) => {
        try {
            await axiosInstance.delete(`/invoice/${id}`);
            message.success('Đã xóa hóa đơn');
            fetchInvoices(pagination.current, pagination.pageSize);
        } catch (err) {
            message.error('Xóa hóa đơn thất bại');
        }
    };

    // 🧾 Cột của bảng hóa đơn
    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Room ID',
            dataIndex: 'roomId',
            key: 'roomId',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `${amount.toLocaleString()} đ`,
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => new Date(createdAt).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteInvoice(record._id)}
                    />
                </Space>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        fetchInvoices(pagination.current, pagination.pageSize);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <Title level={3}>Quản lý hóa đơn</Title>
            </div>

            <Table
                columns={columns}
                dataSource={invoices}
                loading={isLoading}
                rowKey="_id"
                pagination={pagination}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default InvoiceAdminPage;
