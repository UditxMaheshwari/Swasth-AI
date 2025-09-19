export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        const response = await fetch("http://127.0.0.1:5000/predict/heart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          return res.status(500).json({ error: data.error || "Backend error" });
        }
  
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  