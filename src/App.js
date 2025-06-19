import React, { useState } from 'react';
import './App.css';

// Import Airtable
const Airtable = require('airtable');

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Airtable configuration
  const AIRTABLE_API_TOKEN = 'patCPQa8ny40cKGCR.66d815c91634c354cf9aaffb9dcd7e5381808082e8940b5045ce6ae112eeb272';
  const AIRTABLE_BASE_ID = 'app0Bkxr0ta9HVZsM';
  
  // Initialize Airtable
  const base = new Airtable({ apiKey: AIRTABLE_API_TOKEN }).base(AIRTABLE_BASE_ID);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Test function to verify connection
  const testAirtableConnection = async () => {
    try {
      console.log('🧪 Testing Airtable connection...');
      const records = await base('Waitlist').select({
        maxRecords: 1
      }).firstPage();
      console.log('✅ Connection test successful! Found records:', records.length);
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  };

  const submitToAirtable = async (name, email) => {
    console.log('=== AIRTABLE SUBMISSION DEBUG ===');
    console.log('Base ID:', AIRTABLE_BASE_ID);
    console.log('Table Name: Waitlist');
    console.log('Name field:', name);
    console.log('Email field:', email);
    console.log('API Token (first 10 chars):', AIRTABLE_API_TOKEN.substring(0, 10) + '...');

    // First test if we can read from the table
    const canConnect = await testAirtableConnection();
    if (!canConnect) {
      throw new Error('Cannot connect to Airtable. Please check your base ID, table name, and API token permissions.');
    }

    try {
      console.log('Creating record with fields: { Name: "' + name + '", Email: "' + email + '" }');
      
      const records = await base('Waitlist').create([
        {
          fields: {
            Name: name,
            Email: email
          }
        }
      ]);
      
      console.log('✅ SUCCESS! Records created:', records);
      return records;
    } catch (error) {
      console.error('❌ FAILED! Detailed error:');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Status code:', error.statusCode);
      console.error('Full error:', error);
      
      // Log the specific error details
      if (error.error) {
        console.error('Airtable API error details:', error.error);
      }
      
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setIsLoading(true);
      setError('');
      
      try {
        // Submit to Airtable
        await submitToAirtable(formData.name, formData.email);
        
        // If successful, show success message
        setIsSubmitted(true);
        setFormData({ name: '', email: '' });
        console.log('Form submitted successfully!');
      } catch (error) {
        // Handle errors
        setError('Failed to submit. Please try again.');
        console.error('Submission error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">
          <h2>Pike AI</h2>
        </div>
      </nav>

      {/* Main Content */}
      <div className="landing-container">
        <div className="landing-content">
          <header className="landing-header">
            <h1>
              Learn to build software  <br />
              <span className="highlight">the right way</span>
            </h1>
          </header>
          
          <p className="subheader">
            Building software has changed so much but the education hasn't. We're building the first platform powered by AI to teach the non-technical person how to build software. Join the waitlist to be the first to experience the future of software education.
          </p>
          
          <div className="waitlist-section">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="email-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isLoading}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isLoading}
                />
                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? 'Joining...' : 'Join Waitlist'}
                </button>
                {error && <p className="error-message">{error}</p>}
              </form>
            ) : (
              <div className="success-message">
                <p>Thanks for joining! We'll be in touch soon.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
