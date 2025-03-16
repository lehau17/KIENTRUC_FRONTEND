import React from "react";
import { Col, Card, Input, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";

const LoginPage: React.FC = () => {
  return (
    <Col xs={24} md={12}>
      <Card style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <div className="font-bold text-center text-2xl mb-5">Login</div>

        <Input placeholder="Email" />
        <Input.Password placeholder="Password" style={{ marginTop: "10px" }} />

        <Button type="primary" block style={{ marginTop: "10px" }}>
          Sign In
        </Button>

        <div className="text-center p-2">
          <p className="p-3">Or sign in with:</p>
          <FacebookOutlined style={iconStyle} />
          <TwitterOutlined style={iconStyle} />
          <GoogleOutlined style={iconStyle} />
          <GithubOutlined style={iconStyle} />
        </div>

        <div className="text-center mt-3">
          <p>
            Don't have an account? <Link to="/auth/register">Sign Up</Link>
          </p>
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

export default LoginPage;
