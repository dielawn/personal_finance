import { useEffect, useState } from 'react';
import './Summary.css'
import { formatMonths, formatCurrency, formatPercent, calcMonthlyInterest } from "./utils/utils";
import { getPayIntervalMultipliers } from './utils/utils';
import LoanAmortization from './LoanAmortization';

const DebtSummary = ({ debtList, payStubData, housingExpenses}) => {
  // Add state to track which amortization is visible (only one at a time as modal)
  const [visibleAmortizationIndex, setVisibleAmortizationIndex] = useState(null);

  // Function to show a specific amortization table
  const showAmortization = (index) => {
    console.log('Showing amortization as modal for index:', index);
    setVisibleAmortizationIndex(index);
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to hide the amortization modal
  const hideAmortization = () => {
    console.log('Hiding amortization modal');
    setVisibleAmortizationIndex(null);
    // Re-enable scrolling on body
    document.body.style.overflow = 'auto';
  };

  // Housing Debt calc 
  // Debt calculations
  const generalDebts = debtList.reduce((sum, debt) => sum + debt.balance, 0);
  const totalDebt = generalDebts;

  // Fix this line by extracting housing payment outside the reduce
  const debtMinPayments = debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const housingPayment = housingExpenses.housingType === 'own' ? housingExpenses.housingDetails.monthlyPayment : 0;
  const totalMinMonthlyPayment = debtMinPayments + housingPayment;

  const totalMinAnnualPayment = totalMinMonthlyPayment * 12;

  // Fix months calculation
  const monthsUntilPaidOff = debtList.length > 0 ? Math.max(...debtList.map(debt => {
      const monthlyRate = (debt.interestRate / 100) / 12;
      if (monthlyRate === 0 || debt.minimumPayment <= 0) return debt.balance / debt.minimumPayment;
      return Math.log(debt.minimumPayment / (debt.minimumPayment - monthlyRate * debt.balance)) / Math.log(1 + monthlyRate);
  })) : 0;

  const annualInterest = debtList.reduce((sum, debt) => sum + (debt.balance * debt.interestRate / 100), 0);
  const monthlyInterest = annualInterest / 12 || 0;
   
  //Automotive debt
  const multipliers = getPayIntervalMultipliers(payStubData[0].payInterval)
  // DTI of 35% or less is best
  const debtToIncome = payStubData[0]?.grossPay && multipliers?.monthly 
    ? (totalDebt / (payStubData[0].grossPay * multipliers.monthly)) * 100 
    : 0;

  const totalInterest = debtList.reduce((totalInterest, debt) => {
      const monthlyRate = (debt.interestRate / 100) / 12;
      if (monthlyRate === 0 || debt.minimumPayment <= 0) return totalInterest;
      
      // Calculate how many months to pay off
      const months = Math.log(debt.minimumPayment / (debt.minimumPayment - monthlyRate * debt.balance)) / Math.log(1 + monthlyRate);
      
      // Calculate total payments
      const totalPayments = debt.minimumPayment * months;
      
      // Total interest is total payments minus the principal
      const interestAmount = totalPayments - debt.balance;
          
      return totalInterest + interestAmount;
  }, 0); // Add initial value of 0 here

  useEffect(() => {
    console.log('debts', debtList);
    
    // Cleanup function to ensure body scrolling is restored when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [debtList]);

  return (        
    <div className='debtList summary-section'>
        <h3>Debts</h3>
            <div className="flex">
      
      <p className='info-row'>
        <span className='acct-label'>Total Debt:</span> 
        <span className='acct-value'>{formatCurrency(totalDebt)}</span>
      </p>
      <div className="flex">
      {debtList.map((debt, index) => (
  <div className='card flexColumn' key={index}>
    <div className='debt-header'>
      <span className='acct-name'>{debt.accountName}</span>
      
      <div className='info-row'>
        <span className='acct-label'>Balance:</span>
        <span className='acct-value'>{formatCurrency(debt.balance)}</span>
      </div>
      
      <div className='info-row'>
        <span className='acct-label'>Min Payment:</span>
        <span className='acct-value'>{formatCurrency(debt.minimumPayment)}</span>
      </div>
      
      <div className='info-row'>
        <span className='acct-label'>Rate:</span>
        <span className='acct-value'>{formatPercent(debt.interestRate)}</span>
      </div>
      
      <div className='info-row'>
        <span className='acct-label'>Monthly Interest:</span>
        <span className='acct-value'>{formatCurrency(calcMonthlyInterest(debt.balance, debt.interestRate))}</span>
      </div>
      
      {debt.interestRate > 0 && (
        <button 
          className="show-amortization-btn"
          onClick={() => showAmortization(index)}
        >
          Show Amortization
        </button>
      )}
    </div>
  </div>
))}
      </div>
      
      {/* Modal Overlay for Amortization Table */}
      {visibleAmortizationIndex !== null && (
        <div className="amortization-modal-overlay" onClick={hideAmortization}>
          <div className="amortization-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="amortization-modal-header">
              <h3>{debtList[visibleAmortizationIndex].accountName} - Amortization Schedule</h3>
              <button className="close-modal-btn" onClick={hideAmortization}>
                ×
              </button>
            </div>
            <div className="amortization-modal-body">
              <LoanAmortization 
                interestRate={debtList[visibleAmortizationIndex].interestRate} 
                minimumPayment={debtList[visibleAmortizationIndex].minimumPayment} 
                balance={debtList[visibleAmortizationIndex].balance}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="monthly card">
        <h5>Monthly</h5>
        <p className="account-row">
          <span>Minimum Payment</span>
          <span className='sub-acct-value'>{formatCurrency(totalMinMonthlyPayment)}</span>
        </p>
        <p className="account-row">
          <span>Interest:</span>
          <span className='sub-acct-value'>{formatCurrency(monthlyInterest)}</span>
        </p>
        <p className="account-row">
            <span>Total:</span>
            <span className="sub-acct-value">{formatCurrency(totalMinMonthlyPayment + monthlyInterest)}</span>
        </p>
      </div>
      <div className="annual card">
        <h5>Annual</h5>
        <p className="account-row">
          <span>Minimum Payment:</span>
          <span className='sub-acct-value'>{formatCurrency(totalMinAnnualPayment)}</span>
        </p>
        <p className="account-row">
          <span>Interest:</span>
          <span className='sub-acct-value'>{formatCurrency(annualInterest)}</span>
        </p>
        <p className="account-row">
            <span>Total:</span>
            <span className="sub-acct-value">{formatCurrency(totalMinAnnualPayment + annualInterest)}</span>
        </p>
      </div>
      <div className="total card">
        <h5>Stats</h5>
        <p className="account-row">    
          <span>Months Until Pay Off:</span>     
          <span className='sub-acct-value'>{formatMonths(monthsUntilPaidOff)}</span>     
        </p> 
        <p className="account-row">
          <span>Total Interest:</span>
          <span className='sub-acct-value'>{formatCurrency(totalInterest)}</span>
        </p>
        <p className="account-row">
          <span>Debt to Income (DTI) </span>
          <span className='sub-acct-value'>{formatPercent(debtToIncome)}</span>
        </p>
      </div>
    </div>  
    </div>      
  );
};

export default DebtSummary;