import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Badge from '../../components/Badge.jsx';
import Spinner from '../../components/Spinner.jsx';
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Server,
  ArrowRight,
  Brain,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/health')
      .then((res) => {
        setHealth(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to connect to API');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              CL
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">CampusLink</span>
              <span className="ml-2 text-xs text-brand-600 font-semibold px-2 py-0.5 bg-brand-50 rounded-full border border-brand-200">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen AI-Assisted College Placement Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Connecting Campus Talent with Global Opportunities
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explainable neural embeddings matching, automated eligibility rule engine, and structured AI resume parsing for modern university recruitment drives.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              Join CampusLink
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center"
            >
              Sign In to Your Portal
            </Link>
          </div>

          {/* System Status Pill */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-xs text-slate-600">
              <Server className="w-4 h-4 text-slate-500" />
              <span>Backend API Status:</span>
              {loading ? (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Spinner size="sm" /> Checking...
                </span>
              ) : health ? (
                <span className="flex items-center gap-2">
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> API Online
                  </Badge>
                  <span className="text-slate-400">|</span>
                  <span>Database: <strong>{health.db}</strong></span>
                  <span className="text-slate-400">|</span>
                  <span>Embeddings: <strong>{health.embeddings}</strong></span>
                </span>
              ) : (
                <Badge variant="danger">{error || 'Disconnected'}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Students</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload PDF resumes with auto-parsing, discover jobs you are eligible for, understand fit breakdown, and track applications.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Recruiters</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Define strict eligibility criteria, let AI suggest target skills, review candidates ranked by explainable semantic similarity, and schedule interviews.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Admins</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Oversee university placement drives, approve verified recruiters, audit all state transitions, and analyze campus-wide hiring statistics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          CampusLink &copy; {new Date().getFullYear()} &mdash; Placement & Recruitment Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

