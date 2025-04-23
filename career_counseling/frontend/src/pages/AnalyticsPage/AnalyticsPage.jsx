import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AnalyticsPage.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [filteredData, setFilteredData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetch("/data/Jobs_Data.json")
      .then((response) => response.json())
      .then((data) => setChartData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!chartData || !chartData.datasets) {
    return (
      <div className="loading-container">
        <p>Loading chart data...</p>
      </div>
    );
  }

  const fieldOptions = chartData.datasets.map((dataset) => ({
    value: dataset.label,
    label: dataset.label,
  }));

  const handleSelectChange = (selectedOptions) => {
    setSelectedFields(selectedOptions);
  };

  const handleProcessClick = () => {
    if (selectedFields.length === 0) {
      setFilteredData({ labels: [], datasets: [] });
      return;
    }

    const selectedLabels = selectedFields.map((field) => field.value);
    const filteredDatasets = chartData.datasets.filter((dataset) =>
      selectedLabels.includes(dataset.label)
    );

    setFilteredData({
      labels: chartData.labels,
      datasets: filteredDatasets,
    });
  };

  const handleShowTrendingFields = () => {
    const growthRates = chartData.datasets.map((dataset) => {
      const initial = dataset.data[0];
      const final = dataset.data[dataset.data.length - 1];
      const growthRate = ((final - initial) / initial) * 100;
      return { ...dataset, growthRate };
    });

    const topTrendingFields = growthRates
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 5);

    setFilteredData({
      labels: chartData.labels,
      datasets: topTrendingFields,
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Job Trends (2018 - 2024)",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Job Opportunities (in thousands)" },
      },
      x: {
        title: { display: true, text: "Years" },
      },
    },
    elements: {
      line: {
        borderWidth: 1.5,
        tension: 0,
      },
      point: {
        radius: 3,
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="analytics-wrapper">
      <div className="chart-container">
        <div className="dropdown-container">
          <Select
            options={fieldOptions}
            isMulti
            onChange={handleSelectChange}
            placeholder="Search and Select Fields..."
            isSearchable
            className="custom-select"
          />
        </div>

        <div className="button-group">
          <button className="process-btn" onClick={handleProcessClick}>
            Process
          </button>
          <button className="trending-btn" onClick={handleShowTrendingFields}>
            Show Trending Fields
          </button>
        </div>

        <div className="chart-box">
          <h2 className="chart-title">Job Trends Visualization</h2>
          <div className="chart-wrapper">
            <Line data={filteredData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
