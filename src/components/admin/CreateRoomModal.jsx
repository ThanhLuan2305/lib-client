import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const CreateRoomModal = ({ visible, onCancel, onCreate, form }) => {
  return (
    <Modal
      title="Create New Room"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onCreate}>
        <Form.Item
          label="Room ID"
          name="roomId"
          rules={[{ required: true, message: "Please enter the room ID" }]}
        >
          <Input placeholder="Enter room ID" />
        </Form.Item>
        <Form.Item
          label="Room Name"
          name="roomName"
          rules={[{ required: true, message: "Please enter the room name" }]}
        >
          <Input placeholder="Enter room name" />
        </Form.Item>
        <Form.Item
          label="Room Type"
          name="roomType"
          rules={[{ required: true, message: "Please select the room type" }]}
        >
          <Select placeholder="Select room type">
            <Option value="PUBLIC">Public</Option>
            <Option value="PRIVATE">Private</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Create Room
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
