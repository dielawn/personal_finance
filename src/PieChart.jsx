import React, { useState, useEffect } from 'react';
import './PieChart.css';
import { formatCurrency, formatPercent } from './utils/utils';

const PieChart = ({ title, income, color, expenses }) => {
  const [pieData, setPieData] = useState([]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingIncome = income - totalExpenses;
  useEffect(() => {
    // Combine remaining income with expenses for the pie chart
    const newPieData = [
      { label: 'Remaining Income', amount: remainingIncome, color },
      ...expenses
    ].filter(item => item.amount > 0); // Filter out zero or negative values
    
    // Calculate total for percentage calculations
    const total = newPieData.reduce((sum, item) => sum + item.amount, 0);
    
    // Add percentage and angle calculations
    let cumulativeAngle = 0;
    const processedData = newPieData.map(item => {
      const percentage = (item.amount / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      const endAngle = cumulativeAngle;
      
      return {
        ...item,
        percentage,
        startAngle,
        endAngle
      };
    });
    
    setPieData(processedData);
    
    // console.log('Income:', income);
    // console.log('Total Expenses:', totalExpenses);
    // console.log('Remaining Income:', remainingIncome);
    // console.log('Pie Data:', processedData);
  }, [income, expenses]);
  
  // Convert polar coordinates to cartesian
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Create SVG arc path
  const createArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };
  
  // Calculate position for labels
  const getLabelPosition = (centerX, centerY, radius, angle) => {
    const angleInRadians = (angle - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * 0.7 * Math.cos(angleInRadians)),
      y: centerY + (radius * 0.7 * Math.sin(angleInRadians))
    };
  };
  
  // SVG dimensions for the pie chart
  const svgWidth = 400;
  const svgHeight = 400;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = Math.min(centerX, centerY) - 40;
  
  return (
    <div className="pie-chart-container">
      <h2>{title} Breakdown</h2>
      <div className="chart-layout">
        <div className="pie-chart">
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="pie-chart-svg"
          >
            {/* Render pie slices */}
            {pieData.map((item, index) => {
              const path = createArc(centerX, centerY, radius, item.startAngle, item.endAngle);
              return (
                <path 
                  key={`slice-${index}`}
                  d={path}
                  fill={item.color || `hsl(${index * 60}, 70%, 60%)`}
                  className="pie-slice"
                />
              );
            })}
            
            {/* Render labels */}
            {pieData.map((item, index) => {
              const midAngle = (item.startAngle + item.endAngle) / 2;
              const labelPos = getLabelPosition(centerX, centerY, radius, midAngle);
              return (
                <g key={`label-${index}`} className="pie-label">
                 
                  <text 
                    x={labelPos.x} 
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {formatPercent(item.percentage)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Separate legend on the right */}
        <div className="legend-container">
          <h3>Expense Breakdown</h3>
          {pieData.map((item, index) => (
            <div key={`legend-item-${index}`} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 60%)` }}
              ></div>
              <div className="legend-text">
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">{formatCurrency(item.amount)} ({formatPercent(item.percentage)})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="summary">
        <p>Income: <span className="amount">{formatCurrency(income)}</span></p>
        <p>Total Expenses: <span className="amount">{formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</span></p>
        <p>Remaining Income: <span className="amount">{formatCurrency(remainingIncome)}</span></p>
          <p>{remainingIncome < 0? 
          `❌ Over spending in this category. Need ${formatCurrency(totalExpenses - income)} from another category.` 
          : 
          `✅ Within budget. ${formatCurrency(remainingIncome)} remaining.`}
          </p>
      </div>
    
    </div>
  );
};

export default PieChart;