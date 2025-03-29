import React, { useState, useEffect } from 'react';
import './TransportExpenses.css'
const TransportExpenses = ({ setTransportExpenses }) => {
    // Main transport type state
    const [transportMode, setTransportMode] = useState('');
    
    // Vehicle states
    const [vehicles, setVehicles] = useState([{
      name: '',
      paymentStatus: '',
      vehiclePayment: '',
      loanBalance: '',
      interestRate: '',
      fuelExpense: '',
      insurance: '',
      maintenance: ''
    }]);
    
    // Lease states
    const [leasePayment, setLeasePayment] = useState('');
    const [leaseFuelExpense, setLeaseFuelExpense] = useState('');
    const [leaseInsurance, setLeaseInsurance] = useState('');
    
    // Ride service states
    const [monthlyRideServices, setMonthlyRideServices] = useState('');
    
    // Public transport states
    const [monthlyPublicTransport, setMonthlyPublicTransport] = useState('');
    const [transportPasses, setTransportPasses] = useState([{ type: '', cost: '' }]);
    
    // Handle changing vehicle payment status
    const handlePaymentStatusChange = (index, value) => {
      console.log(`Changing payment status for vehicle ${index} to ${value}`);
      const updatedVehicles = [...vehicles];
      updatedVehicles[index].paymentStatus = value;
      setVehicles(updatedVehicles);
    };
    
    // Handle vehicle field changes
    const handleVehicleFieldChange = (index, field, value) => {
      console.log(`Changing ${field} for vehicle ${index} to ${value}`);
      const updatedVehicles = [...vehicles];
      updatedVehicles[index][field] = value;
      setVehicles(updatedVehicles);
    };
    
    // Handle adding another vehicle
    const handleAddVehicle = () => {
      console.log('Adding new vehicle');
      setVehicles([...vehicles, {
        name: '',
        paymentStatus: '',
        vehiclePayment: '',
        loanBalance: '',
        interestRate: '',
        fuelExpense: '',
        insurance: '',
        maintenance: ''
      }]);
    };
    
    // Handle removing a vehicle
    const handleRemoveVehicle = (index) => {
      console.log(`Removing vehicle at index ${index}`);
      // Don't remove if it's the only vehicle
      if (vehicles.length > 1) {
        const updatedVehicles = vehicles.filter((_, i) => i !== index);
        setVehicles(updatedVehicles);
      }
    };
    
    // Handle adding another transport pass
    const handleAddTransportPass = () => {
      console.log('Adding new transport pass field');
      setTransportPasses([...transportPasses, { type: '', cost: '' }]);
    };
    
    // Handle transport pass type change
    const handlePassTypeChange = (index, value) => {
      console.log(`Changing pass type at index ${index} to ${value}`);
      const updatedPasses = [...transportPasses];
      updatedPasses[index].type = value;
      setTransportPasses(updatedPasses);
    };
    
    // Handle transport pass cost change
    const handlePassCostChange = (index, value) => {
      console.log(`Changing pass cost at index ${index} to ${value}`);
      const updatedPasses = [...transportPasses];
      updatedPasses[index].cost = value;
      setTransportPasses(updatedPasses);
    };
    
    // Calculate total for each owned vehicle
    const calculateVehicleTotal = (vehicle) => {
    //   console.log('Calculating vehicle total');
      let total = 0;
      if (vehicle.paymentStatus === 'making-payments' && vehicle.vehiclePayment) {
        total += parseFloat(vehicle.vehiclePayment);
      }
      if (vehicle.fuelExpense) total += parseFloat(vehicle.fuelExpense);
      if (vehicle.insurance) total += parseFloat(vehicle.insurance);
      if (vehicle.maintenance) total += parseFloat(vehicle.maintenance);
      return total.toFixed(2);
    };
    
    // Calculate total for all vehicles
    const calculateAllVehiclesTotal = () => {
    //   console.log('Calculating all vehicles total');
      let total = 0;
      
      vehicles.forEach(vehicle => {
        total += parseFloat(calculateVehicleTotal(vehicle));
      });
      
      return total.toFixed(2);
    };
    
    // Calculate total for leased vehicle
    const calculateLeasedVehicleTotal = () => {
      console.log('Calculating leased vehicle total');
      let total = 0;
      if (leasePayment) total += parseFloat(leasePayment);
      if (leaseFuelExpense) total += parseFloat(leaseFuelExpense);
      if (leaseInsurance) total += parseFloat(leaseInsurance);
      return total.toFixed(2);
    };
    
    // Calculate total for public transport
    const calculatePublicTransportTotal = () => {
      console.log('Calculating public transport total');
      let total = 0;
      if (monthlyPublicTransport) total += parseFloat(monthlyPublicTransport);
      
      transportPasses.forEach(pass => {
        if (pass.cost) {
          total += parseFloat(pass.cost);
        }
      });
      
      return total.toFixed(2);
    };
    
    // Calculate total transport expenses
    const calculateTotalTransportExpenses = () => {
    //   console.log('Calculating total transport expenses');
      let total = 0;
      
      switch (transportMode) {
        case 'own':
          total = parseFloat(calculateAllVehiclesTotal());
          break;
        case 'lease':
          total = parseFloat(calculateLeasedVehicleTotal());
          break;
        case 'ride':
          total = monthlyRideServices ? parseFloat(monthlyRideServices) : 0;
          break;
        case 'public':
          total = parseFloat(calculatePublicTransportTotal());
          break;
        default:
          total = 0;
      }
      
      return total.toFixed(2);
    };
    
    // Prepare data object to be sent to parent component
    const prepareDataObject = () => {
      // Base data structure
      const data = {
        transportMode,
        totalMonthlyExpenses: parseFloat(calculateTotalTransportExpenses())
      };
      
      // Add mode-specific details
      switch (transportMode) {
        case 'own':
          data.details = {
            vehicles: vehicles.map((vehicle, index) => ({
              id: index + 1,
              name: vehicle.name || `Vehicle ${index + 1}`,
              paymentStatus: vehicle.paymentStatus,
              vehiclePayment: vehicle.paymentStatus === 'making-payments' ? (parseFloat(vehicle.vehiclePayment) || 0) : 0,
              loanBalance: vehicle.paymentStatus === 'making-payments' ? (parseFloat(vehicle.loanBalance) || 0) : 0,
              interestRate: vehicle.paymentStatus === 'making-payments' ? (parseFloat(vehicle.interestRate) || 0) : 0,
              fuelExpense: parseFloat(vehicle.fuelExpense) || 0,
              insurance: parseFloat(vehicle.insurance) || 0,
              maintenance: parseFloat(vehicle.maintenance) || 0,
              total: parseFloat(calculateVehicleTotal(vehicle))
            })),
            totalAllVehicles: parseFloat(calculateAllVehiclesTotal())
          };
          break;
        case 'lease':
          data.details = {
            leasePayment: parseFloat(leasePayment) || 0,
            fuelExpense: parseFloat(leaseFuelExpense) || 0,
            insurance: parseFloat(leaseInsurance) || 0,
            total: parseFloat(calculateLeasedVehicleTotal())
          };
          break;
        case 'ride':
          data.details = {
            monthlyRideServices: parseFloat(monthlyRideServices) || 0
          };
          break;
        case 'public':
          const passes = {};
          transportPasses.forEach((pass, index) => {
            if (pass.type && pass.cost) {
              passes[pass.type] = parseFloat(pass.cost) || 0;
            } else if (pass.cost) {
              passes[`Pass ${index + 1}`] = parseFloat(pass.cost) || 0;
            }
          });
          
          data.details = {
            monthlyPublicTransport: parseFloat(monthlyPublicTransport) || 0,
            passes,
            total: parseFloat(calculatePublicTransportTotal())
          };
          break;
      }
      
      return data;
    };
    
    const handleSubmit = () => {
      console.log('Transport expenses form submitted');
      if (transportMode) {
        const data = prepareDataObject();
        setTransportExpenses(data);
      }
    };


    return (
      <div className="transport-expenses-container">
        <h2>Transportation Expenses</h2>
        
        {/* Transport Mode Selection */}
        <div className="transport-mode-selection">
          <h3>What is your primary mode of transportation?</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="own"
                checked={transportMode === 'own'}
                onChange={() => {
                  console.log('Selected: Own Vehicle');
                  setTransportMode('own');
                }}
              />
              Own Vehicle(s) / Make Payments
            </label>
            <label>
              <input
                type="radio"
                value="lease"
                checked={transportMode === 'lease'}
                onChange={() => {
                  console.log('Selected: Lease Vehicle');
                  setTransportMode('lease');
                }}
              />
              Lease Vehicle
            </label>
            <label>
              <input
                type="radio"
                value="ride"
                checked={transportMode === 'ride'}
                onChange={() => {
                  console.log('Selected: Ride Services');
                  setTransportMode('ride');
                }}
              />
              Ride Services (Uber, Lyft, Taxis)
            </label>
            <label>
              <input
                type="radio"
                value="public"
                checked={transportMode === 'public'}
                onChange={() => {
                  console.log('Selected: Public Transport');
                  setTransportMode('public');
                }}
              />
              Public Transportation
            </label>
          </div>
        </div>
        
        {/* Owned Vehicle Section */}
        {transportMode === 'own' && (
          <div className="owned-vehicle-section">
            <h3>Vehicle Expenses</h3>
            
            {vehicles.map((vehicle, index) => (
              <div key={index} className="vehicle-container">
                <h4>{vehicle.name || `Vehicle ${index + 1}`}</h4>
                
                <div className="form-group">
                  <label>Vehicle Name:</label>
                  <input
                    type="text"
                    value={vehicle.name}
                    onChange={(e) => handleVehicleFieldChange(index, 'name', e.target.value)}
                    placeholder="Enter vehicle name or description (e.g., Honda Civic, Family SUV)"
                  />
                </div>
                
                <div className="payment-status-selection">
                  <p>Is this vehicle paid off or are you making payments?</p>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="paid-off"
                        checked={vehicle.paymentStatus === 'paid-off'}
                        onChange={() => handlePaymentStatusChange(index, 'paid-off')}
                      />
                      Paid Off
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="making-payments"
                        checked={vehicle.paymentStatus === 'making-payments'}
                        onChange={() => handlePaymentStatusChange(index, 'making-payments')}
                      />
                      Making Payments
                    </label>
                  </div>
                </div>
                
                {vehicle.paymentStatus === 'making-payments' && (
                  <>
                    <div className="form-group">
                      <label>Monthly Vehicle Payment ($):</label>
                      <input
                        type="number"
                        value={vehicle.vehiclePayment}
                        onChange={(e) => handleVehicleFieldChange(index, 'vehiclePayment', e.target.value)}
                        placeholder="Enter monthly payment amount"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Remaining Loan Balance ($):</label>
                      <input
                        type="number"
                        value={vehicle.loanBalance}
                        onChange={(e) => handleVehicleFieldChange(index, 'loanBalance', e.target.value)}
                        placeholder="Enter remaining loan balance"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Interest Rate (%):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={vehicle.interestRate}
                        onChange={(e) => handleVehicleFieldChange(index, 'interestRate', e.target.value)}
                        placeholder="Enter loan interest rate"
                      />
                    </div>
                  </>
                )}
                
                <div className="form-group">
                  <label>Monthly Fuel Expense ($):</label>
                  <input
                    type="number"
                    value={vehicle.fuelExpense}
                    onChange={(e) => handleVehicleFieldChange(index, 'fuelExpense', e.target.value)}
                    placeholder="Enter monthly fuel cost"
                  />
                </div>
                
                <div className="form-group">
                  <label>Monthly Insurance ($):</label>
                  <input
                    type="number"
                    value={vehicle.insurance}
                    onChange={(e) => handleVehicleFieldChange(index, 'insurance', e.target.value)}
                    placeholder="Enter monthly insurance cost"
                  />
                </div>
                
                <div className="form-group">
                  <label>Monthly Maintenance ($):</label>
                  <input
                    type="number"
                    value={vehicle.maintenance}
                    onChange={(e) => handleVehicleFieldChange(index, 'maintenance', e.target.value)}
                    placeholder="Enter average monthly maintenance cost"
                  />
                </div>
                
                {vehicles.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveVehicle(index)} 
                    className="remove-vehicle-btn"
                  >
                    Remove Vehicle
                  </button>
                )}
                
                <div className="vehicle-total">
                  Total monthly expenses for Vehicle {index + 1}: ${calculateVehicleTotal(vehicle)}
                </div>
              </div>
            ))}
            
            <button type="button" onClick={handleAddVehicle} className="add-vehicle-btn">
              Add Another Vehicle
            </button>
            
            {vehicles.length > 1 && (
              <div className="all-vehicles-total">
                Total monthly expenses for all vehicles: ${calculateAllVehiclesTotal()}
              </div>
            )}
          </div>
        )}
        
        {/* Leased Vehicle Section */}
        {transportMode === 'lease' && (
          <div className="leased-vehicle-section">
            <h3>Leased Vehicle Expenses</h3>
            
            <div className="form-group">
              <label>Monthly Lease Payment ($):</label>
              <input
                type="number"
                value={leasePayment}
                onChange={(e) => {
                  console.log(`Lease payment changed to: ${e.target.value}`);
                  setLeasePayment(e.target.value);
                }}
                placeholder="Enter monthly lease payment"
              />
            </div>
            
            <div className="form-group">
              <label>Monthly Fuel Expense ($):</label>
              <input
                type="number"
                value={leaseFuelExpense}
                onChange={(e) => {
                  console.log(`Lease fuel expense changed to: ${e.target.value}`);
                  setLeaseFuelExpense(e.target.value);
                }}
                placeholder="Enter monthly fuel cost"
              />
            </div>
            
            <div className="form-group">
              <label>Monthly Insurance ($):</label>
              <input
                type="number"
                value={leaseInsurance}
                onChange={(e) => {
                  console.log(`Lease insurance changed to: ${e.target.value}`);
                  setLeaseInsurance(e.target.value);
                }}
                placeholder="Enter monthly insurance cost"
              />
            </div>
          </div>
        )}
        
        {/* Ride Services Section */}
        {transportMode === 'ride' && (
          <div className="ride-services-section">
            <h3>Ride Service Expenses</h3>
            
            <div className="form-group">
              <label>Monthly Ride Service Expenses ($):</label>
              <input
                type="number"
                value={monthlyRideServices}
                onChange={(e) => {
                  console.log(`Ride services expense changed to: ${e.target.value}`);
                  setMonthlyRideServices(e.target.value);
                }}
                placeholder="Enter average monthly ride service costs"
              />
              <small>Include Uber, Lyft, taxis, and other ride services</small>
            </div>
          </div>
        )}
        
        {/* Public Transportation Section */}
        {transportMode === 'public' && (
          <div className="public-transport-section">
            <h3>Public Transportation Expenses</h3>
            
            <div className="form-group">
              <label>Monthly Public Transport Expenses ($):</label>
              <input
                type="number"
                value={monthlyPublicTransport}
                onChange={(e) => {
                  console.log(`Public transport expense changed to: ${e.target.value}`);
                  setMonthlyPublicTransport(e.target.value);
                }}
                placeholder="Enter monthly public transport costs"
              />
              <small>Include individual tickets or fares not covered by passes</small>
            </div>
            
            <h4>Transit Passes</h4>
            {transportPasses.map((pass, index) => (
              <div className="pass-row" key={index}>
                <input
                  type="text"
                  value={pass.type}
                  onChange={(e) => handlePassTypeChange(index, e.target.value)}
                  placeholder="Pass type (e.g., Monthly Bus Pass)"
                />
                <input
                  type="number"
                  value={pass.cost}
                  onChange={(e) => handlePassCostChange(index, e.target.value)}
                  placeholder="Cost ($)"
                />
              </div>
            ))}
            
            <button type="button" onClick={handleAddTransportPass} className="add-pass-btn">
              Add Another Pass
            </button>
          </div>
        )}
        
        {/* Summary Section */}
        {transportMode && (
          <div className="summary-section">
            <h3>Monthly Transportation Summary</h3>
            
            {transportMode === 'own' && (
              <>
                {vehicles.map((vehicle, index) => (
                  <div key={index} className="vehicle-summary">
                    <h4>{vehicle.name || `Vehicle ${index + 1}`}</h4>
                    {vehicle.paymentStatus === 'making-payments' && (
                      <div className="summary-row">
                        <span>Vehicle Payment:</span>
                        <span>${vehicle.vehiclePayment || '0.00'}</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Fuel:</span>
                      <span>${vehicle.fuelExpense || '0.00'}</span>
                    </div>
                    <div className="summary-row">
                      <span>Insurance:</span>
                      <span>${vehicle.insurance || '0.00'}</span>
                    </div>
                    <div className="summary-row">
                      <span>Maintenance:</span>
                      <span>${vehicle.maintenance || '0.00'}</span>
                    </div>
                    <div className="summary-row vehicle-subtotal">
                      <span>{vehicle.name || `Vehicle ${index + 1}`} Subtotal:</span>
                      <span>${calculateVehicleTotal(vehicle)}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {transportMode === 'lease' && (
              <>
                <div className="summary-row">
                  <span>Lease Payment:</span>
                  <span>${leasePayment || '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span>Fuel:</span>
                  <span>${leaseFuelExpense || '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span>Insurance:</span>
                  <span>${leaseInsurance || '0.00'}</span>
                </div>
              </>
            )}
            
            {transportMode === 'ride' && (
              <div className="summary-row">
                <span>Monthly Ride Services:</span>
                <span>${monthlyRideServices || '0.00'}</span>
              </div>
            )}
            
            {transportMode === 'public' && (
              <>
                <div className="summary-row">
                  <span>Regular Fares:</span>
                  <span>${monthlyPublicTransport || '0.00'}</span>
                </div>
                {transportPasses.map((pass, index) => (
                  pass.type && pass.cost ? (
                    <div className="summary-row" key={index}>
                      <span>{pass.type}:</span>
                      <span>${pass.cost}</span>
                    </div>
                  ) : null
                ))}
              </>
            )}
            
            <div className="summary-row total">
              <span>Total Monthly Transportation Expenses:</span>
              <span>${calculateTotalTransportExpenses()}</span>
            </div>
          </div>
        )}

        {transportMode && (
        <div className="form-actions">
            <button 
            type="button" 
            className="submit-button"
            onClick={handleSubmit}
            >
            Save
            </button>
        </div>
        )}
      </div>
    );
  };
  
  export default TransportExpenses;