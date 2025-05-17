// components/EmployeeFormModal.js
import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

const EmployeeFormModal = ({ visible, onClose, onSubmit, employee }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (employee) {
            form.setFieldsValue(employee);
        } else {
            form.resetFields();
        }
    }, [employee, form]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                onSubmit(values);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            visible={visible}
            title={employee ? 'Edit Employee' : 'Add Employee'}
            onCancel={onClose}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EmployeeFormModal;
