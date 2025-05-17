import { Button } from 'antd';
import { useAddEmployee, useEmployees, useUpdateEmployee } from 'hooks/useEmployees';
import { useState } from 'react';
import AddEmployeeFormModal from './component/AddEmployeeFormModal';
import EditEmployeeFormModal from './component/EditEmployeeFormModal';
import EmployeeTable from './component/EmployeeTable';

const EmployeeAdmin = () => {
    const { data, isLoading } = useEmployees();
    const { mutate: addEmployee } = useAddEmployee();
    const { mutate: updateEmployee } = useUpdateEmployee();
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleAdd = () => {
        setVisibleAdd(true);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setVisibleEdit(true);
    };

    const handleSubmitAdd = (values) => {
        addEmployee(values);
        setVisibleAdd(false);
    };

    const handleSubmitEdit = (values) => {
        updateEmployee(values);
        setVisibleEdit(false);
    };

    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Employee
            </Button>
            <EmployeeTable data={data} onEdit={handleEdit} />
            <AddEmployeeFormModal
                visible={visibleAdd}
                onClose={() => setVisibleAdd(false)}
                onSubmit={handleSubmitAdd}
            />
            <EditEmployeeFormModal
                visible={visibleEdit}
                onClose={() => setVisibleEdit(false)}
                onSubmit={handleSubmitEdit}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default EmployeeAdmin;
