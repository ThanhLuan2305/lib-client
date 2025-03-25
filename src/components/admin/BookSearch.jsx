import React from "react";
import { Form, Input, DatePicker, Button, Row, Col, InputNumber } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "../../styles/bookSearch.css";

const { RangePicker } = DatePicker;

const BookSearch = ({ onSearch }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const criteria = {
      isbn: values.isbn || undefined,
      title: values.title || undefined,
      author: values.author || undefined,
      typeName: values.typeName || undefined,
      stockFrom: values.stockFrom || undefined,
      stockTo: values.stockTo || undefined,
      publisher: values.publisher || undefined,
      publishedDateFrom: values.publishedDateRange?.[0]
        ? values.publishedDateRange[0].toISOString()
        : undefined,
      publishedDateTo: values.publishedDateRange?.[1]
        ? values.publishedDateRange[1].toISOString()
        : undefined,
      maxBorrowDaysFrom: values.maxBorrowDaysFrom || undefined,
      maxBorrowDaysTo: values.maxBorrowDaysTo || undefined,
      location: values.location || undefined,
    };
    onSearch(criteria);
  };

  const onReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="book-search"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="isbn" label="ISBN">
            <Input placeholder="Enter ISBN" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="title" label="Title">
            <Input placeholder="Enter title" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="author" label="Author">
            <Input placeholder="Enter author" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="typeName" label="Book Type">
            <Input placeholder="Enter book type" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Stock Range">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="stockFrom" noStyle>
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Min"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="stockTo" noStyle>
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Max"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="publisher" label="Publisher">
            <Input placeholder="Enter publisher" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="publishedDateRange" label="Published Date Range">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Max Borrow Days Range">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="maxBorrowDaysFrom" noStyle>
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="Min"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="maxBorrowDaysTo" noStyle>
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="Max"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="location" label="Location">
            <Input placeholder="Enter location" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} className="book-search-buttons">
          <Form.Item noStyle>
            <div className="label-placeholder" />{" "}
            {/* Thêm div giả để mô phỏng chiều cao label */}
            <div className="button-wrapper">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                Search
              </Button>
              <Button onClick={onReset}>Reset</Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

BookSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default BookSearch;
