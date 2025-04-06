import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PostTaxSavings.css';
import { formatCurrency } from './utils/utils';

const PostTaxSavings = ({ setPostTaxContributions, paycheck = 0, acctBalanceData, initialData }) => {
  // Default account types if no acctBalanceData is provided
  const defaultAccountTypes = [
    { id: 'savingsAcct', name: 'Savings Account', amount: 0, percentage: 0, enabled: false, isPercentage: false },
    { id: 'iraAcct', name: 'IRA', amount: 0, percentage: 0, enabled: false, isPercentage: false }
  ];

  // Use refs to prevent unnecessary re-renders
  const acctBalanceDataRef = useRef(acctBalanceData);
  const initialDataRef = useRef(initialData);
  const isComponentMounted = useRef(false);
  
  // Track if we're in the middle of initialization to prevent cascading updates
  const [isInitializing, setIsInitializing] = useState(true);
  
  // State for accounts and total contributions
  const [accounts, setAccounts] = useState(() => []);
  const [totalContributions, setTotalContributions] = useState(0);
  const [payAmount, setPayAmount] = useState(paycheck.netPay || 0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize accounts from acctBalanceData if available - use memoized callback
  const initializeAccounts = useCallback(() => {
    console.log('Initializing accounts');
    
    if (!acctBalanceDataRef.current) {
      console.log('No acctBalanceData available, using defaults');
      return defaultAccountTypes;
    }
    
    // Define pre-tax accounts to filter out
    const preTaxAccountIds = ['_401kBalance', 'hsaBalance', 'checkingAcct'];
    
    // Try to use accountsList if available
    if (acctBalanceDataRef.current.accountsList && acctBalanceDataRef.current.accountsList.length > 0) {
      console.log('Initializing accounts from accountsList');
      
      // Filter out pre-tax accounts
      return acctBalanceDataRef.current.accountsList
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
    const accountKeys = Object.keys(acctBalanceDataRef.current)
      .filter(key => 
        key !== 'totalAssets' && 
        key !== 'accountsList' &&
        !preTaxAccountIds.includes(key)
      );
    
    if (accountKeys.length > 0) {
      console.log('Building accounts from properties');
      
      return accountKeys.map(key => {
        // Generate a display name from the key
        const displayName = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/^./, (str) => str.toUpperCase())
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
  }, [defaultAccountTypes]);

  // Calculate actual contribution amount for an account
  const calculateContribution = useCallback((account) => {
    if (!account.enabled) return 0;
    if (account.isPercentage) {
      return (payAmount * account.percentage) / 100;
    }
    return account.amount;
  }, [payAmount]);

  // Handle changes to acctBalanceData through props
  // This effect should NOT run on first render - we handle that separately
  useEffect(() => {
    // Skip if not mounted yet
    if (!isComponentMounted.current) {
      isComponentMounted.current = true;
      acctBalanceDataRef.current = acctBalanceData;
      return;
    }
    
    // Use JSON stringification to compare actual contents
    const oldDataStr = JSON.stringify(acctBalanceDataRef.current);
    const newDataStr = JSON.stringify(acctBalanceData);
    
    // Only update if the data has actually changed in content
    if (oldDataStr !== newDataStr) {
      console.log('acctBalanceData changed, reinitializing accounts');
      acctBalanceDataRef.current = acctBalanceData;
      
      // Don't do any state updates during render - schedule for later
      const timer = setTimeout(() => {
        const newAccounts = initializeAccounts();
        setAccounts(newAccounts);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [acctBalanceData, initializeAccounts]);

  // Initialize component once on first render - with empty dependency array to run only once
  useEffect(() => {
    console.log('Component mounted, initializing');
    setIsInitializing(true);
    
    // Initialize accounts
    const initialAccounts = initializeAccounts();
    
    // Set pay amount if provided
    let initialPayAmount = paycheck > 0 ? paycheck : 0;
    
    // Apply saved account settings if available
    let finalAccounts = initialAccounts;
    if (initialData && initialData.accounts && Array.isArray(initialData.accounts)) {
      console.log('Initializing accounts from initialData');
      
      // Update each account from saved data
      finalAccounts = initialAccounts.map(account => {
        // Find if there's saved data for this account
        const savedAccount = initialData.accounts.find(acc => acc.id === account.id);
        
        if (savedAccount) {
          console.log(`Updating account ${account.id} with saved settings`);
          return {
            ...account,
            enabled: true,
            isPercentage: savedAccount.isPercentage || false,
            amount: savedAccount.isPercentage ? 0 : (savedAccount.amount || 0),
            percentage: savedAccount.isPercentage ? (savedAccount.percentage || 0) : 0
          };
        }
        
        return account;
      });
    }
    
    // Set all state in a single batch if possible
    setAccounts(finalAccounts);
    setPayAmount(initialPayAmount);
    
    // Finish initialization after a delay to ensure other state is set
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setIsInitializing(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - runs once on mount

  // Handle account toggle - now wrapped in an isInitialized check
  const handleToggleAccount = useCallback((id) => {
    if (isInitializing) return;
    
    setAccounts(currentAccounts => 
      currentAccounts.map(account => 
        account.id === id ? { ...account, enabled: !account.enabled } : account
      )
    );
    console.log(`Toggled account ${id}`);
  }, [isInitializing]);

  // Handle amount change - with debounce to prevent rapid update cascades
  const handleAmountChange = useCallback((id, value) => {
    if (isInitializing) return;
    
    // Ensure amount is a number and not negative
    const sanitizedValue = Math.max(0, Number(value) || 0);
    
    setAccounts(currentAccounts => 
      currentAccounts.map(account => {
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
      })
    );
  }, [isInitializing]);
  
  // Handle contribution type toggle (dollar or percentage)
  const handleContributionTypeChange = useCallback((id) => {
    if (isInitializing) return;
    
    setAccounts(currentAccounts => 
      currentAccounts.map(account => {
        if (account.id !== id) return account;
        
        const newIsPercentage = !account.isPercentage;
        console.log(`Changed account ${id} contribution type to ${newIsPercentage ? 'percentage' : 'dollar amount'}`);
        return { 
          ...account, 
          isPercentage: newIsPercentage 
        };
      })
    );
  }, [isInitializing]);
  
  // Handle paycheck amount change - with additional checks
  const handlePayAmountChange = useCallback((amount) => {
    if (isInitializing) return;
    
    const sanitizedAmount = Math.max(0, Number(amount) || 0);
    setPayAmount(sanitizedAmount);
    console.log('Paycheck amount updated:', sanitizedAmount);
  }, [isInitializing]);

  // Calculate contributions without triggering parent updates automatically
  useEffect(() => {
    // Skip during initialization
    if (isInitializing) {
      return;
    }
    
    // Calculate total contributions
    let total = 0;
    accounts.forEach(account => {
      if (account.enabled) {
        if (account.isPercentage) {
          total += (payAmount * account.percentage) / 100;
        } else {
          total += account.amount;
        }
      }
    });
    
    console.log('Calculated total contributions:', total);
    setTotalContributions(total);
    
    // Do NOT update parent component here - only do that on explicit submit
  }, [accounts, payAmount, isInitializing]);

  // Handle save/update button click
  const handleSubmit = useCallback(() => {
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
  }, [accounts, totalContributions, calculateContribution, setPostTaxContributions]);

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
                        Calculated amount: {formatCurrency(contributionAmount)}
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
        <div className="total-amount">{formatCurrency(totalContributions)}</div>
        <div className="remaining-amount">
          Remaining from paycheck: {formatCurrency(payAmount - totalContributions)}
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