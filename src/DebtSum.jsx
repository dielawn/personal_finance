import { useEffect } from 'react';
import './Summary.css'
import { formatMonths, formatCurrency, formatPercent } from "./utils/utils";
const DebtSummary = ({ debtList, payStubData, housingExpenses}) => {

// Housing Debt calc 
const mortgage = housingExpenses.housingType === 'own'? housingExpenses.housingDetails.mortgageBalance : 0;
 // Debt
 const generalDebts = debtList.reduce((sum, debt) => sum + debt.balance, 0);
 const totalDebt = generalDebts + mortgage
 const totalMinMonthlyPayment = debtList.reduce((sum, debt) => sum + debt.minimumPayment + housingExpenses.housingDetails.monthlyPayment, 0)
 const totalMinAnnualPayment =  totalMinMonthlyPayment * 12
 // calc mortgage months to pay off
 // sum debt list with mortgage annual interest, monthly interest
 // sum debt list with mortgage annual payments, monthly payments
 const monthsUntilPaidOff = debtList.reduce((sum, debt) => (sum + debt.balance) / debt.minimumPayment, 0);
 const annualInterest = debtList.reduce((sum, debt) => sum + (debt.balance * debt.interestRate / 100), 0);
 const monthlyInterest = annualInterest / 12 || 0;
 
 



 // DTI of 35% or less is best
 const debtToIncome = (totalDebt / payStubData[0].grossPay) * 100 || 0;

 const totalInterest = debtList.reduce((totalInterest, debt) => {
    const monthlyRate = (debt.interestRate / 100) / 12;
    if (monthlyRate === 0 || debt.minimumPayment <= 0) return totalInterest;
    
    // Calculate how many months to pay off
    const months = Math.log(debt.minimumPayment / (debt.minimumPayment - monthlyRate * debt.balance)) / Math.log(1 + monthlyRate);
    
    // Calculate total payments
    const totalPayments = debt.minimumPayment * months;
    
    // Total interest is total payments minus the principal
    const total = totalInterest.balance + (totalPayments - debt.balance)
        
    return total;
  });

  useEffect(() => {
    console.log('housing', housingExpenses)
    
  }, [housingExpenses])


    return (        
        <div className="summary-section">
             <h3>Debts</h3>
            <p>
            <span>Total Debt:</span> 
            <span>{formatCurrency(totalDebt)}</span>
            </p>
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
                    <span>Debt to Income (DTI) Ratio </span>
                    <span className='sub-acct-value'>{formatPercent(debtToIncome)}%</span>
                </p>
            </div>
            
        </div>        
    )
};
export default DebtSummary