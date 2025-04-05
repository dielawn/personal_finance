import { useEffect, useState } from 'react';
import './Summary.css'
import { handlePayInterval, formatCurrency, formatPercent } from './utils/utils';
import { getPayIntervalMultipliers } from './utils/utils';
import ProjectGrowth from './ProjectGrowth';

const AccountsSummary = ({acctBalanceData, payStubData, postTaxContributions}) => {
    const [preTaxRateGoal, setPreTaxRateGoal] = useState(false);
    const [postTaxRateGoal, setPostTaxRateGoal] = useState(false);

    // Multipliers for different time periods
    const payInterval = payStubData[0].payInterval;
    const multipliers = getPayIntervalMultipliers(payInterval)
    
    //Pre tax accounts    
    const _401kCont = handlePayInterval(payStubData[0].retirement401k, payInterval);
    const _401kMatch = handlePayInterval(payStubData[0].match401k, payInterval);
    const hsaCont = handlePayInterval(payStubData[0].hsa, payInterval);
    
    //Post tax accounts
    const iraContribution = handlePayInterval(postTaxContributions?.accounts[1]?.amount, payInterval);
    const savingsAcctContribution = handlePayInterval(postTaxContributions?.accounts[0]?.amount, payInterval);
    
    const totalSavings = _401kCont.annualPay + hsaCont.annualPay + iraContribution.annualPay + savingsAcctContribution.annualPay
          
    const grossPay = handlePayInterval(payStubData[0]?.grossPay, payInterval) || 0;  
    const netPay = handlePayInterval(payStubData[0]?.netPay, payInterval) || 0;
    
    // Savings Rate calculations
    const preTaxSavingsRate = (totalSavings / grossPay.annualPay * 100 || 0);
    const postTaxSavingsRate = (totalSavings / netPay.annualPay) * 100 || 0;
 
    // Create a modified accounts array without mutating the original data
    const enhancedAccounts = [...acctBalanceData.accountsList].map((account, index) => {
        // Create a deep copy of the account to avoid mutating props
        const enhancedAccount = {...account};
        
        // Add savings account contribution (assuming index 0 is savings account)
        if (index === 1) {
            enhancedAccount.contribution = {
                monthlyPay: savingsAcctContribution.monthlyPay,
                annualPay: savingsAcctContribution.annualPay
            };
            // Add an empty match property with zero values
            enhancedAccount.match = {
                monthlyPay: 0,
                annualPay: 0
            };
        }
        
        // Add IRA contribution 
        if (index === 2) {
            enhancedAccount.contribution = {
                monthlyPay: iraContribution.monthlyPay,
                annualPay: iraContribution.annualPay
            };
            // Add an empty match property with zero values
            enhancedAccount.match = {
                monthlyPay: 0,
                annualPay: 0
            };
        }
        
        // Add HSA contribution
        if (index === 3) {
            enhancedAccount.contribution = hsaCont;
            // Add an empty match property with zero values to HSA
            enhancedAccount.match = {
                monthlyPay: 0,
                annualPay: 0
            };
        }
        
        // Add 401k contributions
        if (index === 4) {
            enhancedAccount.match = _401kMatch;
            enhancedAccount.contribution = _401kCont;
        }
        
        return enhancedAccount;
    });

    function checkGoals(savingsRate, setter) {

        // Goal pre tax savings rate >= 20%
        if (savingsRate >= 20) {
            //Goal met
            setter(true);
        } else {
            setter(false)
        }


    }

    useEffect(() => {
        checkGoals(preTaxSavingsRate, setPreTaxRateGoal)
        checkGoals(postTaxSavingsRate, setPostTaxRateGoal)
    })

    useEffect(() => {
        console.log('accts', acctBalanceData);
        console.log('enhanced accounts', enhancedAccounts);
        console.log('HSA cont', hsaCont);
        console.log('Post-tax contributions', postTaxContributions);
        console.log('IRA contribution', {
            monthly: iraContribution.monthlyPay,
            annual: iraContribution.annualPay
        });
        console.log('Savings account contribution', {
            monthly: savingsAcctContribution.monthlyPay,
            annual: savingsAcctContribution.annualPay
        });
        
       console.log('gross net', grossPay, netPay)
    }, [acctBalanceData, postTaxContributions]);

    return (
        <div className="summary-section">
            <h3>Account Balances</h3>
        
            <div className="accounts-list">
                {enhancedAccounts.map(account => (
                    <div key={account.id} className="card">
                        <p className="account-row">
                            <span className='acct-label'>{account.label} Balance:</span> 
                            <span className='summary-value'>{formatCurrency(account.value)}</span>
                        </p>
                        <div className='flexColumn'>
                   
                        {/* Show contributions if either match or contribution exists */}
                        {account.contribution && (
                            <>

                             <div className="flex acct-card">
                             <div className="monthly card flex">
                                <h5 className='acct-label'>Monthly</h5>
                                <p className="account-row">
                                    <span className='sub-acct'>Contributions:</span>
                                    <span className='sub-acct-value'>{formatCurrency(account.contribution.monthlyPay)}</span>
                                </p>
                                {account.match && account.match.monthlyPay > 0 && (
                                    <p className="account-row">
                                        <span className='sub-acct'>Employer Match:</span>
                                        <span className='sub-acct-value'>{formatCurrency(account.match.monthlyPay)}</span>
                                    </p>
                                )}
                                <p className="account-row">
                                    <span className='sub-acct'>Total:</span>
                                    <span className='sub-acct-value'>
                                        {formatCurrency(
                                            account.contribution.monthlyPay + 
                                            (account.match ? account.match.monthlyPay : 0)
                                        )}
                                    </span>
                                </p>
                            </div>

                            <div className="annual card flex">
                                <h5 className='acct-label'>Annual</h5>
                                <p className="account-row">
                                    <span className='sub-acct'>Contributions:</span>
                                    <span className='sub-acct-value'>{formatCurrency(account.contribution.annualPay)}</span>
                                </p>
                                {account.match && account.match.annualPay > 0 && (
                                    <p className="account-row">
                                        <span className='sub-acct'>Employer Match:</span>
                                        <span className='sub-acct-value'>{formatCurrency(account.match.annualPay)}</span>
                                    </p>
                                )}
                                <p className="account-row">
                                    <span className='sub-acct'>Total:</span>
                                    <span className='sub-acct-value'>
                                        {formatCurrency(
                                            account.contribution.annualPay + 
                                            (account.match ? account.match.annualPay : 0)
                                        )}
                                    </span>
                                    
                                </p>
                                
                            </div>
                             </div>
                            
                            <ProjectGrowth 
                                        acctName={account.label}
                                        initialBalance={account.value} 
                                        annualContribution={account.contribution.annualPay}
                                    />
                            </>
                        )}
                        </div>
                    </div>
                ))}
            </div>
            
            
            
            {/* Optional: Display Savings Rates */}
           <div className="flexColumn">
           <div className="savings-rates card">
                <h4>Savings Rates</h4>
               
                    <p>Good advice save at least 10% of your pre tax income</p>
                    <p>Wealth goal? Save 20% or more of your pre tax income</p>

                
                <p className="account-row">
                    <span>Pre-Tax Savings Rate:</span>
                    <span>{formatPercent(preTaxSavingsRate)}{preTaxRateGoal?' ✅':' ❌'}</span>
                </p>
                <p className="account-row">
                    <span>Post-Tax Savings Rate:</span>
                    <span>{formatPercent(postTaxSavingsRate)}{postTaxRateGoal?' ✅':' ❌'}</span>
                </p>
                <p className="account-row">
                <span>Total Assets:</span>
                <span>{formatCurrency(acctBalanceData.totalAssets || 0)}</span>              
            </p>
            </div>
            <ProjectGrowth acctName={'All Account Balances'} initialBalance={acctBalanceData.totalAssets} annualContribution={totalSavings}/>
           </div>
        </div>
    );
};

export default AccountsSummary;