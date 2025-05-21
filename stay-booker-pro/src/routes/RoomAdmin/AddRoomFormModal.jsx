import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import axiosInstance from 'api/instance';
import { useUploadMultipleFiles } from 'hooks/useUploadMultipleFiles';
import { useState } from 'react';

const { Option } = Select;

// Danh sách amenities mặc định
const defaultAmenities = [
    'Free Wifi',
    'Air Conditioning',
    'Swimming Pool',
    'Gym',
    'Restaurant',
    'Room Service',
    'Spa',
    'Parking',
    'Pet Friendly',
    'Airport Shuttle',
];

const AddRoomFormModal = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { mutateAsync: uploadImages } = useUploadMultipleFiles();

    /**
     * Xử lý khi người dùng nhấn "Add"
     */
    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // Upload ảnh lên MinIO
            if (fileList.length > 0) {
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append('files', file.originFileObj);
                });

                const response = await uploadImages(formData);

                if (response && response.urls) {
                    values.images = response.urls;
                }
            }

            // Gọi API tạo mới phòng
            await axiosInstance.post('/room', { ...values, price: +values.price, capacity: +values.capacity });
            form.resetFields();
            setFileList([]);
            message.success('Room added successfully.');
            onSubmit();
            onClose();
        } catch (error) {
            console.error('Failed to add room:', error.message);
            message.error('Failed to add room.');
        }
    };

    /**
     * Xử lý khi thay đổi file upload
     */
    const handleFileChange = ({ fileList }) => {
        console.log(fileList)
        setFileList(fileList);
    };

    return (
        <Modal
            title="Add Room"
            visible={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText="Add"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Room Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="roomType" label="Room Type" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Standard">Standard</Option>
                        <Option value="Deluxe">Deluxe</Option>
                        <Option value="Suite">Suite</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="available">Available</Option>
                        <Option value="unavailable">Unavailable</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="amenities" label="Amenities">
                    <Select
                        mode="multiple"
                        placeholder="Select amenities"
                        defaultValue={defaultAmenities}
                        allowClear
                    >
                        {defaultAmenities.map((amenity, index) => (
                            <Option key={index} value={amenity}>
                                {amenity}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Upload hình ảnh */}
                <Form.Item name="images" label="Room Images">
                    <Upload
                        multiple
                        listType="picture"
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false} // Không upload ngay lập tức
                    >
                        <Button icon={<UploadOutlined />}>Upload Images</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddRoomFormModal;
