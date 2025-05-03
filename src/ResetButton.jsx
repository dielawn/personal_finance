import React, { useState } from 'react';
import './ResetButton.css';

/**
 * Component for resetting all form data in the application
 */
const ResetButton = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Handle the initial click to show confirmation
  const handleResetClick = () => {
    console.log('Reset button clicked, showing confirmation');
    setIsConfirming(true);
  };
  
  // Handle the confirmation click to actually reset data
  const handleConfirmReset = () => {
    console.log('Reset confirmation clicked, performing reset');
    
    try {
      // Clear ENTIRE localStorage
      console.log('Clearing entire localStorage');
      localStorage.clear();
      
      // Only set the current step to 0
      localStorage.setItem('finance_current_step', '0');
      console.log('Set current step to 0');
      
      // Display an alert to inform the user
      alert('All data has been reset. The page will now reload.');
      
      // Force a completely fresh reload
      console.log('Reloading to application root');
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname;
      }, 500); // Short delay to ensure all operations complete
    } catch (error) {
      console.error('Error during reset operation:', error);
      alert('An error occurred while resetting the application. Please try again.');
    }
  };
  return (
    <div className="reset-button-container">
      {!isConfirming ? (
        <button 
          className="reset-button"
          onClick={handleResetClick}
        >
          Reset All Form Data
        </button>
      ) : (
        <div className="confirm-container">
          <p className="confirm-message">
            Are you sure? This will delete all your saved data and cannot be undone.
          </p>
          <div className="button-group">
            {/* <button 
              className="cancel-button"
              onClick={handleCancelReset}
            >
              Cancel
            </button> */}
            <button 
              className="confirm-reset-button"
              onClick={handleConfirmReset}
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetButton;