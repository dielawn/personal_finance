import './Summary.css'
import { formatCurrency, getPayIntervalMultipliers } from './utils/utils'
import PieChart from './PieChart'
import { useEffect, useState } from 'react'

const CashFlowSummary = ({ payStubData, recurringExpenses, debtList, housingExpenses, transportExpenses, personalExpenses, postTaxContributions, summary}) => {
    const [savingsAccts, setSavingsAccts] = useState([]);

    const netPay = payStubData[0].netPay    
    const grossPay = payStubData[0].grossPay
    const multipliers = getPayIntervalMultipliers(payStubData[0].payInterval)
    const monthlyGrossPay = grossPay * multipliers.monthly;
    const monthlyNet = netPay * multipliers.monthly

    const monthlyRecurringExp = recurringExpenses.summary.monthlyTotal;
    const totalDebtPayment = debtList.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0)
    const {hsa, match401k, retirement401k, healthInsurance, dentalInsurance, visionInsurance} = payStubData[0]
    const personalDebts = debtList.filter(debt => debt.type === 'personal');
    const personalDebtPaymentTotal = personalDebts.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0);
    const monthlyTaxes = payStubData[0].totalDeductions - (retirement401k + hsa)
    
    const monthlyHealthInsurance = (healthInsurance + dentalInsurance + visionInsurance) * multipliers.monthly
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
    const colors = ['#F2F4CB', '#A5D0A8','#96BD99', '#99BFA8', '#8CADA7', '#64520F', '#B7990D', '#D5C76C', ]
    const wantsExp = [
        {
            label: 'Recurring Expenses',
            color: colors[1],
            amount: monthlyRecurringExp
        }, 
        {
            label: 'Personal Debt',
            color: colors[2],
            amount: personalDebtPaymentTotal
        }, 
        {
            label: 'Dining Out',
            color: colors[3],
            amount: personalExpenses.diningOut
        }, 
        {
            label: 'Entertainment',
            color: colors[4],
            amount: personalExpenses.entertainment
        }, 

        
    ]
    const needsExp = [
        {
            label: 'Housing Expenses',
            color: colors[1],
            amount: housingExpenses.totalMonthlyExpenses,
        }, 
        {
            label: 'Groceries',
            color: colors[2],
            amount: personalExpenses.groceries, 
        }, 
        {
            label: 'Clothing',
            color: colors[3],
            amount: personalExpenses.clothing, 
        }, 
        {
            label: 'Minimum Debt Payments',
            color: colors[4],
            amount:  totalDebtPayment
        }, 
    ]

    const _401kMonthly = match401k * multipliers.monthly + retirement401k * multipliers.monthly
    function handleAccts(acctArray) {
        if (!acctArray || !acctArray.length) return [];
        
        // Colors to cycle through (reusing from other arrays)
        const adjustedColors = colors.slice(3);
        
        // Transform the accounts data into the format needed for savingsExp
        return acctArray.map((acct, index) => {
        return {
            label: acct.name,
            color: adjustedColors[index % adjustedColors.length], // Cycle through colors
            amount: acct.calculatedAmount * multipliers.monthly || acct.amount * multipliers.monthly
        };
        });
    }
    const savingsExp = [
        {
            label: 'HSA',
            color: colors[1],
            amount: hsa * multipliers.monthly,
        }, 
        {
            label: '401k',
            color: colors[2],
            amount: _401kMonthly,
        }, 
        ...savingsAccts       
    ]
    const expenses = [
        {
            label: 'Livings Expenses',
            color: colors[1],
            amount: housingExpenses?.totalMonthlyExpenses,
        },
        {
            label: 'Health Insurance',
            color: colors[2],
            amount: monthlyHealthInsurance,
        },
        {
            label: 'Debt',
            color: colors[3],
            amount: totalDebtPayment,
        },
        {
            label: 'Savings',
            color: colors[4],
            amount: postTaxContributions?.total_contributions * multipliers.monthly + hsa + match401k + retirement401k,
        },

        {
            label: 'Taxes',
            color: colors[5],
            amount: monthlyTaxes,
        },
        {
            label: 'Transportation',
            color: colors[6],
            amount: transportExpenses?.totalMonthlyExpenses,
        },
        {
            label: 'Subscriptions/Recurring',
            color: colors[7],
            amount: monthlyRecurringExp,
        },
        
    ]

    useEffect(() => {
        // Process the accounts from postTaxContributions
        if (postTaxContributions && postTaxContributions.accounts) {
            setSavingsAccts(handleAccts(postTaxContributions.accounts));
        }
    }, [payStubData, debtList, housingExpenses, transportExpenses, personalExpenses, postTaxContributions, summary]);

    return (
        <div>
            <PieChart 
                title={'50% Needs'} 
                income={monthlyNet * .5} 
                color={colors[0]} 
                expenses={needsExp}
            />
            <PieChart 
                title={'30% Wants'} 
                income={monthlyNet * .3} 
                color={colors[0]} 
                expenses={wantsExp}
            />
            <PieChart 
                title={'20% Savings'} 
                income={monthlyGrossPay * .2} 
                color={colors[0]} 
                expenses={savingsExp}
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
                    <PieChart 
                        title={'Monthly Cash Flow'} 
                        income={monthlyNet}
                        color={colors[0]}  
                        expenses={expenses}
                    />
                </div>
                )}
        </div>
    )
}

export default CashFlowSummary