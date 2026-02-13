import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    singerName: "",
    numVideos: 20,
    duration: 30,
    email: "",
    intelligentExtraction: true,
  });

  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ API base URL (defined ONCE)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Fetch stats (memoized)
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, [API_URL]);

  // ✅ Fetch job status (memoized)
  const fetchJobStatus = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${API_URL}/api/job-status/${id}`);
        const data = await response.json();
        setJobStatus(data);

        if (data.status === "completed") {
          setShowSuccess(true);
          setTimeout(() => {
            setJobId(null);
            setJobStatus(null);
            setShowSuccess(false);
            fetchStats();
          }, 5000);
        }
      } catch (error) {
        console.error("Failed to fetch job status:", error);
      }
    },
    [API_URL, fetchStats],
  );

  // ✅ Stats polling
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // ✅ Job polling
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(() => {
      fetchJobStatus(jobId);
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, fetchJobStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/create-mashup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setJobId(data.job_id);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">
            🎵 Mashup Studio
          </h1>

          {stats && (
            <div className="hidden md:flex gap-6 text-sm">
              <div>
                <div className="font-bold text-purple-600">
                  {stats.total_jobs}
                </div>
                <div>Total</div>
              </div>
              <div>
                <div className="font-bold text-green-600">
                  {stats.completed}
                </div>
                <div>Completed</div>
              </div>
              <div>
                <div className="font-bold text-blue-600">
                  {stats.processing}
                </div>
                <div>Processing</div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!jobId ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6"
          >
            <input
              type="text"
              name="singerName"
              placeholder="Singer Name"
              value={formData.singerName}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
            >
              {isSubmitting ? "Creating..." : "Create Mashup"}
            </button>
          </form>
        ) : (
          <div className="text-center mt-20">
            {showSuccess ? (
              <>
                <h2 className="text-3xl font-bold text-green-600">✅ Done!</h2>
                <p>Check your email 🎧</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">Processing…</h2>
                <p>{jobStatus?.message || "Please wait"}</p>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-gray-600">
        Made with ❤️ using AI
      </footer>
    </div>
  );
}

export default App;
