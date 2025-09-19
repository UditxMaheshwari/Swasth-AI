import Navbar from '../components/Navbar';
import DiabetesForm from '../components/DiabetesForm';
import HeartDiseaseForm from '../components/HeartDiseaseForm';
import Head from 'next/head';

const HealthCheckPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Health Check - SwasthAI</title>
        <meta name="description" content="AI-powered health predictions for diabetes and heart disease" />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Diabetes Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Diabetes Prediction</h1>
          <DiabetesForm />
        </section>

        {/* Heart Disease Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Heart Disease Prediction</h1>
          <HeartDiseaseForm />
        </section>
      </main>
    </div>
  );
};

export default HealthCheckPage;
