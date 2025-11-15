import React, { useState, useEffect } from 'react';
import { getArchivedAssignments } from '../api/archiveSchedule';
import { exportToCSV, exportToPDF } from '../utils/export';

export default function ListArchives() {
  const [archivedAssignments, setArchivedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterShift, setFilterShift] = useState('all');

  const handleExportCSV = () => {
    const filteredData = getFilteredData();
    const exportData = filteredData.map(a => ({
      id: a.id,
      task_description: a.task_description,
      aircraft_tail: a.aircraft_tail,
      task_status: a.task_status,
      task_shift: a.task_shift,
      personnel_name: a.personnel_name,
      role: a.role,
      archived_at: new Date(a.archived_at).toLocaleString(),
      archived_by: a.archived_by_schedule ? 'Scheduled' : 'Manual'
    }));
    exportToCSV(exportData, 'archived_assignments');
  };

  const handleExportPDF = () => {
    const filteredData = getFilteredData();
    const exportData = filteredData.map(a => ({
      task: a.task_description,
      aircraft: a.aircraft_tail,
      status: a.task_status,
      shift: a.task_shift,
      personnel: a.personnel_name,
      role: a.role,
      archived: new Date(a.archived_at).toLocaleDateString()
    }));
    const columns = [
      { header: 'Task', dataKey: 'task' },
      { header: 'Aircraft', dataKey: 'aircraft' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Shift', dataKey: 'shift' },
      { header: 'Personnel', dataKey: 'personnel' },
      { header: 'Role', dataKey: 'role' },
      { header: 'Archived', dataKey: 'archived' }
    ];
    exportToPDF(exportData, 'archived_assignments', 'Archived Assignments', columns);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getArchivedAssignments(startDate, endDate);
      setArchivedAssignments(data);
    } catch (err) {
      console.error('Failed to load archived assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filtered = archivedAssignments;
    
    if (filterShift !== 'all') {
      filtered = filtered.filter(a => a.task_shift === filterShift);
    }
    
    return filtered;
  };

  const handleFilter = () => {
    load();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Archived Assignments</h2>
          <div className="export-buttons">
            <button className="btn btn-success btn-sm me-2" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
            </button>
            <button className="btn btn-danger btn-sm me-2" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf"></i> Export PDF
            </button>
          </div>
        </div>

        {/* Filter Options */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Shift</label>
                <select
                  className="form-control"
                  value={filterShift}
                  onChange={(e) => setFilterShift(e.target.value)}
                >
                  <option value="all">All Shifts</option>
                  <option value="1st">1st Shift</option>
                  <option value="2nd">2nd Shift</option>
                  <option value="3rd">3rd Shift</option>
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={handleFilter}>
                  <i className="bi bi-funnel"></i> Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Aircraft</th>
                  <th>Status</th>
                  <th>Shift</th>
                  <th>Personnel</th>
                  <th>Role</th>
                  <th>Archived Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredData().length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No archived assignments found.
                    </td>
                  </tr>
                ) : (
                  getFilteredData().map(a => (
                    <tr key={a.id}>
                      <td>{a.task_description}</td>
                      <td>{a.aircraft_tail}</td>
                      <td>
                        <span className={`badge ${
                          a.task_status === 'Completed' ? 'bg-success' :
                          a.task_status === 'In Progress' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {a.task_status}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info">{a.task_shift}</span>
                      </td>
                      <td>{a.personnel_name}</td>
                      <td>{a.role || '-'}</td>
                      <td>{formatDateTime(a.archived_at)}</td>
                      <td>
                        <span className={`badge ${a.archived_by_schedule ? 'bg-info' : 'bg-primary'}`}>
                          {a.archived_by_schedule ? 'Scheduled' : 'Manual'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
