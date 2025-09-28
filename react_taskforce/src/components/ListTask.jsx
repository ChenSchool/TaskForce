import React, { useState, useEffect } from 'react';
import { getAllTasks, deleteTask } from '../api/tasks';
import { getAllAircraft } from '../api/aircraft';
import { useNavigate } from 'react-router-dom';

export default function ListTask() {
  const [tasks, setTasks] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const nav = useNavigate();

  useEffect(() => { load(); getAllAircraft().then(setAircraft); }, []);
  const load = () => getAllTasks().then(setTasks);

  const findTail = id => aircraft.find(a => a.id === id)?.tail_number || '';

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete).then(() => {
        load();
        setShowConfirm(false);
        setTaskToDelete(null);
      });
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setTaskToDelete(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={()=>nav('/tasks/new')}>+ New</button>
      </div>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Aircraft</th><th>Shift</th><th>Description</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{findTail(t.aircraft_id)}</td>
              <td>{t.shift}</td>
              <td>{t.description}</td>
              <td>{t.status}</td>
              <td>{t.date}</td>
              <td>
                <button className="btn btn-sm btn-secondary me-2" onClick={()=>nav(`/tasks/${t.id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDeleteClick(t.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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