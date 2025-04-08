import React from "react";
import { Modal, Form, Input, Button } from "antd";

const AddUserModal = ({ visible, onCancel, onAdd, form }) => {
  return (
    <Modal
      title="Add User to Room"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onAdd}>
        <Form.Item
          label="User ID"
          name="userId"
          rules={[{ required: true, message: "Please enter the user ID" }]}
        >
          <Input placeholder="Enter user ID" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Add User
        </Button>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
