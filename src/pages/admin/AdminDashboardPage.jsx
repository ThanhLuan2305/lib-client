import React from "react";
import { Layout, Card, Table, Typography } from "antd";
import { Row, Col, Container } from "react-bootstrap";
import {
  BookOutlined,
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Thêm ResponsiveContainer
import "../../styles/adminDashboard.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const chartData = [
  { month: "Jan", borrows: 30 },
  { month: "Feb", borrows: 45 },
  { month: "Mar", borrows: 60 },
  { month: "Apr", borrows: 50 },
  { month: "May", borrows: 70 },
  { month: "Jun", borrows: 90 },
];

const recentBooksColumns = [
  {
    title: "ISBN",
    dataIndex: "isbn",
    key: "isbn",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
  },
];

const recentBooksData = [
  {
    key: "1",
    isbn: "9780553380163",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    stock: 5,
  },
  {
    key: "2",
    isbn: "9780142437247",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    stock: 3,
  },
  {
    key: "3",
    isbn: "9780451524935",
    title: "1984",
    author: "George Orwell",
    stock: 8,
  },
];

const statsData = {
  totalBooks: 1200,
  totalUsers: 350,
  totalBorrows: 180,
  activeBorrows: 45,
};

const AdminDashboardPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content className="content">
          <Container fluid>
            <Row className="mb-4">
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Card className="stat-card">
                  <div className="stat-content">
                    <BookOutlined
                      style={{ fontSize: 24, color: "#1890ff", marginRight: 8 }}
                    />
                    <div>
                      <Text type="secondary">Total Books</Text>
                      <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
                        {statsData.totalBooks}
                      </Title>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Card className="stat-card">
                  <div className="stat-content">
                    <UserOutlined
                      style={{ fontSize: 24, color: "#52c41a", marginRight: 8 }}
                    />
                    <div>
                      <Text type="secondary">Total Users</Text>
                      <Title level={3} style={{ color: "#52c41a", margin: 0 }}>
                        {statsData.totalUsers}
                      </Title>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Card className="stat-card">
                  <div className="stat-content">
                    <FileTextOutlined
                      style={{ fontSize: 24, color: "#faad14", marginRight: 8 }}
                    />
                    <div>
                      <Text type="secondary">Total Borrows</Text>
                      <Title level={3} style={{ color: "#faad14", margin: 0 }}>
                        {statsData.totalBorrows}
                      </Title>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Card className="stat-card">
                  <div className="stat-content">
                    <ClockCircleOutlined
                      style={{ fontSize: 24, color: "#ff4d4f", marginRight: 8 }}
                    />
                    <div>
                      <Text type="secondary">Active Borrows</Text>
                      <Title level={3} style={{ color: "#ff4d4f", margin: 0 }}>
                        {statsData.activeBorrows}
                      </Title>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6} className="mb-4">
                <Card title="Borrow Trends" className="chart-card">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="borrows"
                        stroke="#1890ff"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Bảng sách gần đây */}
              <Col xs={12} md={6}>
                <Card title="Recent Books" className="table-card">
                  <Table
                    columns={recentBooksColumns}
                    dataSource={recentBooksData}
                    pagination={false}
                    size="small"
                    scroll={{ x: "max-content" }}
                  />
                </Card>
              </Col>
            </Row>
          </Container>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardPage;
