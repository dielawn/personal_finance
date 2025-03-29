import React, { useState, useEffect } from 'react';
import './AccountBalanceForm.css';

const AccountBalanceForm = ({ setAcctBalanceData, initialData }) => {
  // Default account types
  const defaultAccountTypes = [
    { id: 'checkingAcct', label: 'Checking Account', value: 0, active: true },
    { id: 'savingsAcct', label: 'Savings Account', value: 0, active: true },
    { id: 'personalInvestmentAcct', label: 'Personal Investment Account', value: 0, active: false },
    { id: 'iraBalance', label: 'IRA Account', value: 0, active: false },
    { id: 'hsaBalance', label: 'HSA Account', value: 0, active: false },
    { id: '_401kBalance', label: '401(k) Account', value: 0, active: false },
    { id: 'otherBalance', label: 'Other Investments', value: 0, active: false }
  ];

  // Initialize from initialData if available
  const initializeAccounts = () => {
    console.log('Initializing AccountBalanceForm with:', initialData);
    
    if (!initialData) {
      console.log('No initialData available, using defaults');
      return defaultAccountTypes;
    }

    try {
      if (initialData.accountsList && initialData.accountsList.length > 0) {
        // Convert accountsList to our accounts format
        console.log('Using accountsList from initialData:', initialData.accountsList);
        
        // Create a map of all default accounts for easy lookup
        const defaultAccountsMap = defaultAccountTypes.reduce((acc, account) => {
          acc[account.id] = { ...account };
          return acc;
        }, {});
        
        // Custom accounts from initialData (those not in default accounts)
        const customAccounts = [];
        
        // Update values for existing accounts and find custom accounts
        initialData.accountsList.forEach(account => {
          if (defaultAccountsMap[account.id]) {
            defaultAccountsMap[account.id].value = account.value;
            defaultAccountsMap[account.id].active = true;
          } else {
            customAccounts.push({
              id: account.id,
              label: account.label,
              value: account.value,
              active: true,
              custom: true
            });
          }
        });
        
        // Combine default and custom accounts
        return [...Object.values(defaultAccountsMap), ...customAccounts];
      }
      
      // Fallback: try to use individual properties
      console.log('No accountsList found, checking individual properties');
      
      return defaultAccountTypes.map(account => {
        // If the account ID exists in initialData, use its value
        if (initialData[account.id] !== undefined) {
          return { 
            ...account, 
            value: initialData[account.id],
            active: true 
          };
        }
        return account;
      });
    } catch (error) {
      console.error('Error initializing accounts from initialData:', error);
      return defaultAccountTypes;
    }
  };

  // State for managing accounts
  const [accounts, setAccounts] = useState(() => initializeAccounts());
  const [newAccountName, setNewAccountName] = useState('');

  // Re-initialize accounts when initialData changes
  useEffect(() => {
    console.log('initialData changed, re-initializing accounts');
    setAccounts(initializeAccounts());
  }, [initialData]);

  // Handle input changes
  const handleAccountChange = (id, value) => {
    const parsedValue = parseFloat(value) || 0;
    
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === id 
          ? { ...account, value: parsedValue } 
          : account
      )
    );
    
    console.log(`Updated ${id} to ${parsedValue}`);
  };

  // Toggle account visibility
  const toggleAccount = (id) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === id 
          ? { ...account, active: !account.active } 
          : account
      )
    );
    
    console.log(`Toggled ${id} visibility`);
  };

  // Add new custom account
  const addNewAccount = () => {
    if (!newAccountName.trim()) {
      console.log('Cannot add account with empty name');
      return;
    }
    
    const id = `custom_${Date.now()}`;
    const newAccount = {
      id,
      label: newAccountName,
      value: 0,
      active: true,
      custom: true
    };
    
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    setNewAccountName('');
    console.log(`Added new account: ${newAccountName} with id ${id}`);
  };

  // Remove custom account
  const removeAccount = (id) => {
    setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
    console.log(`Removed account with id ${id}`);
  };

  // Calculate total balance (only from active accounts)
  const totalBalance = accounts
    .filter(account => account.active)
    .reduce((sum, account) => sum + account.value, 0);

  // Update parent component state
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get active accounts
    const activeAccounts = accounts.filter(account => account.active);
    
    // Create base data object
    const updatedData = {
      totalAssets: totalBalance,
      // Include the full list of active accounts with their details
      accountsList: activeAccounts.map(({ id, label, value }) => ({
        id,
        label,
        value
      }))
    };
    
    // Also add individual account values as top-level properties for backwards compatibility
    activeAccounts.forEach(account => {
      updatedData[account.id] = account.value;
    });
    
    console.log('Form submitted with data:', updatedData);
    setAcctBalanceData(updatedData);
  };

  // Reset form to default values
  const handleReset = () => {
    setAccounts(defaultAccountTypes);
    setNewAccountName('');
    console.log('Form reset to default values');
  };

  return (
    <div className="account-balance-container">
      <h2>Account Balance Information</h2>
      
      <div className="account-selector">
        <h3>Select Accounts to Include</h3>
        <div className="account-checkboxes">
          {accounts.map(account => (
            <div key={account.id} className="account-toggle">
              <input
                type="checkbox"
                id={`toggle-${account.id}`}
                checked={account.active}
                onChange={() => toggleAccount(account.id)}
              />
              <label htmlFor={`toggle-${account.id}`}>{account.label}</label>
              {account.custom && (
                <button 
                  type="button" 
                  className="remove-account-btn" 
                  onClick={() => removeAccount(account.id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="add-account-section">
        <input
          type="text"
          placeholder="Enter new account name"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
        />
        <button 
          type="button" 
          className="add-account-btn"
          onClick={addNewAccount}
        >
          Add Account
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Account Balances</h3>
          
          {accounts
            .filter(account => account.active)
            .map(account => (
              <div className="form-row" key={account.id}>
                <div className="form-group">
                  <label htmlFor={account.id}>{account.label}</label>
                  <div className="input-prefix">
                    <span>$</span>
                    <input
                      type="number"
                      id={account.id}
                      value={account.value}
                      onChange={(e) => handleAccountChange(account.id, e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        <div className="total-section">
          <h3>Total Balance</h3>
          <p className="total-amount">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save
          </button>
          <button 
            type="button" 
            className="reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountBalanceForm;