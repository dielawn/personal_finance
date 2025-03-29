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
function projections(payInterval, acct, growthRate, years = 1) {
    let monthly;
    let annually;
    
    // Calculate contribution based on pay interval
    switch(payInterval.toLowerCase()) {
        case 'weekly':
            monthly = acct.contributionDollar * 4.33; // Average weeks in a month
            annually = acct.contributionDollar * 52;
            break;
        case 'bi-weekly':
            monthly = acct.contributionDollar * 2.17; // Average bi-weekly periods in a month
            annually = acct.contributionDollar * 26;
            break;
        case 'monthly':
            monthly = acct.contributionDollar;
            annually = acct.contributionDollar * 12;
            break;
        default:
            console.log(`Invalid pay interval: ${payInterval}`);
            return null;
    }
    
    // Calculate growth with compound interest
    const monthlyGrowthRate = Math.pow(1 + growthRate, 1/12) - 1;
    let balance = acct.currentBalance || 0;
    let totalContributions = 0;
    let totalGrowth = 0;
    
    console.log(`Starting balance: $${balance.toFixed(2)}`);
    console.log(`Growth rate: ${(growthRate * 100).toFixed(2)}% annually`);
    
    // Project for specified number of years
    for (let year = 1; year <= years; year++) {
        let yearlyContributions = 0;
        let yearlyGrowth = 0;
        
        // Calculate month by month
        for (let month = 1; month <= 12; month++) {
            // Add monthly contribution
            balance += monthly;
            yearlyContributions += monthly;
            
            // Apply monthly growth
            const monthlyGrowth = balance * monthlyGrowthRate;
            balance += monthlyGrowth;
            yearlyGrowth += monthlyGrowth;
        }
        
        totalContributions += yearlyContributions;
        totalGrowth += yearlyGrowth;
        
        console.log(`Year ${year}: Balance = $${balance.toFixed(2)}, Contributions = $${yearlyContributions.toFixed(2)}, Growth = $${yearlyGrowth.toFixed(2)}`);
    }
    
    return {
        finalBalance: balance,
        totalContributions: totalContributions,
        totalGrowth: totalGrowth,
        monthly,
        annually,
    };
}


//analize pay stub
// function analizePayStub(payStub, growthRate, years) {

//     const {retirement401k, match401k, hsa, grossPay, payInterval} = payStub
//     const preTaxSavings = retirement401k + hsa
//     const employeePercent = retirement401k / grossPay * 100
//     const matchPercent = match401k / grossPay * 100

//     const proj401kEmployee = projections(payInterval, retirement401k, growthRate, years)
//     const proj401kEmployer = projections(payInterval, match401k, growthRate, years)
//     const projHSA = projections(payInterval, hsa, )



//     return {
//         preTaxSavings,
//         employeePercent,
//         matchPercent
//     }
// }