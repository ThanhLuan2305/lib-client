import React from "react";
import { Form, Input, DatePicker, Button, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
import PropTypes from "prop-types";

const UserSearch = ({ onSearch }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const criteria = {
      email: values.email || undefined,
      phoneNumber: values.phoneNumber || undefined,
      birthDateFrom: values.birthDateRange?.[0]
        ? values.birthDateRange[0].toISOString()
        : undefined,
      birthDateTo: values.birthDateRange?.[1]
        ? values.birthDateRange[1].toISOString()
        : undefined,
    };
    onSearch(criteria);
  };

  const onReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="email" label="Email">
            <Input placeholder="Enter email" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="birthDateRange" label="Birth Date Range">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={6} style={{ display: "flex", alignItems: "center" }}>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

UserSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default UserSearch;
