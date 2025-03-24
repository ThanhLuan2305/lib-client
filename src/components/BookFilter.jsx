import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, Button, Row, Col, Dropdown, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "../styles/bookFilter.css";

const { Option } = Select;

const BookFilter = ({ setFilters }) => {
  const [filterValues, setFilterValues] = useState({
    title: [],
    author: [],
    typeName: [],
    publisher: [],
  });

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setFilters(filterValues);
  };

  const clearFilters = () => {
    setFilterValues({
      title: [],
      author: [],
      typeName: [],
      publisher: [],
    });
    setFilters({});
  };

  const filterMenu = (
    <div className="filter-dropdown">
      <Row gutter={[16, 16]}>
        {[
          {
            label: "Title",
            field: "title",
            options: [
              "Effective Java",
              "Clean Code",
              "Head First Design Patterns",
            ],
          },
          {
            label: "Author",
            field: "author",
            options: [
              "J.K. Rowling",
              "J.R.R. Tolkien",
              "Joshua Bloch",
              "Martin Kleppmann",
              "Robert C. Martin",
              "Eric Freeman",
              "Alex Petrov",
              "Thomas H. Cormen",
              "Yuval Noah Harari",
              "David McCullough",
              "Stephen Hawking",
              "Brian W. Kernighan",
              "Jared Diamond",
              "George Orwell",
              "Dennis M.RitChie",
            ],
          },
          {
            label: "Category",
            field: "typeName",
            options: [
              "Fantasy",
              "Database",
              "Fiction",
              "Non-Fiction",
              "History",
              "Science",
            ],
          },
          {
            label: "Publisher",
            field: "publisher",
            options: [
              "Bloomsbury",
              "Penguin",
              "Addison-Wesley",
              "O'Reilly Media",
              "Prentice Hall",
              "MIT Press",
              "Harper",
              "Simon & Schuster",
              "Bantam",
              "W.W. Norton & Company",
              "Signet Classic",
            ],
          },
        ].map(({ label, field, options }) => (
          <Col span={24} key={field}>
            <label>{label}</label>
            <Select
              placeholder={`Choose ${label.toLowerCase()}`}
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange(field, value)}
              value={filterValues[field]}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
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
        dropdownRender={() => filterMenu}
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