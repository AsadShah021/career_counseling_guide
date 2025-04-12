import React, { useState, useEffect } from "react";
import DropdownFields from "../../components/DropdownFields";
import universityLogos from "../../assets/logos.json"; // JSON file
import "./HomePage.css";

const HomePage = () => {
    const [selectedField, setSelectedField] = useState("");
    const [marks, setMarks] = useState({ matric: "", fsc: "", nts: "" });
    const [universityList, setUniversityList] = useState([]);
    const [calculatedMerit, setCalculatedMerit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle input changes
    const handleMarksChange = (e) => {
        setMarks({ ...marks, [e.target.name]: e.target.value });
    };

    // Function to calculate student merit correctly (out of 100%)
    const calculateAggregate = () => {
        const matricWeight = 0.10;
        const fscWeight = 0.15;
        const ntsWeight = 0.75;

        // Normalize marks (assuming 1100 for Matric & FSC, 100 for NTS)
        const matricMarks = (parseFloat(marks.matric) || 0) / 1100 * 100;
        const fscMarks = (parseFloat(marks.fsc) || 0) / 1100 * 100;
        const ntsMarks = (parseFloat(marks.nts) || 0) / 100 * 100;

        // Calculate weighted aggregate
        return (
            (matricMarks * matricWeight) +
            (fscMarks * fscWeight) +
            (ntsMarks * ntsWeight)
        ).toFixed(2); // Round to 2 decimal places
    };

    // Fetch universities data and filter results
    const fetchAndFilterUniversities = async () => {
        try {
            const response = await fetch("/data/Merit_Predictions.json");
            const data = await response.json();
            const studentAggregate = calculateAggregate();
            setCalculatedMerit(studentAggregate); // Store calculated merit

            // Filter universities based on selected field and aggregate score
            const matchedUniversities = data
                .filter(
                    (item) =>
                        item.Field_of_Study === selectedField &&
                        studentAggregate >= item.Merit_2025
                )
                .sort((a, b) => b.Merit_2025 - a.Merit_2025) // Sort by highest merit
                .slice(0, 5); // Take top 5 universities

            setUniversityList(matchedUniversities);
            setIsModalOpen(true); // Open modal after results
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Function to fetch the logo path from JSON
    const getLogo = (institutionName) => {
        const logoPath = universityLogos[institutionName];
        return logoPath ? logoPath : "/assets/logo/default_logo.png"; // Fallback logo
    };

    return (
        <div className="homepage-container">
            {/* Input Fields Section */}
            <div className="left-section">
                <div className="input-row">
                    <DropdownFields onFieldSelect={setSelectedField} />
                    <input type="number" name="matric" placeholder="Matric Marks" value={marks.matric} onChange={handleMarksChange} className="input-field" />
                    <input type="number" name="fsc" placeholder="FSC/DAE Marks" value={marks.fsc} onChange={handleMarksChange} className="input-field" />

                    {/* GO Button next to NTS/NET Marks Field */}
                    <div className="nts-go-container">
                        <input type="number" name="nts" placeholder="NTS/NET Marks" value={marks.nts} onChange={handleMarksChange} className="input-field" />
                        <button className="go-button" onClick={fetchAndFilterUniversities}>GO</button>
                    </div>
                </div>

                {/* Display Calculated Merit */}
                {calculatedMerit !== null && (
                    <div className="calculated-merit">
                        <p>Your Calculated Merit: <strong>{calculatedMerit}%</strong></p>
                    </div>
                )}
            </div>

            {/* University Results Modal */}
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
                                        <p>{uni.Field_of_Study}</p>
                                        <button className="visit-btn" onClick={() => window.open(uni.Admission_Link, "_blank")}>
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
