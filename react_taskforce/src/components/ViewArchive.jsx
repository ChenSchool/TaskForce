import React, { useState, useEffect } from 'react';
import { getArchiveById } from '../api/archives';
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewArchive() {
  const [archive, setArchive] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getArchiveById(id)
      .then(data => {
        setArchive(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load archive:', err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="alert alert-info">Loading archive...</div>;
  }

  if (!archive) {
    return <div className="alert alert-danger">Archive not found</div>;
  }

  const renderDataTable = (data, type) => {
    if (!data || data.length === 0) {
      return <p className="text-muted">No {type} records in this archive.</p>;
    }

    if (type === 'tasks') {
      return (
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Aircraft ID</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.aircraft_id}</td>
                <td>{item.shift}</td>
                <td>{item.status}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (type === 'assignments') {
      return (
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Task</th>
              <th>Personnel</th>
              <th>Role</th>
              <th>Assigned At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item.id}</td>
                <td>{item.task_description}</td>
                <td>{item.personnel_name}</td>
                <td>{item.role}</td>
                <td>{formatDate(item.assigned_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (type === 'training') {
      return (
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Personnel</th>
              <th>Course</th>
              <th>Status</th>
              <th>Completion Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item.id}</td>
                <td>{item.personnel_name}</td>
                <td>{item.course_name}</td>
                <td>{item.status}</td>
                <td>{item.completion_date ? formatDate(item.completion_date) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return <pre className="bg-light p-3">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>View Archive #{archive.id}</h2>
        <button className="btn btn-secondary" onClick={() => nav('/archives')}>
          ← Back to Archives
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Snapshot Date:</strong> {formatDate(archive.snapshot_date)}</p>
              <p><strong>Snapshot Time:</strong> {archive.snapshot_time || '-'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Shift:</strong> {archive.shift ? <span className="badge bg-info">{archive.shift}</span> : '-'}</p>
              <p><strong>Aircraft:</strong> {archive.aircraft_tail || 'All Aircraft'}</p>
            </div>
          </div>
        </div>
      </div>

      {archive.data_json && (
        <div>
          <h4>Archived Data</h4>
          
          {archive.data_json.tasks && (
            <div className="mb-4">
              <h5>Tasks ({archive.data_json.tasks.length})</h5>
              {renderDataTable(archive.data_json.tasks, 'tasks')}
            </div>
          )}

          {archive.data_json.assignments && (
            <div className="mb-4">
              <h5>Assignments ({archive.data_json.assignments.length})</h5>
              {renderDataTable(archive.data_json.assignments, 'assignments')}
            </div>
          )}

          {archive.data_json.training && (
            <div className="mb-4">
              <h5>Training ({archive.data_json.training.length})</h5>
              {renderDataTable(archive.data_json.training, 'training')}
            </div>
          )}
        </div>
      )}

      {!archive.data_json && (
        <div className="alert alert-warning">
          No archived data available for viewing.
        </div>
      )}
    </div>
  );
}
