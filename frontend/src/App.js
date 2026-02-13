/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

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

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // -------- API CALLS (defined BEFORE useEffect) --------

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, [API_URL]);

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

  // -------- EFFECTS --------

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(() => {
      fetchJobStatus(jobId);
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, fetchJobStatus]);

  // -------- FORM HANDLERS --------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/create-mashup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  // -------- UI (UNCHANGED) --------

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Mashup Studio
                </h1>
                <p className="text-sm text-gray-600">
                  Create Amazing Music Mashups
                </p>
              </div>
            </div>

            {stats && (
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-purple-600 text-xl">
                    {stats.total_jobs}
                  </div>
                  <div className="text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600 text-xl">
                    {stats.completed}
                  </div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600 text-xl">
                    {stats.processing}
                  </div>
                  <div className="text-gray-600">Processing</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
