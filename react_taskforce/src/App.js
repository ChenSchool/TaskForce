/**
 * Main application component.
 * Configures routing, authentication provider, toast notifications, and layout wrapper for the entire application.
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateUser from './components/Register';
import EditUser from './components/EditUser';
import Dashboard from './components/Dashboard';
import ListAircraft from './components/ListAircraft';
import CreateEditAircraft from './components/CreateEditAircraft';
import ListTask from './components/ListTask';
import CreateEditTask from './components/CreateEditTask';
import ListPersonnel from './components/ListPersonnel';
import CreateEditPersonnel from './components/CreateEditPersonnel';
import ListAssignment from './components/ListAssignment';
import CreateEditAssignment from './components/CreateEditAssignment';
import ListTraining from './components/ListTraining';
import CreateEditTraining from './components/CreateEditTraining';
import ListArchives from './components/ListArchives';
import ViewArchive from './components/ViewArchive';
import ListUsers from './components/ListUsers';
import ArchiveScheduleManager from './components/ArchiveScheduleManager';

/**
 * Root application component with route definitions and role-based access control.
 */
function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/assignments" replace /></ProtectedRoute>} />
          
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="aircraft" element={<ProtectedRoute><ListAircraft /></ProtectedRoute>} />
          <Route path="aircraft/new" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditAircraft /></ProtectedRoute>} />
          <Route path="aircraft/:id" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditAircraft /></ProtectedRoute>} />

          <Route path="tasks" element={<ProtectedRoute><ListTask /></ProtectedRoute>} />
          <Route path="tasks/new" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditTask /></ProtectedRoute>} />
          <Route path="tasks/:id" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditTask /></ProtectedRoute>} />

          <Route path="personnel" element={<ProtectedRoute><ListPersonnel /></ProtectedRoute>} />
          <Route path="personnel/new" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditPersonnel /></ProtectedRoute>} />
          <Route path="personnel/:id" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditPersonnel /></ProtectedRoute>} />

          <Route path="assignments" element={<ProtectedRoute><ListAssignment /></ProtectedRoute>} />
          <Route path="assignments/new" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditAssignment /></ProtectedRoute>} />
          <Route path="assignments/:id" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditAssignment /></ProtectedRoute>} />

          <Route path="training" element={<ProtectedRoute><ListTraining /></ProtectedRoute>} />
          <Route path="training/new" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditTraining /></ProtectedRoute>} />
          <Route path="training/:id" element={<ProtectedRoute roles={['Manager', 'Production Lead', 'Supervisor']}><CreateEditTraining /></ProtectedRoute>} />

          <Route path="archives" element={<ProtectedRoute><ListArchives /></ProtectedRoute>} />
          <Route path="archives/:id" element={<ProtectedRoute><ViewArchive /></ProtectedRoute>} />

          <Route path="archive-schedules" element={<ProtectedRoute roles={['Manager', 'Supervisor']}><ArchiveScheduleManager /></ProtectedRoute>} />

          <Route path="users" element={<ProtectedRoute roles={['Manager', 'Supervisor']}><ListUsers /></ProtectedRoute>} />
          <Route path="users/new" element={<ProtectedRoute roles={['Manager', 'Supervisor']}><CreateUser /></ProtectedRoute>} />
          <Route path="users/:id" element={<ProtectedRoute roles={['Manager', 'Supervisor']}><EditUser /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;