import { useEffect, useState } from 'react';
import './Summary.css'
import { handlePayInterval, formatCurrency } from './utils/utils';

const AccountsSummary = ({acctBalanceData, payStubData}) => {

    const [data, setData] = useState([]);

    const payInterval = payStubData[0].payInterval;
    const _401kCont = handlePayInterval(payStubData[0].retirement401k, payInterval);
    const _401kMatch = handlePayInterval(payStubData[0].match401k, payInterval);

    const hsaCont = handlePayInterval(payStubData[0].hsa, payInterval);
 
    // If acctBalanceData is an object with accountsList property
const accounts = [
    acctBalanceData.accountsList[3],  // Add the object at index 3
    {id: 'hsaBalance', label: 'HSA Contribution', value: hsaCont}, 
    acctBalanceData.accountsList[4],  // Add the object at index 4
    {id: '_401kCont', label: '401k Contribution', value: _401kCont},
    {id: '_401kMatch', label: '401k Match', value: _401kMatch},
    acctBalanceData.accountsList[2],  // Add the object at index 2
    acctBalanceData.accountsList[1],  // Add the object at index 1
    acctBalanceData.accountsList[0]   // Add the object at index 0
  ]

    useEffect(() => {
        console.log('accts', acctBalanceData)
    }, [acctBalanceData])

    return (
    <div className="summary-section">
        <h3>Account Balances</h3>
    
        <div className="accounts-list">
  {acctBalanceData.accountsList?.map(account => (
    <div key={account.id} className="account-item card">
      <p className="account-row">
        <span className='label-txt'>{account.label}:</span> 
        <span>{formatCurrency(account.value)}</span>
      </p>
     
     

    </div>
  ))}

</div>
        <p>
        <span>Total Assets: </span>
        <span>{formatCurrency(acctBalanceData.totalAssets || 0)}</span>              
        </p>
    </div>
    )
};

export default AccountsSummary