import React, { useState, useEffect } from 'react';
import { getAllAssignments, deleteAssignment } from '../api/assignments';
import { useNavigate } from 'react-router-dom';

export default function ListAssignment() {
  const [assignments, setAssignments] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = () => getAllAssignments().then(setAssignments);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Assignments</h2>
        <button className="btn btn-primary" onClick={() => nav('/assignments/new')}>+ New</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Assignment ID</th>
            <th>Task</th>
            <th>Aircraft</th>
            <th>Personnel</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.assignment_id}>
              <td>{a.assignment_id}</td>
              <td>{a.task_description}</td>
              <td>{a.aircraft_tail}</td>
              <td>{a.personnel_name}</td>
              <td>{a.assignment_role}</td>
              <td>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => nav(`/assignments/${a.assignment_id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => { if (window.confirm('Delete this assignment?')) deleteAssignment(a.assignment_id).then(load); }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}