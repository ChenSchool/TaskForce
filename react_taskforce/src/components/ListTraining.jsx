import React, { useState, useEffect } from 'react';
import { getAllTraining, deleteTraining } from '../api/training';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../utils/export';

export default function ListTraining() {
  const [training, setTraining] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = () => getAllTraining().then(setTraining);

  const handleDeleteClick = (id) => {
    setTrainingToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (trainingToDelete !== null) {
      deleteTraining(trainingToDelete).then(() => {
        load();
        setShowConfirm(false);
        setTrainingToDelete(null);
      });
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setTrainingToDelete(null);
  };

  const handleExportCSV = () => {
    exportToCSV(training, 'training_records');
  };

  const handleExportPDF = () => {
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Personnel', dataKey: 'personnel_name' },
      { header: 'Task', dataKey: 'task_description' },
      { header: 'Phase', dataKey: 'phase' },
      { header: 'Progress', dataKey: 'progress' },
      { header: 'Complete', dataKey: 'complete' }
    ];
    exportToPDF(training, 'training_records', 'Training Records', columns);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Training Records</h2>
          <div className="export-buttons">
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
            <button className="btn btn-light" onClick={() => nav('/training/new')}>
              <i className="bi bi-plus-circle"></i> Add Training
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table">
        <thead>
          <tr>
            <th>Personnel</th>
            <th>Phase</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {training.map(t => (
            <tr key={t.id}>
              <td>
                <strong>{t.personnel_name}</strong>
                <br />
                <small className="text-muted">{t.personnel_role || '-'}</small>
              </td>
              <td>{t.phase}</td>
              <td>
                <div className="progress" style={{ minWidth: '100px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${t.progress}%` }}
                    aria-valuenow={t.progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100">
                    {t.progress}%
                  </div>
                </div>
              </td>
              <td>
                {t.complete ? (
                  <span className="badge bg-success">Complete</span>
                ) : (
                  <span className="badge bg-warning">In Progress</span>
                )}
              </td>
              <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => nav(`/training/${t.id}`)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDeleteClick(t.id)}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {training.length === 0 && (
          <div className="alert alert-info">
            No training records found. Click "Add Training" to add one.
          </div>
        )}
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
                <p>Delete this training record?</p>
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
