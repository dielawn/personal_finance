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

//calc balance + contributions + growth 
function projections(payInterval, acct) {
    let monthly;
    let annually;
    switch(payInterval) {
        case 'weekly':
            monthly = acct.contributionDollar * 4
            annually = acct.contributionDollar * 52
          break;
        case 'bi-weekly':
            monthly = acct.contributionDollar * 2
            annually = acct.contributionDollar * 26
          break;
        case 'monthly':
            monthly = acct.contributionDollar
            annually = acct.contributionDollar * 12
          break;
        default:
          // code block
      }
} 


//analize pay stub
function analizePayStub(payStub) {
    const {retirement401k, hsa, grossPay} = payStub
    const preTaxSavings = retirement401k + hsa
    const employeePercent = retirement401k / grossPay * 100
    const matchPercent = match401k / grossPay * 100
}