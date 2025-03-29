import React, { useState } from 'react';
import PayStub from './PayStub';
import AccountBalanceForm from './AccountBalanceForm';
import DebtTrackerForm from './DebtTrackerForm';
import HousingExpenses from './HousingExpenses';
import TransportExpenses from './TransportExpenses';
import PersonalExpenses from './PersonalExpenses';
import RecurringExpenses from './RecurringExpenses';
import PostTaxSavings from './PostTaxSavings';
import './FinanceNavigation.css';

const FinanceNavigation = () => {
  // State for all the financial data
  const [payStubData, setPayStubData] = useState([]);
  const [showAddSpouse, setShowAddSpouse] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [summary, setSummary] = useState({
    totalNetPay: 0,
    preTaxSavings: 0
  });
  const [acctBalanceData, setAcctBalanceData] = useState(null);
  const [debtList, setDebtList] = useState([]);
  const [housingExpenses, setHousingExpenses] = useState({
    isOwner: true,
    mortgage: 0,
    homeValue: 0,
    interestRate: 0,
    monthlyPayment: 0,
    allUtilities: 0,
  });
  const [transportExpenses, setTransportExpenses] = useState(null);
  const [personalExpenses, setPersonalExpenses] = useState(null);
  const [recurringExpenses, setRecurringExpenses] = useState(null);
  const [postTaxContributions, setPostTaxContributions] = useState(null);

  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

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
          <PayStub id="primary" label="Primary Pay Stub" setPayStubData={setPayStubData} />
          
          {showAddSpouse && (
            <div className="additional-paystub">
              <h3>Spouse Pay Stub</h3>
              <PayStub id="spouse" label="Spouse Pay Stub" setPayStubData={setPayStubData} />
            </div>
          )}
          
          {showAddJob && (
            <div className="additional-paystub">
              <h3>Secondary Job</h3>
              <PayStub id="secondary-job" label="Secondary Job" setPayStubData={setPayStubData} />
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
      component: <AccountBalanceForm setAcctBalanceData={setAcctBalanceData} />
    },
    {
      id: 'debts',
      title: 'Debts',
      description: 'Track your debts and loans',
      component: <DebtTrackerForm setAcctBalanceData={setDebtList} />
    },
    {
      id: 'housing',
      title: 'Housing',
      description: 'Enter your housing expenses',
      component: <HousingExpenses setHousingExpenses={setHousingExpenses} />
    },
    {
      id: 'transport',
      title: 'Transport',
      description: 'Enter your transportation costs',
      component: <TransportExpenses setTransportExpenses={setTransportExpenses} />
    },
    {
      id: 'personal',
      title: 'Personal',
      description: 'Track your personal expenses',
      component: <PersonalExpenses setPersonalExpenses={setPersonalExpenses} />
    },
    {
      id: 'recurring',
      title: 'Recurring',
      description: 'Enter your recurring bills',
      component: <RecurringExpenses setReOccuringExpenses={setRecurringExpenses} />
    },
    {
      id: 'savings',
      title: 'Contributions',
      description: 'Configure your savings contributions',
      component: (
        <PostTaxSavings 
          setPostTaxContributions={setPostTaxContributions} 
          paycheck={payStubData.length > 0 ? payStubData[0].netPay : 0} 
          acctBalanceData={acctBalanceData} 
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
  }, [currentStep, payStubData]);

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