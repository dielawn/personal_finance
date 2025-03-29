import React, { useState, useEffect } from 'react';
import './PostTaxSavings.css';

const PostTaxSavings = ({ setPostTaxContributions, paycheck = 0, acctBalanceData, initialData }) => {
  // Default account types if no acctBalanceData is provided
  const defaultAccountTypes = [
    { id: 'savingsAcct', name: 'Savings Account', amount: 0, percentage: 0, enabled: false, isPercentage: false },
    { id: 'iraAcct', name: 'IRA', amount: 0, percentage: 0, enabled: false, isPercentage: false }
  ];

  // Initialize accounts from acctBalanceData if available
  const initializeAccounts = () => {
    console.log('acctBalanceData received:', acctBalanceData);
    
    if (!acctBalanceData) {
      console.log('No acctBalanceData available, using defaults');
      return defaultAccountTypes;
    }
    
    // Define pre-tax accounts to filter out
    const preTaxAccountIds = ['_401kBalance', 'hsaBalance', 'checkingAcct'];
    
    // Try to use accountsList if available
    if (acctBalanceData.accountsList && acctBalanceData.accountsList.length > 0) {
      console.log('Initializing accounts from accountsList:', acctBalanceData.accountsList);
      
      // Filter out pre-tax accounts
      return acctBalanceData.accountsList
        .filter(account => !preTaxAccountIds.includes(account.id))
        .map(account => ({
          id: account.id,
          name: account.label,
          amount: 0,
          percentage: 0,
          enabled: false,
          isPercentage: false
        }));
    }
    
    // Fallback: try to build accountsList from properties
    console.log('No accountsList found, trying to build from properties');
    const accountKeys = Object.keys(acctBalanceData)
      .filter(key => 
        key !== 'totalAssets' && 
        key !== 'accountsList' &&
        !preTaxAccountIds.includes(key)
      );
    
    if (accountKeys.length > 0) {
      console.log('Building accounts from properties:', accountKeys);
      
      return accountKeys.map(key => {
        // Generate a display name from the key
        const displayName = key
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/_/g, ' ')         // Replace underscores with spaces
          .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
          .trim();
          
        return {
          id: key,
          name: displayName,
          amount: 0,
          percentage: 0,
          enabled: false,
          isPercentage: false
        };
      });
    }
    
    console.log('No account properties found, using defaults');
    return defaultAccountTypes;
  };

  // State for accounts and total contributions
  const [accounts, setAccounts] = useState(() => initializeAccounts());
  const [totalContributions, setTotalContributions] = useState(0);
  const [payAmount, setPayAmount] = useState(paycheck.netPay || 0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update accounts if acctBalanceData changes
  useEffect(() => {
    console.log('acctBalanceData changed, reinitializing accounts');
    const newAccounts = initializeAccounts();
    console.log('New accounts after reinitialization:', newAccounts);
    setAccounts(newAccounts);
  }, [acctBalanceData]);

  // Initialize from initialData if available
  useEffect(() => {
    console.log('Initializing PostTaxSavings with:', initialData);
    
    if (!initialData) {
      console.log('No initialData available, using defaults');
      return;
    }
    
    try {
      // Set pay amount if provided
      if (payAmount === 0 && paycheck > 0) {
        console.log(`Setting payAmount to paycheck value: ${paycheck}`);
        setPayAmount(paycheck);
      }
      
      // Apply saved account settings
      if (initialData.accounts && Array.isArray(initialData.accounts)) {
        console.log('Initializing accounts from initialData:', initialData.accounts);
        
        const updatedAccounts = [...accounts];
        let hasUpdates = false;
        
        // Update each account from saved data
        initialData.accounts.forEach(savedAccount => {
          const accountIndex = updatedAccounts.findIndex(acc => acc.id === savedAccount.id);
          
          if (accountIndex >= 0) {
            console.log(`Updating account ${savedAccount.id} with saved settings`);
            
            updatedAccounts[accountIndex] = {
              ...updatedAccounts[accountIndex],
              enabled: true,
              isPercentage: savedAccount.isPercentage || false,
              amount: savedAccount.isPercentage ? 0 : (savedAccount.amount || 0),
              percentage: savedAccount.isPercentage ? (savedAccount.percentage || 0) : 0
            };
            
            hasUpdates = true;
          } else {
            console.log(`Account ${savedAccount.id} not found in current accounts list`);
            // Could add missing accounts here if needed
          }
        });
        
        if (hasUpdates) {
          console.log('Setting updated accounts:', updatedAccounts);
          setAccounts(updatedAccounts);
          setIsInitialized(true);
        }
      }
      
    } catch (error) {
      console.error('Error initializing from initialData:', error);
    }
  }, [initialData, accounts, paycheck, payAmount]);

  // Calculate actual contribution amount for an account
  const calculateContribution = (account) => {
    if (!account.enabled) return 0;
    if (account.isPercentage) {
      return (payAmount * account.percentage) / 100;
    }
    return account.amount;
  };

  // Calculate total and update parent component whenever accounts or paycheck amount changes
  useEffect(() => {
    let total = 0;
    
    // Calculate total contributions
    accounts.forEach(account => {
      total += calculateContribution(account);
    });
    
    setTotalContributions(total);
    
    // Only update parent component if initialization is complete
    if (isInitialized) {
      // Create data object for parent component
      const contributionsData = {
        accounts: accounts.filter(account => account.enabled).map(account => {
          const actualAmount = calculateContribution(account);
          return {
            ...account,
            calculatedAmount: actualAmount
          };
        }),
        total_contributions: total
      };
      
      console.log('Post-tax contributions updated:', contributionsData);
      setPostTaxContributions(contributionsData);
    }
  }, [accounts, payAmount, setPostTaxContributions, isInitialized]);

  // Handle account toggle
  const handleToggleAccount = (id) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, enabled: !account.enabled } : account
    ));
    console.log(`Toggled account ${id}`);
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };

  // Handle amount change
  const handleAmountChange = (id, value) => {
    // Ensure amount is a number and not negative
    const sanitizedValue = Math.max(0, Number(value) || 0);
    
    setAccounts(accounts.map(account => {
      if (account.id !== id) return account;
      
      if (account.isPercentage) {
        // Limit percentage to 100
        const cappedValue = Math.min(100, sanitizedValue);
        console.log(`Updated account ${id} percentage to ${cappedValue}`);
        return { ...account, percentage: cappedValue };
      } else {
        console.log(`Updated account ${id} amount to ${sanitizedValue}`);
        return { ...account, amount: sanitizedValue };
      }
    }));
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };
  
  // Handle contribution type toggle (dollar or percentage)
  const handleContributionTypeChange = (id) => {
    setAccounts(accounts.map(account => {
      if (account.id !== id) return account;
      
      const newIsPercentage = !account.isPercentage;
      console.log(`Changed account ${id} contribution type to ${newIsPercentage ? 'percentage' : 'dollar amount'}`);
      return { 
        ...account, 
        isPercentage: newIsPercentage 
      };
    }));
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };
  
  // Handle paycheck amount change
  const handlePayAmountChange = (amount) => {
    const sanitizedAmount = Math.max(0, Number(amount) || 0);
    setPayAmount(sanitizedAmount);
    console.log('Paycheck amount updated:', sanitizedAmount);
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };

  const handleSubmit = () => {
    console.log('Post-tax savings form submitted');
    
    // Create data object for parent component
    const contributionsData = {
      accounts: accounts.filter(account => account.enabled).map(account => {
        const actualAmount = calculateContribution(account);
        return {
          ...account,
          calculatedAmount: actualAmount
        };
      }),
      total_contributions: totalContributions
    };
    
    console.log('Post-tax contributions submitted:', contributionsData);
    setPostTaxContributions(contributionsData);
  };
  

  return (
    <div className="post-tax-savings">
      <h2>Post-Tax Contributions</h2>
      
      <div className="paycheck-input">
        <label>
          Paycheck Amount:
          <div className="input-with-prefix">
            <span className="currency-prefix">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={payAmount}
              onChange={(e) => handlePayAmountChange(e.target.value)}
            />
          </div>
        </label>
      </div>
      
      <div className="accounts-container">
        {accounts.map((account) => {
          const contributionAmount = calculateContribution(account);
          
          return (
            <div key={account.id} className={`account-item ${account.enabled ? 'enabled' : 'disabled'}`}>
              <div className="account-header">
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    checked={account.enabled}
                    onChange={() => handleToggleAccount(account.id)}
                  />
                  <span className="toggle-checkmark"></span>
                  <span className="account-name">{account.name}</span>
                </label>
              </div>
              
              {account.enabled && (
                <div className="contribution-settings">
                  <div className="contribution-type">
                    <label className="radio-container">
                      <input
                        type="radio"
                        checked={!account.isPercentage}
                        onChange={() => handleContributionTypeChange(account.id)}
                      />
                      <span className="radio-label">Dollar Amount</span>
                    </label>
                    <label className="radio-container">
                      <input
                        type="radio"
                        checked={account.isPercentage}
                        onChange={() => handleContributionTypeChange(account.id)}
                      />
                      <span className="radio-label">Percentage</span>
                    </label>
                  </div>
                  
                  <div className="amount-input">
                    <label>
                      {account.isPercentage ? 'Percentage of paycheck:' : 'Amount per pay period:'}
                      <div className="input-with-prefix">
                        <span className="currency-prefix">{account.isPercentage ? '%' : '$'}</span>
                        <input
                          type="number"
                          min="0"
                          step={account.isPercentage ? "0.1" : "0.01"}
                          max={account.isPercentage ? "100" : ""}
                          value={account.isPercentage ? account.percentage : account.amount}
                          onChange={(e) => handleAmountChange(account.id, e.target.value)}
                        />
                      </div>
                    </label>
                    
                    {account.isPercentage && payAmount > 0 && (
                      <div className="calculated-amount">
                        Calculated amount: ${contributionAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="total-section">
        <div className="total-label">Total Post-Tax Contributions:</div>
        <div className="total-amount">${totalContributions.toFixed(2)}</div>
        <div className="remaining-amount">
          Remaining from paycheck: ${Math.max(0, payAmount - totalContributions).toFixed(2)}
        </div>
      </div>
      <div className="form-actions">
        <button 
            type="button" 
            className="submit-button"
            onClick={handleSubmit}
        >
            {isInitialized ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default PostTaxSavings;