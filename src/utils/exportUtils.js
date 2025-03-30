// src/utils/exportUtils.js
// Note: You'll need to install xlsx package: npm install xlsx
// Make sure to create this file in the src/utils/ directory
import * as XLSX from 'xlsx';

/**
 * Export financial data to CSV file
 * @param {Object} data - The financial data to export
 * @param {string} fileName - Name of the file to download
 */
export const exportToCSV = (data, fileName = 'financial_summary.csv') => {
  try {
    console.log('Exporting data to CSV:', data);
    
    // Flatten the data structure for CSV format
    const flattenedData = flattenFinancialData(data);
    
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    
    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary');
    
    // Generate and download the file
    XLSX.writeFile(workbook, fileName);
    
    console.log('CSV export completed successfully');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};

/**
 * Export financial data to Excel file
 * @param {Object} data - The financial data to export
 * @param {string} fileName - Name of the file to download
 */
export const exportToExcel = (data, fileName = 'financial_summary.xlsx') => {
  try {
    console.log('Exporting data to Excel:', data);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add income sheet
    if (data.payStubData && data.payStubData.length > 0) {
      const incomeData = formatIncomeData(data.payStubData, data.summary);
      const incomeSheet = XLSX.utils.json_to_sheet(incomeData);
      XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income');
    }
    
    // Add accounts sheet
    if (data.acctBalanceData) {
      const accountsData = formatAccountsData(data.acctBalanceData);
      const accountsSheet = XLSX.utils.json_to_sheet(accountsData);
      XLSX.utils.book_append_sheet(workbook, accountsSheet, 'Accounts');
    }
    
    // Add debts sheet
    if (data.debtList && data.debtList.length > 0) {
      const debtsSheet = XLSX.utils.json_to_sheet(data.debtList);
      XLSX.utils.book_append_sheet(workbook, debtsSheet, 'Debts');
    }
    
    // Add expenses sheets
    const expensesData = formatExpensesData(data);
    const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses');
    
    // Add cash flow sheet
    const cashFlowData = formatCashFlowData(data);
    const cashFlowSheet = XLSX.utils.json_to_sheet(cashFlowData);
    XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Cash Flow');
    
    // Generate and download the file
    XLSX.writeFile(workbook, fileName);
    
    console.log('Excel export completed successfully');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};

/**
 * Flatten the nested financial data structure into rows for simple CSV export
 */
const flattenFinancialData = (data) => {
  const rows = [];
  
  // Add income data
  if (data.summary) {
    rows.push({ Category: 'INCOME', Item: 'Total Net Pay', Value: data.summary.totalNetPay });
    rows.push({ Category: '', Item: 'Pre-Tax Savings', Value: data.summary.preTaxSavings });
  }
  
  // Add accounts data
  if (data.acctBalanceData) {
    rows.push({ Category: 'ACCOUNTS', Item: 'Total Assets', Value: data.acctBalanceData.totalAssets });
    if (data.acctBalanceData.accountsList) {
      data.acctBalanceData.accountsList.forEach(account => {
        rows.push({ Category: '', Item: account.label, Value: account.value });
      });
    }
  }
  
  // Add debts data
  if (data.debtList && data.debtList.length > 0) {
    const totalDebt = data.debtList.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinPayment = data.debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    
    rows.push({ Category: 'DEBTS', Item: 'Total Debt', Value: totalDebt });
    rows.push({ Category: '', Item: 'Total Min Monthly Payment', Value: totalMinPayment });
    
    data.debtList.forEach(debt => {
      rows.push({ Category: '', Item: debt.accountName, Value: debt.balance });
    });
  }
  
  // Add housing expenses
  if (data.housingExpenses) {
    rows.push({ Category: 'HOUSING', Item: 'Monthly Housing Expenses', Value: data.housingExpenses.totalMonthlyExpenses });
  }
  
  // Add transportation expenses
  if (data.transportExpenses) {
    rows.push({ Category: 'TRANSPORTATION', Item: 'Monthly Transportation Expenses', Value: data.transportExpenses.totalMonthlyExpenses });
  }
  
  // Add personal expenses
  if (data.personalExpenses) {
    rows.push({ Category: 'PERSONAL', Item: 'Total Personal Expenses', Value: data.personalExpenses.total });
  }
  
  // Add recurring expenses
  if (data.recurringExpenses && data.recurringExpenses.summary) {
    rows.push({ Category: 'RECURRING', Item: 'Monthly Equivalent', Value: data.recurringExpenses.summary.monthlyTotal });
  }
  
  // Add post-tax contributions
  if (data.postTaxContributions) {
    rows.push({ Category: 'SAVINGS', Item: 'Post-Tax Contributions', Value: data.postTaxContributions.total_contributions });
  }
  
  // Add cash flow summary
  if (data.summary) {
    const income = data.summary.totalNetPay || 0;
    const housing = data.housingExpenses?.totalMonthlyExpenses || 0;
    const transport = data.transportExpenses?.totalMonthlyExpenses || 0;
    const debtPayments = data.debtList ? data.debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0) : 0;
    const savings = data.postTaxContributions?.total_contributions || 0;
    const remaining = income - housing - transport - debtPayments - savings;
    
    rows.push({ Category: 'CASH FLOW', Item: 'Monthly Income', Value: income });
    rows.push({ Category: '', Item: 'Monthly Expenses', Value: housing + transport + debtPayments });
    rows.push({ Category: '', Item: 'Monthly Savings', Value: savings });
    rows.push({ Category: '', Item: 'Remaining', Value: remaining });
  }
  
  return rows;
};

/**
 * Format income data for Excel
 */
const formatIncomeData = (payStubData, summary) => {
  const result = [];
  
  // Add summary info
  result.push({
    Category: 'Income Summary',
    Item: 'Total Net Pay',
    Value: summary.totalNetPay
  });
  
  // Process each pay stub
  payStubData.forEach((stub, index) => {
    result.push({
      Category: `${stub.label} (${stub.payInterval})`,
      Item: 'Gross Pay',
      Value: stub.grossPay
    });
    
    // Add earnings breakdown
    result.push({
      Category: '',
      Item: 'Regular Pay',
      Value: stub.regularPay
    });
    
    result.push({
      Category: '',
      Item: 'Overtime Pay',
      Value: stub.overtimePay
    });
    
    // Add deductions
    const deductions = [
      { name: 'Federal Tax', value: stub.federalTax },
      { name: 'State Tax', value: stub.stateTax },
      { name: 'Social Security', value: stub.socialSecurity },
      { name: 'Medicare', value: stub.medicare },
      { name: '401(k)', value: stub.retirement401k },
      { name: 'Health Insurance', value: stub.healthInsurance },
      { name: 'Dental Insurance', value: stub.dentalInsurance },
      { name: 'Vision Insurance', value: stub.visionInsurance },
      { name: 'HSA', value: stub.hsa },
      { name: 'Other Deductions', value: stub.otherDeductions }
    ];
    
    deductions.forEach(deduction => {
      if (deduction.value > 0) {
        result.push({
          Category: '',
          Item: deduction.name,
          Value: -deduction.value
        });
      }
    });
    
    // Add net pay
    result.push({
      Category: '',
      Item: 'Net Pay',
      Value: stub.netPay
    });
    
    // Add a spacer between pay stubs
    if (index < payStubData.length - 1) {
      result.push({
        Category: '',
        Item: '',
        Value: ''
      });
    }
  });
  
  return result;
};

/**
 * Format accounts data for Excel
 */
const formatAccountsData = (acctBalanceData) => {
  const result = [];
  
  // Add total assets
  result.push({
    Account: 'Total Assets',
    Balance: acctBalanceData.totalAssets
  });
  
  // Add account breakdown
  if (acctBalanceData.accountsList) {
    acctBalanceData.accountsList.forEach(account => {
      result.push({
        Account: account.label,
        Balance: account.value
      });
    });
  }
  
  return result;
};

/**
 * Format expenses data for Excel
 */
const formatExpensesData = (data) => {
  const result = [];
  
  // Housing expenses
  if (data.housingExpenses) {
    result.push({
      Category: 'Housing',
      Expense: 'Total Housing',
      Monthly: data.housingExpenses.totalMonthlyExpenses,
      Annual: data.housingExpenses.totalMonthlyExpenses * 12
    });
    
    if (data.housingExpenses.housingType === 'own') {
      result.push({
        Category: '',
        Expense: 'Mortgage Payment',
        Monthly: data.housingExpenses.housingDetails?.monthlyPayment || 0,
        Annual: (data.housingExpenses.housingDetails?.monthlyPayment || 0) * 12
      });
    } else if (data.housingExpenses.housingType === 'rent') {
      result.push({
        Category: '',
        Expense: 'Rent',
        Monthly: data.housingExpenses.housingDetails?.monthlyRent || 0,
        Annual: (data.housingExpenses.housingDetails?.monthlyRent || 0) * 12
      });
    }
    
    // Add utilities
    if (data.housingExpenses.utilities && data.housingExpenses.utilities.items) {
      const utilities = data.housingExpenses.utilities.items;
      Object.entries(utilities).forEach(([name, amount]) => {
        result.push({
          Category: '',
          Expense: `Utility: ${name}`,
          Monthly: amount,
          Annual: amount * 12
        });
      });
    }
  }
  
  // Transportation expenses
  if (data.transportExpenses) {
    result.push({
      Category: 'Transportation',
      Expense: 'Total Transportation',
      Monthly: data.transportExpenses.totalMonthlyExpenses,
      Annual: data.transportExpenses.totalMonthlyExpenses * 12
    });
    
    // Add mode-specific details
    if (data.transportExpenses.transportMode === 'own' && data.transportExpenses.details && data.transportExpenses.details.vehicles) {
      data.transportExpenses.details.vehicles.forEach(vehicle => {
        result.push({
          Category: '',
          Expense: `Vehicle: ${vehicle.name}`,
          Monthly: parseFloat(calculateVehicleTotal(vehicle)),
          Annual: parseFloat(calculateVehicleTotal(vehicle)) * 12
        });
      });
    } else if (data.transportExpenses.transportMode === 'lease' && data.transportExpenses.details) {
      const leaseDetails = data.transportExpenses.details;
      
      result.push({
        Category: '',
        Expense: 'Lease Payment',
        Monthly: leaseDetails.leasePayment || 0,
        Annual: (leaseDetails.leasePayment || 0) * 12
      });
      
      result.push({
        Category: '',
        Expense: 'Fuel',
        Monthly: leaseDetails.fuelExpense || 0,
        Annual: (leaseDetails.fuelExpense || 0) * 12
      });
      
      result.push({
        Category: '',
        Expense: 'Insurance',
        Monthly: leaseDetails.insurance || 0,
        Annual: (leaseDetails.insurance || 0) * 12
      });
    } else if (data.transportExpenses.transportMode === 'ride' && data.transportExpenses.details) {
      result.push({
        Category: '',
        Expense: 'Ride Services',
        Monthly: data.transportExpenses.details.monthlyRideServices || 0,
        Annual: (data.transportExpenses.details.monthlyRideServices || 0) * 12
      });
    } else if (data.transportExpenses.transportMode === 'public' && data.transportExpenses.details) {
      result.push({
        Category: '',
        Expense: 'Public Transportation',
        Monthly: data.transportExpenses.details.monthlyPublicTransport || 0,
        Annual: (data.transportExpenses.details.monthlyPublicTransport || 0) * 12
      });
      
      if (data.transportExpenses.details.passes) {
        Object.entries(data.transportExpenses.details.passes).forEach(([name, cost]) => {
          result.push({
            Category: '',
            Expense: `Transit Pass: ${name}`,
            Monthly: cost,
            Annual: cost * 12
          });
        });
      }
    }
  }
  
  // Personal expenses
  if (data.personalExpenses) {
    result.push({
      Category: 'Personal',
      Expense: 'Total Personal Expenses',
      Monthly: data.personalExpenses.total || 0,
      Annual: (data.personalExpenses.total || 0) * 12
    });
    
    // Add standard expense items
    ['groceries', 'diningOut', 'clothing', 'entertainment'].forEach(expenseType => {
      if (data.personalExpenses[expenseType]) {
        const expenseName = expenseType === 'diningOut' ? 'Dining Out' : 
                           expenseType.charAt(0).toUpperCase() + expenseType.slice(1);
        
        result.push({
          Category: '',
          Expense: expenseName,
          Monthly: data.personalExpenses[expenseType],
          Annual: data.personalExpenses[expenseType] * 12
        });
      }
    });
    
    // Add custom expenses
    if (data.personalExpenses.customExpenses) {
      data.personalExpenses.customExpenses.forEach(expense => {
        result.push({
          Category: '',
          Expense: expense.name,
          Monthly: expense.amount,
          Annual: expense.amount * 12
        });
      });
    }
  }
  
  // Recurring expenses
  if (data.recurringExpenses && data.recurringExpenses.expenses) {
    result.push({
      Category: 'Recurring',
      Expense: 'Total Recurring Expenses',
      Monthly: data.recurringExpenses.summary?.monthlyTotal || 0,
      Annual: data.recurringExpenses.summary?.annualTotal || 0
    });
    
    data.recurringExpenses.expenses.forEach(expense => {
      const monthlyEquivalent = expense.frequency === 'monthly' ? 
                               expense.cost : 
                               expense.cost / 12;
      
      const annualEquivalent = expense.frequency === 'annual' ? 
                              expense.cost : 
                              expense.cost * 12;
      
      result.push({
        Category: '',
        Expense: `${expense.name} (${expense.frequency})`,
        Monthly: monthlyEquivalent,
        Annual: annualEquivalent
      });
    });
  }
  
  return result;
};

/**
 * Format cash flow data for Excel
 */
const formatCashFlowData = (data) => {
  const income = data.summary?.totalNetPay || 0;
  const housing = data.housingExpenses?.totalMonthlyExpenses || 0;
  const transport = data.transportExpenses?.totalMonthlyExpenses || 0;
  const debtPayments = data.debtList ? data.debtList.reduce((sum, debt) => sum + debt.minimumPayment, 0) : 0;
  const personal = data.personalExpenses?.total || 0;
  const recurring = data.recurringExpenses?.summary?.monthlyTotal || 0;
  const savings = data.postTaxContributions?.total_contributions || 0;
  
  const totalExpenses = housing + transport + debtPayments + personal + recurring;
  const totalOutflow = totalExpenses + savings;
  const remaining = income - totalOutflow;
  
  return [
    { Category: 'Income', Monthly: income, Annual: income * 12 },
    { Category: 'Housing', Monthly: -housing, Annual: -housing * 12 },
    { Category: 'Transportation', Monthly: -transport, Annual: -transport * 12 },
    { Category: 'Debt Payments', Monthly: -debtPayments, Annual: -debtPayments * 12 },
    { Category: 'Personal Expenses', Monthly: -personal, Annual: -personal * 12 },
    { Category: 'Recurring Expenses', Monthly: -recurring, Annual: -recurring * 12 },
    { Category: 'Savings Contributions', Monthly: -savings, Annual: -savings * 12 },
    { Category: 'Total Expenses', Monthly: -totalExpenses, Annual: -totalExpenses * 12 },
    { Category: 'Total Cash Outflow', Monthly: -totalOutflow, Annual: -totalOutflow * 12 },
    { Category: 'Remaining Cash Flow', Monthly: remaining, Annual: remaining * 12 }
  ];
};

/**
 * Helper function to calculate the total for a vehicle
 */
const calculateVehicleTotal = (vehicle) => {
  let total = 0;
  if (vehicle.paymentStatus === 'making-payments' && vehicle.vehiclePayment) {
    total += parseFloat(vehicle.vehiclePayment);
  }
  if (vehicle.fuelExpense) total += parseFloat(vehicle.fuelExpense);
  if (vehicle.insurance) total += parseFloat(vehicle.insurance);
  if (vehicle.maintenance) total += parseFloat(vehicle.maintenance);
  return total.toFixed(2);
};