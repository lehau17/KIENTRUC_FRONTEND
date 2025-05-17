// pages/EmployeeAdmin.js
import { Button } from 'antd';
import { useAddEmployee, useEmployees, useUpdateEmployee } from 'hooks/useEmployees';
import { useState } from 'react';
import EmployeeFormModal from './component/EmployeeFormModal';
import EmployeeTable from './component/EmployeeTable';

const EmployeeAdmin = () => {
    const { data, isLoading } = useEmployees();
    const { mutate: addEmployee } = useAddEmployee();
    const { mutate: updateEmployee } = useUpdateEmployee();
    const [visible, setVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleAdd = () => {
        setSelectedEmployee(null);
        setVisible(true);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setVisible(true);
    };

    const handleSubmit = (values) => {
        if (selectedEmployee) {
            updateEmployee({ ...selectedEmployee, ...values });
        } else {
            addEmployee(values);
        }
        setVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Employee
            </Button>
            <EmployeeTable data={data} onEdit={handleEdit} />
            <EmployeeFormModal
                visible={visible}
                onClose={() => setVisible(false)}
                onSubmit={handleSubmit}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default EmployeeAdmin;
