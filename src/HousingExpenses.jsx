import React, { useState, useEffect } from 'react';
import './HousingExpenses.css'

const HousingExpenses = ({ setHousingExpenses }) => {
  // Main housing type state
  const [housingType, setHousingType] = useState('');
  
  // Owner-specific states
  const [mortgageBalance, setMortgageBalance] = useState('');
  const [homeValue, setHomeValue] = useState('');
  const [interestRate, setInterestRate] = useState('');
  
  // Common states
  const [monthlyPayment, setMonthlyPayment] = useState('');
  
  // Utility states
  const [electricity, setElectricity] = useState('');
  const [water, setWater] = useState('');
  const [gas, setGas] = useState('');
  const [otherUtilities, setOtherUtilities] = useState([{ name: '', amount: '' }]);
  
  // Function to handle adding another utility
  const handleAddUtility = () => {
    console.log('Adding new utility field');
    setOtherUtilities([...otherUtilities, { name: '', amount: '' }]);
  };
  
  // Function to handle utility name change
  const handleUtilityNameChange = (index, value) => {
    console.log(`Changing utility name at index ${index} to ${value}`);
    const updatedUtilities = [...otherUtilities];
    updatedUtilities[index].name = value;
    setOtherUtilities(updatedUtilities);
  };
  
  // Function to handle utility amount change
  const handleUtilityAmountChange = (index, value) => {
    console.log(`Changing utility amount at index ${index} to ${value}`);
    const updatedUtilities = [...otherUtilities];
    updatedUtilities[index].amount = value;
    setOtherUtilities(updatedUtilities);
  };
  
  // Function to calculate total utilities
  const calculateTotalUtilities = () => {
    console.log('Calculating total utilities');
    let total = 0;
    
    // Add standard utilities if they have values
    if (electricity) total += parseFloat(electricity);
    if (water) total += parseFloat(water);
    if (gas) total += parseFloat(gas);
    
    // Add other utilities
    otherUtilities.forEach(utility => {
      if (utility.amount) {
        total += parseFloat(utility.amount);
      }
    });
    
    return total.toFixed(2);
  };
  
  // Calculate total monthly housing cost
  const calculateTotalMonthly = () => {
    console.log('Calculating total monthly expenses');
    let total = 0;
    
    // Add monthly payment if it exists
    if (monthlyPayment) total += parseFloat(monthlyPayment);
    
    // Add utilities
    total += parseFloat(calculateTotalUtilities());
    
    return total.toFixed(2);
  };
  
  // Prepare data object to be sent to parent component
  const prepareDataObject = () => {
    const utilityItems = {
      electricity: electricity || 0,
      water: water || 0,
      gas: gas || 0
    };
    
    // Add other utilities to the object
    otherUtilities.forEach(utility => {
      if (utility.name && utility.amount) {
        utilityItems[utility.name] = parseFloat(utility.amount) || 0;
      }
    });
    
    const totalUtilities = parseFloat(calculateTotalUtilities());
    const totalMonthly = parseFloat(calculateTotalMonthly());
    
    return {
      housingType,
      housingDetails: housingType === 'own' ? {
        mortgageBalance: parseFloat(mortgageBalance) || 0,
        homeValue: parseFloat(homeValue) || 0,
        interestRate: parseFloat(interestRate) || 0,
        monthlyPayment: parseFloat(monthlyPayment) || 0
      } : {
        monthlyRent: parseFloat(monthlyPayment) || 0
      },
      utilities: {
        items: utilityItems,
        total: totalUtilities
      },
      totalMonthlyExpenses: totalMonthly
    };
  };
  
  // Effect to update parent component when relevant data changes
  useEffect(() => {
    if (housingType && setHousingExpenses) {
      console.log('Housing expenses data changed, notifying parent component');
      const data = prepareDataObject();
      setHousingExpenses(data);
    }
  }, [
    housingType, 
    mortgageBalance, 
    homeValue, 
    interestRate, 
    monthlyPayment, 
    electricity, 
    water, 
    gas, 
    otherUtilities
  ]);

  return (
    <div className="housing-expenses-container">
      <h2>Housing Expenses Calculator</h2>
      
      {/* Housing Type Selection */}
      <div className="housing-type-selection">
        <h3>Do you rent or own your home?</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="rent"
              checked={housingType === 'rent'}
              onChange={() => {
                console.log('Selected: Rent');
                setHousingType('rent');
              }}
            />
            Rent
          </label>
          <label>
            <input
              type="radio"
              value="own"
              checked={housingType === 'own'}
              onChange={() => {
                console.log('Selected: Own');
                setHousingType('own');
              }}
            />
            Own
          </label>
        </div>
      </div>
      
      {/* Conditional Fields based on Housing Type */}
      {housingType === 'own' && (
        <div className="owner-details">
          <h3>Homeowner Details</h3>
          
          <div className="form-group">
            <label>Mortgage Balance ($):</label>
            <input
              type="number"
              value={mortgageBalance}
              onChange={(e) => {
                console.log(`Mortgage balance changed to: ${e.target.value}`);
                setMortgageBalance(e.target.value);
              }}
              placeholder="Enter mortgage balance"
            />
          </div>
          
          <div className="form-group">
            <label>Estimated Home Value ($):</label>
            <input
              type="number"
              value={homeValue}
              onChange={(e) => {
                console.log(`Home value changed to: ${e.target.value}`);
                setHomeValue(e.target.value);
              }}
              placeholder="Enter estimated home value"
            />
          </div>
          
          <div className="form-group">
            <label>Interest Rate (%):</label>
            <input
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => {
                console.log(`Interest rate changed to: ${e.target.value}`);
                setInterestRate(e.target.value);
              }}
              placeholder="Enter interest rate"
            />
          </div>
        </div>
      )}
      
      {/* Monthly Payment (for both rent and mortgage) */}
      {housingType && (
        <div className="monthly-payment">
          <h3>Monthly {housingType === 'rent' ? 'Rent' : 'Mortgage'} Payment</h3>
          <div className="form-group">
            <label>Monthly Payment ($):</label>
            <input
              type="number"
              value={monthlyPayment}
              onChange={(e) => {
                console.log(`Monthly payment changed to: ${e.target.value}`);
                setMonthlyPayment(e.target.value);
              }}
              placeholder={`Enter monthly ${housingType === 'rent' ? 'rent' : 'mortgage'}`}
            />
          </div>
        </div>
      )}
      
      {/* Utilities Section */}
      {housingType && (
        <div className="utilities-section">
          <h3>Monthly Utilities</h3>
          
          <div className="form-group">
            <label>Electricity ($):</label>
            <input
              type="number"
              value={electricity}
              onChange={(e) => {
                console.log(`Electricity cost changed to: ${e.target.value}`);
                setElectricity(e.target.value);
              }}
              placeholder="Enter monthly electricity cost"
            />
          </div>
          
          <div className="form-group">
            <label>Water ($):</label>
            <input
              type="number"
              value={water}
              onChange={(e) => {
                console.log(`Water cost changed to: ${e.target.value}`);
                setWater(e.target.value);
              }}
              placeholder="Enter monthly water cost"
            />
          </div>
          
          <div className="form-group">
            <label>Natural Gas/Propane ($):</label>
            <input
              type="number"
              value={gas}
              onChange={(e) => {
                console.log(`Gas cost changed to: ${e.target.value}`);
                setGas(e.target.value);
              }}
              placeholder="Enter monthly gas cost"
            />
          </div>
          
          {/* Other Utilities - Dynamic Fields */}
          <div className="other-utilities">
            <h4>Other Utilities</h4>
            
            {otherUtilities.map((utility, index) => (
              <div className="utility-row" key={index}>
                <input
                  type="text"
                  value={utility.name}
                  onChange={(e) => handleUtilityNameChange(index, e.target.value)}
                  placeholder="Utility name"
                />
                <input
                  type="number"
                  value={utility.amount}
                  onChange={(e) => handleUtilityAmountChange(index, e.target.value)}
                  placeholder="Amount ($)"
                />
              </div>
            ))}
            
            <button type="button" onClick={handleAddUtility} className="add-utility-btn">
              Add Another Utility
            </button>
          </div>
        </div>
      )}
      
      {/* Summary Section */}
      {housingType && monthlyPayment && (
        <div className="summary-section">
          <h3>Monthly Summary</h3>
          <div className="summary-row">
            <span>Housing ({housingType === 'rent' ? 'Rent' : 'Mortgage'}):</span>
            <span>${monthlyPayment}</span>
          </div>
          <div className="summary-row">
            <span>Total Utilities:</span>
            <span>${calculateTotalUtilities()}</span>
          </div>
          <div className="summary-row total">
            <span>Total Monthly Housing Expenses:</span>
            <span>${calculateTotalMonthly()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HousingExpenses;