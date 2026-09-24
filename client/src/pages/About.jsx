import React from 'react';
import { Quote, ShieldCheck, Heart, Target, Users } from 'lucide-react';

const quotes = [
  {
    quote: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    category: "Civic Duty",
  },
  {
    quote: "Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.",
    author: "Jane Jacobs",
    category: "Urban Stewardship",
  },
  {
    quote: "Never doubt that a small group of thoughtful, committed citizens can change the world; indeed, it's the only thing that ever has.",
    author: "Margaret Mead",
    category: "Community Power",
  },
  {
    quote: "Patriotism is supporting your country all the time, and your government when it deserves it.",
    author: "Mark Twain",
    category: "Accountability",
  },
];

const pillars = [
  {
    title: 'Open & Transparent',
    desc: 'Every issue report is public so citizens can track fixes in real time.',
    icon: Target,
  },
  {
    title: 'Powered by Citizens',
    desc: 'Giving everyone simple tools to report problems and improve neighborhoods.',
    icon: Users,
  },
  {
    title: 'Fast Action',
    desc: 'Connecting issues directly to local authority teams for faster turnaround.',
    icon: ShieldCheck,
  },
  {
    title: 'Safer Neighborhoods',
    desc: 'Fixing potholes, streetlights, and waste creates safer streets for everyone.',
    icon: Heart,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h1 className="text-3xl font-extrabold">About Civic Alert</h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Civic Alert is a community platform designed to help citizens report local problems and track fixes transparently.
          </p>
        </div>
      </section>

      {/* Inspirational Quotes */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Inspirational Quotes</h2>
          <p className="text-slate-500 text-sm mt-1">Timeless thoughts on civic duty and community</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {quotes.map((q, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                    {q.category}
                  </span>
                  <Quote className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-slate-800 italic leading-relaxed mb-4">"{q.quote}"</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">— {q.author}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className="text-xl font-bold text-slate-900">What We Stand For</h2>
            <p className="text-xs text-slate-500 mt-1">Simple principles guiding our platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
