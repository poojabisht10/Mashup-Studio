import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
  const [stats, setStats] = useState({
    total_jobs: 0,
    completed: 0,
    processing: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/stats`);
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchJobStatus = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${API_URL}/api/job-status/${id}`);
        const data = await res.json();
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
      } catch (e) {
        console.error(e);
      }
    },
    [fetchStats],
  );

  useEffect(() => {
    fetchStats();
    const i = setInterval(fetchStats, 30000);
    return () => clearInterval(i);
  }, [fetchStats]);

  useEffect(() => {
    if (!jobId) return;
    const i = setInterval(() => fetchJobStatus(jobId), 3000);
    return () => clearInterval(i);
  }, [jobId, fetchJobStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/create-mashup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) setJobId(data.job_id);
      else alert(data.error);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">🎵 Mashup Studio</h1>
        <div className="flex gap-6 text-sm">
          <div>
            <b>{stats.total_jobs}</b> Total
          </div>
          <div className="text-green-600">
            <b>{stats.completed}</b> Completed
          </div>
          <div className="text-blue-600">
            <b>{stats.processing}</b> Processing
          </div>
        </div>
      </header>

      <main className="flex justify-center items-center py-20">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
          {!jobId ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="singerName"
                placeholder="Singer Name"
                value={formData.singerName}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded"
              />

              <label>Videos: {formData.numVideos}</label>
              <input
                type="range"
                min="10"
                max="50"
                name="numVideos"
                value={formData.numVideos}
                onChange={handleChange}
              />

              <label>Duration: {formData.duration}s</label>
              <input
                type="range"
                min="20"
                max="60"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="intelligentExtraction"
                  checked={formData.intelligentExtraction}
                  onChange={handleChange}
                />
                AI Chorus Detection
              </label>

              <button
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
              >
                {isSubmitting ? "Processing..." : "Create Mashup"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              {showSuccess ? (
                <h2 className="text-green-600 text-xl font-bold">
                  ✅ Sent to your email!
                </h2>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">
                    {jobStatus?.status || "Queued"}
                  </h2>
                  <p>{jobStatus?.message}</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-gray-500 py-6">
        Made with ❤️ using AI
      </footer>
    </div>
  );
}

export default App;
