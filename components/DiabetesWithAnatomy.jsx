"use client";

import { useState } from 'react';

export default function DiabetesWithAnatomy() {
  const [prediction, setPrediction] = useState(null); // "Diabetic" or "Not Diabetic"
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodpressure: '',
    skinthickness: '',
    insulin: '',
    bmi: '',
    diabetespedigreefunction: '',
    age: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrediction(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await fetch('http://127.0.0.1:5000/predict/diabetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction); // "Diabetic" or "Not Diabetic"
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'pregnancies', label: 'Pregnancies', type: 'number', step: '1', min: '0' },
    { name: 'glucose', label: 'Glucose (mg/dL)', type: 'number', step: '1', min: '0' },
    { name: 'bloodpressure', label: 'Blood Pressure (mmHg)', type: 'number', step: '1', min: '0' },
    { name: 'skinthickness', label: 'Skin Thickness (mm)', type: 'number', step: '1', min: '0' },
    { name: 'insulin', label: 'Insulin Level (μU/ml)', type: 'number', step: '1', min: '0' },
    { name: 'bmi', label: 'BMI', type: 'number', step: '0.1', min: '0' },
    { name: 'diabetespedigreefunction', label: 'Diabetes Pedigree Function', type: 'number', step: '0.001', min: '0' },
    { name: 'age', label: 'Age', type: 'number', step: '1', min: '0' }
  ];

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe.bio-widget');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) { // Safari
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { // IE11
        iframe.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Prediction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Diabetes Risk Assessment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                step={field.step}
                min={field.min}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Predicting...' : 'Predict Diabetes Risk'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Prediction Result */}
      {prediction && (
        <div className={`mt-6 p-6 rounded-lg ${prediction === 'Diabetic' 
          ? 'bg-red-50 border-l-4 border-red-400' 
          : 'bg-green-50 border-l-4 border-green-400'}`}
        >
          <h3 className="text-xl font-semibold mb-2">
            {prediction === 'Diabetic' ? 'High Risk of Diabetes' : 'Low Risk of Diabetes'}
          </h3>
          <p className="text-gray-700">
            {prediction === 'Diabetic'
              ? 'The model predicts a high risk of diabetes. Please consult a healthcare professional.'
              : 'The model predicts a low risk of diabetes. Maintain a healthy lifestyle.'}
          </p>
        </div>
      )}

      {/* BioDigital Widget - Only show if Diabetic */}
      {prediction === 'Diabetic' && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Diabetes Information</h3>
            <button
              onClick={handleFullscreen}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              View Fullscreen
            </button>
          </div>
          
          <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
            <iframe
              className="bio-widget absolute top-0 left-0 w-full h-full rounded-lg shadow-lg border border-gray-200"
              src="https://human.biodigital.com/widget/?be=2S0t&background.colors=0,0,0,0,0,0,0,0&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3iSxx"
              title="BioDigital Human Widget - Diabetes Information"
              allowFullScreen
              loading="lazy"
            />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Understanding Your Results</h4>
            <p className="text-sm text-blue-700">
              The 3D model above highlights areas of the body commonly affected by diabetes. 
              Please consult with a healthcare professional for personalized medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
