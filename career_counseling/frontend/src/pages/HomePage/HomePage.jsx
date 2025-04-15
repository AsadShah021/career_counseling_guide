import React, { useState, useEffect, useRef } from "react";
import DropdownFields from "../../components/DropdownFields";
import universityLogos from "../../assets/logos.json";
import "./HomePage.css";

const HomePage = () => {
  const [selectedField, setSelectedField] = useState("");
  const [marks, setMarks] = useState({ matric: "", fsc: "", nts: "" });
  const [universityList, setUniversityList] = useState([]);
  const [calculatedMerit, setCalculatedMerit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const dropdownRef = useRef(null);

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
      setFormErrors((prev) => ({ ...prev, matric: "Matric marks cannot exceed 1100." }));
    } else if (name === "fsc" && value > 1100) {
      setFormErrors((prev) => ({ ...prev, fsc: "FSC marks cannot exceed 1100." }));
    } else if (name === "nts" && value > 100) {
      setFormErrors((prev) => ({ ...prev, nts: "NTS marks cannot exceed 100." }));
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
    else if (parseInt(marks.matric) > 1100) errors.matric = "Matric marks cannot exceed 1100.";
    if (!marks.fsc) errors.fsc = "FSC marks are required.";
    else if (parseInt(marks.fsc) > 1100) errors.fsc = "FSC marks cannot exceed 1100.";
    if (!marks.nts) errors.nts = "NTS marks are required.";
    else if (parseInt(marks.nts) > 100) errors.nts = "NTS marks cannot exceed 100.";
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
      const studentAggregate = calculateAggregate();
      setCalculatedMerit(studentAggregate);

      const matchedUniversities = data
        .filter(
          (item) =>
            item.Field_of_Study === selectedField &&
            studentAggregate >= item.Merit_2025
        )
        .sort((a, b) => b.Merit_2025 - a.Merit_2025)
        .slice(0, 5);

      setUniversityList(matchedUniversities);
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
              <DropdownFields onFieldSelect={handleFieldSelect} />
              {formErrors.selectedField && <p className="error-msg">{formErrors.selectedField}</p>}
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
            {formErrors.matric && <p className="error-msg">{formErrors.matric}</p>}

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
              <button className="go-button" onClick={fetchAndFilterUniversities}>
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
              <details open={activeFaq === 1} onClick={() => toggleFaq(1)}>
                <summary><span className="q-mark">Q.</span> What field I have to select?</summary>
                <p className="answer">
                  Select a field from a dropdown menu according to your interest in studies.
                </p>
              </details>

              <details open={activeFaq === 2} onClick={() => toggleFaq(2)}>
                <summary><span className="q-mark">Q.</span> Can I enter the expected Matric marks?</summary>
                <p className="answer">
                  Yes, you can enter your expected Matric marks if the result is not announced yet.
                </p>
              </details>

              <details open={activeFaq === 3} onClick={() => toggleFaq(3)}>
                <summary><span className="q-mark">Q.</span> Can I enter expected FSC/FCS marks?</summary>
                <p className="answer">
                  You can enter your expected FSC/FCS marks if your result is not yet declared.
                </p>
              </details>

              <details open={activeFaq === 4} onClick={() => toggleFaq(4)}>
                <summary><span className="q-mark">Q.</span> What are NTS/NET marks?</summary>
                <p className="answer">
                  NTS and NET are standardized entrance tests. Provide your score or expected marks here.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>✖</button>
            <h2>Recommended Universities</h2>
            {universityList.length > 0 ? (
              universityList.map((uni, index) => (
                <div key={index} className="university-item">
                  <img
                    src={getLogo(uni.Institution_Name)}
                    alt={`${uni.Institution_Name} Logo`}
                    className="university-logo"
                  />
                  <div className="university-info">
                    <h3>{uni.Institution_Name}</h3>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
