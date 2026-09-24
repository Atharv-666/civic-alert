import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, CheckCircle2, ArrowRight, Quote, ShieldCheck } from 'lucide-react';

const simpleSteps = [
  {
    number: '1',
    title: 'Report Problem',
    desc: 'Take a photo of the issue (like a pothole or garbage) and add a short title.',
    icon: Camera,
  },
  {
    number: '2',
    title: 'Add Location',
    desc: 'Mention nearby landmarks so local teams can quickly find the exact spot.',
    icon: MapPin,
  },
  {
    number: '3',
    title: 'Watch It Get Fixed',
    desc: 'Track progress as local authorities work from Pending to In Progress to Resolved.',
    icon: CheckCircle2,
  },
];

const featuredQuotes = [
  {
    quote: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
  },
  {
    quote: "Cities are created by everybody, for everybody.",
    author: "Jane Jacobs",
  },
  {
    quote: "Never doubt that a small group of committed citizens can change the world.",
    author: "Margaret Mead",
  },
];

const Home = ({ onOpenReport }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center space-x-1.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community Issue Reporting</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Report Local Problems. <br />
            <span className="text-blue-400">See Fixes Happen.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Civic Alert lets you report potholes, garbage dumps, broken streetlights, and drainage issues directly to local authorities so they get fixed faster.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenReport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-sm active:scale-95"
            >
              Report an Issue
            </button>
            <Link
              to="/feed"
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl border border-slate-700 text-sm transition"
            >
              See All Issues
            </Link>
          </div>
        </div>
      </section>

      {/* How it works - Simple 3 Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
          <p className="text-slate-500 text-sm mt-1">3 simple steps to improve your neighborhood</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {simpleSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.number}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quotes Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-400 mb-4">
            <Quote className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Civic Inspiration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredQuotes.map((q, idx) => (
              <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                <p className="text-xs text-slate-200 italic">"{q.quote}"</p>
                <p className="text-xs font-bold text-blue-400 mt-2">— {q.author}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <Link to="/about" className="text-xs font-semibold text-blue-400 hover:underline flex items-center">
              <span>Read more about our mission</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
