import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProjectGrowth.css';
import { formatCurrency } from './utils/utils';

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
      let totalContributions = initialBalance;
  
      // Add starting point
      data.push({
        year: 0,
        balance: balance,
        contributions: totalContributions
      });
  
      // Calculate balance for each year
      for (let year = 1; year <= years; year++) {
        // Apply annual growth
        balance = balance * (1 + growthRate / 100);
        
        // Add annual contribution
        balance += annualContribution;
        
        // Track total contributions
        totalContributions += annualContribution;
        
        // Round to 2 decimal places for display
        balance = Math.round(balance * 100) / 100;
        
        data.push({
          year: year,
          balance: balance,
          contributions: totalContributions
        });
        
        console.log(`Year ${year}: Balance $${balance.toLocaleString()}, Contributions $${totalContributions.toLocaleString()}`);
      }
  
      setProjectionData(data);
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
            <div className="slider-container flexColumn">
            <input
                type="number"
                value={growthRate}
                min="0"
                max="15"
                step="0.1"
                onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                className="rate-input"
              />
              
              <input
                id='agrInput'
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={growthRate}
                onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                className="slider"
              />
             
             
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
              <span>{projectionData.length > 0 ? formatCurrency(projectionData[projectionData.length - 1].contributions) : '$0'}</span>
            </div>
            <div className="stat-item">
              <span>Growth Amount:</span>
              <span>{projectionData.length > 0 ? 
                formatCurrency(projectionData[projectionData.length - 1].balance - projectionData[projectionData.length - 1].contributions) : 
                '$0'}</span>
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
                  tickFormatter={(tick) => {
                    if (tick >= 1000000) {
                      return `${(tick / 1000000).toFixed(1)}M`;
                    } else if (tick >= 1000) {
                      return `${(tick / 1000).toFixed(0)}k`;
                    } else {
                      return `${tick}`;
                    }
                  }}
                  label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} 
                />
                  <Tooltip 
                formatter={(value, name) => {
                  // Format the value
                  let formattedValue;
                  if (value >= 1000000) {
                    formattedValue = `${(value / 1000000).toFixed(2)}M`;
                  } else if (value >= 1000) {
                    formattedValue = `${(value / 1000).toFixed(2)}k`;
                  } else {
                    formattedValue = `${value.toFixed(2)}`;
                  }
                  
                  return [formattedValue, name === "Account Balance" ? "Total Balance" : "Total Contributions"];
                }}
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
                <Line
                  type="monotone"
                  dataKey="contributions"
                  name="Total Contributions"
                  stroke="#007755"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectGrowth;