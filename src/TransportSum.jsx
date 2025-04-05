import './Summary.css'
import './PieChart.css'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { formatCurrency, monthsToPaidOff, calcTotalInterest, getPayIntervalMultipliers } from './utils/utils';
import PieChart from './PieChart';

const TransportSummary = ({ transportExpenses, payStubData }) => {
  // Transportation, vehicle loans, insurance, maintenance, fuel
  const monthlyTransportExp = transportExpenses.totalMonthlyExpenses || 0;
  const annualTransportExp = (transportExpenses.totalMonthlyExpenses || 0) * 12;
  const numberOfVehicles = transportExpenses.details.vehicles.length;
  const netIncome = payStubData[0].netPay;

  const multipliers = getPayIntervalMultipliers(payStubData[0].payInterval)
  const monthlyNetIncome = netIncome * multipliers.monthly;
  const monthlyFuel = transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.fuelExpense || 0), 0);
  const monthlyInsurance = transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.insurance || 0), 0);
  const monthlyMaintenance = transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.maintenance || 0), 0);
  const monthlyLoanPayment = transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.vehiclePayment || 0), 0);
  const expenses = [
    // {
    //     label: 'Fuel',
    //     amount: monthlyFuel,
    //     color: '#2F2235'
    // },
    // {
    //     label: 'Insurance',
    //     amount: monthlyInsurance,
    //     color: '#A9ACA9'
    // },
    // {
    //     label: 'Maintenance',
    //     amount: monthlyMaintenance,
    //     color: '#60495A'
    // },
    // {
    //     label: 'Loan Repayment',
    //     amount: monthlyLoanPayment,
    //     color: '#3F3244'
    // },
    {
        label: 'Transportation Expenses',
        amount: monthlyTransportExp,
        color: '#F2F4CB'
    },
  ]

  

  useEffect(() => {
    console.log('expenses', payStubData[0].grossPay)
  }, [transportExpenses])

    return (
        <div className='transportSummary'>
            {transportExpenses && (
            <div className="summary-section">
                <h3>Transportation</h3>
                <PieChart title={'Income & Transportation Expense '} income={monthlyNetIncome} expenses={expenses} color={'#B7990D'}/>
                
                <p>
                <span>Monthly Transportation Expenses:</span>
                <span>{formatCurrency(monthlyTransportExp)}</span>
                </p>
                <p>
                <span>Annual Transportation Expenses:</span>
                <span>{formatCurrency(annualTransportExp)}</span>
                </p>
                
                {transportExpenses.transportMode === 'own' && transportExpenses.details && transportExpenses.details.vehicles && (
                <>
                    <p>
                    <span>Number of Vehicles:</span>
                    <span>{numberOfVehicles}</span>
                    </p>
                    
                    <p>
                    <span>Total Monthly Fuel:</span>
                    <span>{formatCurrency(monthlyFuel)}</span>
                    </p>
                    
                    <p>
                    <span>Total Monthly Insurance:</span>
                    <span>${transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.insurance || 0), 0)}</span>
                    </p>
                    
                    <p>
                    <span>Total Monthly Maintenance:</span>
                    <span>${transportExpenses.details.vehicles.reduce((sum, vehicle) => sum + (vehicle.maintenance || 0), 0)}</span>
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
                       <div className="card loanData">
                       <h4>Loan/Payments Data For {vehicle.name}</h4>
                        <p>
                            <span>Monthly Payment:</span>
                            <span>{(formatCurrency(vehicle.vehiclePayment) || 0)}</span>
                        </p>
                        <p>
                            <span>Monthly Interest:</span>
                            <span>{formatCurrency((((vehicle.loanBalance || 0) * ((vehicle.interestRate || 0) / 100)) / 12))}</span>
                        </p>
                        <p>
                            <span>Annual Interest:</span>
                            <span>{formatCurrency((vehicle.loanBalance || 0) * (vehicle.interestRate || 0) / 100)}</span>
                        </p>
                        <p>
                            <span>Months to pay off:</span>
                            <span>
                            {monthsToPaidOff(vehicle.loanBalance, vehicle.vehiclePayment, vehicle.interestRate)}
                            </span>
                        </p>
                        <p>
                            <span>Total Interest:</span>
                            <span>
                            {calcTotalInterest(vehicle.loanBalance, vehicle.vehiclePayment, vehicle.interestRate)}
                            
                            </span>
                        </p>
                       </div>
                        </React.Fragment>
                    )
                    ))}
                </>
                )}
            </div>
            )}
              <p className='proTip'> 
                <span>Pro Tip!</span> <br />
                <span> Aim to keep your monthly car payment below 10% of your monthly take-home pay, and no more than 20% including payments, insurance, gas, and maintenance. </span> 
            </p>
        </div>
    )
}

export default TransportSummary