/**
 * ArchiveScheduleManager Component
 * 
 * Manages automated archive schedules and displays archive execution logs.
 * Restricted to Manager and Supervisor roles. Allows creating, editing,
 * enabling/disabling, and deleting archive schedules.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllSchedules, createSchedule, updateSchedule, deleteSchedule, getArchiveLogs } from '../api/archiveSchedule';
import { useAuth } from '../context/AuthContext';

/**
 * Component for managing automated archive schedules with role-based access control.
 * Provides CRUD operations for schedules and displays historical archive logs.
 */
export default function ArchiveScheduleManager() {
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('schedules');
  
  const [formData, setFormData] = useState({
    schedule_time: '02:00:00',
    enabled: true,
    shift: '1st'
  });

  const navigate = useNavigate();
  const { hasRole } = useAuth();

  // Check authorization
  useEffect(() => {
    if (!hasRole('Manager') && !hasRole('Supervisor')) {
      toast.error('Access denied. Only Managers and Supervisors can manage archive schedules.');
      navigate('/dashboard');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'schedules') {
        const data = await getAllSchedules();
        setSchedules(data);
      } else {
        const logsData = await getArchiveLogs();
        setLogs(logsData);
      }
    } catch (err) {
      toast.error('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, formData);
        toast.success('Schedule updated successfully!');
      } else {
        await createSchedule(formData);
        toast.success('Schedule created successfully!');
      }

      setShowForm(false);
      setEditingSchedule(null);
      setFormData({ schedule_time: '02:00:00', enabled: true, shift: '1st' });
      loadData();
    } catch (err) {
      toast.error('Failed to save schedule: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      schedule_time: schedule.schedule_time,
      enabled: schedule.enabled,
      shift: schedule.shift
    });
    setShowForm(true);
  };

  const handleDeleteClick = (schedule) => {
    setScheduleToDelete(schedule);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSchedule(scheduleToDelete.id);
      toast.success('Schedule deleted successfully!');
      setShowConfirm(false);
      setScheduleToDelete(null);
      loadData();
    } catch (err) {
      toast.error('Failed to delete schedule: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setScheduleToDelete(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSchedule(null);
    setFormData({ schedule_time: '02:00:00', enabled: true, shift: '1st' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="page-header">
          <h2>Archive Schedule Manager</h2>
          <div className="export-buttons">
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <i className="bi bi-plus-circle"></i> Add Schedule
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'schedules' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedules')}
            >
              <i className="bi bi-clock"></i> Schedules
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <i className="bi bi-journal-text"></i> Archive History
            </button>
          </li>
        </ul>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Schedule Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="schedule_time"
                      value={formData.schedule_time}
                      onChange={handleInputChange}
                      required
                      step="1"
                    />
                    <small className="form-text text-muted">Time of day to run archive (24-hour format)</small>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Shift</label>
                    <select
                      className="form-control"
                      name="shift"
                      value={formData.shift}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="1st">1st Shift</option>
                      <option value="2nd">2nd Shift</option>
                      <option value="3rd">3rd Shift</option>
                    </select>
                    <small className="form-text text-muted">Which shift's assignments to archive</small>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Enabled</label>
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="enabled"
                        checked={formData.enabled}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">
                        {formData.enabled ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle"></i> {editingSchedule ? 'Update' : 'Create'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>
                    <i className="bi bi-x-circle"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && !loading && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No schedules configured. Click "Add Schedule" to create one.
                    </td>
                  </tr>
                ) : (
                  schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{formatTime(schedule.schedule_time)}</td>
                      <td>{schedule.shift} Shift</td>
                      <td>
                        <span className={`badge ${schedule.enabled ? 'bg-success' : 'bg-secondary'}`}>
                          {schedule.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDateTime(schedule.created_at)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(schedule)}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(schedule)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && !loading && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Archive Date/Time</th>
                  <th>Type</th>
                  <th>Shift</th>
                  <th>Assignments Archived</th>
                  <th>Triggered By</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No archive history yet.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id}>
                      <td>{formatDateTime(log.archive_date)}</td>
                      <td>
                        <span className={`badge ${log.archive_type === 'MANUAL' ? 'bg-primary' : 'bg-info'}`}>
                          {log.archive_type}
                        </span>
                      </td>
                      <td>{log.shift} Shift</td>
                      <td>{log.assignments_archived}</td>
                      <td>{log.triggered_by_username || 'System'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this schedule?</p>
                <p className="text-muted">
                  <strong>Time:</strong> {scheduleToDelete && formatTime(scheduleToDelete.schedule_time)}
                </p>
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
