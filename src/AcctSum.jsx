import './Summary.css'
import { handlePayInterval, formatCurrency, formatPercent } from './utils/utils';
import ProjectGrowth from './ProjectGrowth';
import { useEffect, useState } from 'react';
import MultiProjectGrowth from './MultiGrowth';

const AccountsSummary = ({acctBalanceData, payStubData, postTaxContributions}) => {
    const [allAccts, setAllAccts] = useState([]);
    const { payInterval, retirement401k, match401k, hsa, grossPay, netPay } = payStubData[0]
    
    // Pre tax accounts    
    const _401kContInterval = handlePayInterval(retirement401k, payInterval);
    const _401kMatch = handlePayInterval(match401k, payInterval);
    const hsaContInterval = handlePayInterval(hsa, payInterval);
    
    // Post tax accounts
    const iraContInterval = handlePayInterval(postTaxContributions?.accounts[1]?.amount || 0, payInterval);
    const savingsAcctContInterval = handlePayInterval(postTaxContributions?.accounts[0]?.amount || 0, payInterval);
    
    const totalSavings = _401kContInterval.annual + hsaContInterval.annual + iraContInterval.annual + savingsAcctContInterval.annual
          
    const grossPayInterval = handlePayInterval(grossPay, payInterval) || 0;  
    const netPayInterval = handlePayInterval(netPay, payInterval) || 0;
    
    // Savings Rate calculations
    const preTaxSavingsRate = (totalSavings / grossPayInterval.annual) * 100 || 0;
    const postTaxSavingsRate = (totalSavings / netPayInterval.annual) * 100 || 0;

    // Account type map to identify accounts by ID or label
    const accountTypeMap = {
        '401k': { label: '401(k)', contInterval: _401kContInterval, match: _401kMatch },
        '401(k)': { label: '401(k)', contInterval: _401kContInterval, match: _401kMatch },
        'ira': { label: 'IRA', contInterval: iraContInterval, match: null },
        'hsa': { label: 'HSA', contInterval: hsaContInterval, match: null },
        'savings': { label: 'Savings Account', contInterval: savingsAcctContInterval, match: null },
        'checking': { label: 'Checking Account', contInterval: null, match: null }
    };

    useEffect(() => {
        // Process accounts from accountsList
        if (acctBalanceData?.accountsList?.length > 0) {
            const processedAccounts = buildAccountObjects(acctBalanceData.accountsList);
            console.log('Processed accounts:', processedAccounts);
            setAllAccts(processedAccounts);
        }
    }, [acctBalanceData]);

    // Function to build account objects based on the accounts in accountsList
    function buildAccountObjects(accountsList) {
        return accountsList.map(account => {
            // Normalize account id to lowercase for matching
            const accountType = account.id.toLowerCase();
            const accountLabel = account.label;
            
            // Try to find matching account type in our map
            let matchedType = null;
            
            // First try matching by ID
            if (accountTypeMap[accountType]) {
                matchedType = accountTypeMap[accountType];
            } 
            // Then try partial matching of the label
            else {
                for (const [key, value] of Object.entries(accountTypeMap)) {
                    if (accountLabel.toLowerCase().includes(key.toLowerCase())) {
                        matchedType = value;
                        break;
                    }
                }
            }
            
            // Default values for years and growth rate
            const defaultYears = 30;
            const defaultGrowthRate = 7;
            
            // If no match found, create a generic account object
            if (!matchedType) {
                return {
                    id: account.id,
                    acctName: account.label,
                    initialBalance: account.value || 0,
                    annualContribution: 0,
                    years: defaultYears,
                    growthRate: defaultGrowthRate,
                    contribution: null,
                    match: null
                };
            }
            
            // Create account object with appropriate contribution intervals
            // and include the specific properties needed for MultiProjectGrowth
            const annualContribution = matchedType.contInterval ? 
                matchedType.contInterval.annual + (matchedType.match ? matchedType.match.annual : 0) : 0;
                
            return {
                id: account.id,
                acctName: account.label,
                label: account.label,
                initialBalance: account.value || 0,
                annualContribution: annualContribution,
                years: defaultYears,
                growthRate: defaultGrowthRate,
                contribution: matchedType.contInterval,
                match: matchedType.match
            };
        });
    }

    return (
        <div className="summary-section">
            <h3>Account Balances</h3>
        
            <div className="accounts-list">
                {allAccts.map(account => (
                    <div key={account.id} className="card">
                        <p className="account-row">
                            <span className='acct-label'>{account.label} Balance:</span> 
                            <span className='summary-value'>{formatCurrency(account.initialBalance)}</span>
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
                                        <span className='sub-acct-value'>{formatCurrency(account.contribution.monthly)}</span>
                                    </p>
                                    {account.match && account.match.monthly > 0 && (
                                        <p className="account-row">
                                            <span className='sub-acct'>Employer Match:</span>
                                            <span className='sub-acct-value'>{formatCurrency(account.match.monthly)}</span>
                                        </p>
                                    )}
                                    <p className="account-row">
                                        <span className='sub-acct'>Total:</span>
                                        <span className='sub-acct-value'>
                                            {formatCurrency(
                                                account.contribution.monthly + 
                                                (account.match ? account.match.monthly : 0)
                                            )}
                                        </span>
                                    </p>
                                </div>

                                <div className="annual card flex">
                                    <h5 className='acct-label'>Annual</h5>
                                    <p className="account-row">
                                        <span className='sub-acct'>Contributions:</span>
                                        <span className='sub-acct-value'>{formatCurrency(account.contribution.annual)}</span>
                                    </p>
                                    {account.match && account.match.annual > 0 && (
                                        <p className="account-row">
                                            <span className='sub-acct'>Employer Match:</span>
                                            <span className='sub-acct-value'>{formatCurrency(account.match.annual)}</span>
                                        </p>
                                    )}
                                    <p className="account-row">
                                        <span className='sub-acct'>Total:</span>
                                        <span className='sub-acct-value'>
                                            {formatCurrency(
                                                account.contribution.annual + 
                                                (account.match ? account.match.annual : 0)
                                            )}
                                        </span>
                                    </p>
                                </div>
                             </div>
                            
                            <ProjectGrowth 
                                acctName={account.label}
                                initialBalance={account.initialBalance} 
                                annualContribution={account.contribution.annual}
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
                        <span>{formatPercent(preTaxSavingsRate)}</span>
                    </p>
                    <p className="account-row">
                        <span>Post-Tax Savings Rate:</span>
                        <span>{formatPercent(postTaxSavingsRate)}</span>
                    </p>
                    <p className="account-row">
                        <span>Total Assets:</span>
                        <span>{formatCurrency(acctBalanceData.totalAssets || 0)}</span>              
                    </p>
                </div>
                <MultiProjectGrowth 
                    acctsArray={allAccts}                    
                />
           </div>
        </div>
    );
};

export default AccountsSummary;