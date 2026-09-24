import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, Plus, AlertCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import IssueCard from '../components/IssueCard';
import EditModal from '../components/EditModal';

const MyReports = ({ onOpenReport }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingIssue, setEditingIssue] = useState(null);

  const fetchMyIssues = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get('/issues');
      const allIssues = response.data.data || [];
      const myIssueIds = JSON.parse(localStorage.getItem('my_civic_issues') || '[]');

      if (myIssueIds.length === 0) {
        setIssues(allIssues.slice(0, 3));
      } else {
        setIssues(allIssues.filter((item) => myIssueIds.includes(item._id)));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to load your issues.');
    }
  }, []);

  useEffect(() => {
    fetchMyIssues();
  }, [fetchMyIssues]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this report?')) {
      try {
        await axiosInstance.delete(`/issues/${id}`);
        const myIssueIds = JSON.parse(localStorage.getItem('my_civic_issues') || '[]');
        localStorage.setItem(
          'my_civic_issues',
          JSON.stringify(myIssueIds.filter((item) => item !== id))
        );
        fetchMyIssues();
      } catch (err) {
        alert(err.message || 'Failed to delete issue');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Reported Issues</h1>
              <p className="text-slate-400 text-xs mt-0.5">Track status updates for your submitted reports</p>
            </div>
          </div>

          <button
            onClick={onOpenReport}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Report New</span>
          </button>
        </div>
      </section>

      {/* Main Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center justify-between border border-red-200">
            <span>{error}</span>
            <button onClick={fetchMyIssues} className="underline font-bold ml-2">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 border border-slate-200 animate-pulse p-4 space-y-3">
                <div className="bg-slate-200 h-36 rounded-xl w-full" />
                <div className="bg-slate-200 h-4 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-sm mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No reports yet</h3>
            <p className="text-xs text-slate-500 mt-1">You have not submitted any issue reports from this device.</p>
            <button
              onClick={onOpenReport}
              className="mt-4 inline-flex items-center space-x-1.5 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
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
        onSuccess={fetchMyIssues}
      />
    </div>
  );
};

export default MyReports;
