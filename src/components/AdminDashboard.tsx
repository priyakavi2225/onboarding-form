import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Users,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Trash2,
  Edit,
  Eye,
  LogOut,
  Layers,
  FileText,
  Settings,
  RefreshCw,
  Menu,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'applications' | 'employees' | 'documents' | 'reports' | 'settings'
  >('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [assignDept, setAssignDept] = useState('');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignManager, setAssignManager] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/onboarding');
      if (!response.ok) throw new Error('Failed to retrieve profiles from server.');
      const data = await response.json();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Connection failure to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdateStatus = async (profileId: string, status: string) => {
    try {
      const record = records.find((r) => r.id === profileId);
      if (!record) return;
      const payload = { ...record, status };
      const response = await fetch(`/api/admin/onboarding/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        showNotification(`Application updated to '${status.toUpperCase()}'`);
        setIsReviewModalOpen(false);
        setSelectedRecord(null);
        fetchRecords();
      } else {
        showNotification('Failed to update application status.');
      }
    } catch {
      showNotification('Error connecting to the backend API.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    try {
      const updatedRecord = {
        ...selectedRecord,
        personalInfo: { ...selectedRecord.personalInfo, fullName: editName, mobile: editMobile },
        role: editRole,
        status: editStatus,
        adminInfo: { ...selectedRecord.adminInfo, department: assignDept, roleTitle: assignTitle, reportingManager: assignManager },
      };
      const response = await fetch(`/api/admin/onboarding/${selectedRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord),
      });
      if (response.ok) {
        showNotification('Employee details saved successfully.');
        setIsEditModalOpen(false);
        setSelectedRecord(null);
        fetchRecords();
      } else {
        showNotification('Failed to save employee edits.');
      }
    } catch {
      showNotification('Error connecting to backend server.');
    }
  };

  const handleDeleteRecord = async (profileId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this onboarding record?')) return;
    try {
      const response = await fetch(`/api/admin/onboarding/${profileId}`, { method: 'DELETE' });
      if (response.ok) {
        showNotification('Profile deleted.');
        fetchRecords();
      } else {
        showNotification('Failed to delete onboarding profile.');
      }
    } catch {
      showNotification('Error communicating with backend API.');
    }
  };

  const openEditModal = (rec: any) => {
    setSelectedRecord(rec);
    setEditName(rec.personalInfo.fullName);
    setEditMobile(rec.personalInfo.mobile);
    setEditRole(rec.role);
    setEditStatus(rec.status);
    setAssignDept(rec.adminInfo?.department || '');
    setAssignTitle(rec.adminInfo?.roleTitle || '');
    setAssignManager(rec.adminInfo?.reportingManager || '');
    setIsEditModalOpen(true);
  };

  const totalApplications = records.length;
  const pendingReviews = records.filter((r) => r.status === 'pending').length;
  const approvedEmployees = records.filter((r) => r.status === 'approved').length;
  const rejectedApplications = records.filter((r) => r.status === 'rejected').length;

  const filteredRecords = records.filter((rec) => {
    const name = rec.personalInfo.fullName.toLowerCase();
    const email = rec.personalInfo.email.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
    const matchesRole = filterRole ? rec.role === filterRole : true;
    const matchesStatus = filterStatus ? rec.status === filterStatus : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleExportCSV = (type: 'all' | 'approved' | 'pending') => {
    let list = records;
    if (type === 'approved') list = records.filter((r) => r.status === 'approved');
    if (type === 'pending') list = records.filter((r) => r.status === 'pending');
    if (list.length === 0) { showNotification('No data available to export.'); return; }
    const headers = ['Employee ID', 'Name', 'Email', 'Mobile', 'Role', 'Status', 'Country', 'Joined Date'];
    const csvRows = [headers.join(',')];
    list.forEach((r) => {
      csvRows.push([
        `"${r.id}"`, `"${r.personalInfo.fullName}"`, `"${r.personalInfo.email}"`,
        `"${r.personalInfo.mobile || ''}"`, `"${r.role || ''}"`, `"${r.status || 'pending'}"`,
        `"${r.personalInfo.country || ''}"`, `"${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}"`,
      ].join(','));
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `eduquest_onboarding_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('CSV Report exported successfully.');
  };

  // Sidebar nav item helper
  const NavBtn = ({ tab, icon: Icon, label, badge }: { tab: typeof activeTab; icon: any; label: string; badge?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
        activeTab === tab
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-100'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 flex font-sans select-none overflow-x-hidden" id="admin-dashboard-container">

      {/* Toast notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 text-gray-800 font-semibold text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:relative top-0 bottom-0 left-0 z-50 w-[240px] shrink-0 bg-white border-r border-gray-150/70 flex flex-col justify-between p-5 shadow-sm transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-5">
          {/* Brand */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-100">
                EQ
              </div>
              <div>
                <h1 className="text-sm font-black text-gray-800 tracking-wide uppercase">EduQuest</h1>
                <p className="text-[9px] text-gray-400 font-semibold tracking-wider">Admin Workspace</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Nav */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('applications'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Onboarding Reviews</span>
              </div>
              {pendingReviews > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingReviews}</span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('employees'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'employees'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Employee Directory</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('documents'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4" />
                <span>Document Center</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4" />
                <span>Reports Export</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings & Security</span>
              </div>
            </button>
          </nav>
        </div>

        {/* User info + logout */}
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
              SA
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800">System Admin</p>
              <p className="text-[9px] text-gray-400">admin@eduquest.com</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-400 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">

        {/* Top header bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 rounded-xl transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-gray-900 capitalize">{activeTab} Workspace</h2>
              <p className="text-xs text-gray-400 mt-0.5">Manage, verify, and complete enterprise user onboarding tasks.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={fetchRecords}
              className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 rounded-xl transition-all cursor-pointer"
              title="Refresh records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="p-2 border border-gray-200 text-gray-500 rounded-xl flex items-center gap-1.5 text-xs font-semibold">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Live Feed</span>
            </div>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl flex items-center justify-between">
            <span>Error: {error}</span>
            <button onClick={fetchRecords} className="underline font-bold hover:text-red-800">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-3 py-24">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-xs text-gray-400 font-medium">Synchronizing records with database...</p>
          </div>
        ) : (
          <div className="space-y-6 flex-1">

            {/* ── TAB: DASHBOARD ── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Applications', value: totalApplications, icon: Users, color: 'blue', sub: 'Submitted in database' },
                    { label: 'Pending Review', value: pendingReviews, icon: Clock, color: 'amber', sub: 'Requires manual audit' },
                    { label: 'Approved', value: approvedEmployees, icon: CheckCircle, color: 'emerald', sub: 'Onboarding verified' },
                    { label: 'Rejected', value: rejectedApplications, icon: XCircle, color: 'red', sub: 'Declined or refile' },
                  ].map(({ label, value, icon: Icon, color, sub }) => (
                    <div key={label} className="bg-white border border-gray-150/70 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-tight">{label}</span>
                        <div className={`p-1.5 rounded-lg ${
                          color === 'blue' ? 'bg-blue-50 text-blue-600' :
                          color === 'amber' ? 'bg-amber-50 text-amber-600' :
                          color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-red-50 text-red-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-3xl font-black text-gray-900">{value}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="bg-white border border-gray-150/70 rounded-3xl p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-gray-800">System Onboarding Clearance Rate</h3>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${totalApplications ? (approvedEmployees / totalApplications) * 100 : 0}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    <div style={{ width: `${totalApplications ? (pendingReviews / totalApplications) * 100 : 0}%` }} className="h-full bg-amber-400" />
                    <div style={{ width: `${totalApplications ? (rejectedApplications / totalApplications) * 100 : 0}%` }} className="h-full bg-red-400" />
                  </div>
                  <div className="flex gap-5 text-[10px] font-semibold text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Approved ({Math.round(totalApplications ? (approvedEmployees / totalApplications) * 100 : 0)}%)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Pending ({Math.round(totalApplications ? (pendingReviews / totalApplications) * 100 : 0)}%)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Rejected ({Math.round(totalApplications ? (rejectedApplications / totalApplications) * 100 : 0)}%)</span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-150/70 rounded-3xl p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Recent Applications</h3>
                  <div className="space-y-2">
                    {records.slice(0, 5).map((rec, i) => (
                      <div key={rec.id || i} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                            {rec.personalInfo.fullName.substring(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-bold text-gray-800">{rec.personalInfo.fullName}</p>
                            <p className="text-[10px] text-gray-400 capitalize">{rec.role} • {rec.personalInfo.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={rec.status} />
                          <span className="text-[10px] text-gray-400">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                    ))}
                    {records.length === 0 && <p className="text-center text-xs text-gray-400 py-4">No submissions yet.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: APPLICATIONS ── */}
            {activeTab === 'applications' && (
              <div className="space-y-4">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-gray-150/70 rounded-2xl shadow-sm items-center">
                  <div className="relative w-full sm:flex-1">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                      <option value="">All Roles</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="administrator">Administrator</option>
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-150/70 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-4">Name</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Country</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((rec) => (
                        <tr key={rec.id} className="border-b border-gray-50 hover:bg-blue-50/30 text-xs transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                {rec.personalInfo.fullName.substring(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <p className="font-bold text-gray-800">{rec.personalInfo.fullName}</p>
                                <p className="text-[10px] text-gray-400">{rec.personalInfo.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold capitalize text-gray-600">{rec.role}</td>
                          <td className="p-4 text-gray-500">{rec.personalInfo.country || 'N/A'}</td>
                          <td className="p-4 text-gray-500">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-4"><StatusBadge status={rec.status} /></td>
                          <td className="p-4 text-right space-x-1.5">
                            <button
                              onClick={() => { setSelectedRecord(rec); setIsReviewModalOpen(true); }}
                              className="px-2.5 py-1 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Review
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(rec.id)}
                              className="p-1 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all inline-flex items-center cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredRecords.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-xs text-gray-400">No records found matching filters.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}

            {/* ── TAB: EMPLOYEES ── */}
            {activeTab === 'employees' && (
              <div className="space-y-4">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search approved employees by name, email, department..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="bg-white border border-gray-150/70 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-4">Employee</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Designation</th>
                        <th className="p-4">Manager</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.filter((r) => r.status === 'approved').map((rec) => (
                        <tr key={rec.id} className="border-b border-gray-50 hover:bg-blue-50/30 text-xs transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                                {rec.personalInfo.fullName.substring(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <p className="font-bold text-gray-800">{rec.personalInfo.fullName}</p>
                                <p className="text-[10px] text-gray-400">{rec.personalInfo.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-gray-600">{rec.adminInfo?.department || 'Unassigned'}</td>
                          <td className="p-4 text-gray-500">{rec.adminInfo?.roleTitle || rec.role || 'Member'}</td>
                          <td className="p-4 text-gray-500">{rec.adminInfo?.reportingManager || '—'}</td>
                          <td className="p-4 text-emerald-600 font-semibold text-[10px]">✓ Approved</td>
                          <td className="p-4 text-right space-x-1.5">
                            <button
                              onClick={() => openEditModal(rec)}
                              className="px-2 py-1 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3 h-3" /> Manage
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(rec.id)}
                              className="p-1 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all inline-flex items-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredRecords.filter((r) => r.status === 'approved').length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-xs text-gray-400">No approved employees yet. Approve applications to list them here.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}

            {/* ── TAB: DOCUMENTS ── */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-150/70 p-5 rounded-3xl shadow-sm space-y-1">
                  <h3 className="text-xs font-bold text-gray-800">Onboarding Uploads Vault</h3>
                  <p className="text-[11px] text-gray-500">Preview, download, and verify documents submitted by users during onboarding.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {records.map((rec) => {
                    const hasDoc = !!rec.personalInfo.profilePic;
                    return (
                      <div key={rec.id} className="bg-white border border-gray-150/70 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-[180px]">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold truncate max-w-[130px]">{rec.personalInfo.fullName}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${hasDoc ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>{hasDoc ? '1 Attachment' : 'No Files'}</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-800 mt-2">Identity Proof & Profile Pic</h4>
                          <p className="text-[10px] text-gray-400 mt-1 truncate">Email: {rec.personalInfo.email}</p>
                        </div>
                        <div className="flex gap-2">
                          {hasDoc ? (
                            <>
                              <a href={rec.personalInfo.profilePic} download className="flex-1 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-800 rounded-lg text-center text-[10px] font-bold transition-all">Download</a>
                              <button onClick={() => { setSelectedRecord(rec); setIsReviewModalOpen(true); }} className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[10px] font-bold transition-all">Preview</button>
                            </>
                          ) : (
                            <button disabled className="w-full py-1.5 border border-gray-100 text-gray-300 bg-gray-50 rounded-lg text-center text-[10px] font-bold cursor-not-allowed">Pending Upload</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TAB: REPORTS ── */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-150/70 p-5 rounded-3xl shadow-sm space-y-1">
                  <h3 className="text-xs font-bold text-gray-800">Export Onboarding Data</h3>
                  <p className="text-[11px] text-gray-500">Select a report type to generate and download a <code className="font-mono">.csv</code> spreadsheet.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { type: 'all' as const, title: 'Full Onboarding Log', desc: 'All user profiles with roles, dates, statuses, and preferences.' },
                    { type: 'pending' as const, title: 'Pending Requests', desc: 'Only users currently awaiting administrative review.' },
                    { type: 'approved' as const, title: 'Approved Employees', desc: 'Finalized employee files with department and manager details.' },
                  ].map(({ type, title, desc }) => (
                    <div key={type} className="bg-white border border-gray-150/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[160px]">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{title}</h4>
                        <p className="text-[10px] text-gray-400 mt-1">{desc}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleExportCSV(type)}
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Export CSV
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB: SETTINGS ── */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-gray-150/70 p-6 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Administrative Portal Settings</h3>
                  <p className="text-[11px] text-gray-500 mt-1">Configure global onboarding parameters and portal metadata.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-700">Company Metadata</h4>
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase">Organization Name</label>
                        <input type="text" defaultValue="EduQuest Corporation" className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase">Notification Email</label>
                        <input type="email" defaultValue="onboarding@eduquest.com" className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-700">Role Authorization Matrix</h4>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2 text-xs">
                      <p className="font-semibold text-gray-700">Permissions Assigned:</p>
                      <ul className="space-y-1 text-[11px] text-gray-500 list-disc list-inside">
                        <li>Create/Delete onboarding user profiles</li>
                        <li>Approve/Reject database applications</li>
                        <li>Assign departments & manager keys</li>
                        <li>Export database analytics reports</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-10 pt-4 border-t border-gray-100">
          © 2026 EduQuest Learning Platform • Admin Portal • Confidential
        </footer>
      </main>

      {/* ═══════════════════════════════════════ */}
      {/* REVIEW MODAL */}
      {/* ═══════════════════════════════════════ */}
      {isReviewModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white border border-gray-150/70 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Reviewing Onboarding File</h3>
                <p className="text-[10px] text-gray-400">ID: {selectedRecord.id}</p>
              </div>
              <button onClick={() => { setIsReviewModalOpen(false); setSelectedRecord(null); }} className="text-gray-400 hover:text-gray-700 font-bold text-lg leading-none">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Profile row */}
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-inner shrink-0">
                  {selectedRecord.personalInfo.profilePic ? (
                    <img src={selectedRecord.personalInfo.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-7 h-7 text-indigo-400" />
                  )}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">{selectedRecord.personalInfo.fullName}</h4>
                  <p className="text-gray-600">Role: <strong className="capitalize text-indigo-600">{selectedRecord.role}</strong></p>
                  <p className="text-[10px] text-gray-400">{selectedRecord.personalInfo.email} • {selectedRecord.personalInfo.mobile || 'No mobile'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <h5 className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Personal Information</h5>
                  <div className="space-y-1.5 text-gray-500 text-[11px]">
                    <p>DOB: <strong className="text-gray-700">{selectedRecord.personalInfo.dateOfBirth || 'N/A'}</strong></p>
                    <p>Gender: <strong className="text-gray-700">{selectedRecord.personalInfo.gender || 'N/A'}</strong></p>
                    <p>Country: <strong className="text-gray-700">{selectedRecord.personalInfo.country || 'N/A'}</strong></p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <h5 className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Role-Specific Details</h5>
                  <div className="space-y-1.5 text-gray-500 text-[11px]">
                    {selectedRecord.role === 'student' && (<>
                      <p>School: <strong className="text-gray-700">{selectedRecord.studentInfo.schoolCollegeName}</strong></p>
                      <p>Grade: <strong className="text-gray-700">{selectedRecord.studentInfo.gradeClass}</strong></p>
                      <p>Subjects: <strong className="text-indigo-600 block truncate">{selectedRecord.studentInfo.preferredSubjects.join(', ')}</strong></p>
                    </>)}
                    {selectedRecord.role === 'teacher' && (<>
                      <p>Institution: <strong className="text-gray-700">{selectedRecord.teacherInfo.institutionName}</strong></p>
                      <p>Qualification: <strong className="text-gray-700">{selectedRecord.teacherInfo.qualification}</strong></p>
                      <p>Subjects: <strong className="text-indigo-600 block truncate">{selectedRecord.teacherInfo.subjectsTaught.join(', ')}</strong></p>
                    </>)}
                    {selectedRecord.role === 'parent' && (<>
                      <p>Children: <strong className="text-gray-700">{selectedRecord.parentInfo.numberOfChildren}</strong></p>
                      <p>Child Grade: <strong className="text-gray-700">{selectedRecord.parentInfo.childGrade}</strong></p>
                    </>)}
                    {selectedRecord.role === 'administrator' && (<>
                      <p>Institution: <strong className="text-gray-700">{selectedRecord.adminInfo.institutionName}</strong></p>
                      <p>Department: <strong className="text-gray-700">{selectedRecord.adminInfo.department}</strong></p>
                      <p>Access: <strong className="text-indigo-600 uppercase">{selectedRecord.adminInfo.accessLevel}</strong></p>
                    </>)}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2 sm:col-span-2">
                  <h5 className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Preferences & Notifications</h5>
                  <div className="grid grid-cols-2 gap-4 text-gray-500 text-[11px]">
                    <div>
                      <p>Time Goal: <strong className="text-gray-700">{selectedRecord.learningPreferences.dailyLearningTime}</strong></p>
                      <p>Language: <strong className="text-gray-700">{selectedRecord.learningPreferences.preferredLanguage}</strong></p>
                    </div>
                    <div>
                      <p>Email: <strong className={selectedRecord.notifications.emailNotifications ? 'text-emerald-600' : 'text-gray-400'}>{selectedRecord.notifications.emailNotifications ? 'Enabled' : 'Disabled'}</strong></p>
                      <p>SMS: <strong className={selectedRecord.notifications.smsAlerts ? 'text-emerald-600' : 'text-gray-400'}>{selectedRecord.notifications.smsAlerts ? 'Enabled' : 'Disabled'}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-between gap-3">
              <button onClick={() => handleUpdateStatus(selectedRecord.id, 'rejected')} className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1">Reject</button>
              <button onClick={() => handleUpdateStatus(selectedRecord.id, 'pending')} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1">Request Clarification</button>
              <button onClick={() => handleUpdateStatus(selectedRecord.id, 'approved')} className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex-1">Approve & Register</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* EDIT MODAL */}
      {/* ═══════════════════════════════════════ */}
      {isEditModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white border border-gray-150/70 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Edit Employee File</h3>
                <p className="text-[10px] text-gray-400">{selectedRecord.personalInfo.email}</p>
              </div>
              <button onClick={() => { setIsEditModalOpen(false); setSelectedRecord(null); }} className="text-gray-400 hover:text-gray-700 font-bold text-lg leading-none">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1 col-span-2">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Full Name *</label>
                    <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Mobile</label>
                    <input type="text" value={editMobile} onChange={(e) => setEditMobile(e.target.value)} className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Platform Role *</label>
                    <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-all appearance-none">
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                <hr className="border-gray-100" />
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Enterprise Assignments</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Department</label>
                    <input type="text" value={assignDept} onChange={(e) => setAssignDept(e.target.value)} placeholder="e.g. HR, IT, Sales" className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Designation</label>
                    <input type="text" value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} placeholder="e.g. Software Engineer" className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Reporting Manager</label>
                    <input type="text" value={assignManager} onChange={(e) => setAssignManager(e.target.value)} placeholder="e.g. Sarah Jenkins" className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Clearance Status *</label>
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-all appearance-none">
                      <option value="pending">Pending Audit</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setSelectedRecord(null); }} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-colors">Discard</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all">Save Changes</motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    rejected: 'bg-red-50 text-red-500 border-red-200',
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${map[status] || map['pending']}`}>
      {status || 'pending'}
    </span>
  );
}
