import React from 'react';
import { Lock } from 'lucide-react';
import { HubstaffProvider, useHubstaff } from './context/HubstaffContext';
import HubstaffHeader from './components/HubstaffHeader';
import HubstaffSidebar from './components/HubstaffSidebar';
import DashboardView from './components/views/DashboardView';
import ActivityView from './components/views/ActivityView';
import TimesheetsView from './components/views/TimesheetsView';
import PayrollView from './components/views/PayrollView';
import SettingsView from './components/views/SettingsView';
import LeavePortalView from './components/views/LeavePortalView';
import EmployeesAdminView from './components/views/EmployeesAdminView';
import LoginView from './components/views/LoginView';
import ManualTimeModal from './components/modals/ManualTimeModal';
import InvoiceModal from './components/modals/InvoiceModal';
import AddProjectModal from './components/modals/AddProjectModal';
import FaceLockModal from './components/modals/FaceLockModal';
import ApplyLeaveModal from './components/modals/ApplyLeaveModal';
import GoogleAuthModal from './components/modals/GoogleAuthModal';
import AddEmployeeModal from './components/modals/AddEmployeeModal';
import FaceLoginModal from './components/modals/FaceLoginModal';

function HubstaffContent() {
  const { activeTab, currentUser } = useHubstaff();
  const isAdmin = currentUser?.role === 'admin';

  // Security Route Guard: Block employee from accessing admin routes
  if (!isAdmin && (activeTab === 'activity' || activeTab === 'payroll' || activeTab === 'employees')) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/60">
        <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xl max-w-md text-center space-y-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Access Restricted (403 Forbidden)</h3>
          <p className="text-xs text-slate-500">
            You do not have administrative privileges to view company-wide activity, payroll, or team records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/60">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'employees' && isAdmin && <EmployeesAdminView />}
      {activeTab === 'activity' && isAdmin && <ActivityView />}
      {activeTab === 'timesheets' && <TimesheetsView />}
      {activeTab === 'leave' && <LeavePortalView />}
      {activeTab === 'payroll' && isAdmin && <PayrollView />}
      {activeTab === 'settings' && <SettingsView />}
    </div>
  );
}

function MainApp() {
  const { isAuthenticated } = useHubstaff();

  return (
    <>
      {!isAuthenticated ? (
        <LoginView />
      ) : (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 select-none">
          {/* Top Navbar with Stopwatch Time Tracker, Face Lock & Role Actions */}
          <HubstaffHeader />

          {/* Main Body: Left Navigation Sidebar + Content Views */}
          <div className="flex-1 flex overflow-hidden">
            <HubstaffSidebar />
            <HubstaffContent />
          </div>

          {/* Global Modals for Authenticated Users */}
          <ManualTimeModal />
          <InvoiceModal />
          <AddProjectModal />
          <FaceLockModal />
          <ApplyLeaveModal />
          <AddEmployeeModal />
        </div>
      )}

      {/* Authentication Modals (Available across Login & App) */}
      <GoogleAuthModal />
      <FaceLoginModal />
    </>
  );
}

export default function App() {
  return (
    <HubstaffProvider>
      <MainApp />
    </HubstaffProvider>
  );
}
