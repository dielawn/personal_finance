import './FinanceNavigation.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import ExportButtons from './ExportButtons';
// Forms
import PayStub from './PayStub';
import AccountBalanceForm from './AccountBalanceForm';
import DebtTrackerForm from './DebtTrackerForm';
import HousingExpenses from './HousingExpenses';
import TransportExpenses from './TransportExpenses';
import PersonalExpenses from './PersonalExpenses';
import RecurringExpenses from './RecurringExpenses';
import PostTaxSavings from './PostTaxSavings';
// Summaries
import PayStubSummary from './PayStubSum.jsx';
import AccountsSummary from './AcctSum.jsx';
import DebtSummary from './DebtSum.jsx';
import HousingSummary from './HousingSum.jsx';
import TransportSummary from './TransportSum.jsx';
import RecurringSummary from './RecurringSum.jsx';
import CashFlowSummary from './CashFlowSum.jsx';

const FinanceNavigation = () => {
  // State for all the financial data with useLocalStorage integration
  const [payStubData, setPayStubData] = useLocalStorage('finance_paystub_data', []);
  const [showAddSpouse, setShowAddSpouse] = useLocalStorage('finance_show_spouse', false);
  const [showAddJob, setShowAddJob] = useLocalStorage('finance_show_job', false);
  const [summary, setSummary] = useLocalStorage('finance_summary', {
    totalNetPay: 0,
    preTaxSavings: 0
  });
  // Forms Data
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
  // Prevent multiple updates
  const updateInProgress = React.useRef(false);

  // Wrapper functions to ensure data is properly saved/loaded - made with useCallback to prevent unnecessary re-renders
  const handlePayStubDataUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating pay stub data');
    setPayStubData(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setPayStubData]);

  const handleAcctBalanceUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating account balance data');
    setAcctBalanceData(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setAcctBalanceData]);

  const handleDebtListUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating debt list');
    setDebtList(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setDebtList]);

  const handleHousingExpensesUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating housing expenses');
    setHousingExpenses(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setHousingExpenses]);

  const handleTransportExpensesUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating transport expenses', newData);
    setTransportExpenses(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setTransportExpenses]);

  const handlePersonalExpensesUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating personal expenses');
    setPersonalExpenses(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setPersonalExpenses]);

  const handleRecurringExpensesUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating recurring expenses');
    setRecurringExpenses(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setRecurringExpenses]);

  const handlePostTaxContributionsUpdate = useCallback((newData) => {
    if (updateInProgress.current) return;
    updateInProgress.current = true;
    
    console.log('Updating post-tax contributions');
    setPostTaxContributions(newData);
    
    setTimeout(() => {
      updateInProgress.current = false;
    }, 100);
  }, [setPostTaxContributions]);

  useEffect(() => {
    let housingDebtDetail = [];
    let autoDebtDetail = [];
    
    // Add mortgage if homeowner
    if (housingExpenses && housingExpenses.housingType === 'own') {  
      const {mortgageBalance, interestRate, monthlyPayment} = housingExpenses.housingDetails;
    
      const mortgageDetail = {
        accountName: 'Mortgage', 
        balance: mortgageBalance, 
        interestRate,
        minimumPayment: monthlyPayment,
        type: 'mortgage'
      };
      housingDebtDetail = [mortgageDetail];
    }
    
    // Add vehicle loans
    if (transportExpenses && transportExpenses.details && transportExpenses.details.vehicles) {
      autoDebtDetail = transportExpenses.details.vehicles
        .filter(vehicle => vehicle.paymentStatus === 'making-payments')
        .map(vehicle => {
          const {name, loanBalance, interestRate, vehiclePayment} = vehicle;
          return {
            accountName: name,
            balance: loanBalance,
            interestRate,
            minimumPayment: vehiclePayment,
            type: 'auto'
          };
        });
    }
  
    // Combine existing debt with housing and auto debt
    // Avoid duplicates by filtering out entries that might already exist
    const existingDebtNames = debtList.map(debt => debt.accountName);
    const newHousingDebt = housingDebtDetail.filter(debt => !existingDebtNames.includes(debt.accountName));
    const newAutoDebt = autoDebtDetail.filter(debt => !existingDebtNames.includes(debt.accountName));
    
    const updatedDebtList = [...debtList, ...newHousingDebt, ...newAutoDebt];
    
    // Only update if there are actual changes
    if (newHousingDebt.length > 0 || newAutoDebt.length > 0) {
      handleDebtListUpdate(updatedDebtList);
    }
    
  }, [housingExpenses, transportExpenses, debtList, handleDebtListUpdate]);

  // Memoize the welcome screen component to prevent unnecessary re-renders
  const welcomeScreenComponent = useMemo(() => (
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
  ), []);

  // Memoize income component to prevent unnecessary re-renders
  const incomeComponent = useMemo(() => (
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
  ), [payStubData, summary, showAddSpouse, showAddJob, handlePayStubDataUpdate, setShowAddSpouse, setShowAddJob]);

  // Define the steps/components to navigate through
  const steps = useMemo(() => [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Complete this questionnaire to get a clear picture of your financial situation',
      component: welcomeScreenComponent
    },
    {
      id: 'income',
      title: 'Income',
      description: 'Enter your income details from your pay stub',
      component: incomeComponent
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
      id: 'debts',
      title: 'Debts',
      description: 'Track your debts and loans',
      component: <DebtTrackerForm 
        setAcctBalanceData={handleDebtListUpdate}
        initialData={debtList}

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
            {payStubData && payStubData.length > 0 && payStubData[0].netPay > 0 && (
  <div className="pay-breakdown-section">
    <h4>Pay Breakdown</h4>
    <PayStubSummary payStubData={payStubData} />   
  </div>
)}
          </div>
<AccountsSummary acctBalanceData={acctBalanceData} payStubData={payStubData} postTaxContributions={postTaxContributions}/>
<DebtSummary debtList={debtList} payStubData={payStubData} housingExpenses={housingExpenses} />
<HousingSummary housingExpenses={housingExpenses} payStubData={payStubData}/>
<TransportSummary transportExpenses={transportExpenses} payStubData={payStubData}/>     
<RecurringSummary recurringExpenses={recurringExpenses} />     
<CashFlowSummary 
  payStubData={payStubData} 
  debtList={debtList}
  housingExpenses={housingExpenses}
  transportExpenses={transportExpenses}
  personalExpenses={personalExpenses}
  postTaxContributions={postTaxContributions}
  summary={summary}  
  recurringExpenses={recurringExpenses}
/>

          <ExportButtons 
        data={{
          payStubData,
          summary,
          acctBalanceData,
          debtList,
          housingExpenses,
          transportExpenses,
          personalExpenses,
          recurringExpenses,
          postTaxContributions
        }} 
      />
          <div className="final-message">
            <h3>Congratulations!</h3>
            <p>You've completed the financial questionnaire. Use this information to make informed decisions about your financial future.</p>
            <button onClick={() => window.print()}>Print Summary</button>
            
          </div>
        </div>
      )
    }
  ], [
    welcomeScreenComponent, 
    incomeComponent,
    acctBalanceData, 
    debtList, 
    housingExpenses, 
    transportExpenses, 
    personalExpenses,
    recurringExpenses,
    postTaxContributions,
    payStubData,
    summary,
    handleAcctBalanceUpdate,
    handleDebtListUpdate,
    handleHousingExpensesUpdate,
    handleTransportExpensesUpdate,
    handlePersonalExpensesUpdate,
    handleRecurringExpensesUpdate,
    handlePostTaxContributionsUpdate
  ]);

  // Calculate progress percentage - only updates when currentStep changes
  useEffect(() => {
    const progressPercentage = (currentStep / (steps.length - 1)) * 100;
    setProgress(progressPercentage);
  }, [currentStep, steps.length]);
  
  // Update summary from payStubData when it changes
  useEffect(() => {
    if (payStubData.length > 0 && !updateInProgress.current) {
      updateInProgress.current = true;
      
      const totalNetPay = payStubData.reduce((sum, stub) => sum + (stub.netPay || 0), 0);
      const preTaxSavings = payStubData.reduce((sum, stub) => 
        sum + (stub.retirement401k || 0) + (stub.hsa || 0), 0);
      
      setSummary({ totalNetPay, preTaxSavings });
      
      setTimeout(() => {
        updateInProgress.current = false;
      }, 100);
    }
  }, [payStubData, setSummary]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep, steps.length, setCurrentStep]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep, setCurrentStep]);

  // Jump to a specific step
  const goToStep = useCallback((index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
      window.scrollTo(0, 0);
    }
  }, [steps.length, setCurrentStep]);

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