import React, { useState, useEffect } from 'react';
import { getAllAssignments, deleteAssignment } from '../api/assignments';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../utils/export';

export default function ListAssignment() {
  const [groupedAssignments, setGroupedAssignments] = useState([]);
  const [activeShift, setActiveShift] = useState('1st');
  const nav = useNavigate();

  const handleExportCSV = () => {
    const currentShiftData = groupedAssignments.filter(g => g.shift === activeShift);
    const exportData = currentShiftData.flatMap(g => 
      g.personnel.map(p => ({
        task_id: g.task_id,
        task: g.task_description,
        aircraft: g.aircraft_tail,
        status: g.task_status,
        shift: g.shift,
        personnel: p.name,
        personnel_role: p.role
      }))
    );
    exportToCSV(exportData, `assignments_${activeShift}_shift`);
  };

  const handleExportPDF = () => {
    const currentShiftData = groupedAssignments.filter(g => g.shift === activeShift);
    const exportData = currentShiftData.flatMap(g => 
      g.personnel.map(p => ({
        task_id: g.task_id,
        task: g.task_description,
        aircraft: g.aircraft_tail,
        status: g.task_status,
        personnel: p.name,
        personnel_role: p.role
      }))
    );
    const columns = [
      { header: 'Task ID', dataKey: 'task_id' },
      { header: 'Task', dataKey: 'task' },
      { header: 'Aircraft', dataKey: 'aircraft' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Personnel', dataKey: 'personnel' },
      { header: 'Role', dataKey: 'personnel_role' }
    ];
    exportToPDF(exportData, `assignments_${activeShift}_shift`, `Assignments - ${activeShift} Shift`, columns);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = () => getAllAssignments().then(data => {
    groupAssignments(data);
  });

  // Group assignments by task
  const groupAssignments = (data) => {
    const grouped = {};
    
    data.forEach(a => {
      if (!grouped[a.task_id]) {
        grouped[a.task_id] = {
          task_id: a.task_id,
          task_description: a.task_description,
          aircraft_tail: a.aircraft_tail,
          task_status: a.task_status,
          shift: a.task_shift, // Assuming the API returns task_shift
          personnel: [],
          assignment_ids: []
        };
      }
      grouped[a.task_id].personnel.push({
        name: a.personnel_name,
        role: a.assignment_role
      });
      grouped[a.task_id].assignment_ids.push(a.assignment_id);
    });

    setGroupedAssignments(Object.values(grouped));
  };

  const handleDeleteTask = async (taskId, assignmentIds) => {
    if (window.confirm('Delete all assignments for this task?')) {
      // Delete all assignment records for this task
      await Promise.all(assignmentIds.map(id => deleteAssignment(id)));
      load();
    }
  };

  // Filter assignments by active shift
  const filteredAssignments = groupedAssignments.filter(g => g.shift === activeShift);

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Assignments</h2>
          <div className="export-buttons">
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
            <button className="btn btn-light" onClick={() => nav('/assignments/new')}>
              <i className="bi bi-plus-circle"></i> Add Assignment
            </button>
          </div>
        </div>
        
        {/* Shift Tabs */}
        <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeShift === '1st' ? 'active' : ''}`}
            onClick={() => setActiveShift('1st')}
          >
            1st Shift
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeShift === '2nd' ? 'active' : ''}`}
            onClick={() => setActiveShift('2nd')}
          >
            2nd Shift
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeShift === '3rd' ? 'active' : ''}`}
            onClick={() => setActiveShift('3rd')}
          >
            3rd Shift
          </button>
        </li>
      </ul>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Aircraft</th>
                <th>Personnel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map(g => (
                <tr key={g.task_id}>
                  <td>{g.task_description}</td>
                  <td>{g.aircraft_tail}</td>
                  <td>
                    {g.personnel.map((p, idx) => (
                      <div key={idx}>
                        <strong>{p.name}</strong> - {p.role}
                      </div>
                    ))}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => nav(`/assignments/${g.assignment_ids[0]}`)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDeleteTask(g.task_id, g.assignment_ids)}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}