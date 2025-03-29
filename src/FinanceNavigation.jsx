import React, { useState, useEffect } from 'react';
import PayStub from './PayStub';
import AccountBalanceForm from './AccountBalanceForm';
import DebtTrackerForm from './DebtTrackerForm';
import HousingExpenses from './HousingExpenses';
import TransportExpenses from './TransportExpenses';
import PersonalExpenses from './PersonalExpenses';
import RecurringExpenses from './RecurringExpenses';
import PostTaxSavings from './PostTaxSavings';
import './FinanceNavigation.css';
import useLocalStorage from './hooks/useLocalStorage';

const FinanceNavigation = () => {
  // State for all the financial data
  const [payStubData, setPayStubData] = useLocalStorage('finance_paystub_data', []);
  const [showAddSpouse, setShowAddSpouse] = useLocalStorage('finance_show_spouse', false);
  const [showAddJob, setShowAddJob] = useLocalStorage('finance_show_job', false);
  const [summary, setSummary] = useLocalStorage('finance_summary', {
    totalNetPay: 0,
    preTaxSavings: 0
  });
  const [acctBalanceData, setAcctBalanceData] = useLocalStorage('finance_acct_balance', null);
  const [debtList, setDebtList] = useLocalStorage('finance_debt_list', []);
  const [housingExpenses, setHousingExpenses] = useLocalStorage('finance_housing_expenses', null);
  const [transportExpenses, setTransportExpenses] = useLocalStorage('finance_transport_expenses', null);
  const [personalExpenses, setPersonalExpenses] = useLocalStorage('finance_personal_expenses', null);
  const [recurringExpenses, setRecurringExpenses] = useLocalStorage('finance_recurring_expenses', null);
  const [postTaxContributions, setPostTaxContributions] = useLocalStorage('finance_post_tax_contributions', null);

  // Navigation state
  const [currentStep, setCurrentStep] = useLocalStorage('finance_current_step', 0);
  const [progress, setProgress] = useState(0);

  // Add debug logs to verify data is being saved/loaded
  useEffect(() => {
    console.log('Current localStorage state:');
    console.log('Pay stub data:', payStubData);
    console.log('Account balance data:', acctBalanceData);
    console.log('Debt list:', debtList);
    console.log('Housing expenses:', housingExpenses);
    console.log('Transport expenses:', transportExpenses);
    console.log('Personal expenses:', personalExpenses);
    console.log('Recurring expenses:', recurringExpenses);
    console.log('Post-tax contributions:', postTaxContributions);
  }, [
    payStubData, acctBalanceData, debtList, housingExpenses, 
    transportExpenses, personalExpenses, recurringExpenses, postTaxContributions
  ]);

  // Wrapper functions to ensure data is properly saved/loaded
  const handlePayStubDataUpdate = (newData) => {
    console.log('Updating pay stub data:', newData);
    setPayStubData(newData);
  };

  const handleAcctBalanceUpdate = (newData) => {
    console.log('Updating account balance data:', newData);
    setAcctBalanceData(newData);
  };

  const handleDebtListUpdate = (newData) => {
    console.log('Updating debt list:', newData);
    setDebtList(newData);
  };

  const handleHousingExpensesUpdate = (newData) => {
    console.log('Updating housing expenses:', newData);
    setHousingExpenses(newData);
  };

  const handleTransportExpensesUpdate = (newData) => {
    console.log('Updating transport expenses:', newData);
    setTransportExpenses(newData);
  };

  const handlePersonalExpensesUpdate = (newData) => {
    console.log('Updating personal expenses:', newData);
    setPersonalExpenses(newData);
  };

  const handleRecurringExpensesUpdate = (newData) => {
    console.log('Updating recurring expenses:', newData);
    setRecurringExpenses(newData);
  };

  const handlePostTaxContributionsUpdate = (newData) => {
    console.log('Updating post-tax contributions:', newData);
    setPostTaxContributions(newData);
  };

  // Define the steps/components to navigate through
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Complete this questionnaire to get a clear picture of your financial situation',
      component: (
        <div className="welcome-screen">
          <h1>Personal Finance Questionnaire</h1>
          <p>This questionnaire will help you understand your financial situation better by walking you through several key areas:</p>
          <ul>
            <li>Income and Paystubs</li>
            <li>Account Balances</li>
            <li>Debt Tracking</li>
            <li>Housing Expenses</li>
            <li>Transportation Costs</li>
            <li>Personal Expenses</li>
            <li>Recurring Bills</li>
            <li>Savings Contributions</li>
          </ul>
          <p>Each section builds on the previous one to create a comprehensive financial overview.</p>
          <p><strong>Your progress will be automatically saved</strong> as you move through the questionnaire.</p>
        </div>
      )
    },
    {
      id: 'income',
      title: 'Income',
      description: 'Enter your income details from your pay stub',
      component: (
        <div className="step-container">
          <h2>Income Information</h2>
          <PayStub 
            id="primary" 
            label="Primary Pay Stub" 
            setPayStubData={handlePayStubDataUpdate}
            initialData={payStubData.find(stub => stub.id === "primary")} 
          />
          
          {showAddSpouse && (
            <div className="additional-paystub">
              <h3>Spouse Pay Stub</h3>
              <PayStub 
                id="spouse" 
                label="Spouse Pay Stub" 
                setPayStubData={handlePayStubDataUpdate}
                initialData={payStubData.find(stub => stub.id === "spouse")}
              />
            </div>
          )}
          
          {showAddJob && (
            <div className="additional-paystub">
              <h3>Secondary Job</h3>
              <PayStub 
                id="secondary-job" 
                label="Secondary Job" 
                setPayStubData={handlePayStubDataUpdate}
                initialData={payStubData.find(stub => stub.id === "secondary-job")}
              />
            </div>
          )}
          
          <div className="add-buttons">
            {!showAddSpouse && (
              <button onClick={() => setShowAddSpouse(true)}>Add Spouse Pay Stub</button>
            )}
            
            {!showAddJob && (
              <button onClick={() => setShowAddJob(true)}>Add Secondary Job</button>
            )}
          </div>
          
          {payStubData.length > 0 && (
            <div className="data-summary">
              <h3>Pay Summary</h3>
              <div className="total-summary">
                <p>Total Net Pay: ${summary.totalNetPay.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'accounts',
      title: 'Accounts',
      description: 'Track your account balances',
      component: <AccountBalanceForm 
        setAcctBalanceData={handleAcctBalanceUpdate}
        initialData={acctBalanceData}
      />
    },
    {
      id: 'debts',
      title: 'Debts',
      description: 'Track your debts and loans',
      component: <DebtTrackerForm 
        setAcctBalanceData={handleDebtListUpdate}
        initialData={debtList}
      />
    },
    {
      id: 'housing',
      title: 'Housing',
      description: 'Enter your housing expenses',
      component: <HousingExpenses 
        setHousingExpenses={handleHousingExpensesUpdate}
        initialData={housingExpenses}
      />
    },
    {
      id: 'transport',
      title: 'Transport',
      description: 'Enter your transportation costs',
      component: <TransportExpenses 
        setTransportExpenses={handleTransportExpensesUpdate}
        initialData={transportExpenses}
      />
    },
    {
      id: 'personal',
      title: 'Personal',
      description: 'Track your personal expenses',
      component: <PersonalExpenses 
        setPersonalExpenses={handlePersonalExpensesUpdate}
        initialData={personalExpenses}
      />
    },
    {
      id: 'recurring',
      title: 'Recurring',
      description: 'Enter your recurring bills',
      component: <RecurringExpenses 
        setReOccuringExpenses={handleRecurringExpensesUpdate}
        initialData={recurringExpenses}
      />
    },
    {
      id: 'savings',
      title: 'Contributions',
      description: 'Configure your savings contributions',
      component: (
        <PostTaxSavings 
          setPostTaxContributions={handlePostTaxContributionsUpdate} 
          paycheck={payStubData.length > 0 ? payStubData[0].netPay : 0} 
          acctBalanceData={acctBalanceData}
          initialData={postTaxContributions}
        />
      )
    },
    {
      id: 'summary',
      title: 'Summary',
      description: 'Review your complete financial picture',
      component: (
        <div className="financial-summary">
          <h2>Financial Summary</h2>
          
          <div className="summary-section">
            <h3>Income</h3>
            <p>Total Net Pay: ${summary.totalNetPay.toFixed(2)}</p>
            <p>Pre-Tax Savings: ${summary.preTaxSavings.toFixed(2)}</p>
          </div>
          
          {acctBalanceData && (
            <div className="summary-section">
              <h3>Account Balances</h3>
              <p>Total Assets: ${acctBalanceData.totalAssets?.toFixed(2) || '0.00'}</p>
              <div className="accounts-list">
                {acctBalanceData.accountsList?.map(account => (
                  <div key={account.id} className="account-item">
                    <span>{account.label}:</span> <span>${account.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {debtList && debtList.length > 0 && (
            <div className="summary-section">
              <h3>Debts</h3>
              <p>Total Debt: ${debtList.reduce((sum, debt) => sum + debt.balance, 0).toFixed(2)}</p>
              <p>Total Minimum Monthly Payment: ${debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0).toFixed(2)}</p>
            </div>
          )}
          
          {housingExpenses && (
            <div className="summary-section">
              <h3>Housing</h3>
              <p>Monthly Housing Expenses: ${housingExpenses.totalMonthlyExpenses?.toFixed(2) || '0.00'}</p>
            </div>
          )}
          
          {transportExpenses && (
            <div className="summary-section">
              <h3>Transportation</h3>
              <p>Monthly Transportation Expenses: ${transportExpenses.totalMonthlyExpenses?.toFixed(2) || '0.00'}</p>
            </div>
          )}
          
          {personalExpenses && postTaxContributions && (
            <div className="summary-section">
              <h3>Monthly Cash Flow</h3>
              <p>Income: ${summary.totalNetPay.toFixed(2)}</p>
              <p>Housing: -${housingExpenses?.totalMonthlyExpenses?.toFixed(2) || '0.00'}</p>
              <p>Transportation: -${transportExpenses?.totalMonthlyExpenses?.toFixed(2) || '0.00'}</p>
              <p>Debt Payments: -${debtList ? debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0).toFixed(2) : '0.00'}</p>
              <p>Savings Contributions: -${postTaxContributions?.total_contributions?.toFixed(2) || '0.00'}</p>
              <p className="remaining">
                Remaining: ${(
                  summary.totalNetPay -
                  (housingExpenses?.totalMonthlyExpenses || 0) -
                  (transportExpenses?.totalMonthlyExpenses || 0) -
                  (debtList ? debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0) : 0) -
                  (postTaxContributions?.total_contributions || 0)
                ).toFixed(2)}
              </p>
            </div>
          )}
          
          <div className="final-message">
            <h3>Congratulations!</h3>
            <p>You've completed the financial questionnaire. Use this information to make informed decisions about your financial future.</p>
            <button onClick={() => window.print()}>Print Summary</button>
          </div>
        </div>
      )
    }
  ];

  // Calculate progress percentage
  React.useEffect(() => {
    const progressPercentage = (currentStep / (steps.length - 1)) * 100;
    setProgress(progressPercentage);
    
    // Update summary from payStubData when it changes
    if (payStubData.length > 0) {
      const totalNetPay = payStubData.reduce((sum, stub) => sum + (stub.netPay || 0), 0);
      const preTaxSavings = payStubData.reduce((sum, stub) => 
        sum + (stub.retirement401k || 0) + (stub.hsa || 0), 0);
      
      setSummary({ totalNetPay, preTaxSavings });
    }
  }, [currentStep, payStubData, setSummary]);

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Jump to a specific step
  const goToStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="finance-navigation">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="step-navigation">
        <ul>
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => goToStep(index)}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="step-content">
        <div className="step-header">
          <h2>{steps[currentStep].title}</h2>
          <p>{steps[currentStep].description}</p>
        </div>
        
        <div className="component-container">
          {steps[currentStep].component}
        </div>
        
        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button className="prev-button" onClick={prevStep}>
              Previous
            </button>
          )}
          
          {currentStep < steps.length - 1 && (
            <button className="next-button" onClick={nextStep}>
              Next
            </button>
          )}
        </div>
      </div>
      
      <div className="navigation-help">
        <p>Step {currentStep + 1} of {steps.length}</p>
        <p>
          <small>
            You can navigate using the buttons below or by clicking on the steps above
          </small>
        </p>
      </div>
    </div>
  );
};

export default FinanceNavigation;