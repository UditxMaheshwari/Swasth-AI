import { useState } from 'react';

const DiabetesForm = () => {
  const [formData, setFormData] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
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
      setResult(data.prediction);
    } catch (err) {
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'Pregnancies', label: 'Pregnancies' },
    { name: 'Glucose', label: 'Glucose (mg/dL)' },
    { name: 'BloodPressure', label: 'Blood Pressure (mmHg)' },
    { name: 'SkinThickness', label: 'Skin Thickness (mm)' },
    { name: 'Insulin', label: 'Insulin Level (μU/ml)' },
    { name: 'BMI', label: 'BMI' },
    { name: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree Function' },
    { name: 'Age', label: 'Age' }
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-sm font-medium text-gray-700">{f.label}</label>
              <input
                type="number"
                id={f.name}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {isLoading ? 'Predicting...' : 'Predict Diabetes Risk'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {result && <p className={`mt-4 font-semibold ${result === 'Diabetic' ? 'text-red-600' : 'text-green-600'}`}>{result}</p>}
    </div>
  );
};

export default DiabetesForm;
