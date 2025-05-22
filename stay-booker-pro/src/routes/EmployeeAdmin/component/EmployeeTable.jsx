// EmployeeTable.js
import { Button, Popconfirm, Space, Table } from 'antd';
import { useDeleteEmployee } from 'hooks/useEmployees';

const EmployeeTable = ({ data, onEdit }) => {
    const { mutate: deleteEmployee } = useDeleteEmployee();

    // 👉 Lấy ra array thực sự từ response data
    const employeeData = data?.data?.data ?? [];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: ['role', 'role'],
            key: 'role',
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                return <Space>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this employee?"
                        onConfirm={() => deleteEmployee(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger">Delete</Button>
                    </Popconfirm>
                </Space>
            }
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={employeeData}
            rowKey="id"
            pagination={{
                pageSize: 20,
                total: data?.total ?? 0,
                current: data?.page ?? 1
            }}
        />
    );
};

export default EmployeeTable;
