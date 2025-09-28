import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ListAircraft from './components/ListAircraft';
import CreateEditAircraft from './components/CreateEditAircraft';
import ListTask from './components/ListTask';
import CreateEditTask from './components/CreateEditTask';
import ListPersonnel from './components/ListPersonnel';
import CreateEditPersonnel from './components/CreateEditPersonnel';
import ListAssignment from './components/ListAssignment';
import CreateEditAssignment from './components/CreateEditAssignment';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/aircraft" replace />} />
        <Route path="aircraft" element={<ListAircraft />} />
        <Route path="aircraft/new" element={<CreateEditAircraft />} />
        <Route path="aircraft/:id" element={<CreateEditAircraft />} />

        <Route path="tasks" element={<ListTask />} />
        <Route path="tasks/new" element={<CreateEditTask />} />
        <Route path="tasks/:id" element={<CreateEditTask />} />

        <Route path="personnel" element={<ListPersonnel />} />
        <Route path="personnel/new" element={<CreateEditPersonnel />} />
        <Route path="personnel/:id" element={<CreateEditPersonnel />} />

        <Route path="assignments" element={<ListAssignment />} />
        <Route path="assignments/new" element={<CreateEditAssignment />} />
        <Route path="assignments/:id" element={<CreateEditAssignment />} />

      </Routes>
    </Layout>
  );
}

export default App;