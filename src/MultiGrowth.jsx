import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MultiProjectGrowth.css';
import { formatCurrency } from './utils/utils';

// Simplified component that works with a basic data structure
const MultiProjectGrowth = ({ acctsArray }) => {
  const [accounts, setAccounts] = useState([]);
  const [projectionData, setProjectionData] = useState([]);
  const [yearsToProject, setYearsToProject] = useState(30);
  
  // Colors for the different account lines
  const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
  const colors = 
  // Initialize accounts from props
  useEffect(() => {
    // console.log('acctsArray received:', acctsArray);
    if (acctsArray && acctsArray.length > 0) {
      // Make a deep copy and ensure required properties
      const processedAccounts = acctsArray.map(acct => ({
        acctName: acct.acctName || acct.label || 'Account',
        initialBalance: Number(acct.initialBalance) || 0,
        annualContribution: Number(acct.annualContribution) || 0,
        years: Number(acct.years) || 30,
        growthRate: Number(acct.growthRate) || 7
      }));
      
      setAccounts(processedAccounts);
      
      // Set initial years to project based on accounts
      const maxYears = Math.max(...processedAccounts.map(a => a.years), 30);
      setYearsToProject(maxYears);
    }
  }, [acctsArray]);

  // Calculate projection whenever accounts or years change
  useEffect(() => {
    if (accounts.length > 0) {
      const data = generateProjectionData(accounts, yearsToProject);
      setProjectionData(data);
    }
  }, [accounts, yearsToProject]);
  
  // Handle growth rate change
  const handleGrowthRateChange = (index, newRate) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      growthRate: parseFloat(newRate) || 0
    };
    setAccounts(updatedAccounts);
  };
  
  // Handle years to project change
  const handleYearsChange = (newYears) => {
    setYearsToProject(parseInt(newYears) || 30);
  };
  
  // Generate projection data with a very simple structure
  const generateProjectionData = (accounts, years) => {
    const data = [];
    
    for (let year = 0; year <= years; year++) {
      const yearData = { year };
      
      accounts.forEach((account, index) => {
        // Calculate balance for this year
        let balance = account.initialBalance;
        let contributions = account.initialBalance;
        
        // Apply growth for each year
        for (let y = 1; y <= year; y++) {
          if (y <= account.years) {
            balance = balance * (1 + account.growthRate / 100);
            balance += account.annualContribution;
            contributions += account.annualContribution;
          }
        }
        
        // Use simple property names
        yearData[`balance${index}`] = Math.round(balance * 100) / 100;
        yearData[`contrib${index}`] = Math.round(contributions * 100) / 100;
      });
      
      data.push(yearData);
    }
    
    // console.log('Generated projection data:', data);
    return data;
  };
  
  return (
    <div className="project-growth-container">
      <div className="calculator-header">
        <h2>Multiple Account Growth Calculator</h2>
        

      </div>
      
      <div className="accounts-container">
        {accounts.map((account, index) => (
          <div key={`account-${index}`} className="account-controls" style={{ borderLeft: `4px solid ${lineColors[index % lineColors.length]}` }}>
            <h3>{account.acctName}</h3>
            
            <div className="multi-account-stats">
              <div className="multi-stat-item">
                <span>Initial: {formatCurrency(account.initialBalance)}</span>
              </div>
              <div className="multi-stat-item">
                <span>Annual: {formatCurrency(account.annualContribution)}</span>
              </div>
              <div className="multi-stat-item">
                <span>Years: {account.years}</span>
              </div>
              <div className="multi-stat-item highlight">
                <span>Final: {
                  projectionData.length > 0 ? 
                  formatCurrency(projectionData[Math.min(account.years, projectionData.length - 1)][`balance${index}`]) : 
                  '$0'
                }</span>
              </div>
            </div>

            <div className="input-group">
              <label>Annual Growth Rate: {account.growthRate}%</label>
              <input
                type="number"
                value={account.growthRate}
                min="0"
                max="15"
                step="0.1"
                onChange={(e) => handleGrowthRateChange(index, e.target.value)}
                className="rate-input"
              />
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={account.growthRate}
                onChange={(e) => handleGrowthRateChange(index, e.target.value)}
                className="slider"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="results">
      <div className="years-control">
          <label>
            Projection Years: {yearsToProject}
            <div className="slider-group">
              <input
                type="number"
                value={yearsToProject}
                min="5"
                max="50"
                step="1"
                onChange={(e) => handleYearsChange(e.target.value)}
                className="years-input"
              />
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={yearsToProject}
                onChange={(e) => handleYearsChange(e.target.value)}
                className="years-slider"
              />
            </div>
          </label>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
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
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
              <YAxis 
                label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  // Format based on value size
                  const formattedValue = formatCurrency(value);
                  
                  // Get account index and type
                  const type = name.startsWith('balance') ? 'Balance' : 'Contributions';
                  const index = parseInt(name.replace('balance', '').replace('contrib', ''));
                  
                  // Get account name
                  const accountName = accounts[index]?.acctName || `Account ${index+1}`;
                  
                  return [formattedValue, `${accountName} ${type}`];
                }}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend 
                formatter={(value, entry) => {
                  // Get type and index
                  const type = value.startsWith('balance') ? 'Balance' : 'Contributions';
                  const index = parseInt(value.replace('balance', '').replace('contrib', ''));
                  
                  // Get account name
                  const accountName = accounts[index]?.acctName || `Account ${index+1}`;
                  
                  return `${accountName} ${type}`;
                }}
              />
              
              {/* Only generate balance lines */}
              {accounts.map((account, index) => (
                <Line
                  key={`balance-line-${index}`}
                  type="monotone"
                  dataKey={`balance${index}`}
                  name={`balance${index}`}
                  stroke={lineColors[index % lineColors.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MultiProjectGrowth;