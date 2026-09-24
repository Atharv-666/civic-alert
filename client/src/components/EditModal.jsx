import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const categories = ['Pothole', 'Garbage', 'Streetlight', 'Drainage', 'Other'];

const EditModal = ({ isOpen, onClose, issue, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pothole',
    landmark: '',
    description: '',
    status: 'Pending',
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || '',
        category: issue.category || 'Pothole',
        landmark: issue.landmark || '',
        description: issue.description || '',
        status: issue.status || 'Pending',
      });
      setPreviewUrl(issue.imageUrl || null);
      setFile(null);
      setError('');
    }
  }, [issue]);

  if (!isOpen || !issue) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('landmark', formData.landmark);
      data.append('description', formData.description);
      data.append('status', formData.status);

      if (file) {
        data.append('image', file);
      }

      await axiosInstance.put(`/issues/${issue._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update issue details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Edit Issue Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update reported issue details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-xs outline-none transition"
              required
            />
          </div>

          {/* Category & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-xs outline-none transition bg-white"
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
                Landmark / Location
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-xs outline-none transition"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 text-xs outline-none transition resize-none"
              required
            />
          </div>

          {/* Image Update */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Change Image (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-xl p-3 text-center cursor-pointer transition-colors bg-slate-50 relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded">
                    Replace Image
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-slate-500">
                  <Upload className="w-6 h-6 mb-1" />
                  <p className="text-xs font-semibold">Click to update photo</p>
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
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
