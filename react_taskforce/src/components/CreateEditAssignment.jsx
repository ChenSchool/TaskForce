import React, { useState, useEffect } from 'react';
import { getAllTasks } from '../api/tasks';
import { getAllPersonnel } from '../api/personnel';
import { getAssignmentById, createAssignment, updateAssignment } from '../api/assignments';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEditAssignment() {
  const [taskId, setTaskId] = useState('');
  const [lines, setLines] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    getAllTasks().then(setTasks);
    getAllPersonnel().then(setPeople);
    if (editing) {
      getAssignmentById(id).then(a => {
        setTaskId(a.task_id);
        setLines(a.lines);
      });
    }
  }, [editing, id]);

  const addLine = () => setLines([...lines, { personnel_id: '', role: '' }]);
  const updateLine = (idx, key, value) => {
    const updated = [...lines];
    updated[idx][key] = value;
    setLines(updated);
  };
  const removeLine = idx => setLines(lines.filter((_, i) => i !== idx));

  const save = () => {
    const data = { task_id: taskId, lines };
    const fn = editing ? updateAssignment(id, data) : createAssignment(data);
    fn.then(() => nav('/assignments'));
  };

  return (
    <div>
      <h2>{editing ? 'Edit' : 'New'} Assignment</h2>
      <div className="mb-3">
        <label className="form-label">Task</label>
        <select className="form-select" value={taskId} onChange={e => setTaskId(e.target.value)}>
          <option value="">-- Select Task --</option>
          {tasks.map(t => (<option key={t.id} value={t.id}>{t.description}</option>))}
        </select>
      </div>
      <div>
        {lines.map((line, i) => (
          <div key={i} className="row g-2 mb-2">
            <div className="col">
              <select className="form-select" value={line.personnel_id} onChange={e => updateLine(i, 'personnel_id', e.target.value)}>
                <option value="">-- Person --</option>
                {people.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div className="col">
              <select className="form-select" value={line.role} onChange={e => updateLine(i, 'role', e.target.value)}>
                <option value="">-- Role --</option>
                <option>Captain</option>
                <option>Coordinator</option>
                <option>Collaborator</option>
                <option>Trainee</option>
              </select>
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-outline-danger" onClick={() => removeLine(i)}>×</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-link" onClick={addLine}>+ Add Person</button>
      </div>
      <div className="mt-3">
        <button className="btn btn-success me-2" onClick={save} disabled={!taskId || lines.length === 0}>Save</button>
        <button className="btn btn-link" onClick={() => nav('/assignments')}>Cancel</button>
      </div>
    </div>
  );
}