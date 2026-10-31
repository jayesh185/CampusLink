import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center mx-auto text-lg mb-2">
            CL
          </div>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to CampusLink</h2>
        <p className="mt-1 text-sm text-slate-600">
          Or{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
            create a new student or recruiter account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <p className="text-center text-sm text-slate-500">
            Authentication module will be fully activated in Phase 2.
          </p>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex justify-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

