import React, { useState, useEffect } from 'react';

const PersonalDataForm = ({ setPersonalData, initialData }) => {
    const [formData, setFormData] = useState({
        age: initialData?.age || '',
        retire_age: initialData?.retire_age || ''
    });
    const [submitStatus, setSubmitStatus] = useState('Save Personal Data');

    useEffect(() => {
        // Log initial data loading
        console.log('Initial data loaded:', initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert input to numbers for age fields
        const numValue = name === 'age' || name === 'retire_age' ? parseInt(value, 10) || '' : value;
        
        setFormData({
            ...formData,
            [name]: numValue
        });
        
        console.log(`Field ${name} updated to:`, numValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        setPersonalData(formData);
        console.log('Personal data updated successfully');
        
        // Change button text to show success
        setSubmitStatus('Updated!');
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            setSubmitStatus('Save Personal Data');
        }, 2000);
    };

    return (
        <div className="personal-data-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="age">Current Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="retire_age">Expected Retirement Age</label>
                    <input
                        type="number"
                        id="retire_age"
                        name="retire_age"
                        value={formData.retire_age}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="submit-button">
                    {submitStatus}
                </button>
            </form>
        </div>
    );
};

export default PersonalDataForm;