import React, { useState } from 'react';
import axios from 'axios';

function MeritPredictor() {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState('2025');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);

    const res = await axios.post('http://localhost:5000/api/predict-merit', formData, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `predicted_merit_${year}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e => setFile(e.target.files[0])} required />
      <input type="text" value={year} onChange={e => setYear(e.target.value)} required />
      <button type="submit">Predict Merit</button>
    </form>
  );
}

export default MeritPredictor;
