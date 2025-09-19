import { useState } from 'react';
import DiabetesForm from './DiabetesForm';
import HeartDiseaseForm from './HeartDiseaseForm';
import ParkinsonsForm from './ParkinsonsForm';

const DiseaseTabs = () => {
  const [activeTab, setActiveTab] = useState('diabetes');

  const tabs = [
    { id: 'diabetes', label: 'Diabetes', component: <DiabetesForm /> },
    { id: 'heart', label: 'Heart Disease', component: <HeartDiseaseForm /> },
    { id: 'parkinsons', label: 'Parkinson\'s', component: <ParkinsonsForm /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default DiseaseTabs;
