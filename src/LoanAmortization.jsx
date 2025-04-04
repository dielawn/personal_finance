import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './LoanAmortization.css';
import { formatCurrency } from './utils/utils';

const LoanAmortization = ({ interestRate, minimumPayment, balance }) => {
  const [amortizationData, setAmortizationData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [pieData, setPieData] = useState([]);
  
  const COLORS = ['#0088FE', '#FF8042'];

  // Calculate amortization schedule when inputs change
  useEffect(() => {
    calculateAmortizationSchedule(interestRate, minimumPayment, balance);
  }, [interestRate, minimumPayment, balance]);
  
  // Update pie chart when selected year changes
  useEffect(() => {
    if (amortizationData.length > 0) {
      updatePieChart(selectedYear);
    }
  }, [selectedYear, amortizationData]);
  
  const calculateAmortizationSchedule = (rate, payment, initialBalance) => {
    console.log('Calculating amortization schedule with:', {
      rate,
      payment,
      initialBalance
    });
    
    const monthlyRate = rate / 100 / 12;
    let remainingBalance = initialBalance;
    let currentYear = 1;
    let yearlyData = {
      year: currentYear,
      beginningBalance: remainingBalance,
      yearlyInterest: 0,
      yearlyPrincipal: 0,
      endingBalance: 0
    };
    
    const yearlyResults = [];
    let month = 1;
    
    // Continue calculations until balance is paid off
    while (remainingBalance > 0) {
      // Calculate interest for this month
      const monthlyInterest = remainingBalance * monthlyRate;
      
      // Calculate principal for this month
      let monthlyPrincipal = payment - monthlyInterest;
      
      // If payment is more than remaining balance, adjust principal
      if (monthlyPrincipal > remainingBalance) {
        monthlyPrincipal = remainingBalance;
      }
      
      // Update remaining balance
      remainingBalance -= monthlyPrincipal;
      
      // Update yearly totals
      yearlyData.yearlyInterest += monthlyInterest;
      yearlyData.yearlyPrincipal += monthlyPrincipal;
      
      // If reached end of year or loan is paid off, add year to results
      if (month % 12 === 0 || remainingBalance <= 0) {
        yearlyData.endingBalance = remainingBalance;
        yearlyResults.push({ ...yearlyData });
        
        // Set up next year's data
        currentYear++;
        yearlyData = {
          year: currentYear,
          beginningBalance: remainingBalance,
          yearlyInterest: 0,
          yearlyPrincipal: 0,
          endingBalance: 0
        };
      }
      
      month++;
      
      // Break if we've run for too many months (safety check)
      if (month > 360) {  // 30 years max
        console.log('Loan calculation exceeded 30 years');
        break;
      }
    }
    
    console.log('Generated yearly results:', yearlyResults);
    setAmortizationData(yearlyResults);
    
    // Set first year as default selected
    if (yearlyResults.length > 0) {
      setSelectedYear(1);
    }
  };
  
  const updatePieChart = (year) => {
    const yearData = amortizationData.find(data => data.year === year);
    
    if (yearData) {
      const newPieData = [
        { name: 'Principal', value: yearData.yearlyPrincipal },
        { name: 'Interest', value: yearData.yearlyInterest }
      ];
      
      console.log('Updating pie chart with data:', newPieData);
      setPieData(newPieData);
    }
  };
  

  const handleYearClick = (year) => {
    console.log('Year clicked:', year);
    setSelectedYear(year);
  };
  
  return (
    <div className="loan-container">
      <h2 className="loan-title">Loan Amortization Schedule</h2>
      
      <div className="chart-container">
        <div className="chart-wrapper">
          <h3 className="chart-title">Year {selectedYear} Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="table-container">
        <table className="loan-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Beginning Balance</th>
              <th>Interest Paid</th>
              <th>Principal Paid</th>
              <th>Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            {amortizationData.map((yearData) => (
              <tr 
                key={yearData.year} 
                className={selectedYear === yearData.year ? 'selected-row' : ''}
                onClick={() => handleYearClick(yearData.year)}
              >
                <td>{yearData.year}</td>
                <td>{formatCurrency(yearData.beginningBalance)}</td>
                <td>{formatCurrency(yearData.yearlyInterest)}</td>
                <td>{formatCurrency(yearData.yearlyPrincipal)}</td>
                <td>{formatCurrency(yearData.endingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanAmortization;