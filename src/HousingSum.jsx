import './Summary.css';
import { useEffect, useState } from 'react';
import {
    calcMonthlyInterest,
    calcTotalInterest,
    formatCurrency,
    formatMonths,
    formatPercent
} from './utils/utils';
import { getPayIntervalMultipliers } from './utils/utils';
import PieChart from './PieChart';
import { Label } from 'recharts';

const HousingSummary = ({ housingExpenses, payStubData }) => {
    const monthlyHousingExp = housingExpenses.totalMonthlyExpenses || 0;
    const annualHousingExp = (housingExpenses.totalMonthlyExpenses || 0) * 12;
    const mortgageMonthlyExp = calcMonthlyInterest(
        housingExpenses.housingDetails?.mortgageBalance, 
        housingExpenses.housingDetails?.interestRate
    );
    const annualMortgageExp = mortgageMonthlyExp * 12;
    const mortgageBalance = housingExpenses.housingDetails?.mortgageBalance || 0;
    const mortgagePayment = housingExpenses.housingDetails?.monthlyPayment || 0;
    const mortgageRate = housingExpenses.housingDetails?.interestRate || 0;
    const monthlyRate = (mortgageRate / 100) / 12;
    const monthsMortgagePaidOff = Math.log(mortgagePayment / (mortgagePayment - monthlyRate * mortgageBalance)) / Math.log(1 + monthlyRate) || 0;
    
    const multipliers = getPayIntervalMultipliers(payStubData[0].payInterval)   
    const grossMonthly = payStubData[0].grossPay * multipliers.monthly
    const _30PercentGross = (grossMonthly * .3) 
    const isLessThan30 = monthlyHousingExp <= _30PercentGross;
    const expensesArray = [
        {
            label: 'Housing',
            amount: monthlyHousingExp,
            color: '#36A2EB'
    
        }
    ];

    useEffect(() => {
        console.log('spending', housingExpenses);
    }, [housingExpenses]);
    
    return (
        <div className='housingSummary'>
            {housingExpenses && (
            <div className="summary-section">
                <h3>Housing</h3>
                <PieChart title={'Income & Housing'} income={grossMonthly} expenses={expensesArray} color={'#4CAF50'}/>
                <p>
                    <span className='acct-label'>Housing Type: </span>
                    <span className='acct-value'>{housingExpenses.housingType === ' Own' ? 'Home Owner' : ' Renting'}</span>
                </p>
                <div className="card flexColumn">

                {housingExpenses.housingType === 'own' && housingExpenses.housingDetails && (
                   <>
                   <p>
                        <span className='acct-label'>Home Value: </span>
                        <span className='acct-value'>{formatCurrency(housingExpenses.housingDetails.homeValue || 0)}</span>
                    </p>
                    <p>
                        <span className="acct-label">Mortgage Balance: </span>
                        <span className="acct-value">{formatCurrency(housingExpenses.housingDetails.mortgageBalance || 0)}</span>
                    </p>
                    <p>
                        <span className="acct-label">Home Equity: </span>
                        <span className="acct-value">{formatCurrency(housingExpenses.housingDetails.homeValue - housingExpenses.housingDetails.mortgageBalance)}</span>
                    </p>
                    </>
                )}
                    
                {housingExpenses.housingType === 'rent' && housingExpenses.housingDetails && (
                    <p>
                        <span className='acct-label'>Monthly Rent:</span>
                        <span className='acct-value'>{formatCurrency(housingExpenses.housingDetails.monthlyRent || 0)} </span>
                    </p>
                )}
                <p>
                    <span className='acct-label'>30% of Gross Income:</span>
                    <span className='acct-value'>{formatCurrency(_30PercentGross)}</span>
                </p>
                <p>
                    <span className='acct-label'>Monthly Insurance:</span>
                    <span className='acct-value'>{formatCurrency(housingExpenses.housingDetails.insurance)}</span>
                </p>
                <p>
                    <span className='acct-label'>Annual Insurance:</span>
                    <span className='acct-value'>{formatCurrency(housingExpenses.housingDetails.insurance * 12)}</span>
                </p>
                <p>
                    <span className='acct-label'>Monthly Housing Expenses:</span>
                    <span className='acct-value'>{formatCurrency(monthlyHousingExp)}</span>
                </p>
                <p>
                    <span className='acct-label'>Annual Housing Expenses:</span>
                    <span className='acct-value'>{formatCurrency(annualHousingExp)}</span>
                </p>
                
                {housingExpenses.housingType === 'own' && housingExpenses.housingDetails && housingExpenses.housingDetails.monthlyPayment > 0 && (
                <>
                    <p>
                        <span className='acct-label'>Monthly Mortgage Interest:</span>
                        <span className='acct-value'>{formatCurrency(mortgageMonthlyExp)}</span>
                    </p>
                    <p>
                        <span className='acct-label'>Annual Mortgage Interest:</span>
                        <span className='acct-value'>{formatCurrency(annualMortgageExp)}</span>
                    </p>
                    <p>
                        <span className='acct-label'>Months To Pay Off:</span>
                        <span className='acct-value'>
                            {formatMonths(monthsMortgagePaidOff)}
                        </span>
                    </p>
                    <p>
                        <span className='acct-label'>Total Interest At Pay Off:</span>
                        <span className='acct-value'>
                            {calcTotalInterest(mortgageBalance, mortgagePayment, mortgageRate)}
                        </span>
                    </p>
                </>
                )}
                </div>
                
                {/* Utilities Section */}
                {housingExpenses.utilities && (
                    <div className="utilities-section">
                        <h4>Utilities</h4>
                        <p>
                            <span className='acct-label'>Monthly Utilities Total:</span>
                            <span className='acct-value'>{formatCurrency(housingExpenses.utilities.total || 0)}</span>
                        </p>
                        
                        {housingExpenses.utilities.items && (
                            <div className="flex">
                                {Object.entries(housingExpenses.utilities.items).map(([key, value]) => (
                                    value > 0 && (
                                        <div key={key} className="card">
                                            <h5>{key.charAt(0).toUpperCase() + key.slice(1)}</h5>
                                            <p>{formatCurrency(value)}</p>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            )}
            <p className='proTip'> 
                <span>Pro Tip!</span> <br />
                <span> The 30% Rule: You should allocate no more than 30% of your gross monthly income (before taxes) towards rent and housing costs.</span> 
            </p>
        </div>
    );
};

export default HousingSummary;