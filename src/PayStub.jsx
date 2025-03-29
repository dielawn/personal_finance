import React, { useState, useEffect } from 'react';
import './PayStub.css';
import { formatCurrency } from './utils';

const PayStub = ({ id, label = "Pay Stub", setPayStubData }) => {
// Local state for form data
const [formData, setFormData] = useState({
  // Pay Interval
  payInterval: 'bi-weekly',
  
  // Earnings
  regularHours: 0,
  regularRate: 0,
  overtimeHours: 0,
  overtimeRate: 0,
  
  // Deductions
  federalTax: 0,
  stateTax: 0,
  socialSecurity: 0,
  medicare: 0,
  retirement401k: 0,
  match401k: 0,
  healthInsurance: 0,
  dentalInsurance: 0,
  visionInsurance: 0,
  hsa: 0,
  otherDeductions: 0,
});

const [calculations, setCalculations] = useState({
  regularPay: 0,
  overtimePay: 0,
  grossPay: 0,
  totalDeductions: 0,
  netPay: 0
});

// Calculate values when form data changes
useEffect(() => {
  console.log('Calculating pay values...');
  
  const regularPay = formData.regularHours * formData.regularRate;
  const overtimePay = formData.overtimeHours * formData.overtimeRate;
  const grossPay = regularPay + overtimePay;
  
  const totalDeductions = 
    Number(formData.federalTax) + 
    Number(formData.stateTax) + 
    Number(formData.socialSecurity) + 
    Number(formData.medicare) + 
    Number(formData.retirement401k) + 
    Number(formData.healthInsurance) + 
    Number(formData.dentalInsurance) + 
    Number(formData.visionInsurance) + 
    Number(formData.hsa) + 
    Number(formData.otherDeductions);
  
  const netPay = grossPay - totalDeductions;
  
  const newCalculations = {
    regularPay,
    overtimePay,
    grossPay,
    totalDeductions,
    netPay
  };
  
  setCalculations(newCalculations);
  
  // Update the parent component with both form data and calculations
  if (setPayStubData) {
    setPayStubData(prevData => {
      // Initialize as empty array if it's null
      const currentData = Array.isArray(prevData) ? [...prevData] : [];
      
      // Find if this pay stub already exists in the array
      const existingIndex = currentData.findIndex(item => item.id === id);
      
      // Create the updated pay stub object
      const updatedPayStub = {
        id,
        label,
        ...formData,
        ...newCalculations
      };
      
      // Either update existing or add new
      if (existingIndex >= 0) {
        currentData[existingIndex] = updatedPayStub;
      } else {
        currentData.push(updatedPayStub);
      }
      
      return currentData;
    });
  }
  
  console.log('Updated calculations:', newCalculations);
}, [formData, setPayStubData, id, label]);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  console.log(`Updating ${name} to ${value}`);
  
  // Convert numbers to float for calculation fields
  const numericFields = [
    'regularHours', 'regularRate', 'overtimeHours', 'overtimeRate',
    'federalTax', 'stateTax', 'socialSecurity', 'medicare',
    'retirement401k', 'match401k', 'healthInsurance', 'dentalInsurance', 
    'visionInsurance', 'hsa', 'otherDeductions'
  ];
  
  const newValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
  
  setFormData({
    ...formData,
    [name]: newValue
  });
};

// Get pay interval text for display
const getPayIntervalText = (interval) => {
  switch(interval) {
    case 'weekly':
      return 'Weekly';
    case 'bi-weekly':
      return 'Bi-Weekly';
    case 'monthly':
      return 'Monthly';
    default:
      return 'Pay';
  }
};

const handleSubmit = () => {
  console.log('Pay stub form submitted');
  
  // Update the parent component with both form data and calculations
  if (setPayStubData) {
    setPayStubData(prevData => {
      // Initialize as empty array if it's null
      const currentData = Array.isArray(prevData) ? [...prevData] : [];
      
      // Find if this pay stub already exists in the array
      const existingIndex = currentData.findIndex(item => item.id === id);
      
      // Create the updated pay stub object
      const updatedPayStub = {
        id,
        label,
        ...formData,
        ...calculations
      };
      
      // Either update existing or add new
      if (existingIndex >= 0) {
        currentData[existingIndex] = updatedPayStub;
      } else {
        currentData.push(updatedPayStub);
      }
      
      return currentData;
    });
  }
};

