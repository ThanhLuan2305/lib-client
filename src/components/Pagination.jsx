import React from "react";
import { Pagination } from "antd";
import PropTypes from "prop-types";

const CustomPagination = ({
  currentPage,
  setPage,
  totalElements,
  pageSize,
}) => {
  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination
        current={currentPage}
        total={totalElements}
        pageSize={pageSize}
        onChange={(page) => setPage(page)}
      />
    </div>
  );
};

CustomPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalElements: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};

export default CustomPagination;
