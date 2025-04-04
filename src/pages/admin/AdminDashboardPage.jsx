import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Typography, Spin, Select } from "antd";
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
} from "recharts";
import "../../styles/adminDashboard.css";
import {
  countBookActive,
  countAllBorrowBook,
  countBorrowBookActive,
  countUserActive,
  getRecentBooks,
  getBorrowTrend,
} from "../../services/admin/Statistical";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

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

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrows: 0,
    activeBorrows: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [borrowTrend, setBorrowTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại
  const [recentBooksQuantity, setRecentBooksQuantity] = useState(5); // Số lượng sách mặc định

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy dữ liệu thống kê
        const [totalBooks, totalUsers, totalBorrows, activeBorrows] =
          await Promise.all([
            countBookActive(),
            countUserActive(),
            countAllBorrowBook(),
            countBorrowBookActive(),
          ]);

        setStats({
          totalBooks,
          totalUsers,
          totalBorrows,
          activeBorrows,
        });

        // Lấy danh sách sách gần đây
        const recentBooksData = await getRecentBooks(recentBooksQuantity);
        const formattedRecentBooks = recentBooksData.map((book, index) => ({
          key: index.toString(),
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          stock: book.stock,
        }));
        setRecentBooks(formattedRecentBooks);

        // Lấy xu hướng mượn sách
        const borrowTrendData = await getBorrowTrend(selectedYear);
        const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại (1-12)
        const currentYear = new Date().getFullYear();
        const formattedBorrowTrend = Object.keys(borrowTrendData)
          .filter((month) => {
            // Chỉ hiển thị các tháng từ 1 đến tháng hiện tại nếu năm được chọn là năm hiện tại
            const monthNum = parseInt(month);
            return selectedYear < currentYear || monthNum <= currentMonth;
          })
          .map((month) => ({
            month: new Date(0, month - 1).toLocaleString("default", {
              month: "short",
            }), // Chuyển số tháng thành tên tháng (Jan, Feb, ...)
            borrows: borrowTrendData[month],
          }));
        setBorrowTrend(formattedBorrowTrend);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, recentBooksQuantity]); // Thêm selectedYear và recentBooksQuantity vào dependencies

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Tạo danh sách năm cho dropdown (5 năm gần nhất)
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

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
                        {stats.totalBooks}
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
                        {stats.totalUsers}
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
                        {stats.totalBorrows}
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
                        {stats.activeBorrows}
                      </Title>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6} className="mb-4">
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Borrow Trends</span>
                      <Select
                        value={selectedYear}
                        onChange={(value) => setSelectedYear(value)}
                        style={{ width: 120 }}
                      >
                        {years.map((year) => (
                          <Option key={year} value={year}>
                            {year}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  }
                  className="chart-card"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={borrowTrend}>
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

              <Col xs={12} md={6}>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Recent Books</span>
                      <Select
                        value={recentBooksQuantity}
                        onChange={(value) => setRecentBooksQuantity(value)}
                        style={{ width: 120 }}
                      >
                        {[5, 10, 15, 20].map((quantity) => (
                          <Option key={quantity} value={quantity}>
                            {quantity}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  }
                  className="table-card"
                >
                  <Table
                    columns={recentBooksColumns}
                    dataSource={recentBooks}
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
