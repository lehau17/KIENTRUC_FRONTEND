import React from "react";
import { Row, Col, Card, Input, Checkbox, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons";

const RegisterPage: React.FC = () => {
  return (
    <Col xs={24} md={12}>
      <Card style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <div className="font-bold text-center text-2xl mb-5">Register</div>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Input placeholder="First Name" />
          </Col>
          <Col span={12}>
            <Input placeholder="Last Name" />
          </Col>
        </Row>
        <Input placeholder="Email" style={{ marginTop: "10px" }} />
        <Input.Password placeholder="Password" style={{ marginTop: "10px" }} />

        <Checkbox style={{ margin: "10px 0" }}>
          Subscribe to our newsletter
        </Checkbox>

        <Button type="primary" block>
          Sign Up
        </Button>

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <p>Or sign up with:</p>
          <FacebookOutlined style={iconStyle} />
          <TwitterOutlined style={iconStyle} />
          <GoogleOutlined style={iconStyle} />
          <GithubOutlined style={iconStyle} />
        </div>
      </Card>
    </Col>
  );
};

// Style icon
const iconStyle: React.CSSProperties = {
  fontSize: "20px",
  margin: "0 10px",
  color: "#1890ff",
  cursor: "pointer",
};

export default RegisterPage;
