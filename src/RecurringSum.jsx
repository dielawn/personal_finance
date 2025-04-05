import { useEffect } from 'react'
import './Summary.css'
import { formatCurrency } from './utils/utils'

const RecurringSummary = ({ recurringExpenses }) => {

    useEffect(() => {
        console.log('recurring', recurringExpenses)
    }, [recurringExpenses])

    return (
        <div>
            {recurringExpenses && recurringExpenses.expenses && (
                <div className="summary-section">
                    <h3>Recurring Expenses</h3>
                    {recurringExpenses.expenses.map((item, index) => (
                    <p key={index}>
                        <span>{item.name} ({item.frequency}):</span>
                        <span>{formatCurrency(item.cost)}</span>
                    </p>
                    ))}
                    <p>
                    <span>Monthly Total:</span>
                    <span>{formatCurrency(recurringExpenses.summary?.monthlyTotal || 0)}</span>
                    </p>
                    <p>
                    <span>Annual Total:</span>
                    <span>{formatCurrency(recurringExpenses.summary?.annualTotal || 0)}</span>
                    </p>
                    <p>
                    <span>Total Services:</span>
                    <span>{recurringExpenses.summary?.count || 0}</span>
                    </p>
                    <div className='flex'>
                        {recurringExpenses.expenses.map((exp, index) => (
                            <div key={index} className='card dataCard'>
                                <p>{exp.name}</p>
                                <p>{formatCurrency(exp.cost)}</p>
                                <p>Payment Interval: {exp.frequency}</p>
                            </div>
                        ))}
                    </div>
                </div>
                )}
        </div>
    )
}

export default RecurringSummary