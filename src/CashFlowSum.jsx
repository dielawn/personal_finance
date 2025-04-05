import './Summary.css'
import { formatCurrency, getPayIntervalMultipliers } from './utils/utils'
import PieChart from './PieChart'
import { useEffect } from 'react'

const CashFlowSummary = ({ payStubData, recurringExpenses, debtList, housingExpenses, transportExpenses, personalExpenses, postTaxContributions, summary}) => {
    const grossPay = payStubData[0].grossPay
    const multipliers = getPayIntervalMultipliers(payStubData[0].payInterval)
    const monthlyGrossPay = grossPay * multipliers.monthly;
    const monthlyRecurringExp = recurringExpenses.summary.monthlyTotal;
    const totalDebtPayment = debtList.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0)
    const {hsa, match401k, retirement401k} = payStubData[0]
    const personalDebts = debtList.filter(debt => debt.type === 'personal');
    const personalDebtPaymentTotal = personalDebts.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0);

    const wants = monthlyRecurringExp + personalDebtPaymentTotal + personalExpenses.diningOut + personalExpenses.entertainment;
    const needs = housingExpenses.totalMonthlyExpenses + personalExpenses.groceries + personalExpenses.clothing + totalDebtPayment;
    const monthlySavings = hsa * multipliers.monthly + match401k * multipliers.monthly + retirement401k * multipliers.monthly + postTaxContributions.total_contributions;
 
    const monthlyTransport = transportExpenses.totalMonthlyExpenses
    
   



    useEffect(() => {
        console.log('paystub', payStubData[0])
        console.log('debts', debtList)
        console.log('housing', housingExpenses)
        console.log('trans', transportExpenses)
        console.log('personal', personalExpenses)
        console.log('postTaxContributions', postTaxContributions)
        console.log('summary', summary)
        console.log('totalDebts', personalDebtPaymentTotal)
        console.log('recurring', recurringExpenses.summary.monthlyTotal)
        console.log('savings', hsa, match401k, retirement401k, postTaxContributions.total_contributions)
    }, [payStubData, debtList, housingExpenses, transportExpenses, personalExpenses, postTaxContributions, summary])

    const expenses = [
        {
            label: 'Housing, Utilities, Insurance,  Groceries',
            color: '#F2F4CB',
            amount: needs,
        },
        {
            label: 'Transportation',
            color: '#F2F4CB',
            amount: monthlyTransport,
        },
        {
            label: 'Subscriptions, Restaurants, Entertainment',
            color: '#8CADA7',
            amount: wants,
        },
        {
            label: 'Retirement, Emergency Fund, Personal Savings',
            color: '#A5D0A8',
            amount: monthlySavings,
        },
    ]

    return (
        <div>
            <PieChart 
                title={'50/30/20 Rule'} 
                income={monthlyGrossPay} 
                color={'#B7990D'} 
                expenses={expenses}
            />
            {personalExpenses && postTaxContributions && (
                <div className="summary-section">
                    <h3>Monthly Cash Flow</h3>
                    <p>
                    <span>Income:</span>
                    <span>{formatCurrency(summary.totalNetPay)}</span>
                    </p>
                    <p>
                    <span>Housing:</span>
                    <span>-{formatCurrency(housingExpenses?.totalMonthlyExpenses || 0)}</span>
                    </p>
                    <p>
                    <span>Transportation:</span>
                    <span>-{formatCurrency(transportExpenses?.totalMonthlyExpenses || 0)}</span>
                    </p>
                    <p>
                    <span>Debt Payments:</span>{}
                    <span>-{formatCurrency(totalDebtPayment)}</span>
                    </p>
                    <p>
                    <span>Savings Contributions:</span>
                    <span>-{formatCurrency(postTaxContributions?.total_contributions || 0)}</span>
                    </p>
                    <p className="remaining">
                    <span>Remaining:</span>
                    <span>{formatCurrency(
                        summary.totalNetPay -
                        (housingExpenses?.totalMonthlyExpenses || 0) -
                        (transportExpenses?.totalMonthlyExpenses || 0) -
                        (totalDebtPayment) -
                        (postTaxContributions?.total_contributions || 0)
                    )}</span>
                    </p>
                </div>
                )}
        </div>
    )
}

export default CashFlowSummary