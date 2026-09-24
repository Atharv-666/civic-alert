import React, { useState } from 'react';
import { MapPin, Calendar, Edit3, Trash2, Tag, Maximize2, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import StatusTracker from './StatusTracker';

const categoryColors = {
  Pothole: 'bg-red-50 text-red-700 border-red-200',
  Garbage: 'bg-amber-50 text-amber-800 border-amber-200',
  Streetlight: 'bg-blue-50 text-blue-700 border-blue-200',
  Drainage: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
  'Roads & Potholes': 'bg-red-50 text-red-700 border-red-200',
  'Water Supply': 'bg-blue-50 text-blue-700 border-blue-200',
  'Waste Management': 'bg-amber-50 text-amber-800 border-amber-200',
  'Street Lighting': 'bg-yellow-50 text-yellow-800 border-yellow-200',
  'Drainage & Sewage': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  'Public Safety': 'bg-purple-50 text-purple-700 border-purple-200',
};

const statusBadgeStyles = {
  Pending: 'bg-red-50 text-red-700 border-red-200 font-bold',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200 font-bold',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
};

const IssueCard = ({
  issue,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenResolutionModal,
  isAdmin = false,
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(issue.resolutionImageUrl ? 'after' : 'before');

  const formattedDate = new Date(issue.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hasProof = Boolean(issue.resolutionImageUrl);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
        {/* Card Image Header */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
          <img
            src={hasProof && activeTab === 'after' ? issue.resolutionImageUrl : issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=800&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-70" />

          {/* Category Tag */}
          <div className="absolute top-3 left-3 flex items-center space-x-1">
            <span
              className={`inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${
                categoryColors[issue.category] || categoryColors.Other
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>{issue.category}</span>
            </span>
          </div>

          {/* Zoom Image Button */}
          <button
            onClick={() => setImageModalOpen(true)}
            className="absolute top-3 right-3 p-1.5 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full backdrop-blur-md transition-colors shadow flex items-center space-x-1 px-2.5 text-[11px] font-semibold"
            title="Expand Photos"
          >
            <Maximize2 className="w-3 h-3" />
            <span>{hasProof ? 'Compare Photos' : 'View Photo'}</span>
          </button>

          {/* Before / After Toggle pill if Resolution Proof is available */}
          {hasProof && (
            <div className="absolute bottom-3 left-3 flex items-center bg-slate-950/80 p-0.5 rounded-full border border-emerald-500/40 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab('before')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition ${
                  activeTab === 'before' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Before (Reported)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('after')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition flex items-center space-x-1 ${
                  activeTab === 'after' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>After (Fixed Proof)</span>
              </button>
            </div>
          )}

          {/* Date Badge */}
          {!hasProof && (
            <div className="absolute bottom-3 left-3 flex items-center text-xs font-medium text-slate-200 drop-shadow">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {issue.title}
              </h3>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border shrink-0 ml-2 ${
                  statusBadgeStyles[issue.status] || statusBadgeStyles.Pending
                }`}
              >
                {issue.status}
              </span>
            </div>

            {/* Landmark */}
            <div className="flex items-center text-xs font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1 shrink-0" />
              <span className="truncate">{issue.landmark}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
              {issue.description}
            </p>

            {/* Proof of Resolution Verified Banner */}
            {hasProof && (
              <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-emerald-900 flex items-center gap-1">
                      <span>Resolution Proof Uploaded</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </h4>
                    <p className="text-[10px] text-emerald-700">Verified photo proof of work from Ward Admin</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="text-[10px] font-bold text-emerald-800 underline hover:text-emerald-950 shrink-0"
                >
                  View Proof
                </button>
              </div>
            )}
          </div>

          {/* Real-time Status Progression Bar */}
          <div className="pt-2 border-t border-slate-100">
            <StatusTracker status={issue.status} />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {/* Admin Direct Status Control */}
            {isAdmin ? (
              <div className="flex items-center space-x-1.5">
                {issue.status !== 'Resolved' && onOpenResolutionModal ? (
                  <button
                    type="button"
                    onClick={() => onOpenResolutionModal(issue)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm transition flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve & Add Proof</span>
                  </button>
                ) : (
                  <select
                    value={issue.status}
                    onChange={(e) => {
                      if (e.target.value === 'Resolved' && onOpenResolutionModal) {
                        onOpenResolutionModal(issue);
                      } else if (onStatusChange) {
                        onStatusChange(issue._id, e.target.value);
                      }
                    }}
                    className="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending 🔴</option>
                    <option value="In Progress">In Progress 🔵</option>
                    <option value="Resolved">Resolved 🟢</option>
                  </select>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-mono">
                {formattedDate}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(issue)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Issue"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(issue._id)}
                  className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Issue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Photo & Resolution Proof Comparison Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{issue.title}</h3>
                <p className="text-xs text-slate-400">📍 {issue.landmark} • Salokhenagar Ward</p>
              </div>
              <button
                onClick={() => setImageModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Photo comparison layout */}
            <div className="p-6">
              {hasProof ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                        🔴 Reported Issue (Before)
                      </span>
                      <span className="text-[10px] text-slate-400">{formattedDate}</span>
                    </div>
                    <div className="h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img
                        src={issue.imageUrl}
                        alt="Original Issue"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="font-semibold text-slate-400">Citizen Report:</span> {issue.description}
                    </p>
                  </div>

                  {/* After */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        🟢 Proof of Resolution (After Fix)
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Admin Verified
                      </span>
                    </div>
                    <div className="h-64 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950">
                      <img
                        src={issue.resolutionImageUrl}
                        alt="Resolution Proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-emerald-200 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                      <span className="font-bold text-emerald-400">Municipal Officer Note:</span> Issue repaired and verified by Ward Officer. Proof photo uploaded for citizen audit.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <p><span className="font-bold text-slate-100">Status:</span> {issue.status}</p>
                    <p className="mt-1"><span className="font-bold text-slate-100">Description:</span> {issue.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueCard;
