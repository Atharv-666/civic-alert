import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Search, RefreshCw, Trash2, List, Grid, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import IssueCard from '../components/IssueCard';
import ResolutionModal from '../components/ResolutionModal';

const categories = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Drainage', 'Other'];
const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolutionModalIssue, setResolutionModalIssue] = useState(null);

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
      setError(err.message || 'Failed to fetch issues');
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === 'Resolved') {
      const targetIssue = issues.find((i) => i._id === id);
      if (targetIssue) {
        setResolutionModalIssue(targetIssue);
        return;
      }
    }

    try {
      await axiosInstance.patch(`/issues/${id}/status`, { status: newStatus });
      setIssues((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
      fetchIssues();
    }
  };

  const handleResolutionSuccess = (id, newStatus, proofUrl) => {
    setIssues((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: 'Resolved', resolutionImageUrl: proofUrl } : item
      )
    );
    fetchIssues();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this report?')) {
      try {
        await axiosInstance.delete(`/issues/${id}`);
        fetchIssues();
      } catch (err) {
        alert(err.message || 'Failed to delete issue');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Banner */}
      <section className="bg-slate-950 border-b border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Resolution Portal</h1>
              <p className="text-xs text-slate-400 mt-0.5">Salokhenagar Municipal Authority • Resolution Proof Verification Desk</p>
            </div>
          </div>

          <button
            onClick={fetchIssues}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Streamlined Controls */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Status buttons */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl shrink-0 border border-slate-700">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedStatus === st ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data list */}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading reported issues...</div>
        ) : issues.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center max-w-sm mx-auto my-6">
            <p className="text-xs text-slate-400">No reported issues matching criteria.</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Photos (Before / Proof)</th>
                    <th className="py-3 px-4">Issue & Landmark</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Status Controls & Resolution Proof</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {issues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-slate-700/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-center">
                            <img
                              src={issue.imageUrl}
                              alt="Reported"
                              className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                            />
                            <span className="text-[9px] text-slate-400 block">Reported</span>
                          </div>
                          {issue.resolutionImageUrl && (
                            <div className="text-center">
                              <img
                                src={issue.resolutionImageUrl}
                                alt="Resolution Proof"
                                className="w-9 h-9 rounded-lg object-cover bg-emerald-950 border-2 border-emerald-500 shrink-0"
                              />
                              <span className="text-[9px] font-bold text-emerald-400 block">✓ Proof</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-100 block">{issue.title}</span>
                        <span className="text-[11px] text-blue-400">📍 {issue.landmark}</span>
                      </td>
                      <td className="py-3 px-4">{issue.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            issue.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : issue.status === 'In Progress'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleStatusChange(issue._id, 'Pending')}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                              issue.status === 'Pending' ? 'bg-red-500 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => handleStatusChange(issue._id, 'In Progress')}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                              issue.status === 'In Progress' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => setResolutionModalIssue(issue)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                              issue.status === 'Resolved'
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-emerald-950/80 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{issue.resolutionImageUrl ? 'Update Proof' : 'Resolve & Add Proof'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(issue._id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded transition"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onOpenResolutionModal={(iss) => setResolutionModalIssue(iss)}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </main>

      {/* Resolution Proof Upload Modal */}
      <ResolutionModal
        isOpen={Boolean(resolutionModalIssue)}
        onClose={() => setResolutionModalIssue(null)}
        issue={resolutionModalIssue}
        onSuccess={handleResolutionSuccess}
      />
    </div>
  );
};

export default AdminDashboard;