return (
  <div className="paystub-container">
    {/* Paycheck Section */}
    <div className="paycheck">
      <div className="paycheck-header">
        <div className="check-title">{label} - {getPayIntervalText(formData.payInterval)}</div>
      </div>
      
      <div className="paycheck-body">
        <div className="amount">
          <div className="amount-box">
            <span className="dollar-sign">$</span>
            <span className="amount-value">{calculations.netPay.toFixed(2)}</span>
          </div>
          <div className="amount-text">
            {calculations.netPay.toFixed(2)} DOLLARS
          </div>
        </div>
      </div>
    </div>
    
    {/* Pay Stub Section */}
    <div className="paystub">
      <div className="paystub-header">
        <div className="paystub-title">PAY STUB</div>
        <div className="pay-interval-selector">
          <select 
            name="payInterval"
            value={formData.payInterval}
            onChange={handleInputChange}
            className="interval-select"
          >
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      
      <div className="earnings-deductions">
        <div className="earnings">
          <h3>Earnings</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Hours</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Regular Pay</td>
                <td>
                  <input
                    type="number"
                    name="regularHours"
                    value={formData.regularHours}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="regularRate"
                    value={formData.regularRate}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
                <td>{formatCurrency(calculations.regularPay)}</td>
              </tr>
              <tr>
                <td>Overtime Pay</td>
                <td>
                  <input
                    type="number"
                    name="overtimeHours"
                    value={formData.overtimeHours}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="overtimeRate"
                    value={formData.overtimeRate}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
                <td>{formatCurrency(calculations.overtimePay)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan="3">Gross Pay</td>
                <td>{formatCurrency(calculations.grossPay)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="deductions">
          <h3>Deductions</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Federal Tax</td>
                <td>
                  <input
                    type="number"
                    name="federalTax"
                    value={formData.federalTax}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>State Tax</td>
                <td>
                  <input
                    type="number"
                    name="stateTax"
                    value={formData.stateTax}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>Social Security</td>
                <td>
                  <input
                    type="number"
                    name="socialSecurity"
                    value={formData.socialSecurity}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>Medicare</td>
                <td>
                  <input
                    type="number"
                    name="medicare"
                    value={formData.medicare}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>401(k)</td>
                <td>
                  <input
                    type="number"
                    name="retirement401k"
                    value={formData.retirement401k}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>Employer 401(k) Match</td>
                <td>
                  <input
                    type="number"
                    name="match401k"
                    value={formData.match401k}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>Health Insurance</td>
                <td>
                  <input
                    type="number"
                    name="healthInsurance"
                    value={formData.healthInsurance}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>Dental Insurance</td>
                <td>
                  <input
                    type="number"
                    name="dentalInsurance"
                    value={formData.dentalInsurance}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>Vision Insurance</td>
                <td>
                  <input
                    type="number"
                    name="visionInsurance"
                    value={formData.visionInsurance}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>HSA</td>
                <td>
                  <input
                    type="number"
                    name="hsa"
                    value={formData.hsa}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>Other</td>
                <td>
                  <input
                    type="number"
                    name="otherDeductions"
                    value={formData.otherDeductions}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </td>
              </tr>
              <tr className="total-row">
                <td>Total Deductions</td>
                <td>{formatCurrency(calculations.totalDeductions)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="paystub-summary">
        <div className="summary-item">
          <div>Gross Pay ({getPayIntervalText(formData.payInterval)}):</div>
          <div>{formatCurrency(calculations.grossPay)}</div>
        </div>
        <div className="summary-item">
          <div>Total Deductions:</div>
          <div>{formatCurrency(calculations.totalDeductions)}</div>
        </div>
        <div className="summary-item net-pay">
          <div>Net Pay ({getPayIntervalText(formData.payInterval)}):</div>
          <div>{formatCurrency(calculations.netPay)}</div>
        </div>
      </div>
    </div>
    <div className="paystub-actions">
      <button 
        type="button" 
        className="save-button"
        onClick={handleSubmit}
      >
        Save
      </button>
    </div>
  </div>
);
};

export default PayStub;