import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-10 shadow-soft">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">AI Resume Builder</h1>
          <p className="max-w-2xl text-slate-600">Create a polished, one-page resume with a live preview. Add sections like Education, Experience, Projects, and Certifications — then export a professional PDF.</p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#/builder" className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Get Started</a>
            <a href="#/builder" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Open Builder</a>
          </div>

          <div className="mt-6 w-full border-t border-slate-100 pt-6 text-sm text-slate-500">
            <p>Designed for students and professionals. Live preview, responsive layout, and high-quality PDF export.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
