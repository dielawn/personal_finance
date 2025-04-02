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
    let weeklyPay, biWeeklyPay, monthlyPay, annualPay;
    switch(payInterval) {
        case 'weekly':
          weeklyPay = pay;
          biWeeklyPay = pay * 2;
          monthlyPay = pay * 4.33; // Average weeks in a month
          annualPay = pay * 52;
          break;
        case 'bi-weekly':
          weeklyPay = (pay / 2);
          biWeeklyPay = pay;
          monthlyPay = pay * 2.17; // Average bi-weekly periods in a month
          annualPay = pay * 26;
          break;
        case 'monthly':
          weeklyPay = pay / 4.33;
          biWeeklyPay = pay / 2.165;
          monthlyPay = pay;
          annualPay = pay * 12;
          break;
        default:
          return null;
      }
      return {weeklyPay, biWeeklyPay, monthlyPay, annualPay}
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  const formatPercent = (value) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatMonths = (value) =>value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  export {
    getPayIntervalMultipliers,
    getColorClass,
    handlePayInterval, 
    formatCurrency,
    formatPercent,
    formatMonths
  }