
import { formatMonths, formatCurrency } from "./utils/utils";
const DebtSummary = ({ debtList, payStubData, }) => {
 // Debt
 const totalDebt = debtList.reduce((sum, debt) => sum + debt.balance, 0);
 const totalMinMonthlyPayment = debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0)
 const totalMinAnnualPayment =  totalMinMonthlyPayment * 12
 const monthsUntilPaidOff = debtList.reduce((sum, debt) => (sum + debt.balance) / debt.minimumPayment, 0)
 const annualInterest = debtList.reduce((sum, debt) => sum + (debt.balance * debt.interestRate / 100), 0)
 const monthlyInterest = annualInterest / 12 || 0;

 // DTI of 35% or less is best
 const debtToIncome = (totalDebt / payStubData[0].grossPay) * 100;

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


    return (        
        <div className="summary-section">
             <h3>Debts</h3>
            <p>
            <span>Total Debt:</span> 
            <span>{formatCurrency(totalDebt)}</span>
            </p>
            <div className="month card">
                <p>
                    <span>Total Minimum Monthly Payment:</span> 
                    <span>{formatCurrency(totalMinMonthlyPayment)}</span>
                </p>
                <p>
                    <span>Monthly Interest:</span>
                    <span>{formatCurrency(monthlyInterest)}</span>
                </p>
                <p>    
                    <span>Months to pay off:</span>     
                    <span>{formatMonths(monthsUntilPaidOff)}</span>     
                </p> 
            </div>
            <div className="annual card">
                <p>
                    <span>Total Annual Minimum Payment:</span>
                    <span>{formatCurrency(totalMinAnnualPayment)}</span>
                </p>
                <p>
                    <span>Annual Interest:</span>
                    <span>{formatCurrency(annualInterest)}</span>
                </p>
            </div>
            <p>
                <span>Total Interest:</span>
                <span>{formatCurrency(totalInterest)}</span>
            </p>
        </div>        
    )
};
export default DebtSummary