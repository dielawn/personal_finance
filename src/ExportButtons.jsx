// src/ExportButtons.jsx
import React from 'react';
import { exportToCSV, exportToExcel } from './utils/exportUtils';

const ExportButtons = ({ data }) => {
  // Define styling for the export buttons container
  const exportButtonsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '20px 0'
  };

  // Define styling for the individual buttons
  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  // Define specific styles for each button type
  const csvButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none'
  };

  const excelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none'
  };

  // Handle CSV export
  const handleCSVExport = () => {
    console.log('Exporting to CSV');
    exportToCSV(data, 'personal_finance_summary.csv');
  };

  // Handle Excel export
  const handleExcelExport = () => {
    console.log('Exporting to Excel');
    exportToExcel(data, 'personal_finance_summary.xlsx');
  };

  return (
    <div style={exportButtonsStyle}>
      <button 
        onClick={handleCSVExport} 
        style={csvButtonStyle}
        title="Export to CSV (compatible with most spreadsheet applications)"
      >
        <span>📄</span> Export to CSV
      </button>
      <button 
        onClick={handleExcelExport} 
        style={excelButtonStyle}
        title="Export to Excel (includes multiple sheets with detailed data)"
      >
        <span>📊</span> Export to Excel
      </button>
    </div>
  );
};

export default ExportButtons;