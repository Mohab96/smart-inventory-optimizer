/* eslint-disable */

import React from "react";

export default function InputForms({
  id,
  name,
  type = "text",
  label,
  placeholder,
  required = false,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col w-full items-center">
      <label
        htmlFor={id}
        className=" flex w-full xl:w-3/4 text-sm font-medium leading-6 text-orange-500"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="block w-full xl:w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}
