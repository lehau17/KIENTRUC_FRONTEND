import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

const EditEmployeeFormModal = ({ visible, onClose, onSubmit, employee }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (employee) {
            form.setFieldsValue({
                fullname: employee.fullname,
                email: employee.email,
                role: employee.role.role,
            });
        }
    }, [employee, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onSubmit({ ...employee, ...values });
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
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditEmployeeFormModal;
