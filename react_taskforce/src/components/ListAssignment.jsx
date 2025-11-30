/**
 * ListAssignment component.
 * Displays assignments grouped by task with shift-based filtering, manual archive functionality, and export capabilities.
 */
import React, { useState, useEffect } from 'react';
import { getAllAssignments, deleteAssignment } from '../api/assignments';
import { manualArchive } from '../api/archiveSchedule';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exportToCSV, exportToPDF } from '../utils/export';

/**
 * Assignment list component with shift tabs, grouped task view, manual archiving, and CSV/PDF export.
 */
export default function ListAssignment() {
  const location = useLocation();
  const [groupedAssignments, setGroupedAssignments] = useState([]);
  const [activeShift, setActiveShift] = useState(location.state?.shift || '1st');
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const nav = useNavigate();
  const { hasRole } = useAuth();

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

    // Sort personnel alphabetically within each task group
    Object.values(grouped).forEach(group => {
      group.personnel.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Sort grouped assignments by aircraft tail number
    const sortedGrouped = Object.values(grouped).sort((a, b) => {
      const tailA = a.aircraft_tail || '';
      const tailB = b.aircraft_tail || '';
      return tailA.localeCompare(tailB);
    });

    setGroupedAssignments(sortedGrouped);
  };

  const handleDeleteTask = async (taskId, assignmentIds) => {
    if (window.confirm('Delete all assignments for this task?')) {
      // Delete all assignment records for this task
      await Promise.all(assignmentIds.map(id => deleteAssignment(id)));
      load();
    }
  };

  const handleArchiveClick = () => {
    setShowArchiveModal(true);
  };

  const handleConfirmArchive = async () => {
    try {
      setArchiving(true);
      const result = await manualArchive({ shift: activeShift });
      
      toast.success(`Successfully archived ${result.assignments_archived} assignment(s) for ${activeShift} shift!`);
      setShowArchiveModal(false);
      load(); // Reload assignments
    } catch (err) {
      toast.error('Failed to archive: ' + (err.response?.data?.message || err.message));
    } finally {
      setArchiving(false);
    }
  };

  const handleCancelArchive = () => {
    setShowArchiveModal(false);
  };

  // Filter assignments by active shift
  const filteredAssignments = groupedAssignments.filter(g => g.shift === activeShift);

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Assignments</h2>
          <div className="export-buttons">
            {(hasRole('Manager') || hasRole('Supervisor')) && (
              <button className="btn btn-warning btn-sm me-2" onClick={handleArchiveClick}>
                <i className="bi bi-archive"></i> Archive {activeShift} Shift
              </button>
            )}
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
            <button className="btn btn-light" onClick={() => nav('/assignments/new', { state: { shift: activeShift } })}>
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
                <th>Aircraft</th>
                <th>Task</th>
                <th>Personnel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map(g => (
                <tr key={g.task_id}>
                  <td>{g.aircraft_tail}</td>
                  <td>{g.task_description}</td>
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
                        onClick={() => nav(`/assignments/${g.assignment_ids[0]}`, { state: { shift: activeShift } })}>
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

      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">
                  <i className="bi bi-archive"></i> Archive {activeShift} Shift Assignments
                </h5>
                <button type="button" className="btn-close" onClick={handleCancelArchive}></button>
              </div>
              <div className="modal-body">
                <p>This will archive <strong>ALL assignments</strong> for the <strong>{activeShift} shift</strong> currently displayed on the assignments page.</p>
                <div className="alert alert-warning">
                  <small>
                    <i className="bi bi-exclamation-triangle"></i> This action will archive all assignments for the {activeShift} shift, regardless of their age. Archived assignments can be viewed in the Archive Schedule Manager.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelArchive} disabled={archiving}>
                  Cancel
                </button>
                <button className="btn btn-warning" onClick={handleConfirmArchive} disabled={archiving}>
                  {archiving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Archiving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-archive"></i> Archive Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}