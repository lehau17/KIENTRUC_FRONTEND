import { Form, Input, Modal, Select } from 'antd';

const { Option } = Select;

const AddEmployeeFormModal = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onSubmit(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Add New Employee"
            visible={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText="Add"
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
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please enter username' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                >
                    <Input.Password placeholder="Password" />
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

export default AddEmployeeFormModal;
