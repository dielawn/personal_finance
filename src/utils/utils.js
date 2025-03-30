const getPayIntervalMultipliers = (payInterval) => {
    console.log('interval', payInterval)
    const multipliers = {
      'weekly': { monthly: 4, annual: 52 },
      'bi-weekly': { monthly: 26/12, annual: 26 },
      'monthly': { monthly: 1, annual: 12 }
    };
    console.log(multipliers[payInterval])
    return multipliers[payInterval] || { monthly: 1, annual: 1 };
  };

  export {
    getPayIntervalMultipliers
  }