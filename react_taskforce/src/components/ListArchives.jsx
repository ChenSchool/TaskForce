import React, { useState, useEffect } from 'react';
import { getAllArchives, deleteArchive, createArchive } from '../api/archives';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../utils/export';

export default function ListArchives() {
  const [archives, setArchives] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [shift, setShift] = useState('1st');
  const [aircraftTail, setAircraftTail] = useState('');
  const [cutoffDate, setCutoffDate] = useState('');
  const [creating, setCreating] = useState(false);
  const nav = useNavigate();

  const handleExportCSV = () => {
    exportToCSV(archives, 'archives');
  };

  const handleExportPDF = () => {
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Snapshot Date', dataKey: 'snapshot_date' },
      { header: 'Aircraft', dataKey: 'aircraft_tail' },
      { header: 'Shift', dataKey: 'shift' }
    ];
    exportToPDF(archives, 'archives', 'Archives', columns);
  };

  useEffect(() => {
    load();
    // Set default cutoff date to 90 days ago
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 90);
    setCutoffDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  const load = () => getAllArchives().then(setArchives);

  const handleDelete = (id) => {
    if (window.confirm('Delete this archive? This cannot be undone.')) {
      deleteArchive(id).then(load);
    }
  };

  const handleCreateArchive = async () => {
    setCreating(true);
    try {
      const data = {
        shift,
        aircraft_tail: aircraftTail || null,
        snapshot_date: new Date().toISOString().split('T')[0],
        cutoff_date: cutoffDate
      };
      await createArchive(data);
      setShowCreateModal(false);
      setShift('1st');
      setAircraftTail('');
      load();
      alert('Archive created successfully!');
    } catch (error) {
      alert('Failed to create archive: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '-';
    return `${formatDate(dateString)} ${timeString || ''}`;
  };

  const countRecords = (archive) => {
    if (!archive.data_json) return 0;
    try {
      const data = typeof archive.data_json === 'string' 
        ? JSON.parse(archive.data_json) 
        : archive.data_json;
      return (data.tasks?.length || 0) + 
             (data.assignments?.length || 0) + 
             (data.training?.length || 0);
    } catch {
      return 0;
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Archives</h2>
          <div className="export-buttons">
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
            <button 
              className="btn btn-light" 
              onClick={() => setShowCreateModal(true)}>
              <i className="bi bi-plus-circle"></i> Create Archive
            </button>
          </div>
        </div>

      {/* Create Archive Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Archive</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Shift</label>
                  <select 
                    className="form-select" 
                    value={shift} 
                    onChange={e => setShift(e.target.value)}>
                    <option value="1st">1st Shift</option>
                    <option value="2nd">2nd Shift</option>
                    <option value="3rd">3rd Shift</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Aircraft Tail (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={aircraftTail} 
                    onChange={e => setAircraftTail(e.target.value)}
                    placeholder="e.g., N54321" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cutoff Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={cutoffDate} 
                    onChange={e => setCutoffDate(e.target.value)} />
                  <small className="form-text text-muted">
                    Completed tasks before this date will be archived (default: 90 days ago)
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleCreateArchive}
                  disabled={creating}>
                  {creating ? 'Creating...' : 'Create Archive'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date/Time</th>
                <th>Shift</th>
                <th>Aircraft</th>
                <th>Record Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {archives.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{formatDateTime(a.snapshot_date, a.snapshot_time)}</td>
                  <td>
                    {a.shift ? <span className="badge bg-info">{a.shift}</span> : '-'}
                  </td>
                  <td>{a.aircraft_tail || 'All'}</td>
                  <td>
                    <span className="badge bg-secondary">{countRecords(a)} records</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => nav(`/archives/${a.id}`)}>
                        <i className="bi bi-eye"></i> View
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDelete(a.id)}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {archives.length === 0 && (
          <div className="alert alert-info">
            No archives found. Click "Create Archive" to manually archive old records.
          </div>
        )}
      </div>
    </div>
  );
}
