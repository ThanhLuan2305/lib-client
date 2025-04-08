import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Switch,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import "../styles/userModal.css";

const { Option } = Select;

const UserModal = ({ open, onCancel, onOk, initialValues, isEdit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          email: initialValues.email,
          phoneNumber: initialValues.phoneNumber,
          password: initialValues.password,
          fullName: initialValues.fullName,
          birthDate: initialValues.birthDate
            ? dayjs(initialValues.birthDate)
            : null,
          verificationStatus: initialValues.verificationStatus,
          listRole: initialValues.roles
            ? initialValues.roles.map((role) => role.name)
            : [],
          deleted: initialValues.deleted,
          resetPassword: initialValues.resetPassword,
          lateReturnCount: initialValues.lateReturnCount,
        });
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, form, open]);

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      birthDate: values.birthDate
        ? values.birthDate.format("DD-MM-YYYY[T]17:00:00.000[Z]")
        : null,
      listRole: values.listRole,
    };
    onOk(formattedValues);
  };

  return (
    <Modal
      className="user-modal"
      title={isEdit ? "Edit User" : "Add User"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input placeholder="Enter email" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter phone number" },
            { len: 10, message: "Phone number must be 10 digits" },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={
            isEdit
              ? []
              : [
                  { required: true, message: "Please enter password" },
                  {
                    pattern:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must be at least 8 characters, include a letter, a number, and a special character",
                  },
                ]
          }
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>
        <Form.Item
          name="birthDate"
          label="Birth Date"
          rules={[{ required: true, message: "Please select birth date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="verificationStatus"
          label="Verification Status"
          rules={[
            { required: true, message: "Please select verification status" },
          ]}
        >
          <Select placeholder="Select verification status">
            <Option value="UNVERIFIED">Unverified</Option>
            <Option value="EMAIL_VERIFIED">Email verified</Option>
            <Option value="PHONE_VERIFIED">Phone verified</Option>
            <Option value="FULLY_VERIFIED">Fully verified</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="listRole"
          label="Roles"
          rules={[{ required: true, message: "Please select roles" }]}
        >
          <Select mode="multiple" placeholder="Select roles">
            <Option value="USER">User</Option>
          </Select>
        </Form.Item>
        <div className="user-modal-switches">
          <Form.Item name="deleted" label="Deleted" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="resetPassword"
            label="Reset Password"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
        <Form.Item name="lateReturnCount" label="Late Return Count">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default UserModal;
