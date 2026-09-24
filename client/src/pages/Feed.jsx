import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, AlertCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import IssueCard from '../components/IssueCard';
import EditModal from '../components/EditModal';

const categories = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Drainage', 'Other'];
const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];

const Feed = ({ onOpenReport }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingIssue, setEditingIssue] = useState(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await axiosInstance.get('/issues', { params });
      setIssues(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to load issues');
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this issue report?')) {
      try {
        await axiosInstance.delete(`/issues/${id}`);
        fetchIssues();
      } catch (err) {
        alert(err.message || 'Failed to delete issue');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Community Issues Feed</h1>
            <p className="text-slate-400 text-xs mt-0.5">Browse and track reported problems in your area</p>
          </div>

          <button
            onClick={onOpenReport}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Report Issue</span>
          </button>
        </div>
      </section>

      {/* Streamlined Filter Bar */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Status buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedStatus === st
                    ? st === 'Resolved'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : st === 'In Progress'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : st === 'Pending'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center justify-between border border-red-200">
            <span>{error}</span>
            <button onClick={fetchIssues} className="underline font-bold ml-2">Retry</button>
          </div>
        )}

        {/* Issues list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 border border-slate-200 animate-pulse p-4 space-y-3">
                <div className="bg-slate-200 h-36 rounded-xl w-full" />
                <div className="bg-slate-200 h-4 rounded w-2/3" />
                <div className="bg-slate-200 h-3 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-sm mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No issues found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search filters or report a new issue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onEdit={setEditingIssue}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit modal */}
      <EditModal
        isOpen={Boolean(editingIssue)}
        issue={editingIssue}
        onClose={() => setEditingIssue(null)}
        onSuccess={fetchIssues}
      />
    </div>
  );
};

export default Feed;
