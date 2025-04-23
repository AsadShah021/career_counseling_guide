import React, { useState, useEffect } from "react";
import "./DropdownFields.css";

const DropdownFields = ({ onFieldSelect, selectedField }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetch("/data/Merit_Predictions.json")
      .then((response) => response.json())
      .then((data) => {
        const uniqueFields = [...new Set(data.map((item) => item.Field_of_Study))];
        setFields(uniqueFields);
      })
      .catch((error) => console.error("Error loading JSON data:", error));
  }, []);

  const handleChange = (e) => {
    onFieldSelect(e.target.value); // send updated value to parent
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="fieldsDropdown" className="dropdown-label">Select a Field of Study:</label>
      <select
        id="fieldsDropdown"
        className="dropdown-select"
        value={selectedField}
        onChange={handleChange}
      >
        <option value="">--Select a Field--</option>
        {fields.map((field, index) => (
          <option key={index} value={field}>
            {field}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFields;
