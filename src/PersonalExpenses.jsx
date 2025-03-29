import React, { useState, useEffect } from 'react';
import './PersonalExpenses.css';

const PersonalExpenses = ({ setPersonalExpenses }) => {
  const [expenses, setExpenses] = useState({
    groceries: '',
    diningOut: '',
    clothing: '',
    entertainment: ''
  });
  
  const [customExpenses, setCustomExpenses] = useState([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  // Add state to track if form has been submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : parseFloat(value);
    
    console.log(`Updating ${name} to ${numericValue}`);
    
    setExpenses(prevExpenses => ({
      ...prevExpenses,
      [name]: numericValue
    }));
    
    // Reset submitted state when form is changed
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };
  
  const handleCustomExpenseChange = (index, value) => {
    const numericValue = value === '' ? '' : parseFloat(value);
    console.log(`Updating custom expense ${index} to ${numericValue}`);
    
    setCustomExpenses(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], amount: numericValue };
      return updated;
    });
    
    // Reset submitted state when form is changed
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };
  
  const addCustomExpense = () => {
    if (newExpenseName.trim() === '') {
      alert('Please enter an expense name');
      return;
    }
    
    const newExpense = {
      id: Date.now(),
      name: newExpenseName.trim(),
      amount: newExpenseAmount === '' ? 0 : parseFloat(newExpenseAmount)
    };
    
    console.log('Adding new custom expense:', newExpense);
    setCustomExpenses(prev => [...prev, newExpense]);
    setNewExpenseName('');
    setNewExpenseAmount('');
    
    // Reset submitted state when form is changed
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };
  
  const removeCustomExpense = (id) => {
    console.log('Removing custom expense with id:', id);
    setCustomExpenses(prev => prev.filter(expense => expense.id !== id));
    
    // Reset submitted state when form is changed
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert empty strings to 0 for calculations
    const finalExpenses = Object.fromEntries(
      Object.entries(expenses).map(([key, value]) => [key, value === '' ? 0 : value])
    );
    
    // Add custom expenses
    const allExpenses = {
      ...finalExpenses,
      customExpenses: customExpenses.map(item => ({
        name: item.name,
        amount: item.amount === '' ? 0 : item.amount
      }))
    };
    
    // Calculate the total
    const total = [
      ...Object.values(finalExpenses).filter(val => val !== ''),
      ...customExpenses.map(item => item.amount).filter(val => val !== '')
    ].reduce((sum, val) => sum + parseFloat(val), 0);
    
    // Add total to the data
    allExpenses.total = total;
    
    console.log('Submitting expenses:', allExpenses);
    setPersonalExpenses(allExpenses);
    setIsSubmitted(true);
  };

  // Calculate total when expenses change
  useEffect(() => {
    console.log('Current expenses state:', expenses);
  }, [expenses]);

  return (
    <div className="personal-expenses-container">
      <h2>Personal Monthly Expenses</h2>
      <form onSubmit={handleSubmit}>
        <div className="expense-field">
          <label htmlFor="groceries">Groceries ($):</label>
          <input
            type="number"
            id="groceries"
            name="groceries"
            value={expenses.groceries}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="expense-field">
          <label htmlFor="diningOut">Dining Out / Ordering In ($):</label>
          <input
            type="number"
            id="diningOut"
            name="diningOut"
            value={expenses.diningOut}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="expense-field">
          <label htmlFor="clothing">Clothing ($):</label>
          <input
            type="number"
            id="clothing"
            name="clothing"
            value={expenses.clothing}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="expense-field">
          <label htmlFor="entertainment">Entertainment ($):</label>
          <input
            type="number"
            id="entertainment"
            name="entertainment"
            value={expenses.entertainment}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="add-custom-expense">
          <h3>Add Custom Expense</h3>
          <div className="custom-expense-inputs">
            <input
              type="text"
              placeholder="Expense name"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount ($)"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <button 
              type="button" 
              className="add-expense-button"
              onClick={addCustomExpense}
            >
              Add
            </button>
          </div>
        </div>
        
        {customExpenses.length > 0 && (
          <div className="custom-expenses-list">
            <h3>Custom Expenses</h3>
            {customExpenses.map((expense, index) => (
              <div key={expense.id} className="custom-expense-item">
                <label>{expense.name} ($):</label>
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => handleCustomExpenseChange(index, e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <button 
                  type="button" 
                  className="remove-expense-button"
                  onClick={() => removeCustomExpense(expense.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="total-section">
          <p className="total-label">Total Monthly Expenses:</p>
          <p className="total-amount">
            ${[
              ...Object.values(expenses).filter(val => val !== ''),
              ...customExpenses.map(item => item.amount).filter(val => val !== '')
            ].reduce((sum, val) => sum + parseFloat(val), 0).toFixed(2)}
          </p>
        </div>

        <button type="submit" className="save-button">
          {isSubmitted ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default PersonalExpenses;