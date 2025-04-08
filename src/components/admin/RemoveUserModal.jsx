import React from "react";
import { Modal, Form, Input, Button } from "antd";

const RemoveUserModal = ({ visible, onCancel, onRemove, form }) => {
  return (
    <Modal
      title="Remove User from Room"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onRemove}>
        <Form.Item
          label="User ID"
          name="userId"
          rules={[{ required: true, message: "Please enter the user ID" }]}
        >
          <Input placeholder="Enter user ID" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Remove User
        </Button>
      </Form>
    </Modal>
  );
};

export default RemoveUserModal;
