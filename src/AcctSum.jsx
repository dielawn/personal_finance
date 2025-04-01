import { useEffect, useState } from 'react';
import './Summary.css'
import { handlePayInterval, formatCurrency } from './utils/utils';
import { getPayIntervalMultipliers } from './utils/utils';

const AccountsSummary = ({acctBalanceData, payStubData, postTaxContributions}) => {
    // Multipliers for different time periods
    const payInterval = payStubData[0].payInterval;
    const multipliers = getPayIntervalMultipliers(payInterval)

    //Pre tax accounts    
    const _401kCont = handlePayInterval(payStubData[0].retirement401k, payInterval);
    const _401kMatch = handlePayInterval(payStubData[0].match401k, payInterval);
    const hsaCont = handlePayInterval(payStubData[0].hsa, payInterval);
    
    //Post tax accounts
    // Annual post-tax values
    const totalPostTaxContributions = postTaxContributions?.total_contributions || 0;
    const iraContribution = handlePayInterval(postTaxContributions?.accounts[1]?.amount, payInterval);
    const savingsAcctContribution = handlePayInterval(postTaxContributions?.accounts[0]?.amount, payInterval);
    
    const totalSavings = _401kCont.annualPay + hsaCont.annualPay + iraContribution.annualPay + savingsAcctContribution.annualPay
    // Monthly post-tax values
    const monthlyIraContributions = iraContribution.monthlyPay;
    const monthlySavingsAcctContributions = savingsAcctContribution.monthlyPay;
    const monthlyTotalPostTaxContributions = totalPostTaxContributions;
    
    // Annual post-tax values
    const annualIraContributions = iraContribution.annualPay;
    const annualSavingsAcctContributions = savingsAcctContribution.annualPay;
    const annualTotalPostTaxContributions = totalPostTaxContributions;
    
    // Calculate pre-tax total (assuming this is what you want)
    const totalPreTaxContributions = _401kCont?.annualPay + hsaCont?.annualPay;
    
    // These would need to be passed in or calculated
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
                monthlyPay: monthlySavingsAcctContributions,
                annualPay: annualSavingsAcctContributions
            };
            // Add an empty match property with zero values
            enhancedAccount.match = {
                monthlyPay: 0,
                annualPay: 0
            };
        }
        
        // Add IRA contribution (assuming index 1 is IRA)
        if (index === 2) {
            enhancedAccount.contribution = {
                monthlyPay: monthlyIraContributions,
                annualPay: annualIraContributions
            };
            // Add an empty match property with zero values
            enhancedAccount.match = {
                monthlyPay: 0,
                annualPay: 0
            };
        }
        
        // Add HSA contribution to index 3 (assuming this is the HSA account)
        if (index === 3) {
            enhancedAccount.contribution = hsaCont;
            // Add an empty match property with zero values to HSA
            enhancedAccount.match = {
                monthlyPay: 0,
                annualPay: 0
            };
        }
        
        // Add 401k contributions to index 4 (assuming this is the 401k account)
        if (index === 4) {
            enhancedAccount.match = _401kMatch;
            enhancedAccount.contribution = _401kCont;
        }
        
        return enhancedAccount;
    });

    useEffect(() => {
        console.log('accts', acctBalanceData);
        console.log('enhanced accounts', enhancedAccounts);
        console.log('HSA cont', hsaCont);
        console.log('Post-tax contributions', postTaxContributions);
        console.log('IRA contribution', {
            monthly: monthlyIraContributions,
            annual: annualIraContributions
        });
        console.log('Savings account contribution', {
            monthly: monthlySavingsAcctContributions,
            annual: annualSavingsAcctContributions
        });
        
       console.log('gross net', grossPay, netPay)
        console.log('pre', totalPreTaxContributions, 'post', totalPostTaxContributions)
    }, [acctBalanceData, postTaxContributions]);

    return (
        <div className="summary-section">
            <h3>Account Balances</h3>
        
            <div className="accounts-list">
                {enhancedAccounts.map(account => (
                    <div key={account.id} className="card">
                        <p className="account-row">
                            <span className='acct-name'>{account.label}:</span> 
                            <span className='summary-value'>{formatCurrency(account.value)}</span>
                        </p>
                        <div className='flex'>
                   
                        {/* Show contributions if either match or contribution exists */}
                        {account.contribution && (
                            <>
                             <div className="monthly card">
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

                            <div className="annual card">
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
                            </>
                        )}
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="total-row">
                <span>Total Assets:</span>
                <span>{formatCurrency(acctBalanceData.totalAssets || 0)}</span>              
            </p>
            
            {/* Optional: Display Savings Rates */}
            <div className="savings-rates card">
                <h4>Savings Rates</h4>
                <p className="account-row">
                    <span>Pre-Tax Savings Rate:</span>
                    <span>{preTaxSavingsRate.toFixed(2)}%</span>
                </p>
                <p className="account-row">
                    <span>Post-Tax Savings Rate:</span>
                    <span>{postTaxSavingsRate.toFixed(2)}%</span>
                </p>
            </div>
        </div>
    );
};

export default AccountsSummary;