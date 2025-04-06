const getPayIntervalMultipliers = (payInterval) => {
    const multipliers = {
      'weekly': { monthly: 4, annual: 52 },
      'bi-weekly': { monthly: 26/12, annual: 26 },
      'monthly': { monthly: 1, annual: 12 }
    };
    return multipliers[payInterval] || { monthly: 1, annual: 1 };
  };

  const getColorClass = (value, thresholds, inverse = false) => {
    // Default thresholds
    const defaultThresholds = {
      green: 20,
      yellow: 10
    };
    
    // Use provided thresholds or defaults
    const rules = thresholds || defaultThresholds;
    
    // For metrics where higher is better (savings rate, etc.)
    if (!inverse) {
      if (value >= rules.green) return 'green';
      if (value >= rules.yellow) return 'yellow';
      return 'red';
    } 
    // For metrics where lower is better (debt ratio, expense ratio, etc.)
    else {
      if (value <= rules.green) return 'green';
      if (value <= rules.yellow) return 'yellow';
      return 'red';
    }
  };

  function handlePayInterval(pay, payInterval) {
    let weekly, biWeekly, monthly, annual;
    switch(payInterval) {
        case 'weekly':
          weekly = pay;
          biWeekly = pay * 2;
          monthly = pay * 4.33; // Average weeks in a month
          annual = pay * 52;
          break;
        case 'bi-weekly':
          weekly = (pay / 2);
          biWeekly = pay;
          monthly = pay * 2.17; // Average bi-weekly periods in a month
          annual = pay * 26;
          break;
        case 'monthly':
          weekly = pay / 4.33;
          biWeekly = pay / 2.165;
          monthly = pay;
          annual = pay * 12;
          break;
        default:
          return null;
      }
      return {weekly, biWeekly, monthly, annual}
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  const formatPercent = (value) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const formatMonths = (value) => value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  function monthsToPaidOff(balance, payment, interestRate) {
    if (interestRate === 0 || payment <= 0) return "0";
    const monthlyRate = (interestRate / 100) / 12;
    const months = Math.log(payment / (payment - monthlyRate * balance)) / Math.log(1 + monthlyRate);
    return isFinite(months) ? formatMonths(months) : 0;
  }

  function calcTotalInterest(balance, payment, interestRate) {
    if (interestRate === 0 || payment <= 0) return "0.00";
    const monthlyRate = (interestRate / 100) / 12;
    const months = Math.log(payment / (payment - monthlyRate * balance)) / Math.log(1 + monthlyRate);
    if (!isFinite(months)) return "N/A";
    const totalPayments = payment * months;
    const totalInterest = totalPayments - balance;
                    
    return formatCurrency(totalInterest);
  }

  function calcMonthlyInterest(balance, interestRate) {
    if (interestRate === 0 || balance === 0) return "0.00";
    const interest = (balance * interestRate / 100) / 12;
    return (interest)
  }



  export {
    getPayIntervalMultipliers,
    getColorClass,
    handlePayInterval, 
    formatCurrency,
    formatPercent,
    formatMonths,
    monthsToPaidOff,
    calcTotalInterest,
    calcMonthlyInterest,

  }