import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import axiosInstance from 'api/instance';
import { useUploadMultipleFiles } from 'hooks/useUploadMultipleFiles';
import { useEffect, useState } from 'react';

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

const EditRoomFormModal = ({ visible, onClose, onSubmit, room }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { mutateAsync: uploadImages } = useUploadMultipleFiles();

    useEffect(() => {
        if (room) {
            form.setFieldsValue(room);

            // Nếu room có hình ảnh, render lên trước
            if (room.images && room.images.length > 0) {
                const mappedImages = room.images.map((url, index) => ({
                    uid: index,
                    name: `image-${index}`,
                    status: 'done',
                    url: url,
                }));
                setFileList(mappedImages);
            }
        }
    }, [room, form]);

    // Xử lý thay đổi file upload
    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    // Xử lý khi nhấn OK
    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // Nếu có hình ảnh mới thì upload trước
            if (fileList.length > 0) {
                const formData = new FormData();

                fileList.forEach((file) => {
                    if (!file.url) {
                        formData.append('files', file.originFileObj);
                    }
                });

                if (formData.has('files')) {
                    const response = await uploadImages(formData);
                    if (response && response.urls) {
                        values.images = response.urls;
                    }
                } else {
                    // Nếu không có upload mới, giữ nguyên ảnh cũ
                    values.images = room.images;
                }
            }

            // Gọi API cập nhật phòng
            await axiosInstance.put(`/room/${room._id}`, values);
            message.success('Room updated successfully.');
            form.resetFields();
            setFileList([]);
            onSubmit();
            onClose();
        } catch (error) {
            console.error('Failed to update room:', error.message);
            message.error('Failed to update room.');
        }
    };

    return (
        <Modal
            title="Edit Room"
            visible={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText="Save"
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

export default EditRoomFormModal;
