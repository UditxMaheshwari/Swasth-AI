// pages/api/predict/diabetes.js

// Optional: if you want to use type hints in TypeScript
// import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const response = await fetch('http://127.0.0.1:5000/predict/diabetes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body)
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return res.status(500).json({ error: errorData.error || 'Backend error' });
        }
  
        const data = await response.json();
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  