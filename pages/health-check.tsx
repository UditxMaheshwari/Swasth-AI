'use client';
import Navbar from '../components/Navbar';
import DiabetesForm from '../components/DiabetesForm';
import HeartDiseaseForm from '../components/HeartDiseaseForm';

const HealthCheckPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <section className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Diabetes Prediction</h1>
          <DiabetesForm />
        </section>
        <section className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Heart Disease Prediction</h1>
          <HeartDiseaseForm />
        </section>
      </main>
    </div>
  );
};

export default HealthCheckPage;
