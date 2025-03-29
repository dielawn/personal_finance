// calc savings rate
function calcSavingsRate(payStubSummary, ira, savings) {
    const totalPayPeriodSavings = payStubSummary.preTaxSavings + ira + savings
    const savingsRate = totalPayPeriodSavings / payStubSummary.totalNetPay * 100
    return savingsRate
} 

//401k percentage
function calc401kPercent(contributionDollar, grossPay) {
   const contributionPercent = contributionDollar / grossPay
   return contributionPercent
}

//calc projections
function projections(payInterval, acct) {
    switch(payInterval) {
        case 'weekly':
          const monthly = acct.contributionDollar * 4
          const annually = acct.contributionDollar * 52
          break;
        case 'bi-weekly':
          // code block
          break;
        case 'monthly':
          // code block
          break;
        default:
          // code block
      }
} 