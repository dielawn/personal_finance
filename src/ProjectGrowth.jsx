import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProjectGrowth.css';

const ProjectGrowth = ({ acctName, initialBalance, annualContribution }) => {
  // Default values
  const [years, setYears] = useState(25);
  const [growthRate, setGrowthRate] = useState(7);
  const [projectionData, setProjectionData] = useState([]);

  // Calculate projection whenever inputs change
  useEffect(() => {
    calculateProjection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years, initialBalance, annualContribution, growthRate]);

  // Calculate compound growth projection
  const calculateProjection = () => {
    console.log('Calculating projection with:', {
      years,
      initialBalance,
      annualContribution,
      growthRate
    });

    const data = [];
    let balance = initialBalance;

    // Add starting point
    data.push({
      year: 0,
      balance: balance
    });

    // Calculate balance for each year
    for (let year = 1; year <= years; year++) {
      // Apply annual growth
      balance = balance * (1 + growthRate / 100);
      
      // Add annual contribution
      balance += annualContribution;
      
      // Round to 2 decimal places for display
      balance = Math.round(balance * 100) / 100;
      
      data.push({
        year: year,
        balance: balance
      });
      
      console.log(`Year ${year}: $${balance.toLocaleString()}`);
    }

    setProjectionData(data);
  };

  // Format currency for display
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="project-growth-container">
      <h2>{acctName} Growth Calculator</h2>
      
      <div className="input-controls">
        <div className="input-group">
          <label>Time Period (Years)</label>
          <input
            type="number"
            value={years}
            min="1"
            max="50"
            onChange={(e) => setYears(parseInt(e.target.value) || 1)}
          />
        </div>
        
       
       
        
        <div className="input-group">
          <label>Annual Growth Rate: {growthRate}%</label>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={growthRate}
              onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
              className="slider"
            />
            <input
              type="number"
              value={growthRate}
              min="0"
              max="15"
              step="0.1"
              onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
              className="rate-input"
            />
            <span className="percentage">%</span>
          </div>
        </div>
      </div>
      
      <div className="results">
        <div className="stats">
          <div className="stat-item">
            <span>Initial Investment:</span>
            <span>{formatCurrency(initialBalance)}</span>
          </div>
          <div className="stat-item">
            <span>Total Contributions:</span>
            <span>{formatCurrency(annualContribution * years)}</span>
          </div>
          <div className="stat-item highlight">
            <span>Final Balance:</span>
            <span>{projectionData.length > 0 ? formatCurrency(projectionData[projectionData.length - 1].balance) : '$0'}</span>
          </div>
        </div>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={projectionData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} 
              />
              <YAxis 
                tickFormatter={(tick) => `$${(tick / 1000).toFixed(0)}k`}
                label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                name="Account Balance"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProjectGrowth;