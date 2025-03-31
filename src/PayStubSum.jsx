import './Summary.css'
import { handlePayInterval, formatCurrency } from './utils/utils';

const PayStubSummary = ({ payStubData }) => {

    const grossPay = payStubData[0].grossPay;
    const netPay = payStubData[0].netPay
    const payInterval = payStubData[0].payInterval;
   
    

    const netPayInterval = handlePayInterval(netPay, payInterval);
    const grossPayInterval = handlePayInterval(grossPay, payInterval);

    return (
        <div className="pay-equivalents flex">

            <div className="card">
            <div className="pay-row">
                <span>Weekly Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.weeklyPay)}</span>
            </div>
            <div className="pay-row">
                <span>Bi-Weekly Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.biWeeklyPay)}</span>
            </div>
            <div className="pay-row">
                <span>Monthly Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.monthlyPay)}</span>
            </div>
            <div className="pay-row">
                <span>Annual Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.annualPay)}</span>
            </div>       
            </div>

            <div className="card">
            <div className="pay-row">
                <span>Weekly Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.weeklyPay)}</span>
            </div>
            <div className="pay-row">
                <span>Bi-Weekly Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.biWeeklyPay)}</span>
            </div>
            <div className="pay-row">
                <span>Monthly Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.monthlyPay)}</span>
            </div>
            <div className="pay-row">
                <span>Annual Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.annualPay)}</span>
            </div>   
            </div>
                 
        </div>
    )
};

export default PayStubSummary;