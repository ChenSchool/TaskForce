import React, { useState, useEffect } from 'react';
import { getAllTasks, deleteTask } from '../api/tasks';
import { getAllAircraft } from '../api/aircraft';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../utils/export';
import { toast } from 'react-toastify';

export default function ListTask() {
  const [tasks, setTasks] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const nav = useNavigate();

  useEffect(() => { load(); getAllAircraft().then(setAircraft); }, []);
  const load = () => getAllTasks().then(setTasks);

  const handleExportCSV = () => {
    try {
      const exportData = tasks.map(t => ({
        id: t.id,
        aircraft: findTail(t.aircraft_id),
        shift: t.shift,
        description: t.description,
        status: t.status,
        date: t.date
      }));
      exportToCSV(exportData, 'tasks');
      toast.success('Tasks exported to CSV successfully!');
    } catch (error) {
      toast.error('Failed to export tasks to CSV');
    }
  };

  const handleExportPDF = () => {
    try {
      const exportData = tasks.map(t => ({
        id: t.id,
        aircraft: findTail(t.aircraft_id),
        shift: t.shift,
        description: t.description,
        status: t.status,
        date: t.date
      }));
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Aircraft', dataKey: 'aircraft' },
        { header: 'Shift', dataKey: 'shift' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Date', dataKey: 'date' }
      ];
      exportToPDF(exportData, 'tasks', 'Tasks List', columns);
      toast.success('Tasks exported to PDF successfully!');
    } catch (error) {
      toast.error('Failed to export tasks to PDF');
    }
  };

  const findTail = id => aircraft.find(a => a.id === id)?.tail_number || '';

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete)
        .then(() => {
          load();
          setShowConfirm(false);
          setTaskToDelete(null);
          toast.success('Task deleted successfully!');
        })
        .catch((error) => {
          toast.error('Failed to delete task');
          console.error(error);
        });
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setTaskToDelete(null);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Task Board</h2>
          <div className="export-buttons">
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
            <button className="btn btn-light" onClick={()=>nav('/tasks/new')}>
              <i className="bi bi-plus-circle"></i> Add Task
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Aircraft Tail Number</th>
                <th>Shift Category</th>
                <th>Task Description</th>
                <th>Status</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id}>
                  <td>{findTail(t.aircraft_id)}</td>
                  <td>{t.shift}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className={`badge ${t.status === 'Complete' ? 'bg-success' : 'bg-warning'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.date}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-outline-primary" onClick={()=>nav(`/tasks/${t.id}`)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDeleteClick(t.id)}>
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
      {showConfirm && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Delete this task?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}