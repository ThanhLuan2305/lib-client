import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Upload,
  Button,
  Image,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { uploadImage, updateImage } from "../../services/admin/Image";
import { useAuth } from "../../context/AuthContext";
import "../../styles/bookModal.css";

const BookModal = ({ open, onCancel, onOk, initialValues, isEdit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(
    initialValues?.coverImageUrl || ""
  );
  const [uploading, setUploading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        isbn: initialValues.isbn,
        title: initialValues.title,
        author: initialValues.author,
        typeId: initialValues.bookType?.id,
        stock: initialValues.stock,
        publisher: initialValues.publisher,
        publishedDate: initialValues.publishedDate
          ? dayjs(initialValues.publishedDate)
          : null,
        maxBorrowDays: initialValues.maxBorrowDays,
        location: initialValues.location,
        coverImageUrl: initialValues.coverImageUrl,
        deleted: initialValues.deleted,
      });
      setPreviewImage(initialValues.coverImageUrl || "");
      setFileList([]);
    } else {
      form.resetFields();
      setPreviewImage("");
      setFileList([]);
    }
  }, [initialValues, form]);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setPreviewImage(imageUrl);
      console.log("Test value upload image: ", imageUrl);
      form.setFieldsValue({ coverImageUrl: imageUrl });
      setFileList([
        { uid: file.uid, name: file.name, status: "done", url: imageUrl },
      ]);
      message.success("Image uploaded successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      message.error(
        `Failed to upload image: ${
          error.response?.data?.message || error.message
        }`
      );
      setFileList([{ uid: file.uid, name: file.name, status: "error" }]);
    } finally {
      setUploading(false);
    }
    return false; // Ngăn upload mặc định của Upload component
  };

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      publishedDate: values.publishedDate
        ? values.publishedDate.format("DD-MM-YYYY[T]HH:mm:ss.SSS[Z]")
        : null,
      coverImageUrl: previewImage,
      deleted: values.deleted, // Giữ nguyên kiểu boolean
    };

    console.log("Formatted Values:", formattedValues);

    if (
      isEdit &&
      initialValues.coverImageUrl &&
      values.coverImageUrl !== initialValues.coverImageUrl
    ) {
      const oldFileName = initialValues.coverImageUrl.split("/").pop();
      try {
        const newImageUrl = await updateImage(
          oldFileName,
          fileList[0]?.originFileObj
        );
        formattedValues.coverImageUrl = newImageUrl;
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
        }
        message.error(
          `Failed to update image: ${
            error.response?.data?.message || error.message
          }`
        );
        return;
      }
    }

    onOk(formattedValues);
  };

  const uploadProps = {
    beforeUpload: handleUpload,
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    onRemove: () => {
      setPreviewImage("");
      form.setFieldsValue({ coverImageUrl: "" });
    },
    maxCount: 1,
  };

  return (
    <Modal
      className="book-modal"
      title={isEdit ? "Edit Book" : "Add Book"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      getContainer={() => document.body}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }} // Sửa bodyStyle thành styles.body
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="isbn"
          label="ISBN"
          rules={[
            { required: true, message: "Please enter ISBN" },
            { len: 13, message: "ISBN must be 13 characters" },
          ]}
        >
          <Input placeholder="Enter ISBN" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please enter author" }]}
        >
          <Input placeholder="Enter author" />
        </Form.Item>
        <Form.Item
          name="typeId"
          label="Book Type ID"
          rules={[{ required: true, message: "Please enter book type ID" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter book type ID"
          />
        </Form.Item>
        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: "Please enter stock" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter stock"
          />
        </Form.Item>
        <Form.Item
          name="publisher"
          label="Publisher"
          rules={[{ required: true, message: "Please enter publisher" }]}
        >
          <Input placeholder="Enter publisher" />
        </Form.Item>
        <Form.Item
          name="publishedDate"
          label="Published Date"
          rules={[{ required: true, message: "Please select published date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="maxBorrowDays"
          label="Max Borrow Days"
          rules={[{ required: true, message: "Please enter max borrow days" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter max borrow days"
          />
        </Form.Item>
        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>
        <Form.Item
          name="coverImageUrl"
          label="Cover Image"
          rules={[{ required: true, message: "Please upload a cover image" }]}
        >
          <Upload {...uploadProps} accept="image/*">
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Image
            </Button>
          </Upload>
        </Form.Item>
        {previewImage && (
          <div className="book-modal-image-preview">
            <Image src={previewImage} alt="Cover Image Preview" width={200} />
          </div>
        )}
        <Form.Item name="deleted" label="Deleted" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

BookModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default BookModal;
