'use client';

import DiseaseTabs from '@/components/DiseaseTabs';

export default function TestAIPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧠 AI Disease Prediction Test</h1>
          <p className="text-gray-600 text-lg">Test our machine learning models for disease risk assessment</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Disease Risk Assessment Forms</h2>
            <p className="text-blue-100 mt-1">Fill out the forms below to test AI-powered predictions</p>
          </div>
          
          <div className="p-8">
            <DiseaseTabs />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            ⚠️ <strong>Medical Disclaimer:</strong> These predictions are for testing purposes only and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
