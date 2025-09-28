import React, { useState, useEffect } from 'react';
import { getAllAssignments, deleteAssignment } from '../api/assignments';
import { getAllTasks } from '../api/tasks';
import { getAllPersonnel } from '../api/personnel';
import { useNavigate } from 'react-router-dom';

export default function ListAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    load();
    getAllTasks().then(setTasks);
    getAllPersonnel().then(setPeople);
  }, []);

  const load = () => getAllAssignments().then(setAssignments);
  const findTask = id => tasks.find(t => t.id === id)?.description || '';
  const findName = id => people.find(p => p.id === id)?.name || '';

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Assignments</h2>
        <button className="btn btn-primary" onClick={() => nav('/assignments/new')}>+ New</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task</th>
            <th>Personnel</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{findTask(a.task_id)}</td>
              <td>
                <ul className="ps-3 mb-0">
                  {a.lines.map(line => (
                    <li key={line.personnel_id}>
                      {findName(line.personnel_id)} ({line.role})
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => nav(`/assignments/${a.id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => { if (window.confirm('Delete this assignment?')) deleteAssignment(a.id).then(load); }}>
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