import React from "react";

const EditableText = ({
  value = "",
  onChange,
  isAdminMode = false,
  type = "input",
  className = "",
  placeholder = "",
  style = {},
  ...props
}) => {
  if (!isAdminMode) {
    if (type === "textarea") {
      return (
        <span className={className} style={style}>
          {value.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < value.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }
    return <span className={className} style={style}>{value}</span>;
  }

  const baseStyles = "bg-[#1d1836] text-white border border-dashed border-[#915EFF] rounded px-2 py-1 focus:outline-none focus:border-solid focus:ring-1 focus:ring-[#915EFF] w-full transition-all duration-200";

  if (type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseStyles} ${className} resize-y min-h-[100px] mt-1`}
        placeholder={placeholder}
        style={style}
        {...props}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseStyles} ${className} mt-1`}
      placeholder={placeholder}
      style={style}
      {...props}
    />
  );
};

export default EditableText;
