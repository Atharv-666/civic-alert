import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import AiAutoFillHelper from './AiAutoFillHelper';

const categories = [
  'Roads & Potholes',
  'Water Supply',
  'Waste Management',
  'Street Lighting',
  'Drainage & Sewage',
  'Public Safety',
  'Other',
  'Pothole',
  'Garbage',
  'Streetlight',
  'Drainage'
];

const ReportModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Roads & Potholes',
    priority: 'Medium',
    landmark: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Roads & Potholes',
        priority: initialData.priority || 'Medium',
        landmark: initialData.landmark || '',
        description: initialData.description || '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyAiFields = (aiFields) => {
    setFormData((prev) => ({
      ...prev,
      title: aiFields.title || prev.title,
      category: aiFields.category || prev.category,
      priority: aiFields.priority || prev.priority,
      landmark: aiFields.landmark || prev.landmark,
      description: aiFields.description || prev.description,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.landmark.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('priority', formData.priority || 'Medium');
      data.append('landmark', formData.landmark);
      data.append('description', formData.description);

      if (file) {
        data.append('image', file);
      }

      const res = await axiosInstance.post('/issues', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.data?._id) {
        const myIssues = JSON.parse(localStorage.getItem('my_civic_issues') || '[]');
        myIssues.push(res.data.data._id);
        localStorage.setItem('my_civic_issues', JSON.stringify(myIssues));
      }

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit issue report.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Report Civic Issue</h2>
              <p className="text-xs text-indigo-200/70">Salokhenagar Municipal Ward • Kolhapur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* AI Auto-Fill Helper Widget */}
          <AiAutoFillHelper onApplyFields={handleApplyAiFields} />

          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Deep pothole near Water Tank main road"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs font-medium outline-none transition"
              required
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs font-medium outline-none transition bg-white"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Landmark / Location *
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="e.g., Near Kalamba Water Filter, Ward No. 4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs font-medium outline-none transition"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the issue in detail or auto-fill with AI..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs outline-none transition resize-none"
              required
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Upload Photo Evidence (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-600 rounded-2xl p-3 text-center cursor-pointer transition-colors bg-slate-50 relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded">
                    Change Image
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-slate-500 group-hover:text-indigo-600">
                  <Upload className="w-6 h-6 mb-1 text-slate-400 group-hover:text-indigo-600" />
                  <p className="text-xs font-semibold text-slate-700">Click to upload photo</p>
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
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
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting to Ward Queue...</span>
                </>
              ) : (
                <span>Submit Issue Report</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
