import { Row, Col } from "antd";

const AuthLayout = ({ children }: { children: any }) => {
  return (
    <div className="max-h-screen flex items-center">
      <Row gutter={[16, 16]} align="middle">
        {/* Bên trái */}
        <Col xs={24} md={12} style={{ textAlign: "center" }}>
          <h1
            className="my-5"
            style={{ fontWeight: "bold", fontSize: "2.5rem" }}
          >
            The best offer <br />
            <span style={{ color: "#1890ff" }}>for your business</span>
          </h1>
          <p style={{ color: "gray", padding: "0 20px" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </p>
        </Col>

        {/* Bên phải */}
        {children}
      </Row>
    </div>
  );
};

export default AuthLayout;
