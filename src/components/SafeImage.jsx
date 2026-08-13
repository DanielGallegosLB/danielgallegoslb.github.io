import { useState } from "react";
import PropTypes from "prop-types";
import { placeholder } from "../assets";

const SafeImage = ({
  src,
  alt = "",
  className = "",
  style,
  fallbackSrc = placeholder,
  ...props
}) => {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <img src={fallbackSrc} alt={alt} className={className} style={style} {...props} />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
};

SafeImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  fallbackSrc: PropTypes.string,
};

export default SafeImage;
