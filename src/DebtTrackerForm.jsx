import React, { useState } from 'react';
import './DebtTrackerForm.css';

const DebtTrackerForm = ({ setAcctBalanceData }) => {
  // State for a single debt entry form
  const [debtEntry, setDebtEntry] = useState({
    accountName: '',
    balance: 0,
    minimumPayment: 0,
    interestRate: 0
  });

  // State for storing all debt entries
  const [debtList, setDebtList] = useState([]);

  // Handle debt entry form changes
  const handleDebtEntryChange = (e) => {
    const { name, value } = e.target;
    let processedValue;
    
    // Process numeric values
    if (name === 'balance' || name === 'minimumPayment' || name === 'interestRate') {
      processedValue = parseFloat(value) || 0;
    } else {
      processedValue = value;
    }
    
    setDebtEntry(prevData => ({
      ...prevData,
      [name]: processedValue
    }));
    
    console.log(`Updated debt entry ${name} to ${processedValue}`);
  };

  // Add new debt to list
  const handleAddDebt = (e) => {
    e.preventDefault();
    
    // Validate the debt entry has an account name
    if (!debtEntry.accountName.trim()) {
      alert("Please enter an account name");
      return;
    }
    
    // Create a new debt object with a unique ID
    const newDebt = {
      ...debtEntry,
      id: Date.now()
    };
    
    // Add to debt list
    const updatedDebtList = [...debtList, newDebt];
    setDebtList(updatedDebtList);
    
    // Reset form for new entry
    setDebtEntry({
      accountName: '',
      balance: 0,
      minimumPayment: 0,
      interestRate: 0
    });
    
    console.log('Added new debt:', newDebt);
    console.log('Updated debt list:', updatedDebtList);
    
    // Update parent component state
    updateParentState(updatedDebtList);
  };

  // Remove debt from list
  const handleRemoveDebt = (id) => {
    const updatedList = debtList.filter(debt => debt.id !== id);
    setDebtList(updatedList);
    console.log('Removed debt with ID:', id);
    console.log('Updated debt list:', updatedList);
    
    // Update parent component state
    updateParentState(updatedList);
  };

  // Calculate total debt
  const calculateTotalDebt = (list = debtList) => {
    return list.reduce((total, debt) => total + debt.balance, 0);
  };

  // Calculate total minimum payment
  const calculateTotalMinPayment = (list = debtList) => {
    return list.reduce((total, debt) => total + debt.minimumPayment, 0);
  };

  // Update parent component state
  const updateParentState = (updatedDebtList = debtList) => {
    const totalDebt = calculateTotalDebt(updatedDebtList);
    const totalMinPayment = calculateTotalMinPayment(updatedDebtList);
    
    // Update parent state with debt information
    setAcctBalanceData(prevData => ({
      ...prevData,
      totalDebt,
      totalMinPayment,
      debtList: updatedDebtList,
      netWorth: (prevData?.totalAssets || 0) - totalDebt
    }));
    
    console.log('Updated parent state with new debt data');
  };

  // Handle submit button click
  const handleSubmit = (e) => {
    e.preventDefault();
    updateParentState();
    console.log('Form submitted');
  };

  return (
    <div className="debt-tracker-container">
      <h2>Debt Tracker</h2>
      
      {/* Add Debt Form */}
      <div className="add-debt-form">
        <h3>Add New Debt</h3>
        <form onSubmit={handleAddDebt}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="accountName">Account Name</label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={debtEntry.accountName}
                onChange={handleDebtEntryChange}
                placeholder="Credit Card, Student Loan, etc."
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="balance">Balance</label>
              <div className="input-prefix">
                <span>$</span>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  value={debtEntry.balance}
                  onChange={handleDebtEntryChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="minimumPayment">Minimum Payment</label>
              <div className="input-prefix">
                <span>$</span>
                <input
                  type="number"
                  id="minimumPayment"
                  name="minimumPayment"
                  value={debtEntry.minimumPayment}
                  onChange={handleDebtEntryChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate</label>
              <div className="input-prefix">
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={debtEntry.interestRate}
                  onChange={handleDebtEntryChange}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0.00"
                />
                <span>%</span>
              </div>
            </div>
          </div>
          
          <button type="submit" className="add-button">Add Debt</button>
        </form>
      </div>
      
      {/* Debt List */}
      <div className="debt-list-section">
        <h3>Your Debts</h3>
        
        {debtList.length === 0 ? (
          <p className="no-debts-message">No debts added yet. Use the form above to add your debts.</p>
        ) : (
          <>
            <div className="debt-list-header">
              <div className="debt-column">Account</div>
              <div className="debt-column">Balance</div>
              <div className="debt-column">Min. Payment</div>
              <div className="debt-column">Interest Rate</div>
              <div className="debt-column">Actions</div>
            </div>
            
            {debtList.map((debt) => (
              <div className="debt-item" key={debt.id}>
                <div className="debt-column">{debt.accountName}</div>
                <div className="debt-column">${debt.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="debt-column">${debt.minimumPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="debt-column">{debt.interestRate}%</div>
                <div className="debt-column">
                  <button 
                    className="remove-button" 
                    onClick={() => handleRemoveDebt(debt.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Summary Section */}
      {debtList.length > 0 && (
        <div className="debt-summary">
          <h3>Debt Summary</h3>
          <div className="summary-row">
            <span>Total Debt:</span>
            <span className="summary-value">${calculateTotalDebt().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="summary-row">
            <span>Total Minimum Monthly Payment:</span>
            <span className="summary-value">${calculateTotalMinPayment().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}
      
      <div className="form-actions">
      
      </div>
    </div>
  );
};

export default DebtTrackerForm;