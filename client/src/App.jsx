import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Feed from './pages/Feed';
import MyReports from './pages/MyReports';
import About from './pages/About';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import ReportModal from './components/ReportModal';
import CivicAiChatbot from './components/CivicAiChatbot';

// Admin Imports
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

// Public Layout Wrapper for main client-facing website
function PublicLayout({ children, onOpenReport }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900 relative">
      <Navbar onOpenReport={onOpenReport} />
      <div className="flex-1">{children}</div>
      {/* Global Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            Civic Alert &copy; {new Date().getFullYear()} — Community Civic Issue Reporting System
          </p>
          <div className="flex items-center space-x-4 text-slate-500">
            <span className="hover:text-slate-300 transition">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition">Terms of Service</span>
            <span>•</span>
            <a href="/admin/login" className="text-indigo-400 hover:underline">Admin Portal 🛡️</a>
          </div>
        </div>
      </footer>
      {/* Floating CivicAI Chatbot */}
      <CivicAiChatbot onOpenReportWithData={onOpenReport} />
    </div>
  );
}

function App() {
  const [globalReportModalOpen, setGlobalReportModalOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenReport = (data = null) => {
    setReportModalData(data);
    setGlobalReportModalOpen(true);
  };

  const handleReportSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ==========================================
              1. PUBLIC CLIENT-FACING WEBSITE ROUTES
             ========================================== */}
          <Route
            path="/"
            element={
              <PublicLayout onOpenReport={(data) => handleOpenReport(data)}>
                <Home onOpenReport={() => handleOpenReport(null)} />
              </PublicLayout>
            }
          />
          <Route
            path="/feed"
            element={
              <PublicLayout onOpenReport={(data) => handleOpenReport(data)}>
                <Feed key={`feed-${refreshTrigger}`} onOpenReport={() => handleOpenReport(null)} />
              </PublicLayout>
            }
          />
          <Route
            path="/my-reports"
            element={
              <PublicLayout onOpenReport={(data) => handleOpenReport(data)}>
                <MyReports key={`my-reports-${refreshTrigger}`} onOpenReport={() => handleOpenReport(null)} />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout onOpenReport={(data) => handleOpenReport(data)}>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout onOpenReport={(data) => handleOpenReport(data)}>
                <UserLogin />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout onOpenReport={(data) => handleOpenReport(data)}>
                <UserRegister />
              </PublicLayout>
            }
          />

          {/* ==========================================
              2. ISOLATED ADMIN PORTAL ROUTES (/admin/*)
             ========================================== */}
          {/* Dedicated Admin Login Page (NO public navbar/footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes Tree */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Report Modal Form with AI Prefill capability */}
        <ReportModal
          isOpen={globalReportModalOpen}
          onClose={() => setGlobalReportModalOpen(false)}
          onSuccess={handleReportSuccess}
          initialData={reportModalData}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
