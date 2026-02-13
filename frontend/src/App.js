import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    singerName: '',
    numVideos: 20,
    duration: 30,
    email: '',
    intelligentExtraction: true
  });
  
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch stats
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Poll job status
  useEffect(() => {
    if (jobId) {
      const interval = setInterval(() => {
        fetchJobStatus(jobId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [jobId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchJobStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/job-status/${id}`);
      const data = await response.json();
      setJobStatus(data);
      
      if (data.status === 'completed') {
        setShowSuccess(true);
        setTimeout(() => {
          setJobId(null);
          setJobStatus(null);
          setShowSuccess(false);
          fetchStats();
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to fetch job status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/create-mashup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
                <p className="text-sm text-gray-600">Create Amazing Music Mashups</p>
              </div>
            </div>
            
            {stats && (
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-purple-600 text-xl">{stats.total_jobs}</div>
                  <div className="text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600 text-xl">{stats.completed}</div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600 text-xl">{stats.processing}</div>
                  <div className="text-gray-600">Processing</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Create Your Perfect Mashup
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powered by AI-driven chorus detection and intelligent audio processing
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Features Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <div className="flex flex-wrap items-center justify-center gap-4 text-white text-sm">
                <div className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>AI Chorus Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎼</span>
                  <span>High Quality Audio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>Email Delivery</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {!jobId ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Singer Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🎤 Artist/Singer Name
                    </label>
                    <input
                      type="text"
                      name="singerName"
                      value={formData.singerName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Arijit Singh, Taylor Swift, Ed Sheeran"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>

                  {/* Number of Videos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📹 Number of Videos ({formData.numVideos})
                    </label>
                    <input
                      type="range"
                      name="numVideos"
                      min="10"
                      max="50"
                      value={formData.numVideos}
                      onChange={handleChange}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>10 (Minimum)</span>
                      <span>50 (Maximum)</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ⏱️ Duration per Clip ({formData.duration} seconds)
                    </label>
                    <input
                      type="range"
                      name="duration"
                      min="20"
                      max="60"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>20s (Minimum)</span>
                      <span>60s (Maximum)</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your mashup will be sent to this email
                    </p>
                  </div>

                  {/* Intelligent Extraction Toggle */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center space-x-2">
                          <span>🧠</span>
                          <span>AI-Powered Chorus Detection</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Automatically finds and extracts the best parts of each song
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="intelligentExtraction"
                          checked={formData.intelligentExtraction}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating Mashup...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>🎵</span>
                        <span>Create My Mashup</span>
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                /* Progress Status */
                <div className="text-center py-12">
                  {showSuccess ? (
                    <div className="animate-bounce">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <span className="text-5xl">✅</span>
                      </div>
                      <h3 className="text-3xl font-bold text-green-600 mb-2">Success!</h3>
                      <p className="text-gray-600">Check your email for the mashup!</p>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-8 border-purple-200 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl">
                          {jobStatus?.status === 'processing' ? '🎵' : '⏳'}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {jobStatus?.status === 'processing' ? 'Creating Your Mashup' : 'Queued'}
                      </h3>
                      
                      <p className="text-lg text-gray-600 mb-6">
                        {jobStatus?.message || 'Please wait...'}
                      </p>
                      
                      <div className="bg-gray-100 rounded-xl p-4 inline-block">
                        <p className="text-sm text-gray-600">
                          Job ID: <span className="font-mono font-semibold">{jobId.slice(0, 8)}...</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-bold text-gray-800 mb-2">Smart Extraction</h4>
              <p className="text-sm text-gray-600">
                AI analyzes each song to extract the most memorable chorus sections
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-bold text-gray-800 mb-2">Fast Processing</h4>
              <p className="text-sm text-gray-600">
                Optimized audio processing delivers your mashup in minutes
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🎼</div>
              <h4 className="font-bold text-gray-800 mb-2">High Quality</h4>
              <p className="text-sm text-gray-600">
                192kbps MP3 with normalized volume and smooth transitions
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-purple-100 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p className="mb-2">
            Made with ❤️ using AI-powered audio processing
          </p>
          <p className="text-sm">
            Featuring: Intelligent Chorus Detection • High-Quality Audio • Email Delivery
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
