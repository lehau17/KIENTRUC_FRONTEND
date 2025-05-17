import {
    DollarOutlined,
    HomeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const Sidebar = ({ onSelect }) => {
    return (
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="inline"
                defaultSelectedKeys={['employees']}
                style={{ height: '100%', borderRight: 0 }}
                onSelect={(item) => onSelect(item.key)}
            >
                <Menu.Item key="employees" icon={<UserOutlined />}>
                    Nhân viên
                </Menu.Item>
                <Menu.Item key="rooms" icon={<HomeOutlined />}>
                    Phòng
                </Menu.Item>
                <Menu.Item key="invoices" icon={<DollarOutlined />}>
                    Hóa đơn
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
