import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

const EditEmployeeFormModal = ({ visible, onClose, onSubmit, employee }) => {
    const [form] = Form.useForm();

    // Lưu lại giá trị ban đầu của employee để so sánh khi submit
    const initialValues = {
        fullname: employee?.fullname || '',
        email: employee?.email || '',
        role: employee?.role?.role || '',
    };

    useEffect(() => {
        if (employee) {
            form.setFieldsValue(initialValues);
        }
    }, [employee, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();

                // 📝 So sánh các giá trị mới với giá trị cũ, chỉ lấy các trường thay đổi
                const updatedFields = Object.keys(values).reduce((acc, key) => {
                    if (values[key] !== initialValues[key]) {
                        acc[key] = values[key];
                    }
                    return acc;
                }, {});

                if (Object.keys(updatedFields).length > 0) {
                    // 🏷️ Chỉ submit các trường thay đổi
                    onSubmit({ id: employee.id, ...updatedFields });
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Edit Employee"
            visible={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText="Save"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="fullname"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter full name' }]}
                >
                    <Input placeholder="Full Name" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select a role' }]}
                >
                    <Select placeholder="Select Role">
                        <Option value="ADMIN">Admin</Option>
                        <Option value="USER">User</Option>
                        <Option value="EMPLOYEE">Employee</Option>
                        <Option value="MANAGER">Manager</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditEmployeeFormModal;
