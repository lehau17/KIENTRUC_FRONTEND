import { Layout, Typography } from 'antd';
import { useState } from 'react';
import Sidebar from './component/Sidebar';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Admin = () => {
    const [selectedPage, setSelectedPage] = useState('employees');

    const renderContent = () => {
        switch (selectedPage) {
            case 'employees':
                return <Title level={2}>Danh sách nhân viên</Title>;
            case 'rooms':
                return <Title level={2}>Danh sách phòng</Title>;
            case 'invoices':
                return <Title level={2}>Danh sách hóa đơn</Title>;
            default:
                return <Title level={2}>Trang quản trị</Title>;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Layout>
                <Sidebar onSelect={(page) => setSelectedPage(page)} />
                <Layout style={{ padding: '24px' }}>
                    <Content style={{ margin: 0, minHeight: 280 }}>
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>
                Admin Dashboard ©2025 Created by Hitek Dev
            </Footer>
        </Layout>
    );
};

export default Admin;
