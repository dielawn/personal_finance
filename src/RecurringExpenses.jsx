import React, { useState, useEffect } from 'react';
import './RecurringExpenses.css';

const RecurringExpenses = ({ setReOccuringExpenses }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    cost: '',
    frequency: 'monthly'
  });

  const handleNewExpenseChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === 'cost' 
      ? (value === '' ? '' : parseFloat(value))
      : value;
    
    console.log(`Updating new expense ${name} to ${numericValue}`);
    
    setNewExpense(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const addExpense = () => {
    if (newExpense.name.trim() === '') {
      alert('Please enter a service name');
      return;
    }
    
    if (newExpense.cost === '') {
      alert('Please enter a cost');
      return;
    }
    
    const expenseToAdd = {
      id: Date.now(),
      name: newExpense.name.trim(),
      cost: parseFloat(newExpense.cost),
      frequency: newExpense.frequency
    };
    
    console.log('Adding new recurring expense:', expenseToAdd);
    setExpenses(prev => [...prev, expenseToAdd]);
    
    // Reset form
    setNewExpense({
      name: '',
      cost: '',
      frequency: 'monthly'
    });
  };

  const updateExpense = (id, field, value) => {
    console.log(`Updating expense ${id}, field ${field} to ${value}`);
    
    setExpenses(prev => prev.map(expense => {
      if (expense.id === id) {
        return { ...expense, [field]: field === 'cost' ? parseFloat(value) : value };
      }
      return expense;
    }));
  };
  
  const removeExpense = (id) => {
    console.log('Removing expense with id:', id);
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formattedExpenses = expenses.map(({ id, ...rest }) => rest);
    console.log('Submitting recurring expenses:', formattedExpenses);
    
    // Calculate monthly and annual totals
    const monthlyTotal = expenses.reduce((sum, expense) => {
      return sum + (expense.frequency === 'monthly' ? expense.cost : expense.cost / 12);
    }, 0);
    
    const annualTotal = expenses.reduce((sum, expense) => {
      return sum + (expense.frequency === 'annual' ? expense.cost : expense.cost * 12);
    }, 0);
    
    setReOccuringExpenses({
      expenses: formattedExpenses,
      summary: {
        monthlyTotal,
        annualTotal,
        count: expenses.length
      }
    });
  };

  // Log when expenses change
  useEffect(() => {
    console.log('Current recurring expenses:', expenses);
    console.log('Monthly equivalent:', calculateMonthlyTotal());
    console.log('Annual equivalent:', calculateAnnualTotal());
  }, [expenses]);
  
  // Calculate monthly total (convert annual to monthly)
  const calculateMonthlyTotal = () => {
    return expenses.reduce((total, expense) => {
      if (expense.frequency === 'monthly') {
        return total + expense.cost;
      } else {
        // Convert annual to monthly
        return total + (expense.cost / 12);
      }
    }, 0);
  };
  
  // Calculate annual total (convert monthly to annual)
  const calculateAnnualTotal = () => {
    return expenses.reduce((total, expense) => {
      if (expense.frequency === 'annual') {
        return total + expense.cost;
      } else {
        // Convert monthly to annual
        return total + (expense.cost * 12);
      }
    }, 0);
  };

  return (
    <div className="recurring-expenses-container">
      <h2>Recurring Expenses</h2>
      <p className="description">Track your subscription services and memberships</p>
      
      <div className="add-expense-form">
        <h3>Add New Service or Membership</h3>
        <div className="form-inputs">
          <div className="input-group">
            <label htmlFor="name">Service Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newExpense.name}
              onChange={handleNewExpenseChange}
              placeholder="Netflix, Gym membership, etc."
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="cost">Cost ($):</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={newExpense.cost}
              onChange={handleNewExpenseChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="frequency">Billing Cycle:</label>
            <select
              id="frequency"
              name="frequency"
              value={newExpense.frequency}
              onChange={handleNewExpenseChange}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
        
        <button 
          type="button" 
          className="add-button"
          onClick={addExpense}
        >
          Add Expense
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {expenses.length > 0 ? (
          <div className="expenses-list">
            <h3>Your Recurring Expenses</h3>
            <div className="expense-headers">
              <span className="header-name">Service</span>
              <span className="header-cost">Cost</span>
              <span className="header-frequency">Frequency</span>
              <span className="header-actions">Actions</span>
            </div>
            
            {expenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                  className="expense-name"
                />
                <div className="expense-cost-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    value={expense.cost}
                    onChange={(e) => updateExpense(expense.id, 'cost', e.target.value)}
                    className="expense-cost"
                    min="0"
                    step="0.01"
                  />
                </div>
                <select
                  value={expense.frequency}
                  onChange={(e) => updateExpense(expense.id, 'frequency', e.target.value)}
                  className="expense-frequency"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
                <button 
                  type="button"
                  className="remove-button"
                  onClick={() => removeExpense(expense.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-expenses">
            <p>No recurring expenses added yet. Add your first one above!</p>
          </div>
        )}
        
        {expenses.length > 0 && (
          <>
            <div className="summary-section">
              <div className="summary-row">
                <span>Monthly Equivalent:</span>
                <span className="summary-amount">${calculateMonthlyTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Annual Equivalent:</span>
                <span className="summary-amount">${calculateAnnualTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Total Services:</span>
                <span className="summary-count">{expenses.length}</span>
              </div>
            </div>
            
           
          </>
        )}
      </form>
    </div>
  );
};

export default RecurringExpenses;