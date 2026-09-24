import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function ResolutionModal({ isOpen, onClose, issue, onSuccess }) {
  const [resolutionNote, setResolutionNote] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sampleUrl, setSampleUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !issue) return null;

  const sampleProofs = [
    { label: '🕳️ Repaired Asphalt Road', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop' },
    { label: '🚰 Fixed Water Pipeline', url: 'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=800&auto=format&fit=crop' },
    { label: '🗑️ Cleared Garbage Site', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop' },
    { label: '💡 Repaired Streetlight Pole', url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=800&auto=format&fit=crop' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setSampleUrl('');
      setError('');
    }
  };

  const handleSelectSample = (url) => {
    setSampleUrl(url);
    setPreviewUrl(url);
    setFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalProofUrl = previewUrl || sampleUrl;
    if (!file && !finalProofUrl) {
      setError('Proof of image is required when resolving an issue.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('status', 'Resolved');
      formData.append('comment', resolutionNote || 'Issue successfully resolved by Salokhenagar Municipal Authority.');

      if (file) {
        formData.append('resolutionImage', file);
      } else if (finalProofUrl) {
        formData.append('resolutionImageUrl', finalProofUrl);
      }

      await axiosInstance.patch(`/issues/${issue._id}/status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      onSuccess(issue._id, 'Resolved', finalProofUrl);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit resolution proof.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-600/30 border border-emerald-400/30 text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Provide Proof of Resolution</h2>
              <p className="text-xs text-emerald-200/70">Required for resident verification & issue closure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Issue summary */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center space-x-3">
            <img
              src={issue.imageUrl}
              alt="Original"
              className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
            />
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-slate-400">Original Reported Issue</span>
              <h4 className="text-xs font-bold text-slate-900 truncate">{issue.title}</h4>
              <p className="text-[11px] text-slate-500 truncate">📍 {issue.landmark}</p>
            </div>
          </div>

          {/* Proof Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Upload Resolution Proof Photo *
            </label>
            <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-emerald-50/50 relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900 border border-emerald-400">
                  <img
                    src={previewUrl}
                    alt="Resolution Proof Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    ✓ Resolution Proof Image Attached
                  </div>
                  <span className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[11px] px-2 py-1 rounded-lg">
                    Click to Change Image
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-3 text-emerald-800">
                  <Upload className="w-7 h-7 mb-1 text-emerald-600" />
                  <p className="text-xs font-bold text-slate-800">Click to upload photo of completed repair</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Show clear proof of work to the resident</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Sample Proof Selection (for easy testing) */}
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block mb-1.5">
              Or pick a sample completed work photo:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {sampleProofs.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sp.url)}
                  className={`text-[11px] p-2 rounded-xl border transition flex items-center space-x-2 text-left ${
                    previewUrl === sp.url
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">{sp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Officer Resolution Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Officer Completion Note
            </label>
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              rows="2"
              placeholder="e.g. Asphalt filling completed by Salokhenagar Ward No. 4 repair team..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-xs outline-none transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading Proof & Closing Issue...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Proof & Mark Resolved</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
