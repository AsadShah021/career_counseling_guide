import React, { useState, useEffect } from "react";
import DropdownFields from "../../components/DropdownFields";
import "./HomePage.css";

const HomePage = () => {
    const [selectedField, setSelectedField] = useState("");
    const [marks, setMarks] = useState({ matric: "", fsc: "", nts: "" });
    const [universityList, setUniversityList] = useState([]);
    const [calculatedMerit, setCalculatedMerit] = useState(null);

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
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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

                {/* University List */}
                <div className="university-list">
                    {universityList.length > 0 ? (
                        universityList.map((uni, index) => (
                            <button key={index} className="university-btn" onClick={() => window.open(uni.Admission_Link, "_blank")}>
                                {uni.Institution_Name} - {uni.Field_of_Study} <span>▶</span>
                            </button>
                        ))
                    ) : (
                        <p className="no-results">No matching universities found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
