import React from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { ManagementDashboard } from './pages/ManagementDashboard';
import { Role } from './types';
import { ToastContainer } from './components/ToastNotification';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();

  return (
    <>
      <ToastContainer />
      {(() => {
        if (isLoading) {
          return <div className="flex items-center justify-center h-screen bg-slate-100 text-slate-800">Loading...</div>;
        }

        if (!user) {
          return <LoginPage />;
        }

        switch (user.role) {
          case Role.Patient:
            return <PatientDashboard />;
          case Role.Doctor:
            return <DoctorDashboard />;
          case Role.Management:
            return <ManagementDashboard />;
          default:
            return <LoginPage />;
        }
      })()}
    </>
  );
};

export default App;