import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import ExportButtons from './ExportButtons';
import { getPayIntervalMultipliers } from './utils/utils.js';

const FinanceNavigation = () => {
  // State for all the financial data with useLocalStorage integration
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

  // Prevent multiple updates
  const updateInProgress = React.useRef(false);

  useEffect(() => {
    // if (debtList && debtList.length > 0) {
    //   // Commented out line to log each debt's name and interest rate
    //   debtList.map((debt) => console.log( debt.interestRate))
      
    //   // Currently, it just logs the length of the debtList array
    //   console.log(debtList.length)
    // }

    if (postTaxContributions) {
      console.log('ira:', postTaxContributions.accounts[0].amount);
    }
}, [postTaxContributions])

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
    
    console.log('Updating transport expenses');
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
            {payStubData && payStubData.length > 0 && payStubData[0].netPay > 0 && (
  <div className="pay-breakdown-section">
    <h4>Pay Breakdown</h4>
    {(() => {
      const primaryPayStub = payStubData[0];
      const netPay = primaryPayStub.netPay;
      let weeklyPay, biWeeklyPay, monthlyPay, annualPay;
      
      switch(primaryPayStub.payInterval) {
        case 'weekly':
          weeklyPay = netPay;
          biWeeklyPay = netPay * 2;
          monthlyPay = netPay * 4.33; // Average weeks in a month
          annualPay = netPay * 52;
          break;
        case 'bi-weekly':
          weeklyPay = netPay / 2;
          biWeeklyPay = netPay;
          monthlyPay = netPay * 2.17; // Average bi-weekly periods in a month
          annualPay = netPay * 26;
          break;
        case 'monthly':
          weeklyPay = netPay / 4.33;
          biWeeklyPay = netPay / 2.165;
          monthlyPay = netPay;
          annualPay = netPay * 12;
          break;
        default:
          return null;
      }


      
      return (
        <div className="pay-equivalents">
          <div className="pay-row">
            <span>Weekly Net Pay:</span>
            <span className="pay-amount">${weeklyPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="pay-row">
            <span>Bi-Weekly Net Pay:</span>
            <span className="pay-amount">${biWeeklyPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="pay-row">
            <span>Monthly Net Pay:</span>
            <span className="pay-amount">${monthlyPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="pay-row">
            <span>Annual Net Pay:</span>
            <span className="pay-amount">${annualPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          
        </div>
      );
    })()}
  </div>
)}
          </div>
          
          {acctBalanceData && (
  <div className="summary-section">
    <h3>Account Balances</h3>
    <p>
      <span>Total Assets: </span>
      <span>${(acctBalanceData.totalAssets || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>              
    </p>
    <div className="accounts-list">
      {acctBalanceData.accountsList?.map(account => (
        <div key={account.id} className="account-item">
          <span>{account.label}:</span> <span>${account.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      ))}
    </div>
  </div>
)}
{postTaxContributions && payStubData &&
  <div className="summary-section">
    <h3>Pre Tax Savings Contributions</h3>
    <h4>Pay Period Contributions</h4>
    <p>
      <span>Total Pre Tax Contributions</span>
      <span>-${(payStubData[0]?.retirement401k + payStubData[0]?.hsa || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>401k Contributions:</span>
      <span>-${(payStubData[0]?.retirement401k || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Health Savings Account (HSA):</span>
      <span>-${(payStubData[0]?.hsa || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    
    {/* Monthly pre-tax contributions */}
    <h4>Monthly Contributions</h4>
    <p>
      <span>Monthly 401k Contributions:</span>
      <span>-${((payStubData[0]?.retirement401k || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).monthly).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Monthly HSA Contributions:</span>
      <span>-${((payStubData[0]?.hsa || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).monthly).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    
    {/* Annual pre-tax contributions */}
    <h4>Annual Contributions</h4>
    <p>
      <span>Annual 401k Contributions:</span>
      <span>-${((payStubData[0]?.retirement401k || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).annual).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Annual HSA Contributions:</span>
      <span>-${((payStubData[0]?.hsa || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).annual).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
  <p>
    <span>Pre Tax Savings Rate</span>
    <span>{(((payStubData[0]?.retirement401k + payStubData[0]?.hsa ) / payStubData[0].grossPay) * 100|| 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span>
  </p>

    
   {/* Post Tax Savings Contributions section */}
<h3>Post Tax Savings Contributions</h3>
<h4>Pay Period Contributions</h4>
<p>
  <span>Total Savings Contributions:</span>
  <span>-${(postTaxContributions?.total_contributions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>

{/* Individual post-tax accounts */}
<p>
  <span>IRA Contributions:</span>
  <span>-${(postTaxContributions?.accounts[1].amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>
<p>
  <span>Savings Account Contributions:</span>
  <span>-${(postTaxContributions?.accounts[0].amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>

{/* Monthly post-tax contributions */}
<h4>Monthly Contributions</h4>
<p>
  <span>Monthly IRA Contributions:</span>
  <span>-${((postTaxContributions?.accounts[1].amount || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).monthly).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>
<p>
  <span>Monthly Savings Account Contributions:</span>
  <span>-${((postTaxContributions?.accounts[0].amount || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).monthly).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>
<p>
  <span>Monthly Total Contributions:</span>
  <span>-${((postTaxContributions?.total_contributions || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).monthly).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>

{/* Annual post-tax contributions */}
<h4>Annual Contributions</h4>
<p>
  <span>Annual IRA Contributions:</span>
  <span>-${((postTaxContributions?.accounts[1].amount || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).annual).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>
<p>
  <span>Annual Savings Account Contributions:</span>
  <span>-${((postTaxContributions?.accounts[0].amount || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).annual).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>
<p>
  <span>Annual Total Contributions:</span>
  <span>-${((postTaxContributions?.total_contributions || 0) * getPayIntervalMultipliers(payStubData[0].payInterval).annual).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
</p>

<p>
  <span>Post Tax Savings Rate</span>
  <span>{(((postTaxContributions?.accounts[0].amount + postTaxContributions?.accounts[1].amount ) / payStubData[0].netPay) * 100|| 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span>
</p>
  </div>
}


          
          {debtList && debtList.length > 0 && (
  <div className="summary-section">
    <h3>Debts</h3>
    <p>
      <span>Total Debt:</span> 
      <span>${debtList.reduce((sum, debt) => sum + debt.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Total Minimum Monthly Payment:</span> 
      <span>${debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Total Annual Minimum Payment:</span>
      <span>${(debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0) * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>    
      <span>Months to pay off:</span>     
      <span>{debtList.reduce((sum, debt) => (sum + debt.balance) / debt.minimumPayment, 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>     
    </p> 
    <p>
      <span>Monthly Interest:</span>
      <span>${debtList.reduce((sum, debt) => sum + ((debt.balance * (debt.interestRate / 100)) / 12), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Annual Interest:</span>
      <span>${debtList.reduce((sum, debt) => sum + (debt.balance * debt.interestRate / 100), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Total Interest:</span>
      <span>${debtList.reduce((totalInterest, debt) => {
        const monthlyRate = (debt.interestRate / 100) / 12;
        if (monthlyRate === 0 || debt.minimumPayment <= 0) return totalInterest;
        
        // Calculate how many months to pay off
        const months = Math.log(debt.minimumPayment / (debt.minimumPayment - monthlyRate * debt.balance)) / Math.log(1 + monthlyRate);
        
        // Calculate total payments
        const totalPayments = debt.minimumPayment * months;
        
        // Total interest is total payments minus the principal
        return totalInterest + (totalPayments - debt.balance);
      }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
  </div>
)}

{housingExpenses && (
  <div className="summary-section">
    <h3>Housing</h3>
    <p>
      <span>Monthly Housing Expenses:</span>
      <span>${(housingExpenses.totalMonthlyExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Annual Housing Expenses:</span>
      <span>${((housingExpenses.totalMonthlyExpenses || 0) * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    
    {housingExpenses.housingType === 'own' && housingExpenses.housingDetails && housingExpenses.housingDetails.monthlyPayment > 0 && (
      <>
        <p>
          <span>Monthly Mortgage Interest:</span>
          <span>${(((housingExpenses.housingDetails.mortgageBalance || 0) * ((housingExpenses.housingDetails.interestRate || 0) / 100)) / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </p>
        <p>
          <span>Annual Mortgage Interest:</span>
          <span>${((housingExpenses.housingDetails.mortgageBalance || 0) * (housingExpenses.housingDetails.interestRate || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </p>
        <p>
          <span>Months to pay off:</span>
          <span>
            {(() => {
              const balance = housingExpenses.housingDetails.mortgageBalance || 0;
              const payment = housingExpenses.housingDetails.monthlyPayment || 0;
              const interestRate = housingExpenses.housingDetails.interestRate || 0;
              
              if (interestRate === 0 || payment <= 0) return "0";
              
              const monthlyRate = (interestRate / 100) / 12;
              const months = Math.log(payment / (payment - monthlyRate * balance)) / Math.log(1 + monthlyRate);
              
              return months.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            })()}
          </span>
        </p>
        <p>
          <span>Total Mortgage Interest:</span>
          <span>
            ${(() => {
              const balance = housingExpenses.housingDetails.mortgageBalance || 0;
              const payment = housingExpenses.housingDetails.monthlyPayment || 0;
              const interestRate = housingExpenses.housingDetails.interestRate || 0;
              
              if (interestRate === 0 || payment <= 0) return "0.00";
              
              const monthlyRate = (interestRate / 100) / 12;
              const months = Math.log(payment / (payment - monthlyRate * balance)) / Math.log(1 + monthlyRate);
              const totalPayments = payment * months;
              const totalInterest = totalPayments - balance;
              
              return totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            })()}
          </span>
        </p>
      </>
    )}
  </div>
)}
{transportExpenses && (
  <div className="summary-section">
    <h3>Transportation</h3>
    <p>
      <span>Monthly Transportation Expenses:</span>
      <span>${(transportExpenses.totalMonthlyExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Annual Transportation Expenses:</span>
      <span>${((transportExpenses.totalMonthlyExpenses || 0) * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    
    {transportExpenses.transportMode === 'own' && transportExpenses.details && transportExpenses.details.vehicles && (
      <>
        <p>
          <span>Number of Vehicles:</span>
          <span>{transportExpenses.details.vehicles.length}</span>
        </p>
        
        <p>
          <span>Total Monthly Fuel:</span>
          <span>${transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.fuelExpense || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </p>
        
        <p>
          <span>Total Monthly Insurance:</span>
          <span>${transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.insurance || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </p>
        
        <p>
          <span>Total Monthly Maintenance:</span>
          <span>${transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.maintenance || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </p>
        
        {transportExpenses.details.vehicles.filter(vehicle => vehicle.paymentStatus === 'paid-off').length > 0 && (
          <p>
            <span>Paid-off Vehicles:</span>
            <span>{transportExpenses.details.vehicles.filter(vehicle => vehicle.paymentStatus === 'paid-off').map(v => v.name).join(', ')}</span>
          </p>
        )}
        
        {transportExpenses.details.vehicles.map((vehicle) => (
          vehicle.paymentStatus === 'making-payments' && (
            <React.Fragment key={vehicle.id}>
              <h4>Loan/Payments Data For {vehicle.name}</h4>
              <p>
                <span>Monthly Payment:</span>
                <span>${(vehicle.vehiclePayment || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
              <p>
                <span>Monthly Interest:</span>
                <span>${(((vehicle.loanBalance || 0) * ((vehicle.interestRate || 0) / 100)) / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
              <p>
                <span>Annual Interest:</span>
                <span>${((vehicle.loanBalance || 0) * (vehicle.interestRate || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
              <p>
                <span>Months to pay off:</span>
                <span>
                  {(() => {
                    const balance = vehicle.loanBalance || 0;
                    const payment = vehicle.vehiclePayment || 0;
                    const interestRate = vehicle.interestRate || 0;
                    
                    if (interestRate === 0 || payment <= 0) return "0";
                    
                    const monthlyRate = (interestRate / 100) / 12;
                    const months = Math.log(payment / (payment - monthlyRate * balance)) / Math.log(1 + monthlyRate);
                    
                    return isFinite(months) ? months.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "N/A";
                  })()}
                </span>
              </p>
              <p>
                <span>Total Interest:</span>
                <span>
                  ${(() => {
                    const balance = vehicle.loanBalance || 0;
                    const payment = vehicle.vehiclePayment || 0;
                    const interestRate = vehicle.interestRate || 0;
                    
                    if (interestRate === 0 || payment <= 0) return "0.00";
                    
                    const monthlyRate = (interestRate / 100) / 12;
                    const months = Math.log(payment / (payment - monthlyRate * balance)) / Math.log(1 + monthlyRate);
                    
                    if (!isFinite(months)) return "N/A";
                    
                    const totalPayments = payment * months;
                    const totalInterest = totalPayments - balance;
                    
                    return totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  })()}
                </span>
              </p>
            </React.Fragment>
          )
        ))}
      </>
    )}
  </div>
)}

{recurringExpenses && recurringExpenses.expenses && (
  <div className="summary-section">
    <h3>Recurring Expenses</h3>
    {recurringExpenses.expenses.map((item, index) => (
      <p key={index}>
        <span>{item.name} ({item.frequency}):</span>
        <span>${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </p>
    ))}
    <p>
      <span>Monthly Equivalent:</span>
      <span>${(recurringExpenses.summary?.monthlyTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Annual Equivalent:</span>
      <span>${(recurringExpenses.summary?.annualTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Total Services:</span>
      <span>{recurringExpenses.summary?.count || 0}</span>
    </p>
  </div>
)}

{personalExpenses && postTaxContributions && (
  <div className="summary-section">
    <h3>Monthly Cash Flow</h3>
    <p>
      <span>Income:</span>
      <span>${summary.totalNetPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Housing:</span>
      <span>-${(housingExpenses?.totalMonthlyExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Transportation:</span>
      <span>-${(transportExpenses?.totalMonthlyExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Debt Payments:</span>
      <span>-${(debtList ? debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p>
      <span>Savings Contributions:</span>
      <span>-${(postTaxContributions?.total_contributions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
    <p className="remaining">
      <span>Remaining:</span>
      <span>${(
        summary.totalNetPay -
        (housingExpenses?.totalMonthlyExpenses || 0) -
        (transportExpenses?.totalMonthlyExpenses || 0) -
        (debtList ? debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0) : 0) -
        (postTaxContributions?.total_contributions || 0)
      ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </p>
  </div>
)}
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