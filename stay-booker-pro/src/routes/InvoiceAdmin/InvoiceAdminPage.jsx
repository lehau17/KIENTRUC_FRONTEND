import { Table, Typography } from 'antd';
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
  const [errorText, setErrorText] = useState('');

  // 📥 Lấy danh sách hóa đơn bằng fetch
  const fetchInvoices = async (page = 1, pageSize = 10) => {
    setIsLoading(true);
    setErrorText('');
    try {
      const response = await fetch(`http://localhost:5004/api/invoices?page=${page}&limit=${pageSize}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const resData = await response.json();

      let data = [];
      let pag = {};
      if (Array.isArray(resData)) {
        data = resData;
        pag = {
          page: page,
          limit: pageSize,
          total: resData.length,
        };
      } else {
        data = resData.data || [];
        pag = resData.pagination || {};
      }

      setInvoices(data);
      setPagination({
        current: parseInt(pag.page) || page,
        pageSize: parseInt(pag.limit) || pageSize,
        total: parseInt(pag.total) || data.length,
      });
    } catch (err) {
      setErrorText(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🧾 Cột của bảng hóa đơn (đã bỏ Actions)
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

      {errorText && (
        <div style={{ color: 'red', marginTop: 10 }}>
          <b>Lỗi:</b> {errorText}
        </div>
      )}
    </div>
  );
};

export default InvoiceAdminPage;
