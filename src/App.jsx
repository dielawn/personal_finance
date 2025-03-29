import './App.css'
import { useEffect, useState} from 'react'
import PayStub from './PayStub'
import AccountBalanceForm from './AccountBalanceForm';
import DebtTrackerForm from './DebtTrackerForm';
import HousingExpenses from './HousingExpenses.jsx';
import TransportExpenses from './TransportExpenses.jsx';
import PersonalExpenses from './PersonalExpenses.jsx';
import RecurringExpenses from './RecurringExpenses.jsx';
import PostTaxSavings from './PostTaxSavings.jsx';

function App() {
  const [payStubData, setPayStubData] = useState([]);
  const [showAddSpouse, setShowAddSpouse] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
    // Separate state for the total (derived from payStubData)
  const [summary, setSummary] = useState({
    totalNetPay: 0
  });

  const [acctBalanceData, setAcctBalanceData] = useState(null);
  // State for storing all debt entries
  const [debtList, setDebtList] = useState([]);
  // Housing expenses data
  const [housingExpenses, setHousingExpenses] = useState({
    isOwner: true,
    mortgage: 0,
    homeValue: 0,
    intrestRate: 0,
    monthlyPayment: 0,
    allUtilities: 0,
  })
  //Transport expenses data
  const [transportExpenses, setTransportExpenses] = useState(null);
  //Personal expenses data
  const [personalExpenses, setPersonalExpenses] = useState(null);
  //Recurring expenses data
  const [recurringExpenses, setRecurringExpenses] = useState(null);
  //Post tax savings
  const [postTaxContributions, setPostTaxContributions] = useState(null);

  
  useEffect(() => {
    console.log('Calculating total net pay');
    const totalNetPay = payStubData.reduce((sum, stub) => sum + (stub.netPay || 0), 0);
    const preTaxSavings = payStubData.reduce((sum, stub) => 
      sum + (stub.retirement401k || 0) + (stub.hsa || 0), 0);

    // const iraContribution = 
    // const savingsContribution =
    

    setSummary({ totalNetPay, preTaxSavings });
  }, [payStubData]);

  useEffect(() => {
    // console.log('Pay stub', payStubData)
    // console.log('Acct Bal', acctBalanceData)
    // console.log('debts', debtList)
    // console.log('housing expenses', housingExpenses)
    // console.log('transport', transportExpenses)
    // console.log('personal exp', personalExpenses)
    // console.log('recurring exp', recurringExpenses)
    console.log('post tax', postTaxContributions, acctBalanceData)
  }, [postTaxContributions])





  return (
    <div>
       <header className="App-header">
        <h1>Personal Finance</h1>
      </header>
      <main>
        {/* Primary Pay Stub */}
        <PayStub id="primary" label="Primary Pay Stub" setPayStubData={setPayStubData} />
        
        {/* Spouse Pay Stub (conditionally shown) */}
        {showAddSpouse && (
          <div className="additional-paystub">
            <h2>Spouse Pay Stub</h2>
            <PayStub id="spouse" label="Spouse Pay Stub" setPayStubData={setPayStubData} />
          </div>
        )}
        
        {/* Second Job Pay Stub (conditionally shown) */}
        {showAddJob && (
          <div className="additional-paystub">
            <h2>Secondary Job</h2>
            <PayStub id="secondary-job" label="Secondary Job" setPayStubData={setPayStubData} />
          </div>
        )}
        
        {/* Buttons to add more pay stubs */}
        <div className="add-buttons">
          {!showAddSpouse && (
            <button onClick={() => setShowAddSpouse(true)}>Add Spouse Pay Stub</button>
          )}
          
          {!showAddJob && (
            <button onClick={() => setShowAddJob(true)}>Add Secondary Job</button>
          )}
        </div>
        
        {/* Summary of all pay stubs */}
        {payStubData.length > 0 && (
          <div className="data-summary">
            <h2>Pay Stub Summary</h2>
            <div className="total-summary">
              <h3>Total Net Pay: ${summary.totalNetPay.toFixed(2)}</h3>
            </div>
            
            {payStubData.map(stub => (
              <div key={stub.id} className="stub-summary">
                <h4>{stub.label}</h4>
                <p>Gross Pay: ${stub.grossPay.toFixed(2)}</p>
                <p>Total Deductions: ${stub.totalDeductions.toFixed(2)}</p>
                <p>Net Pay: ${stub.netPay.toFixed(2)}</p>
              </div>
            ))}
            
            {/* Debug view of full data */}
            {/* <details>
              <summary>Raw Data</summary>
              <div>
                <h4>Pay Stub Data:</h4>
                <pre>{JSON.stringify(payStubData, null, 2)}</pre>
                <h4>Summary Data:</h4>
                <pre>{JSON.stringify(summary, null, 2)}</pre>
              </div>
            </details> */}
          </div>
        )}
      </main>
      
      <AccountBalanceForm setAcctBalanceData={setAcctBalanceData} />
      <DebtTrackerForm setDebtList={setDebtList} />
      <HousingExpenses setHousingExpenses={setHousingExpenses}/>
      <TransportExpenses setTransportExpenses={setTransportExpenses} />
      <PersonalExpenses setPersonalExpenses={setPersonalExpenses} />
      <RecurringExpenses setReOccuringExpenses={setRecurringExpenses} />
      <PostTaxSavings setPostTaxContributions={setPostTaxContributions} paycheck={payStubData.netPay} acctBalanceData={acctBalanceData}/>
    </div>
  )
}

export default App
