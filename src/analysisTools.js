// calc savings rate
function calcPreTaxSavingsRate(payStubSummary, ira, savings) {
    const totalPayPeriodSavings = payStubSummary.preTaxSavings + ira + savings
    const savingsRate = totalPayPeriodSavings / payStubSummary.totalNetPay * 100

} 