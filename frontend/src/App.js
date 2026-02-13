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

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  /* ===================== API ===================== */

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/stats`);
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  }, [API_URL]);

  const fetchJobStatus = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${API_URL}/api/job-status/${id}`);
        const data = await res.json();
        setJobStatus(data);

        if (data?.status === "completed") {
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
    [API_URL, fetchStats],
  );

  /* ===================== EFFECTS ===================== */

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

  /* ===================== HANDLERS ===================== */

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

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              🎵
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-600">
                Mashup Studio
              </h1>
              <p className="text-sm text-gray-600">
                Create Amazing Music Mashups
              </p>
            </div>
          </div>

          {stats && (
            <div className="flex space-x-6 text-sm">
              <div>
                <div className="font-bold text-purple-600">
                  {stats.total_jobs}
                </div>
                Total
              </div>
              <div>
                <div className="font-bold text-green-600">
                  {stats.completed}
                </div>
                Completed
              </div>
              <div>
                <div className="font-bold text-blue-600">
                  {stats.processing}
                </div>
                Processing
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Create Your Perfect Mashup
          </h2>
          <p className="text-xl text-gray-600 mt-3">
            Powered by AI-driven chorus detection and intelligent audio
            processing
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white flex justify-center space-x-6 text-sm">
            🎯 AI Chorus Detection ⚡ Lightning Fast 🎼 High Quality 📧 Email
            Delivery
          </div>

          <div className="p-8">
            {!jobId ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  name="singerName"
                  placeholder="Singer Name"
                  value={formData.singerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border"
                />

                <input
                  type="range"
                  name="numVideos"
                  min="10"
                  max="50"
                  value={formData.numVideos}
                  onChange={handleChange}
                />
                <div className="text-sm">
                  Number of Songs: {formData.numVideos}
                </div>

                <input
                  type="range"
                  name="duration"
                  min="20"
                  max="60"
                  value={formData.duration}
                  onChange={handleChange}
                />
                <div className="text-sm">
                  Duration per clip: {formData.duration}s
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border"
                />

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="intelligentExtraction"
                    checked={formData.intelligentExtraction}
                    onChange={handleChange}
                  />
                  <span>AI-powered chorus detection</span>
                </label>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold"
                >
                  {isSubmitting ? "Creating Mashup..." : "Create Mashup"}
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                {showSuccess ? (
                  <h3 className="text-3xl text-green-600 font-bold">
                    Success! Check your email ✅
                  </h3>
                ) : (
                  <>
                    <div className="text-4xl mb-4">
                      {jobStatus?.status === "processing" ? "🎵" : "⏳"}
                    </div>
                    <p>{jobStatus?.message || "Queued..."}</p>
                    <p className="text-sm mt-2">
                      Job ID: {jobId?.slice(0, 8)}...
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow">
            🎯 Smart Extraction
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            ⚡ Fast Processing
          </div>
          <div className="bg-white p-6 rounded-xl shadow">🎼 High Quality</div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-600">
        Made with ❤️ using AI-powered audio processing
      </footer>
    </div>
  );
}

export default App;
