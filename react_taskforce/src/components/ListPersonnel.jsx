/**
 * ListPersonnel component.
 * Displays personnel list with CRUD operations, export functionality, and delete confirmation.
 */
import React, { useState, useEffect } from 'react';
import { getAllPersonnel, deletePersonnel } from '../api/personnel';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../utils/export';

/**
 * Personnel list component with table view, delete confirmation modal, and CSV/PDF export.
 */
export default function ListPersonnel() {
  const [items, setItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const nav = useNavigate();

  useEffect(() => { load(); }, []);
  const load = () => getAllPersonnel().then(setItems);

  const handleExportCSV = () => {
    exportToCSV(items, 'personnel');
  };

  const handleExportPDF = () => {
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Specialty', dataKey: 'specialty' },
      { header: 'Role', dataKey: 'role' },
      { header: 'Shift', dataKey: 'shift' }
    ];
    exportToPDF(items, 'personnel', 'Personnel List', columns);
  };

  const handleDeleteClick = (id) => {
    setPersonToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (personToDelete !== null) {
      deletePersonnel(personToDelete).then(() => {
        load();
        setShowConfirm(false);
        setPersonToDelete(null);
      });
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonToDelete(null);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Personnel</h2>
          <div className="export-buttons">
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
            <button className="btn btn-light" onClick={() => nav('/personnel/new')}>
              <i className="bi bi-plus-circle"></i> Add Personnel
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.specialty}</td>
                  <td>{p.role}</td>
                  <td>{p.shift}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => nav(`/personnel/${p.id}`)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(p.id)}>
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
                <p>Delete this person?</p>
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