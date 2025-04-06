import './Summary.css'
import { handlePayInterval, formatCurrency } from './utils/utils';
import PieChart from './PieChart';

const PayStubSummary = ({ payStubData }) => {
    const {
        federalTax, 
        dentalInsurance, 
        healthInsurance, 
        visionInsurance,
        hsa, 
        medicare, 
        retirement401k, 
        socialSecurity, 
        stateTax,
        grossPay,
        netPay,
        payInterval
    } = payStubData[0]
  
    const colors = ['#F2F4CB', '#A5D0A8','#96BD99', '#99BFA8', '#8CADA7', '#64520F', '#B7990D', '#D5C76C', ]
    const deductions = [
        {
            label: 'Federal Tax',
            color: colors[1],
            amount: federalTax
        },
        {
            label: 'State Tax',
            color: colors[2],
            amount: stateTax
        },
        {
            label: 'Social Security',
            color: colors[3],
            amount: socialSecurity
        },
        {
            label: 'Medicare',
            color: colors[4],
            amount: medicare
        },
        {
            label: '401k',
            color: colors[5],
            amount: retirement401k
        },
        {
            label: 'Health Insurance',
            color: colors[6],
            amount: dentalInsurance + healthInsurance + visionInsurance + hsa
        },
    ]

    const netPayInterval = handlePayInterval(netPay, payInterval);
    const grossPayInterval = handlePayInterval(grossPay, payInterval);

    return (
        <div className="pay-equivalents flex">
            <PieChart 
                title={'Pay Check'}
                income={grossPay}
                color={colors[0]}
                expenses={deductions}
            />
            <div className="card">
            <div className="pay-row">
                <span>Weekly Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.weekly)}</span>
            </div>
            <div className="pay-row">
                <span>Bi-Weekly Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.biWeekly)}</span>
            </div>
            <div className="pay-row">
                <span>Monthly Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.monthly)}</span>
            </div>
            <div className="pay-row">
                <span>Annual Gross Pay:</span>
                <span className="pay-amount">{formatCurrency(grossPayInterval.annual)}</span>
            </div>       
            </div>

            <div className="card">
            <div className="pay-row">
                <span>Weekly Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.weekly)}</span>
            </div>
            <div className="pay-row">
                <span>Bi-Weekly Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.biWeekly)}</span>
            </div>
            <div className="pay-row">
                <span>Monthly Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.monthly)}</span>
            </div>
            <div className="pay-row">
                <span>Annual Net Pay:</span>
                <span className="pay-amount">{formatCurrency(netPayInterval.annual)}</span>
            </div>   
            </div>
                 
        </div>
    )
};

export default PayStubSummary;