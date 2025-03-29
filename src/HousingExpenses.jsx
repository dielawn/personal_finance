import React, { useState, useEffect } from 'react';
import './HousingExpenses.css'

const HousingExpenses = ({ setHousingExpenses, initialData }) => {
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
  
  // Add state to track whether form has been submitted
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Initialize from initialData if available
  useEffect(() => {
    console.log('Initializing HousingExpenses with:', initialData);
    
    if (!initialData) {
      console.log('No initialData available, using defaults');
      return;
    }
    
    try {
      // Set housing type
      if (initialData.housingType) {
        console.log(`Setting housing type to: ${initialData.housingType}`);
        setHousingType(initialData.housingType);
      }
      
      // Set housing details based on type
      if (initialData.housingDetails) {
        if (initialData.housingType === 'own') {
          // Set owner-specific details
          if (initialData.housingDetails.mortgageBalance !== undefined) {
            console.log(`Setting mortgage balance to: ${initialData.housingDetails.mortgageBalance}`);
            setMortgageBalance(initialData.housingDetails.mortgageBalance.toString());
          }
          
          if (initialData.housingDetails.homeValue !== undefined) {
            console.log(`Setting home value to: ${initialData.housingDetails.homeValue}`);
            setHomeValue(initialData.housingDetails.homeValue.toString());
          }
          
          if (initialData.housingDetails.interestRate !== undefined) {
            console.log(`Setting interest rate to: ${initialData.housingDetails.interestRate}`);
            setInterestRate(initialData.housingDetails.interestRate.toString());
          }
          
          if (initialData.housingDetails.monthlyPayment !== undefined) {
            console.log(`Setting monthly payment to: ${initialData.housingDetails.monthlyPayment}`);
            setMonthlyPayment(initialData.housingDetails.monthlyPayment.toString());
          }
        } else if (initialData.housingType === 'rent') {
          // Set renter-specific details
          if (initialData.housingDetails.monthlyRent !== undefined) {
            console.log(`Setting monthly rent to: ${initialData.housingDetails.monthlyRent}`);
            setMonthlyPayment(initialData.housingDetails.monthlyRent.toString());
          }
        }
      }
      
      // Set utility details
      if (initialData.utilities && initialData.utilities.items) {
        const items = initialData.utilities.items;
        
        // Set standard utility values
        if (items.electricity !== undefined) {
          console.log(`Setting electricity to: ${items.electricity}`);
          setElectricity(items.electricity.toString());
        }
        
        if (items.water !== undefined) {
          console.log(`Setting water to: ${items.water}`);
          setWater(items.water.toString());
        }
        
        if (items.gas !== undefined) {
          console.log(`Setting gas to: ${items.gas}`);
          setGas(items.gas.toString());
        }
        
        // Find other utilities (excluding standard ones)
        const otherUtils = Object.entries(items)
          .filter(([key]) => !['electricity', 'water', 'gas'].includes(key))
          .map(([name, amount]) => ({ name, amount: amount.toString() }));
        
        if (otherUtils.length > 0) {
          console.log('Setting other utilities:', otherUtils);
          setOtherUtilities(otherUtils);
        }
      }
      
      // Mark as submitted if we loaded initialData
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error initializing from initialData:', error);
    }
  }, [initialData]);
  
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
      electricity: electricity ? parseFloat(electricity) : 0,
      water: water ? parseFloat(water) : 0,
      gas: gas ? parseFloat(gas) : 0
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

  // Handle explicit form submission
  const handleSubmit = () => {
    console.log('Housing expenses form submitted');
    if (housingType) {
      const data = prepareDataObject();
      setHousingExpenses(data);
      setIsSubmitted(true);
      console.log('Parent component updated with data:', data);
    } else {
      alert('Please select whether you rent or own your home.');
    }
  };

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
                // Reset the isSubmitted flag when selection changes
                setIsSubmitted(false);
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
                // Reset the isSubmitted flag when selection changes
                setIsSubmitted(false);
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

    {housingType && (
      <div className="form-actions">
        <button 
          type="button" 
          className="submit-button"
          onClick={handleSubmit}
        >
          {isSubmitted ? "Update" : "Save"}
        </button>
      </div>
    )}
    </div>
  );
};

export default HousingExpenses;