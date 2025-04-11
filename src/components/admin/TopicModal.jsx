import React from "react";
import { Modal, Form, Input, Button } from "antd";
import PropTypes from "prop-types";
import "../../styles/topicModal.css";

const TopicModal = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onOk(values);
    form.resetFields();
  };

  return (
    <Modal
      className="topic-modal"
      title="Add Topic"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={400}
      getContainer={() => document.body}
      styles={{ body: { maxHeight: "50vh", overflowY: "auto" } }}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          name="topicName"
          label="Topic Name"
          rules={[{ required: true, message: "Please enter a topic name" }]}
        >
          <Input placeholder="Enter topic name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea
            placeholder="Enter topic description (optional)"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

TopicModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default TopicModal;
