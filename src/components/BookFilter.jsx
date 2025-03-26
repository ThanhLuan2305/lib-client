import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, Button, Row, Col, Dropdown, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "../styles/bookFilter.css";

const BookFilter = ({ setFilters }) => {
  const [filterValues, setFilterValues] = useState({
    title: "",
    author: "",
    typeName: "",
    publisher: "",
  });

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filterValues).filter(([_, value]) => value.trim() !== "")
    );
    setFilters(activeFilters);
  };

  const clearFilters = () => {
    setFilterValues({
      title: "",
      author: "",
      typeName: "",
      publisher: "",
    });
    setFilters({});
  };

  // Định nghĩa filterMenu như hàm helper
  const renderFilterMenu = ({
    filterValues,
    handleFilterChange,
    applyFilters,
    clearFilters,
  }) => (
    <div className="filter-dropdown">
      <Row gutter={[16, 16]}>
        {[
          { label: "Title", field: "title" },
          { label: "Author", field: "author" },
          { label: "Category", field: "typeName" },
          { label: "Publisher", field: "publisher" },
        ].map(({ label, field }) => (
          <Col span={24} key={field}>
            <label>{label}</label>
            <Input
              placeholder={`Search by ${label.toLowerCase()}`}
              value={filterValues[field]}
              onChange={(e) => handleFilterChange(field, e.target.value)}
              allowClear
            />
          </Col>
        ))}
      </Row>

      <div className="filter-buttons">
        <Button onClick={clearFilters}>Clear filter</Button>
        <Button type="primary" onClick={applyFilters}>
          Submit
        </Button>
      </div>
    </div>
  );

  return (
    <div className="book-filter-container mb-2">
      <Dropdown
        trigger={["click"]}
        dropdownRender={() =>
          renderFilterMenu({
            filterValues,
            handleFilterChange,
            applyFilters,
            clearFilters,
          })
        }
        placement="bottomRight"
      >
        <Button type="primary">
          <Space>
            <FilterOutlined />
            Filter
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

BookFilter.propTypes = {
  setFilters: PropTypes.func.isRequired,
};

export default BookFilter;
