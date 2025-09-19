import { useState } from 'react';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await fetch('http://127.0.0.1:5000/predict/heart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      setResult(data.prediction); // "Heart Disease" or "No Heart Disease"
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'sex', label: 'Sex', type: 'select', options: [{ value: 0, label: 'Female' }, { value: 1, label: 'Male' }] },
    { name: 'cp', label: 'Chest Pain Type', type: 'select', options: [
      { value: 0, label: 'Typical Angina' },
      { value: 1, label: 'Atypical Angina' },
      { value: 2, label: 'Non-anginal Pain' },
      { value: 3, label: 'Asymptomatic' }
    ]},
    { name: 'trestbps', label: 'Resting Blood Pressure (mm Hg)', type: 'number' },
    { name: 'chol', label: 'Cholesterol (mg/dl)', type: 'number' },
    { name: 'fbs', label: 'Fasting Blood Sugar > 120 mg/dl', type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }]},
    { name: 'restecg', label: 'Resting ECG Results', type: 'select', options: [{ value: 0, label: 'Normal' }, { value: 1, label: 'ST-T Wave Abnormality' }, { value: 2, label: 'Left Ventricular Hypertrophy' }]},
    { name: 'thalach', label: 'Maximum Heart Rate Achieved', type: 'number' },
    { name: 'exang', label: 'Exercise Induced Angina', type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }]},
    { name: 'oldpeak', label: 'ST Depression Induced by Exercise', type: 'number', step: '0.1' },
    { name: 'slope', label: 'Slope of Peak Exercise ST Segment', type: 'select', options: [{ value: 0, label: 'Upsloping' }, { value: 1, label: 'Flat' }, { value: 2, label: 'Downsloping' }]},
    { name: 'ca', label: 'Number of Major Vessels (0-3)', type: 'number', min: 0, max: 3 },
    { name: 'thal', label: 'Thalassemia', type: 'select', options: [{ value: 1, label: 'Normal' }, { value: 2, label: 'Fixed Defect' }, { value: 3, label: 'Reversible Defect' }]}
  ];

  const renderInput = (field) => {
    if (field.type === 'select') {
      return (
        <select
          id={field.name}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select {field.label}</option>
          {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        step={field.step || '1'}
        min={field.min || '0'}
        max={field.max}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Heart Disease Risk Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              {renderInput(field)}
            </div>
          ))}
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? 'Predicting...' : 'Predict Heart Disease Risk'}
        </button>
      </form>

      {error && <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded text-red-700">{error}</div>}

      {result && (
        <>
          <div className={`mt-6 p-6 rounded-lg ${result === 'Heart Disease' ? 'bg-red-50 border-l-4 border-red-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
            <h3 className="text-sm font-medium">{result}</h3>
            <p className="mt-2 text-sm">
              {result === 'Heart Disease'
                ? 'The model predicts a high risk of heart disease. Please consult a healthcare professional.'
                : 'The model predicts a low risk of heart disease. Maintain a healthy lifestyle.'}
            </p>
          </div>

          {result === 'Heart Disease' && (
            <iframe
              className="mt-6 w-full h-96 rounded-lg shadow-lg"
              src="https://human.biodigital.com/widget/?be=2e8F&background.colors=0,0,0,0,0,0,0,0"
              title="Heart Simulation"
              allowFullScreen
            ></iframe>
          )}
        </>
      )}
    </div>
  );
};

export default HeartDiseaseForm;
