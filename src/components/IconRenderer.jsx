import React from "react";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const IconRenderer = ({ visible }) => {
  return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
};

IconRenderer.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default React.memo(IconRenderer);
