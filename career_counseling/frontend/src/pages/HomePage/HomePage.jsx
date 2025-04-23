import React, { useState, useEffect, useRef } from "react";
import DropdownFields from "../../components/DropdownFields";
import universityLogos from "../../assets/logos.json";
import "./HomePage.css";

const HomePage = () => {
  const [selectedField, setSelectedField] = useState("");
  const [marks, setMarks] = useState({ matric: "", fsc: "", nts: "" });
  const [universityList, setUniversityList] = useState([]);
  const [alternateSuggestions, setAlternateSuggestions] = useState([]);
  const [calculatedMerit, setCalculatedMerit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const dropdownRef = useRef(null);
  useEffect(() => {
    const injectScript = (src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };
  
    injectScript("https://cdn.botpress.cloud/webchat/v2.3/inject.js");
    injectScript("https://files.bpcontent.cloud/2024/12/17/17/20241217175556-HADFQT9L.js");
  }, []);
  
  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (dropdown) {
      const handleOpen = () => setActiveFaq(1);
      dropdown.addEventListener("mousedown", handleOpen);
      return () => dropdown.removeEventListener("mousedown", handleOpen);
    }
  }, []);

  const handleMarksFocus = (fieldName) => {
    if (fieldName === "matric") setActiveFaq(2);
    else if (fieldName === "fsc") setActiveFaq(3);
    else if (fieldName === "nts") setActiveFaq(4);
  };

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    setMarks((prev) => ({ ...prev, [name]: value }));
    if (name === "matric" && value > 1100) {
      setFormErrors((prev) => ({
        ...prev,
        matric: "Matric marks cannot exceed 1100.",
      }));
    } else if (name === "fsc" && value > 1100) {
      setFormErrors((prev) => ({
        ...prev,
        fsc: "FSC marks cannot exceed 1100.",
      }));
    } else if (name === "nts" && value > 100) {
      setFormErrors((prev) => ({
        ...prev,
        nts: "NTS marks cannot exceed 100.",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setFormErrors((prev) => ({ ...prev, selectedField: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedField) errors.selectedField = "Select Field is required.";
    if (!marks.matric) errors.matric = "Matric marks are required.";
    else if (parseInt(marks.matric) > 1100)
      errors.matric = "Matric marks cannot exceed 1100.";
    if (!marks.fsc) errors.fsc = "FSC marks are required.";
    else if (parseInt(marks.fsc) > 1100)
      errors.fsc = "FSC marks cannot exceed 1100.";
    if (!marks.nts) errors.nts = "NTS marks are required.";
    else if (parseInt(marks.nts) > 100)
      errors.nts = "NTS marks cannot exceed 100.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateAggregate = () => {
    const matricWeight = 0.1;
    const fscWeight = 0.15;
    const ntsWeight = 0.75;

    const matricMarks = ((parseFloat(marks.matric) || 0) / 1100) * 100;
    const fscMarks = ((parseFloat(marks.fsc) || 0) / 1100) * 100;
    const ntsMarks = ((parseFloat(marks.nts) || 0) / 100) * 100;

    return (
      matricMarks * matricWeight +
      fscMarks * fscWeight +
      ntsMarks * ntsWeight
    ).toFixed(2);
  };

  const clearFields = () => {
    setSelectedField("");
    setMarks({ matric: "", fsc: "", nts: "" });
    setCalculatedMerit(null);
    setFormErrors({});
  };

  const fetchAndFilterUniversities = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("/data/Merit_Predictions.json");
      const data = await response.json();
      const studentAggregate = parseFloat(calculateAggregate());
      setCalculatedMerit(studentAggregate);

      const matched = data.filter(
        (item) =>
          item.Field_of_Study === selectedField &&
          studentAggregate >= item.Merit_2025
      );

      const alternate = data.filter(
        (item) =>
          item.Field_of_Study !== selectedField &&
          Math.abs(studentAggregate - item.Merit_2025) <= 5
      );

      setUniversityList(
        matched.sort((a, b) => b.Merit_2025 - a.Merit_2025).slice(0, 5)
      );
      setAlternateSuggestions(
        alternate
          .sort(
            (a, b) =>
              Math.abs(studentAggregate - a.Merit_2025) -
              Math.abs(studentAggregate - b.Merit_2025)
          )
          .slice(0, 5)
      );

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getLogo = (institutionName) => {
    const logoPath = universityLogos[institutionName];
    return logoPath ? logoPath : "/assets/logo/default_logo.png";
  };

  const toggleFaq = (id) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="homepage-container">
      <div className="main-content">
        <div className="left-section">
          <div className="input-form">
            <div ref={dropdownRef} title="Select any field of your interest">
              <DropdownFields
                onFieldSelect={handleFieldSelect}
                selectedField={selectedField}
              />
              {formErrors.selectedField && (
                <p className="error-msg">{formErrors.selectedField}</p>
              )}
            </div>
            <input
              type="number"
              name="matric"
              placeholder="Matric Marks"
              value={marks.matric}
              onFocus={() => handleMarksFocus("matric")}
              onChange={handleMarksChange}
              className="input-field"
              title="Enter matric marks out of 1100"
            />
            {formErrors.matric && (
              <p className="error-msg">{formErrors.matric}</p>
            )}

            <input
              type="number"
              name="fsc"
              placeholder="FSC/DAE Marks"
              value={marks.fsc}
              onFocus={() => handleMarksFocus("fsc")}
              onChange={handleMarksChange}
              className="input-field"
              title="Enter FSC marks out of 1100"
            />
            {formErrors.fsc && <p className="error-msg">{formErrors.fsc}</p>}

            <div className="nts-go-row">
              <input
                type="number"
                name="nts"
                placeholder="NTS/NET Marks"
                value={marks.nts}
                onFocus={() => handleMarksFocus("nts")}
                onChange={handleMarksChange}
                className="input-field"
                title="Enter NTS/NET marks in percentage (out of 100)"
              />
              <button
                className="go-button"
                onClick={fetchAndFilterUniversities}
              >
                GO
              </button>
              <button className="clear-button" onClick={clearFields}>
                Clear
              </button>
            </div>
            {formErrors.nts && <p className="error-msg">{formErrors.nts}</p>}

            {calculatedMerit !== null && (
              <div className="calculated-merit">
                <p>
                  Your Calculated Merit: <strong>{calculatedMerit}%</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          <div className="faq-section">
            <h2 className="faq-title">FAQ about Finding a University</h2>
            <div className="faq">
              {[1, 2, 3, 4].map((id) => (
                <details
                  key={id}
                  open={activeFaq === id}
                  onClick={() => toggleFaq(id)}
                >
                  <summary>
                    <span className="q-mark">Q.</span>{" "}
                    {id === 1
                      ? "What field I have to select?"
                      : id === 2
                      ? "Can I enter the expected Matric marks?"
                      : id === 3
                      ? "Can I enter expected FSC/FCS marks?"
                      : "What are NTS/NET marks?"}
                  </summary>
                  <p className="answer">
                    {id === 1 &&
                      "Select a field from a dropdown menu according to your interest in studies."}
                    {id === 2 &&
                      "Yes, you can enter your expected Matric marks if the result is not announced yet."}
                    {id === 3 &&
                      "You can enter your expected FSC/FCS marks if your result is not yet declared."}
                    {id === 4 &&
                      "NTS and NET are standardized entrance tests. Provide your score or expected marks here."}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>

            <h2>Recommended Universities</h2>

            {/* ✅ Show Merit on Top */}
            {calculatedMerit && (
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Your Calculated Merit: {calculatedMerit}%
              </p>
            )}

            {universityList.length > 0 ? (
              universityList.map((uni, index) => (
                <div key={index} className="university-item">
                  <img
                    src={getLogo(uni.Institution_Name)}
                    alt={`${uni.Institution_Name} Logo`}
                    className="university-logo"
                  />
                  <div className="university-info">
                    <h3>
                      {uni.Institution_Name} –{" "}
                      <span style={{ fontWeight: "normal" }}>
                        {uni.Field_of_Study}
                      </span>
                    </h3>
                    <p style={{ margin: "8px 0", color: "#333" }}>
                      <strong>Required Merit:</strong>{" "}
                      {parseFloat(uni.Merit_2025).toFixed(2)}%
                    </p>
                    <button
                      className="visit-btn"
                      onClick={() => window.open(uni.Admission_Link, "_blank")}
                    >
                      Visit University
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No matching universities found.</p>
            )}

            {/* Alternate Suggestions (unchanged) */}
            {alternateSuggestions.length > 0 && (
              <div className="alternate-fields">
                <h3>Explore Other Fields Based on Your Merit</h3>
                {alternateSuggestions.map((alt, index) => (
                  <div key={index} className="university-item">
                    <img
                      src={getLogo(alt.Institution_Name)}
                      alt={`${alt.Institution_Name} Logo`}
                      className="university-logo"
                    />
                    <div className="university-info">
                      <h4>
                        {alt.Institution_Name} – {alt.Field_of_Study}
                      </h4>
                      <p>Required Merit: {alt.Merit_2025}%</p>
                      <button
                        className="visit-btn"
                        onClick={() =>
                          window.open(alt.Admission_Link, "_blank")
                        }
                      >
                        Visit University
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
